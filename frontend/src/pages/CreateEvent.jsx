import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/events';

const CreateEvent = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        maxSpots: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/events', formData);
            navigate('/');
        } catch (error) {
            alert('Failed to create event: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto animate-fade-in-up">
            <div className="glass-card rounded-3xl p-10 shadow-2xl">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-block mb-4">
                        <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center text-3xl shadow-lg mx-auto">
                            ✨
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold mb-3">
                        <span className="gradient-text">Create New Event</span>
                    </h1>
                    <p className="text-slate-400 text-lg">Share your event with the campus community</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Event Title */}
                    <div>
                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                            <span>📝</span>
                            <span>Event Title</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            required
                            placeholder="e.g., End-of-Year Hackathon"
                            className="w-full px-5 py-4 glass-dark rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition border border-transparent focus:border-blue-500/50"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Date & Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                <span>📅</span>
                                <span>Date & Time</span>
                            </label>
                            <input
                                type="datetime-local"
                                name="date"
                                required
                                className="w-full px-5 py-4 glass-dark rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition border border-transparent focus:border-blue-500/50"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                <span>📍</span>
                                <span>Location</span>
                            </label>
                            <input
                                type="text"
                                name="location"
                                required
                                placeholder="e.g., Main Auditorium"
                                className="w-full px-5 py-4 glass-dark rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition border border-transparent focus:border-blue-500/50"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                            <span>📄</span>
                            <span>Description</span>
                        </label>
                        <textarea
                            name="description"
                            rows="5"
                            required
                            placeholder="Tell us about your event..."
                            className="w-full px-5 py-4 glass-dark rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition resize-none border border-transparent focus:border-blue-500/50"
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    {/* Max Participants */}
                    <div>
                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                            <span>🎟️</span>
                            <span>Max Participants</span>
                        </label>
                        <input
                            type="number"
                            name="maxSpots"
                            required
                            min="1"
                            placeholder="e.g., 50"
                            className="w-full px-5 py-4 glass-dark rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition border border-transparent focus:border-blue-500/50"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full gradient-primary text-white font-bold py-5 rounded-xl shadow-lg hover:shadow-blue-500/50 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-lg"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                <span>Creating...</span>
                            </>
                        ) : (
                            <>
                                <span>✨</span>
                                <span>Publish Event</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateEvent;
