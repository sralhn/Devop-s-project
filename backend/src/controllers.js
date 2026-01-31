const prisma = require('./prisma');

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
        res.status(201).json(event);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Failed to create event' });
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

module.exports = {
    getEvents,
    getEventById,
    createEvent,
    registerForEvent,
    unregisterFromEvent,
    getAllUsers,
    getAllRegistrations,
    deleteEvent
};
