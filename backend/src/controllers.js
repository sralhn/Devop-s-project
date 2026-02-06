const prisma = require('./prisma');

const {
    sendNewEventNotification,
    sendNewRegistrationNotification,
    sendEventUpdateNotification
} = require('./services/email.service');

// --- Events ---

const getEvents = async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            orderBy: { date: 'asc' },
            include: {
                registrations: true,
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        // Add computed field for remaining spots
        const eventsWithAvailability = events.map(event => ({
            ...event,
            remainingSpots: event.maxSpots - event.registrations.length
        }));

        res.json(eventsWithAvailability);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch events' });
    }
};

const getEventById = async (req, res) => {
    const { id } = req.params;
    try {
        const event = await prisma.event.findUnique({
            where: { id: parseInt(id) },
            include: {
                registrations: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                },
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        if (!event) return res.status(404).json({ error: 'Event not found' });

        const eventWithAvailability = {
            ...event,
            remainingSpots: event.maxSpots - event.registrations.length
        };

        res.json(eventWithAvailability);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch event' });
    }
};

const createEvent = async (req, res) => {
    const { title, description, date, location, maxSpots } = req.body;
    const userId = req.user.id; // From authenticated user

    try {
        const event = await prisma.event.create({
            data: {
                title,
                description,
                date: new Date(date),
                location,
                maxSpots: parseInt(maxSpots),
                creatorId: userId
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        // Notify Admins
        const admins = await prisma.user.findMany({
            where: { role: 'ADMIN' },
            select: { email: true }
        });
        const adminEmails = admins.map(a => a.email);

        if (adminEmails.length > 0) {
            await sendNewEventNotification(event, event.creator, adminEmails);
        }

        res.status(201).json(event);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Failed to create event' });
    }
};

const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { title, description, date, location, maxSpots } = req.body;
    const userId = req.user.id;

    try {
        const event = await prisma.event.findUnique({
            where: { id: parseInt(id) },
            include: {
                registrations: {
                    include: { user: { select: { email: true } } }
                }
            }
        });

        if (!event) return res.status(404).json({ error: 'Event not found' });

        // Check permissions: Creator or Admin
        if (event.creatorId !== userId && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Not authorized to edit this event' });
        }

        const updatedEvent = await prisma.event.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                date: new Date(date),
                location,
                maxSpots: parseInt(maxSpots)
            }
        });

        // Calculate changes
        const changes = [];
        if (event.title !== title) changes.push(`Title changed from "${event.title}" to "${title}"`);
        if (event.description !== description) changes.push('Description updated');
        if (new Date(event.date).getTime() !== new Date(date).getTime()) {
            changes.push(`Date/Time changed from ${new Date(event.date).toLocaleString('fr-FR')} to ${new Date(date).toLocaleString('fr-FR')}`);
        }
        if (event.location !== location) changes.push(`Location changed from "${event.location}" to "${location}"`);
        if (event.maxSpots !== parseInt(maxSpots)) changes.push(`Capacity changed from ${event.maxSpots} to ${maxSpots}`);

        // Fetch Admin Emails
        const admins = await prisma.user.findMany({
            where: { role: 'ADMIN' },
            select: { email: true }
        });
        const adminEmails = admins.map(a => a.email);

        // Notify Participants and Admins
        const participantEmails = event.registrations.map(r => r.user.email);

        if (changes.length > 0) {
            await sendEventUpdateNotification(updatedEvent, changes, participantEmails, adminEmails);
        }

        res.json(updatedEvent);
    } catch (error) {
        console.error('Update event error:', error);
        res.status(500).json({ error: 'Failed to update event' });
    }
};

// --- Registrations ---

const registerForEvent = async (req, res) => {
    const { id } = req.params; // eventId
    const userId = req.user.id; // From authenticated user

    try {
        const eventId = parseInt(id);

        // Transaction to ensure atomicity and specific checks
        const result = await prisma.$transaction(async (prisma) => {
            const event = await prisma.event.findUnique({
                where: { id: eventId },
                include: { registrations: true }
            });

            if (!event) throw new Error('Event not found');

            if (event.registrations.length >= event.maxSpots) {
                throw new Error('Event is full');
            }

            const existingRegistration = await prisma.registration.findFirst({
                where: {
                    eventId: eventId,
                    userId: userId
                }
            });

            if (existingRegistration) {
                throw new Error('Already registered');
            }

            return await prisma.registration.create({
                data: {
                    eventId: eventId,
                    userId: userId
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            });
        });

        // Notify Organizer (fetch event with creator email to be sure)
        const eventWithCreator = await prisma.event.findUnique({
            where: { id: parseInt(id) },
            include: { creator: { select: { email: true } } }
        });

        if (eventWithCreator && eventWithCreator.creator) {
            // result is the registration object, need user details. 
            // result.user is available from include in transaction
            await sendNewRegistrationNotification(eventWithCreator, result.user, eventWithCreator.creator.email);
        }



        res.status(201).json(result);
    } catch (error) {
        if (error.message === 'Event is full' || error.message === 'Already registered' || error.message === 'Event not found') {
            res.status(400).json({ error: error.message });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Registration failed' });
        }
    }
};

const unregisterFromEvent = async (req, res) => {
    const { id } = req.params; // eventId
    const userId = req.user.id; // From authenticated user

    try {
        const registration = await prisma.registration.findFirst({
            where: {
                eventId: parseInt(id),
                userId: userId
            }
        });

        if (!registration) {
            return res.status(404).json({ error: 'Registration not found' });
        }

        await prisma.registration.delete({
            where: { id: registration.id }
        });

        res.json({ message: 'Unregistered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unregistration failed' });
    }
};

// --- Admin Endpoints ---

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isBlocked: true,
                createdAt: true,
                _count: {
                    select: {
                        events: true,
                        registrations: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

const getAllRegistrations = async (req, res) => {
    try {
        const registrations = await prisma.registration.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                event: {
                    select: {
                        id: true,
                        title: true,
                        date: true,
                        location: true
                    }
                }
            },
            orderBy: { registeredAt: 'desc' }
        });

        res.json(registrations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch registrations' });
    }
};

const deleteEvent = async (req, res) => {
    const { id } = req.params;

    try {
        // Delete all registrations first (cascade)
        await prisma.registration.deleteMany({
            where: { eventId: parseInt(id) }
        });

        // Delete the event
        await prisma.event.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete event' });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    const userIdToDelete = parseInt(id);

    // Prevent deleting self (optional, but good practice)
    if (req.user.id === userIdToDelete) {
        return res.status(400).json({ error: 'Cannot delete your own admin account' });
    }

    try {
        // 1. Delete all registrations made by this user
        await prisma.registration.deleteMany({
            where: { userId: userIdToDelete }
        });

        // 2. Find all events created by this user
        const userEvents = await prisma.event.findMany({
            where: { creatorId: userIdToDelete },
            select: { id: true }
        });

        const eventIds = userEvents.map(e => e.id);

        if (eventIds.length > 0) {
            // 3. Delete all registrations for events created by this user
            await prisma.registration.deleteMany({
                where: { eventId: { in: eventIds } }
            });

            // 4. Delete the events created by this user
            await prisma.event.deleteMany({
                where: { id: { in: eventIds } }
            });
        }

        // 5. Finally, delete the user
        await prisma.user.delete({
            where: { id: userIdToDelete }
        });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

const toggleBlockStatus = async (req, res) => {
    const { id } = req.params;
    const userIdToToggle = parseInt(id);

    // Prevent blocking self
    if (req.user.id === userIdToToggle) {
        return res.status(400).json({ error: 'Cannot block your own admin account' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userIdToToggle }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userIdToToggle },
            data: { isBlocked: !user.isBlocked },
            select: { id: true, email: true, isBlocked: true }
        });

        res.json({
            message: `User ${updatedUser.isBlocked ? 'blocked' : 'unblocked'} successfully`,
            user: updatedUser
        });
    } catch (error) {
        console.error('Toggle block status error:', error);
        res.status(500).json({ error: 'Failed to update block status' });
    }
};

const changeUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body; // Expecting { role: 'ADMIN' | 'USER' }
    const userIdToUpdate = parseInt(id);

    if (!['ADMIN', 'USER'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
    }

    // Prevent demoting self
    if (req.user.id === userIdToUpdate && role !== 'ADMIN') {
        return res.status(400).json({ error: 'Cannot remove your own admin privileges' });
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userIdToUpdate },
            data: { role },
            select: { id: true, email: true, role: true }
        });

        res.json({
            message: `User role updated to ${role}`,
            user: updatedUser
        });
    } catch (error) {
        console.error('Change role error:', error);
        res.status(500).json({ error: 'Failed to update user role' });
    }
};

module.exports = {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    registerForEvent,
    unregisterFromEvent,
    getAllUsers,
    getAllRegistrations,
    deleteEvent,
    deleteUser,
    toggleBlockStatus,
    changeUserRole
};
