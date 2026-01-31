import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Calendar, ArrowRight } from 'lucide-react';

const EventCard = ({ event }) => {
    const date = new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <Link to={`/events/${event.id}`} className="block group">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-slate-200 h-full flex flex-col">
                {/* Gradient Header */}
                <div className="h-44 bg-[#005596] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    {/* Background Pattern */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#FDC500]/20 rounded-full blur-2xl"></div>

                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 text-slate-800 shadow-sm">
                            <MapPin size={14} className="text-[#005596]" />
                            <span>{event.location}</span>
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 text-[#005596] shadow-sm">
                            <Users size={14} />
                            <span>{event.remainingSpots}</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                    <div className="text-xs text-[#005596] font-semibold mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                        <Calendar size={14} />
                        <span>{date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#005596] transition-colors line-clamp-2 font-serif">
                        {event.title}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-1 leading-relaxed">
                        {event.description}
                    </p>

                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-100">
                        <div className="text-xs font-medium">
                            {event.remainingSpots > 0 ? (
                                <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Available</span>
                            ) : (
                                <span className="text-red-600 bg-red-50 px-2 py-1 rounded-md">Fully Booked</span>
                            )}
                        </div>
                        <div className="text-[#005596] font-semibold text-sm flex items-center gap-1.5 transition-colors group-hover:underline">
                            <span>View Details</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default EventCard;
