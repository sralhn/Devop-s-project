import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import EventDetail from './pages/EventDetail';
import CreateEvent from './pages/CreateEvent';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';

function Navigation() {
    const { isAuthenticated, user, isAdmin, logout } = useAuth();

    return (
        <nav className="relative z-10 glass border-b border-white/10 sticky top-0 backdrop-blur-2xl">
            <div className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-all">
                            <span className="text-2xl">🎓</span>
                        </div>
                        <div>
                            <div className="text-xl font-bold">
                                <span className="gradient-text">Campus</span>
                                <span className="text-white">Events</span>
                            </div>
                            <div className="text-xs text-slate-400 font-medium">Student Event Platform</div>
                        </div>
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link to="/" className="text-slate-300 hover:text-white transition font-medium text-sm">
                            Discover Events
                        </Link>
                        {isAuthenticated ? (
                            <>
                                {isAdmin && (
                                    <Link to="/admin" className="text-purple-400 hover:text-purple-300 transition font-medium text-sm flex items-center gap-1">
                                        <span>👑</span>
                                        <span>Admin Dashboard</span>
                                    </Link>
                                )}
                                <Link to="/create" className="text-slate-300 hover:text-white transition font-medium text-sm">
                                    Create Event
                                </Link>
                                <div className="flex items-center gap-3">
                                    <div className="glass-dark px-4 py-2 rounded-xl flex items-center gap-2">
                                        <span className="text-sm text-slate-400">👤</span>
                                        <span className="text-sm font-semibold text-white">{user?.name}</span>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-300 px-4 py-2 rounded-xl font-semibold text-sm transition flex items-center gap-2"
                                    >
                                        <span>🚪</span>
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-slate-300 hover:text-white transition font-medium text-sm">
                                    Login
                                </Link>
                                <Link to="/register" className="gradient-primary px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all font-semibold text-white text-sm flex items-center gap-2">
                                    <span>✨</span>
                                    <span>Sign Up</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen relative overflow-hidden flex flex-col">
                    {/* Animated Background Orbs */}
                    <div className="fixed inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-float"></div>
                        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
                        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-slate-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '6s' }}></div>
                    </div>

                    {/* Navigation */}
                    <Navigation />

                    {/* Main Content */}
                    <main className="relative z-10 container mx-auto px-6 py-12 flex-1">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/events/:id" element={<EventDetail />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route
                                path="/create"
                                element={
                                    <ProtectedRoute>
                                        <CreateEvent />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute adminOnly={true}>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </main>

                    {/* Footer */}
                    <footer className="relative z-10 glass border-t border-white/10 mt-auto">
                        <div className="container mx-auto px-6 py-8">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="text-center md:text-left">
                                    <div className="font-bold text-white mb-1">Campus Events Platform</div>
                                    <div className="text-sm text-slate-400">Connecting students through amazing experiences</div>
                                </div>
                                <div className="flex gap-6 text-sm text-slate-400">
                                    <a href="#" className="hover:text-white transition">About</a>
                                    <a href="#" className="hover:text-white transition">Contact</a>
                                    <a href="#" className="hover:text-white transition">Privacy</a>
                                    <a href="#" className="hover:text-white transition">Terms</a>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-white/5 text-center text-xs text-slate-500">
                                © 2026 Campus Events. All rights reserved. Built with ❤️ for students.
                            </div>
                        </div>
                    </footer>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
