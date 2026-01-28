import React, { useEffect, useState } from 'react';
import { api } from '../api/events';
import { useAuth } from '../context/AuthContext';

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
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <p className="text-slate-400 font-medium">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in-up space-y-8">
            {/* Header */}
            <div className="glass-card rounded-3xl p-8">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-3xl">👑</span>
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-1">Admin Dashboard</h1>
                        <p className="text-slate-400">Welcome back, {user?.name}</p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">👥</span>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white">{users.length}</div>
                            <div className="text-sm text-slate-400">Total Users</div>
                        </div>
                    </div>
                </div>
                <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">🎉</span>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white">{events.length}</div>
                            <div className="text-sm text-slate-400">Total Events</div>
                        </div>
                    </div>
                </div>
                <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">🎫</span>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white">{registrations.length}</div>
                            <div className="text-sm text-slate-400">Total Registrations</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Events Management */}
            <div className="glass-card rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <span>🎉</span>
                    <span>Events Management</span>
                </h2>
                <div className="space-y-4">
                    {events.length === 0 ? (
                        <p className="text-slate-400 text-center py-8">No events yet</p>
                    ) : (
                        events.map(event => (
                            <div key={event.id} className="glass-dark rounded-xl p-6 flex items-center justify-between">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-1">{event.title}</h3>
                                    <div className="flex gap-4 text-sm text-slate-400">
                                        <span>📍 {event.location}</span>
                                        <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                                        <span>👥 {event.registrations.length}/{event.maxSpots}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteEvent(event.id)}
                                    className="bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-300 px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2"
                                >
                                    <span>🗑️</span>
                                    <span>Delete</span>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Users Table */}
            <div className="glass-card rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <span>👥</span>
                    <span>Users</span>
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Name</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Email</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Role</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Events Created</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Registrations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition">
                                    <td className="py-3 px-4 text-white">{u.name}</td>
                                    <td className="py-3 px-4 text-slate-400">{u.email}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${u.role === 'ADMIN'
                                                ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                                                : 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                                            }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-slate-400">{u._count?.events || 0}</td>
                                    <td className="py-3 px-4 text-slate-400">{u._count?.registrations || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Registrations Table */}
            <div className="glass-card rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <span>🎫</span>
                    <span>Recent Registrations</span>
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">User</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Event</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Date</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Registered At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.slice(0, 10).map(reg => (
                                <tr key={reg.id} className="border-b border-white/5 hover:bg-white/5 transition">
                                    <td className="py-3 px-4 text-white">{reg.user.name}</td>
                                    <td className="py-3 px-4 text-slate-400">{reg.event.title}</td>
                                    <td className="py-3 px-4 text-slate-400">{new Date(reg.event.date).toLocaleDateString()}</td>
                                    <td className="py-3 px-4 text-slate-400">{new Date(reg.registeredAt).toLocaleString()}</td>
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
