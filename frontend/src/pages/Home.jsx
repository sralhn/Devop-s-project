import React, { useEffect, useState } from 'react';
import { api } from '../api/events';
import EventCard from '../components/EventCard';

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
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <p className="text-slate-400 font-medium">Loading events...</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in-up">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <div className="inline-block mb-4">
                    <span className="glass-dark px-4 py-2 rounded-full text-sm font-semibold text-blue-400 inline-flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse-slow"></span>
                        <span>Discover Amazing Events</span>
                    </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 text-shadow">
                    <span className="text-white">Connect Through</span>
                    <br />
                    <span className="gradient-text">Campus Experiences</span>
                </h1>
                <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                    Join the most exciting campus activities, network with peers, and create unforgettable memories.
                </p>
            </div>

            {events.length === 0 ? (
                <div className="glass-card rounded-3xl p-16 md:p-24 text-center border-dashed max-w-2xl mx-auto">
                    <div className="text-7xl mb-6 animate-float">🎉</div>
                    <h3 className="text-2xl font-bold text-white mb-3">No Events Yet</h3>
                    <p className="text-slate-400 text-lg mb-6">Be the first to create an amazing event for your campus community!</p>
                    <a href="/create" className="gradient-primary px-8 py-3 rounded-xl font-semibold text-white inline-block hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                        Create First Event
                    </a>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
                        <span className="text-sm text-slate-400">{events.length} event{events.length !== 1 ? 's' : ''} available</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
