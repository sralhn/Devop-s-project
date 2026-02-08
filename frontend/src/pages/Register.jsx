import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/events';
import { Sparkles, UserPlus, Mail, Check, X, Eye, EyeOff } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Password requirements
    const requirements = [
        { label: 'At least 8 characters', test: p => p.length >= 8 },
        { label: 'One uppercase letter', test: p => /[A-Z]/.test(p) },
        { label: 'One lowercase letter', test: p => /[a-z]/.test(p) },
        { label: 'One number', test: p => /[0-9]/.test(p) },
        { label: 'One special character', test: p => /[^A-Za-z0-9]/.test(p) },
    ];

    const isPasswordValid = requirements.every(req => req.test(password));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/register', { name, email, password });
            // Success - show verification message (no auto-login)
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto animate-fade-in-up">
            <div className="bg-white rounded-3xl p-10 shadow-2xl border border-slate-200">
                {success ? (
                    // Success message after registration
                    <div className="text-center">
                        <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Mail size={40} className="text-emerald-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-3 font-serif">Check Your Email!</h1>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            We have sent a verification link to <strong>{email}</strong>.
                            Please check your inbox and click the link to verify your account.
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                            <p className="text-sm text-blue-800">
                                <strong>⏰ Note:</strong> The verification link will expire in 24 hours.
                            </p>
                        </div>
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 bg-[#005596] hover:bg-[#00447a] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-blue-900/20 transition-all"
                        >
                            <span>Go to Login</span>
                        </Link>
                    </div>
                ) : (
                    // Registration form
                    <>
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-[#005596] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <Sparkles size={32} className="text-[#FDC500]" />
                            </div>
                            <h1 className="text-4xl font-bold text-slate-800 mb-2 font-serif">Join Us</h1>
                            <p className="text-slate-500">Create your account</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-5 py-4 bg-slate-50 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-[#005596] outline-none border border-slate-200 focus:border-[#005596] transition"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-5 py-4 bg-slate-50 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-[#005596] outline-none border border-slate-200 focus:border-[#005596] transition"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>

                            <div>
                                <div className="relative">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Password
                                    </label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`w-full px-5 py-4 bg-slate-50 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-[#005596] outline-none border ${isPasswordValid && password ? 'border-emerald-500 focus:border-emerald-500' : 'border-slate-200 focus:border-[#005596]'} transition pr-12`}
                                        placeholder="Enter secure password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-[38px] text-slate-400 hover:text-slate-600 transition"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>

                                    {/* Password Strength Checklist */}
                                    <div className="mt-3 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Password Requirements:</p>
                                        {requirements.map((req, index) => (
                                            <div key={index} className="flex items-center gap-2 text-sm transition-colors duration-300">
                                                {req.test(password) ? (
                                                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                                        <Check size={12} className="text-emerald-600" />
                                                    </div>
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                                    </div>
                                                )}
                                                <span className={req.test(password) ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
                                                    {req.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !isPasswordValid}
                                className="w-full bg-[#005596] hover:bg-[#00447a] text-white px-6 py-4 rounded-xl font-bold shadow-lg hover:shadow-blue-900/20 transition-all transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        <span>Creating account...</span>
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={20} />
                                        <span>Create Account</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-slate-500 text-sm">
                                Already have an account?{' '}
                                <Link to="/login" className="text-[#005596] hover:text-[#00447a] font-semibold transition">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Register;
