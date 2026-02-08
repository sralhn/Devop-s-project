import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/events';
import { useAuth } from '../context/AuthContext';
import { Lock, ArrowRight, Mail } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [emailNotVerified, setEmailNotVerified] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setEmailNotVerified(false);
        setResendSuccess(false);
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            login(response.data.token, response.data.user);
            navigate('/');
        } catch (err) {
            const errorData = err.response?.data;
            setError(errorData?.error || 'Login failed');
            if (errorData?.emailNotVerified) {
                setEmailNotVerified(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendVerification = async () => {
        setResendLoading(true);
        setResendSuccess(false);
        setError('');

        try {
            await api.post('/auth/resend-verification', { email });
            setResendSuccess(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to resend verification email');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto animate-fade-in-up">
            <div className="bg-white rounded-3xl p-10 shadow-2xl border border-slate-200">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-[#005596] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Lock size={32} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-800 mb-2 font-serif">Welcome Back</h1>
                    <p className="text-slate-500">Sign in to your account</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
                        {error}
                    </div>
                )}

                {emailNotVerified && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <Mail size={20} className="text-amber-600 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm text-amber-800 mb-3">
                                    Your email address hasn t been verified yet. Please check your inbox for the verification link.
                                </p>
                                {resendSuccess ? (
                                    <p className="text-sm text-emerald-700 font-semibold">
                                        ✅ Verification email sent! Check your inbox.
                                    </p>
                                ) : (
                                    <button
                                        onClick={handleResendVerification}
                                        disabled={resendLoading}
                                        className="text-sm font-semibold text-[#005596] hover:text-[#00447a] underline disabled:opacity-50"
                                    >
                                        {resendLoading ? 'Sending...' : 'Resend verification email'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
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
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 bg-slate-50 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-[#005596] outline-none border border-slate-200 focus:border-[#005596] transition"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#005596] hover:bg-[#00447a] text-white px-6 py-4 rounded-xl font-bold shadow-lg hover:shadow-blue-900/20 transition-all transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <>
                                <ArrowRight size={20} />
                                <span>Sign In</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-slate-500 text-sm">
                        Don t have an account?{' '}
                        <Link to="/register" className="text-[#005596] hover:text-[#00447a] font-semibold transition">
                            Create one
                        </Link>
                    </p>
                </div>


            </div>
        </div>
    );
};

export default Login;
