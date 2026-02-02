import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/events';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Ticket, Shield, Info, ArrowRight, Lock, Clock, Edit } from 'lucide-react';

const EventDetail = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const { isAuthenticated, user, isAdmin } = useAuth();

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

    const handleUnregister = async () => {
        if (!confirm('Are you sure you want to cancel your registration?')) return;
        setRegistering(true);
        try {
            await api.post(`/events/${id}/unregister`);
            alert('✅ Unregistered successfully');
            fetchEvent();
        } catch (error) {
            alert('❌ ' + (error.response?.data?.error || 'Unregistration failed'));
        } finally {
            setRegistering(false);
        }
    };

    if (loading || !event) {
        return (
            <div className="text-center py-32 animate-fade-in">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#005596] border-t-transparent mb-4"></div>
                <p className="text-slate-500 font-medium">Loading event...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animate-fade-in-up">
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                {/* Hero Header */}
                <div className="h-72 bg-[#005596] relative overflow-hidden p-10 flex items-end">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    {/* Background Pattern */}
                    <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-[#FDC500]/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10 w-full">
                        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-semibold text-white inline-flex items-center gap-2 mb-4 border border-white/20">
                            <Shield size={16} className="text-[#FDC500]" />
                            <span>AMU Official Event</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 font-serif tracking-tight">{event.title}</h1>

                        {/* Edit Button for Creator or Admin */}
                        {isAuthenticated && (user?.id === event.creatorId || isAdmin) && (
                            <Link
                                to={`/events/${id}/edit`}
                                className="mt-4 inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition text-sm font-semibold border border-white/30"
                            >
                                <Edit size={16} />
                                <span>Edit Event</span>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="px-10 py-20">
                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 mb-10">
                        <span className="bg-slate-50 px-5 py-3 rounded-xl text-sm font-semibold text-slate-700 flex items-center gap-3 border border-slate-200">
                            <Calendar size={20} className="text-[#005596]" />
                            <span>{new Date(event.date).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}</span>
                        </span>
                        <span className="bg-slate-50 px-5 py-3 rounded-xl text-sm font-semibold text-slate-700 flex items-center gap-3 border border-slate-200">
                            <MapPin size={20} className="text-[#005596]" />
                            <span>{event.location}</span>
                        </span>
                        <span className={`px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-3 border ${event.remainingSpots > 0
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                            <Ticket size={20} />
                            <span>{event.remainingSpots > 0 ? `${event.remainingSpots} spots left` : 'Fully Booked'}</span>
                        </span>
                    </div>

                    {/* Description */}
                    <div className="mb-10">
                        <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2 font-serif">
                            <Info className="text-[#FDC500]" />
                            <span>About this event</span>
                        </h3>
                        <p className="text-slate-600 leading-relaxed text-lg">{event.description}</p>
                    </div>

                    {/* Registration Section */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-inner">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2 font-serif">
                            <Ticket className="text-[#005596]" />
                            <span>Reserve Your Spot</span>
                        </h3>

                        {isAuthenticated ? (
                            <>
                                {event.registrations.some(r => r.userId === user?.id) ? (
                                    <div className="text-center">
                                        <div className="bg-emerald-50 text-emerald-700 px-6 py-4 rounded-xl font-bold mb-4 flex items-center justify-center gap-2 border border-emerald-200">
                                            <Shield size={20} />
                                            <span>You are registered for this event!</span>
                                        </div>
                                        <button
                                            onClick={handleUnregister}
                                            disabled={registering}
                                            className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-10 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
                                        >
                                            {registering ? 'Processing...' : 'Cancel Registration'}
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleRegister}
                                        disabled={event.remainingSpots <= 0 || registering}
                                        className="w-full bg-[#005596] hover:bg-[#00447a] text-white px-10 py-4 rounded-xl font-bold shadow-lg hover:shadow-blue-900/20 transition-all transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                                    >
                                        {registering ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                                <span>Reserving...</span>
                                            </>
                                        ) : event.remainingSpots > 0 ? (
                                            <>
                                                <Ticket size={20} />
                                                <span>Reserve Now</span>
                                            </>
                                        ) : (
                                            <>
                                                <Lock size={20} />
                                                <span>Full</span>
                                            </>
                                        )}
                                    </button>
                                )}
                                {event.remainingSpots > 0 && event.remainingSpots <= 10 && !event.registrations.some(r => r.userId === user?.id) && (
                                    <p className="mt-4 text-sm text-amber-600 flex items-center gap-2 font-medium bg-amber-50 p-3 rounded-lg border border-amber-200">
                                        <Clock size={16} />
                                        <span>Hurry! Only {event.remainingSpots} spot{event.remainingSpots !== 1 ? 's' : ''} remaining!</span>
                                    </p>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-slate-500 mb-6">You need to be logged in to register for this event</p>
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 bg-[#005596] hover:bg-[#00447a] text-white px-10 py-4 rounded-xl font-bold shadow-lg hover:shadow-blue-900/20 transition-all transform hover:scale-[1.01]"
                                >
                                    <Lock size={18} />
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
