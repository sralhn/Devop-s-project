import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
    const date = new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <Link to={`/events/${event.id}`} className="block group">
            <div className="glass-card rounded-2xl overflow-hidden card-hover h-full flex flex-col">
                {/* Gradient Header */}
                <div className="h-44 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    {/* Floating Orb Effect */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl"></div>

                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <div className="glass-dark px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 backdrop-blur-xl">
                            <span>📍</span>
                            <span className="text-white">{event.location}</span>
                        </div>
                        <div className="glass-dark px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 backdrop-blur-xl">
                            <span>🎟️</span>
                            <span className="text-blue-300">{event.remainingSpots}</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                    <div className="text-xs text-blue-400 font-semibold mb-2 flex items-center gap-1.5">
                        <span>📅</span>
                        <span>{date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                        {event.title}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-3 mb-4 flex-1 leading-relaxed">
                        {event.description}
                    </p>

                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
                        <div className="text-xs text-slate-500 font-medium">
                            {event.remainingSpots > 0 ? (
                                <span className="text-emerald-400">Available</span>
                            ) : (
                                <span className="text-red-400">Fully Booked</span>
                            )}
                        </div>
                        <div className="text-blue-400 group-hover:text-blue-300 font-semibold text-sm flex items-center gap-1.5 transition-colors">
                            <span>View Details</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default EventCard;
