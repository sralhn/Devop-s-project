import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, MapPin, Users, Type } from 'lucide-react';
import { api } from '../api/events';

const EditEventModal = ({ event, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        location: '',
        maxSpots: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (event) {
            setFormData({
                title: event.title,
                date: new Date(event.date).toISOString().split('T')[0],
                location: event.location,
                maxSpots: event.maxSpots,
                description: event.description
            });
        }
    }, [event]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await api.put(`/events/${event.id}`, formData);
            onUpdate(res.data);
            onClose();
            alert('✅ Event updated successfully! All participants have been notified.');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to update event');
        } finally {
            setLoading(false);
        }
    };

    if (!event) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">Edit Event</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Event Title</label>
                            <div className="relative">
                                <Type className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#005596]/20 focus:border-[#005596]"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <input
                                        type="date"
                                        required
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#005596]/20 focus:border-[#005596]"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Max Spots</label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#005596]/20 focus:border-[#005596]"
                                        value={formData.maxSpots}
                                        onChange={(e) => setFormData({ ...formData, maxSpots: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#005596]/20 focus:border-[#005596]"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                            <textarea
                                required
                                rows="4"
                                className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#005596]/20 focus:border-[#005596]"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3 rounded-xl bg-[#005596] text-white font-bold hover:bg-[#00447a] transition shadow-lg shadow-blue-900/20 disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {loading ? 'Saving...' : (
                                    <>
                                        <Save size={18} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditEventModal;
