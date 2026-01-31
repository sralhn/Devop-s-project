import React, { useEffect, useState } from 'react';
import { api } from '../api/events';
import { useAuth } from '../context/AuthContext';
import { Crown, Users, Calendar, Ticket, Trash2, MapPin } from 'lucide-react';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersRes, eventsRes, regsRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/events'),
                api.get('/admin/registrations')
            ]);
            setUsers(usersRes.data);
            setEvents(eventsRes.data);
            setRegistrations(regsRes.data);
        } catch (error) {
            console.error('Failed to fetch admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        try {
            await api.delete(`/admin/events/${eventId}`);
            setEvents(events.filter(e => e.id !== eventId));
            alert('✅ Event deleted successfully');
        } catch (error) {
            alert('❌ Failed to delete event');
        }
    };

    if (loading) {
        return (
            <div className="text-center py-32 animate-fade-in">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#005596] border-t-transparent mb-4"></div>
                <p className="text-slate-500 font-medium">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in-up space-y-8">
            {/* Header */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#005596] rounded-2xl flex items-center justify-center shadow-lg text-white">
                        <Crown size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-1 font-serif">Admin Dashboard</h1>
                        <p className="text-slate-500">Welcome back, {user?.name}</p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-[#005596] rounded-xl flex items-center justify-center">
                            <Users size={24} />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-slate-800">{users.length}</div>
                            <div className="text-sm text-slate-500">Total Users</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-50 text-[#FDC500] rounded-xl flex items-center justify-center">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-slate-800">{events.length}</div>
                            <div className="text-sm text-slate-500">Total Events</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                            <Ticket size={24} />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-slate-800">{registrations.length}</div>
                            <div className="text-sm text-slate-500">Total Registrations</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Events Management */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2 font-serif">
                    <Calendar className="text-[#005596]" />
                    <span>Events Management</span>
                </h2>
                <div className="space-y-4">
                    {events.length === 0 ? (
                        <p className="text-slate-400 text-center py-8">No events yet</p>
                    ) : (
                        events.map(event => (
                            <div key={event.id} className="bg-slate-50 rounded-xl p-6 flex items-center justify-between border border-slate-200 hover:shadow-md transition-shadow">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-800 mb-2">{event.title}</h3>
                                    <div className="flex gap-4 text-sm text-slate-500">
                                        <span className="flex items-center gap-1"><MapPin size={14} /> {event.location}</span>
                                        <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(event.date).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1"><Users size={14} /> {event.registrations.length}/{event.maxSpots}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteEvent(event.id)}
                                    className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2"
                                >
                                    <Trash2 size={18} />
                                    <span>Delete</span>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2 font-serif">
                    <Users className="text-[#005596]" />
                    <span>Users</span>
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-500">Name</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-500">Email</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-500">Role</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-500">Events Created</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-500">Registrations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                    <td className="py-3 px-4 text-slate-800 font-medium">{u.name}</td>
                                    <td className="py-3 px-4 text-slate-500">{u.email}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold flex w-fit items-center gap-1 ${u.role === 'ADMIN'
                                                ? 'bg-[#005596]/10 text-[#005596] border border-[#005596]/20'
                                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                                            }`}>
                                            {u.role === 'ADMIN' && <Crown size={12} />}
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-slate-500">{u._count?.events || 0}</td>
                                    <td className="py-3 px-4 text-slate-500">{u._count?.registrations || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Registrations Table */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2 font-serif">
                    <Ticket className="text-[#005596]" />
                    <span>Recent Registrations</span>
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-500">User</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-500">Event</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-500">Date</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-500">Registered At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.slice(0, 10).map(reg => (
                                <tr key={reg.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                    <td className="py-3 px-4 text-slate-800 font-medium">{reg.user.name}</td>
                                    <td className="py-3 px-4 text-slate-600">{reg.event.title}</td>
                                    <td className="py-3 px-4 text-slate-500">{new Date(reg.event.date).toLocaleDateString()}</td>
                                    <td className="py-3 px-4 text-slate-500">{new Date(reg.registeredAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
