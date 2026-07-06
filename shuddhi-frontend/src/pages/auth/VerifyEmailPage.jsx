import React, { useState, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../../api/auth.api';
import AuthLayout from '../../components/layout/AuthLayout';
import Button from '../../components/common/Button';
import { ROUTES } from '../../constants/routes';

export default function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const email = searchParams.get('email') || '';
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const inputRefs = useRef([]);

    const handleChange = (index, val) => {
        if (!/^\d?$/.test(val)) return;        // digits only
        const updated = [...otp];
        updated[index] = val;
        setOtp(updated);
        // Auto-advance
        if (val && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length) {
            const updated = [...otp];
            pasted.split('').forEach((ch, i) => { updated[i] = ch; });
            setOtp(updated);
            inputRefs.current[Math.min(pasted.length, 5)]?.focus();
        }
        e.preventDefault();
    };

    const handleVerify = async () => {
        const code = otp.join('');
        if (code.length < 6) {
            toast.error('Enter the complete 6-digit code');
            return;
        }
        setLoading(true);
        try {
            await authApi.verifyEmail({ email, token: code });
            toast.success('Email verified! You can now login.');
            navigate(ROUTES.LOGIN, { replace: true });
        } catch (err) {
            toast.error(err.response?.data?.error || 'Invalid OTP');
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        try {
            await authApi.resendVerification(email);
            toast.success('New OTP sent to your email');
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Could not resend. Try again.');
        } finally {
            setResending(false);
        }
    };

    return (
        <AuthLayout>
            <div className="px-8 py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-5">
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                    We sent a 6-digit code to
                    <br />
                    <span className="font-semibold text-gray-800">{email}</span>
                </p>

                {/* OTP input */}
                <div
                    className="flex gap-2 justify-center mt-7 mb-6"
                    onPaste={handlePaste}
                >
                    {otp.map((digit, i) => (
                        <input
                            key={i}
                            ref={el => (inputRefs.current[i] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={e => handleChange(i, e.target.value)}
                            onKeyDown={e => handleKeyDown(i, e)}
                            className={[
                                'w-11 h-14 text-center text-xl font-bold rounded-xl border-2',
                                'focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200',
                                'transition-all duration-150',
                                digit ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-300 bg-white text-gray-900',
                            ].join(' ')}
                        />
                    ))}
                </div>

                <Button
                    onClick={handleVerify}
                    fullWidth
                    size="lg"
                    loading={loading}
                    disabled={otp.join('').length < 6 || loading}
                >
                    {loading ? 'Verifying...' : 'Verify email'}
                </Button>

                <p className="text-sm text-gray-500 mt-5">
                    Didn't receive the code?{' '}
                    <button
                        onClick={handleResend}
                        disabled={resending}
                        className="font-medium text-primary-600 hover:text-primary-700 disabled:opacity-50"
                    >
                        {resending ? 'Sending...' : 'Resend OTP'}
                    </button>
                </p>

                <div className="mt-4">
                    <Link
                        to={ROUTES.LOGIN}
                        className="text-sm text-gray-400 hover:text-gray-600"
                    >
                        ← Back to login
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}