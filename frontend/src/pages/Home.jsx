import React, { useEffect, useState } from 'react';
import { api } from '../api/events';
import EventCard from '../components/EventCard';
import { Search, Calendar, MapPin, Users, ArrowRight } from 'lucide-react';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/events')
            .then(res => setEvents(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="text-center py-32 animate-fade-in">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#005596] border-t-transparent mb-4"></div>
                <p className="text-slate-500 font-medium">Loading events...</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in-up max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Hero Section */}
            <div className="text-center mb-16 relative">
                <div className="inline-block mb-4">
                    <span className="glass-white border border-blue-200/50 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-[#005596] inline-flex items-center gap-2 shadow-sm">
                        <span className="w-2 h-2 bg-[#FDC500] rounded-full animate-pulse-slow"></span>
                        <span>Welcome to Aix-Marseille University</span>
                    </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 font-serif tracking-tight">
                    <span className="text-slate-900">Excellence in</span>
                    <br />
                    <span className="text-[#005596]">Campus Life</span>
                </h1>
                <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                    Discover seminars, workshops, and social events across all AMU campuses.
                    Connect with the university community.
                </p>
            </div>

            {events.length === 0 ? (
                <div className="glass-card bg-white/80 rounded-3xl p-16 md:p-24 text-center border border-slate-200/60 max-w-2xl mx-auto shadow-xl">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center animate-float">
                            <Calendar size={40} className="text-[#005596]" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-3">No Events Scheduled</h3>
                    <p className="text-slate-500 text-lg mb-8">Be the first to organize an event for the AMU community!</p>
                    <a href="/create" className="bg-[#005596] text-white px-8 py-3 rounded-xl font-semibold inline-flex items-center gap-2 hover:bg-[#00447a] hover:shadow-lg hover:shadow-blue-900/20 transition-all">
                        <span>Create First Event</span>
                        <ArrowRight size={18} />
                    </a>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <Calendar className="text-[#FDC500]" />
                            <span>Upcoming Events</span>
                        </h2>
                        <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                            {events.length} event{events.length !== 1 ? 's' : ''} available
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Home;
