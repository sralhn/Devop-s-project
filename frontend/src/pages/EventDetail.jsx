import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/events';
import { useAuth } from '../context/AuthContext';

const EventDetail = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const { isAuthenticated } = useAuth();

    const fetchEvent = () => {
        api.get(`/events/${id}`)
            .then(res => setEvent(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const handleRegister = async () => {
        setRegistering(true);
        try {
            await api.post(`/events/${id}/register`);
            alert('✅ Registered successfully!');
            fetchEvent();
        } catch (error) {
            alert('❌ ' + (error.response?.data?.error || 'Registration failed'));
        } finally {
            setRegistering(false);
        }
    };

    if (loading || !event) {
        return (
            <div className="text-center py-32 animate-fade-in">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <p className="text-slate-400 font-medium">Loading event...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animate-fade-in-up">
            <div className="glass-card rounded-3xl overflow-hidden shadow-2xl">
                {/* Hero Header */}
                <div className="h-72 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 relative overflow-hidden p-10 flex items-end">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    {/* Floating Orbs */}
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10 w-full">
                        <div className="glass-dark px-4 py-2 rounded-lg text-sm font-semibold inline-flex items-center gap-2 mb-4 backdrop-blur-xl">
                            <span>🎓</span>
                            <span>Campus Event</span>
                        </div>
                        <h1 className="text-5xl font-bold text-white mb-2 text-shadow">{event.title}</h1>
                    </div>
                </div>

                {/* Content */}
                <div className="p-10">
                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-3 mb-10">
                        <span className="glass-dark px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 backdrop-blur-xl">
                            <span className="text-lg">📅</span>
                            <span className="text-white">{new Date(event.date).toLocaleString()}</span>
                        </span>
                        <span className="glass-dark px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 backdrop-blur-xl">
                            <span className="text-lg">📍</span>
                            <span className="text-white">{event.location}</span>
                        </span>
                        <span className={`px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 backdrop-blur-xl ${event.remainingSpots > 0
                                ? 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-300'
                                : 'bg-red-500/20 border border-red-400/30 text-red-300'
                            }`}>
                            <span className="text-lg">🎟️</span>
                            <span>{event.remainingSpots > 0 ? `${event.remainingSpots} spots left` : 'Fully Booked'}</span>
                        </span>
                    </div>

                    {/* Description */}
                    <div className="mb-10">
                        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <span>📄</span>
                            <span>About this event</span>
                        </h3>
                        <p className="text-slate-400 leading-relaxed text-lg">{event.description}</p>
                    </div>

                    {/* Registration Section */}
                    <div className="glass-dark rounded-2xl p-8 border border-white/10 backdrop-blur-xl">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <span>🎫</span>
                            <span>Reserve Your Spot</span>
                        </h3>

                        {isAuthenticated ? (
                            <>
                                <button
                                    onClick={handleRegister}
                                    disabled={event.remainingSpots <= 0 || registering}
                                    className="w-full gradient-primary px-10 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/50 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                                >
                                    {registering ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                            <span>Reserving...</span>
                                        </>
                                    ) : event.remainingSpots > 0 ? (
                                        <>
                                            <span>✨</span>
                                            <span>Reserve Now</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>❌</span>
                                            <span>Full</span>
                                        </>
                                    )}
                                </button>
                                {event.remainingSpots > 0 && event.remainingSpots <= 10 && (
                                    <p className="mt-4 text-sm text-amber-400 flex items-center gap-2">
                                        <span>⚠️</span>
                                        <span>Hurry! Only {event.remainingSpots} spot{event.remainingSpots !== 1 ? 's' : ''} remaining!</span>
                                    </p>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-slate-400 mb-6">You need to be logged in to register for this event</p>
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 gradient-primary px-10 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/50 transition-all transform hover:scale-[1.02]"
                                >
                                    <span>🔐</span>
                                    <span>Login to Register</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
