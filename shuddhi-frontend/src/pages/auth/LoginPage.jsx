import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { ROUTES } from '../../constants/routes';

export default function LoginPage() {
    const { login } = useAuth();
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({ defaultValues: { email: '', password: '' } });

    // Show session-expired banner if redirected here
    const sessionExpired = new URLSearchParams(location.search).get('session') === 'expired';

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await login({
                email: data.email.toLowerCase().trim(),
                password: data.password,
                deviceInfo: navigator.userAgent,
            });
        } catch (err) {
            const msg = err.response?.data?.error || 'Login failed';
            const status = err.response?.status;

            if (status === 401) {
                setError('password', {
                    message: 'Invalid email or password',
                });
            } else if (status === 403) {
                toast.error(msg);
            } else {
                toast.error(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="px-8 py-8">

                {/* Session expired alert */}
                {sessionExpired && (
                    <div className="mb-5 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-center gap-2">
                        <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="text-amber-800 text-sm font-medium">
                            Your session expired. Please log in again.
                        </p>
                    </div>
                )}

                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Sign in</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Access your HMS dashboard
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Email address"
                        type="email"
                        placeholder="you@hospital.com"
                        required
                        autoComplete="email"
                        error={errors.email?.message}
                        icon={<MailIcon />}
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Enter a valid email address',
                            },
                        })}
                    />

                    <div>
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                            error={errors.password?.message}
                            icon={<LockIcon />}
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 8, message: 'Minimum 8 characters' },
                            })}
                        />
                        <div className="mt-2 text-right">
                            <Link
                                to={ROUTES.FORGOT_PASSWORD}
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        fullWidth
                        size="lg"
                        loading={loading}
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        New patient?{' '}
                        <Link
                            to={ROUTES.REGISTER}
                            className="font-medium text-primary-600 hover:text-primary-700"
                        >
                            Create an account
                        </Link>
                    </p>
                </div>

                {/* Demo credentials hint */}
                <div className="mt-5 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 text-center font-medium mb-2">Demo credentials</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <div className="bg-white p-2 rounded border border-gray-200">
                            <p className="font-medium">Doctor</p>
                            <p className="text-gray-400">doctor@hms.in</p>
                            <p className="text-gray-400">Doctor@123</p>
                        </div>
                        <div className="bg-white p-2 rounded border border-gray-200">
                            <p className="font-medium">Admin</p>
                            <p className="text-gray-400">admin@hms.in</p>
                            <p className="text-gray-400">Admin@123</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}

function MailIcon() {
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    );
}

function LockIcon() {
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
    );
}