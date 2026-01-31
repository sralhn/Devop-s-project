import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import EventDetail from './pages/EventDetail';
import CreateEvent from './pages/CreateEvent';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import { GraduationCap, Crown, User, LogOut, Sparkles, Plus, Compass, Mail, Phone, MapPin as MapPinIcon, Github, Linkedin, Twitter } from 'lucide-react';
import AixMarseilleLogo from './AixMarseilleLogo.jpeg';

function Navigation() {
    const { isAuthenticated, user, isAdmin, logout } = useAuth();

    return (
        <nav className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 shadow-sm">
            <div className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-white rounded-xl overflow-hidden shadow-lg group-hover:shadow-blue-500/50 transition-all border border-slate-200">
                            <img src={AixMarseilleLogo} alt="AMU Logo" className="w-full h-full object-contain p-1" />
                        </div>
                        <div>
                            <div className="text-xl font-bold font-serif tracking-tight">
                                <span className="text-[#005596]">AixMarseille</span>
                                <span className="text-[#FDC500]">Events</span>
                            </div>
                            <div className="text-xs text-slate-500 font-medium tracking-wide">University Event Platform</div>
                        </div>
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link to="/" className="text-slate-600 hover:text-[#005596] transition font-medium text-sm flex items-center gap-2">
                            <Compass size={18} />
                            <span>Discover</span>
                        </Link>
                        {isAuthenticated ? (
                            <>
                                {isAdmin && (
                                    <Link to="/admin" className="text-[#FDC500] hover:text-amber-600 transition font-medium text-sm flex items-center gap-2">
                                        <Crown size={18} />
                                        <span>Admin</span>
                                    </Link>
                                )}
                                <Link to="/create" className="text-slate-600 hover:text-[#005596] transition font-medium text-sm flex items-center gap-2">
                                    <Plus size={18} />
                                    <span>Create Event</span>
                                </Link>
                                <div className="flex items-center gap-3">
                                    <div className="bg-slate-100 px-4 py-2 rounded-xl flex items-center gap-2 border border-slate-200">
                                        <User size={16} className="text-[#005596]" />
                                        <span className="text-sm font-semibold text-slate-700">{user?.name}</span>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-4 py-2 rounded-xl font-semibold text-sm transition flex items-center gap-2"
                                    >
                                        <LogOut size={16} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-slate-600 hover:text-[#005596] transition font-medium text-sm">
                                    Login
                                </Link>
                                <Link to="/register" className="gradient-primary px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-blue-900/20 transition-all font-semibold text-white text-sm flex items-center gap-2">
                                    <Sparkles size={16} />
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
                <div className="min-h-screen relative overflow-hidden flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
                    {/* Animated Background Elements - Subtle and Professional */}
                    <div className="fixed inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#005596]/5 rounded-full blur-3xl opacity-50 animate-float"></div>
                        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#FDC500]/5 rounded-full blur-3xl opacity-40"></div>
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
                    <footer className="relative z-10 bg-gradient-to-br from-slate-900 via-[#005596] to-slate-900 text-white mt-auto overflow-hidden">
                        {/* Decorative Background Elements */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FDC500] rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
                        </div>

                        <div className="relative container mx-auto px-6 py-12">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                {/* Brand Section */}
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-white rounded-xl overflow-hidden shadow-lg">
                                            <img src={AixMarseilleLogo} alt="AMU Logo" className="w-full h-full object-contain p-1" />
                                        </div>
                                        <div>
                                            <div className="text-xl font-bold font-serif">
                                                <span className="text-white">AixMarseille</span>
                                                <span className="text-[#FDC500]">Events</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                        Excellence in Campus Life. Connecting the AMU community through memorable events and experiences.
                                    </p>
                                    <div className="flex gap-3">
                                        <a href="https://x.com/AcAixMarseille" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                                            <Twitter size={18} />
                                        </a>
                                        <a href="https://www.linkedin.com/school/aix-marseille-universite/" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                                            <Linkedin size={18} />
                                        </a>
                                        <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                                            <Github size={18} />
                                        </a>
                                    </div>
                                </div>

                                {/* Quick Links */}
                                <div>
                                    <h3 className="text-lg font-bold mb-4 text-[#FDC500]">Quick Links</h3>
                                    <ul className="space-y-2">
                                        <li>
                                            <a href="/" className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 text-sm">
                                                <Compass size={14} />
                                                <span>Discover Events</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="/create" className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 text-sm">
                                                <Plus size={14} />
                                                <span>Create Event</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 text-sm">
                                                <GraduationCap size={14} />
                                                <span>About AMU</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                {/* Contact Info */}
                                <div>
                                    <h3 className="text-lg font-bold mb-4 text-[#FDC500]">Contact Us</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2 text-slate-300 text-sm">
                                            <MapPinIcon size={16} className="mt-0.5 flex-shrink-0" />
                                            <span>Aix-Marseille University<br />58 Boulevard Charles Livon<br />13007 Marseille, France</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-slate-300 text-sm">
                                            <Mail size={16} className="flex-shrink-0" />
                                            <a href="mailto:events@univ-amu.fr" className="hover:text-white transition-colors">events@univ-amu.fr</a>
                                        </li>
                                        <li className="flex items-center gap-2 text-slate-300 text-sm">
                                            <Phone size={16} className="flex-shrink-0" />
                                            <a href="tel:+33491106000" className="hover:text-white transition-colors">+33 4 91 10 60 00</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Bottom Bar */}
                            <div className="pt-8 border-t border-white/10">
                                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                    <div className="text-sm text-slate-300">
                                        © 2026 Aix-Marseille University. All rights reserved.
                                    </div>
                                    <div className="flex gap-6 text-sm">
                                        <a href="#" className="text-slate-300 hover:text-white transition-colors">Privacy Policy</a>
                                        <a href="#" className="text-slate-300 hover:text-white transition-colors">Terms of Service</a>
                                        <a href="#" className="text-slate-300 hover:text-white transition-colors">Cookie Policy</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
