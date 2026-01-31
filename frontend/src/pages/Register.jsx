import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/events';
import { useAuth } from '../context/AuthContext';
import { Sparkles, UserPlus } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/register', { name, email, password });
            register(response.data.token, response.data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto animate-fade-in-up">
            <div className="bg-white rounded-3xl p-10 shadow-2xl border border-slate-200">
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
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 bg-slate-50 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-[#005596] outline-none border border-slate-200 focus:border-[#005596] transition"
                            placeholder="At least 4 characters"
                            required
                            minLength={4}
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
            </div>
        </div>
    );
};

export default Register;
