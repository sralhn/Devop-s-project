import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/events';
import { Sparkles, FileText, Calendar, MapPin, Users, Save, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAdmin } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        maxSpots: ''
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const fetchEvent = async () => {
        try {
            const res = await api.get(`/events/${id}`);
            const event = res.data;

            // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
            const dateObj = new Date(event.date);
            const formattedDate = dateObj.toISOString().slice(0, 16);

            setFormData({
                title: event.title,
                description: event.description,
                date: formattedDate,
                location: event.location,
                maxSpots: event.maxSpots
            });

            // check permissions (client-side check, server also checks)
            // If not creator and not admin, redirect
            if (user && event.creatorId !== user.id && !isAdmin) {
                alert("You don't have permission to edit this event.");
                navigate('/');
            }

            setLoading(false);
        } catch (error) {
            console.error(error);
            alert('Failed to fetch event details');
            navigate('/');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.put(`/events/${id}`, formData);
            alert('✅ Event updated successfully!');
            navigate(`/events/${id}`);
        } catch (error) {
            alert('Failed to update event: ' + (error.response?.data?.error || error.message));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-32 animate-fade-in">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#005596] border-t-transparent mb-4"></div>
                <p className="text-slate-500 font-medium">Loading event details...</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto animate-fade-in-up">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center gap-2 text-slate-500 hover:text-[#005596] transition font-medium"
            >
                <ArrowLeft size={20} />
                <span>Back</span>
            </button>

            <div className="bg-white rounded-3xl p-10 shadow-2xl border border-slate-200">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-block mb-4">
                        <div className="w-16 h-16 bg-[#005596] rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                            <Sparkles size={32} className="text-[#FDC500]" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold mb-3 text-slate-800 font-serif">
                        Edit Event
                    </h1>
                    <p className="text-slate-500 text-lg">Update event details</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Event Title */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                            <FileText size={18} className="text-[#005596]" />
                            <span>Event Title</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            required
                            placeholder="e.g., End-of-Year Hackathon"
                            className="w-full px-5 py-4 bg-slate-50 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-[#005596] focus:outline-none transition border border-slate-200 focus:border-[#005596]"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Date & Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                <Calendar size={18} className="text-[#005596]" />
                                <span>Date & Time</span>
                            </label>
                            <input
                                type="datetime-local"
                                name="date"
                                value={formData.date}
                                required
                                className="w-full px-5 py-4 bg-slate-50 rounded-xl text-slate-800 focus:ring-2 focus:ring-[#005596] focus:outline-none transition border border-slate-200 focus:border-[#005596]"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                <MapPin size={18} className="text-[#005596]" />
                                <span>Location</span>
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                required
                                placeholder="e.g., Main Auditorium"
                                className="w-full px-5 py-4 bg-slate-50 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-[#005596] focus:outline-none transition border border-slate-200 focus:border-[#005596]"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                            <FileText size={18} className="text-[#005596]" />
                            <span>Description</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            rows="5"
                            required
                            placeholder="Tell us about your event..."
                            className="w-full px-5 py-4 bg-slate-50 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-[#005596] focus:outline-none transition resize-none border border-slate-200 focus:border-[#005596]"
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    {/* Max Participants */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                            <Users size={18} className="text-[#005596]" />
                            <span>Max Participants</span>
                        </label>
                        <input
                            type="number"
                            name="maxSpots"
                            value={formData.maxSpots}
                            required
                            min="1"
                            placeholder="e.g., 50"
                            className="w-full px-5 py-4 bg-slate-50 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-[#005596] focus:outline-none transition border border-slate-200 focus:border-[#005596]"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-[#005596] hover:bg-[#00447a] text-white font-bold py-5 rounded-xl shadow-lg hover:shadow-blue-900/20 transition-all transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-lg"
                    >
                        {submitting ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                <span>Updating...</span>
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                <span className="uppercase tracking-wide">Save Changes</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditEvent;
