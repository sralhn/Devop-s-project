import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/events';
import { CheckCircle, XCircle, Mail, Loader } from 'lucide-react';

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');
    const [alreadyVerified, setAlreadyVerified] = useState(false);

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await api.get(`/auth/verify-email/${token}`);
                setStatus('success');
                setMessage(response.data.message);
                setAlreadyVerified(response.data.alreadyVerified || false);

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } catch (err) {
                setStatus('error');
                setMessage(err.response?.data?.error || 'Email verification failed');
            }
        };

        if (token) {
            verifyEmail();
        }
    }, [token, navigate]);

    return (
        <div className="max-w-md mx-auto animate-fade-in-up">
            <div className="bg-white rounded-3xl p-10 shadow-2xl border border-slate-200">
                {status === 'verifying' && (
                    <div className="text-center">
                        <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Loader size={40} className="text-blue-600 animate-spin" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-3 font-serif">Verifying Email...</h1>
                        <p className="text-slate-600">
                            Please wait while we verify your email address.
                        </p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="text-center">
                        <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} className="text-emerald-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-3 font-serif">
                            {alreadyVerified ? 'Already Verified!' : 'Email Verified!'}
                        </h1>
                        <p className="text-slate-600 mb-6">
                            {message}
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                            <p className="text-sm text-blue-800">
                                Redirecting to login page in 3 seconds...
                            </p>
                        </div>
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 bg-[#005596] hover:bg-[#00447a] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-blue-900/20 transition-all"
                        >
                            <span>Go to Login Now</span>
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="text-center">
                        <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <XCircle size={40} className="text-red-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-3 font-serif">Verification Failed</h1>
                        <p className="text-slate-600 mb-6">
                            {message}
                        </p>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                            <p className="text-sm text-amber-800">
                                The verification link may have expired or is invalid.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <Link
                                to="/login"
                                className="block w-full bg-[#005596] hover:bg-[#00447a] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-blue-900/20 transition-all"
                            >
                                Go to Login
                            </Link>
                            <p className="text-sm text-slate-600">
                                You can request a new verification email from the login page.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
