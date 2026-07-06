import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authApi } from '../../api/auth.api';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { ROUTES } from '../../constants/routes';

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [sentTo, setSentTo] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async ({ email }) => {
        setLoading(true);
        try {
            await authApi.forgotPassword(email.toLowerCase().trim());
            // Always show success — backend returns 200 even for unknown emails
            setSentTo(email);
            setSent(true);
        } catch {
            // Still show success to prevent email enumeration
            setSentTo(email);
            setSent(true);
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <AuthLayout>
                <div className="px-8 py-10 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email</h2>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        If an account exists for{' '}
                        <span className="font-medium text-gray-700">{sentTo}</span>,
                        we have sent a password reset link. It expires in 15 minutes.
                    </p>
                    <p className="text-gray-400 text-xs mt-4">
                        Didn't receive it? Check your spam folder or{' '}
                        <button
                            onClick={() => setSent(false)}
                            className="text-primary-600 hover:underline"
                        >
                            try again
                        </button>
                    </p>
                    <Link
                        to={ROUTES.LOGIN}
                        className="inline-block mt-6 text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                        ← Back to login
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            <div className="px-8 py-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Forgot password?</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Enter your email and we'll send you a reset link
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Email address"
                        type="email"
                        placeholder="you@hospital.com"
                        required
                        error={errors.email?.message}
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Enter a valid email',
                            },
                        })}
                    />

                    <Button type="submit" fullWidth size="lg" loading={loading}>
                        {loading ? 'Sending...' : 'Send reset link'}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <Link
                        to={ROUTES.LOGIN}
                        className="text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                        ← Back to login
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}