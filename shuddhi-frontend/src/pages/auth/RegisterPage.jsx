import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { ROUTES } from '../../constants/routes';

export default function RegisterPage() {
    const { register: registerUser } = useAuth();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await registerUser({
                fullName: data.fullName.trim(),
                email: data.email.toLowerCase().trim(),
                phone: data.phone.trim(),
                password: data.password,
            });
        } catch (err) {
            const msg = err.response?.data?.error || 'Registration failed';
            const status = err.response?.status;

            if (status === 409) {
                if (msg.toLowerCase().includes('email'))
                    setError('email', { message: 'This email is already registered' });
                else
                    toast.error(msg);
            } else if (status === 400) {
                toast.error(msg);
            } else {
                toast.error('Something went wrong. Try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="px-8 py-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Create account</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Register as a patient to book appointments
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Full name"
                        placeholder="Dr. Arun Shah"
                        required
                        error={errors.fullName?.message}
                        {...register('fullName', {
                            required: 'Full name is required',
                            minLength: { value: 2, message: 'Minimum 2 characters' },
                            maxLength: { value: 120, message: 'Maximum 120 characters' },
                        })}
                    />

                    <Input
                        label="Email address"
                        type="email"
                        placeholder="you@example.com"
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

                    <Input
                        label="Phone number"
                        type="tel"
                        placeholder="+919876543210"
                        required
                        hint="Include country code (e.g. +91 for India)"
                        error={errors.phone?.message}
                        {...register('phone', {
                            required: 'Phone number is required',
                            pattern: {
                                value: /^\+[1-9]\d{6,14}$/,
                                message: 'Use E.164 format: +919876543210',
                            },
                        })}
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="Min 8 chars, 1 upper, 1 digit, 1 special"
                        required
                        error={errors.password?.message}
                        {...register('password', {
                            required: 'Password is required',
                            minLength: { value: 8, message: 'Minimum 8 characters' },
                            pattern: {
                                value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/,
                                message: 'Must have uppercase, lowercase, digit and special character',
                            },
                        })}
                    />

                    <Input
                        label="Confirm password"
                        type="password"
                        placeholder="Re-enter your password"
                        required
                        error={errors.confirmPassword?.message}
                        {...register('confirmPassword', {
                            required: 'Please confirm your password',
                            validate: val =>
                                val === watch('password') || 'Passwords do not match',
                        })}
                    />

                    {/* Password strength indicator */}
                    <PasswordStrength password={watch('password') || ''} />

                    <div className="flex items-start gap-2">
                        <input
                            id="terms"
                            type="checkbox"
                            className="mt-0.5 h-4 w-4 text-primary-600 border-gray-300 rounded"
                            {...register('terms', {
                                required: 'You must accept the terms',
                            })}
                        />
                        <label htmlFor="terms" className="text-sm text-gray-600">
                            I agree to the{' '}
                            <a href="#" className="text-primary-600 hover:underline">
                                Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="#" className="text-primary-600 hover:underline">
                                Privacy Policy
                            </a>
                        </label>
                    </div>
                    {errors.terms && (
                        <p className="form-error">{errors.terms.message}</p>
                    )}

                    <Button type="submit" fullWidth size="lg" loading={loading}>
                        {loading ? 'Creating account...' : 'Create account'}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link
                            to={ROUTES.LOGIN}
                            className="font-medium text-primary-600 hover:text-primary-700"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}

function PasswordStrength({ password }) {
    if (!password) return null;

    const checks = [
        { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
        { label: 'Lowercase letter', ok: /[a-z]/.test(password) },
        { label: 'Number', ok: /\d/.test(password) },
        { label: 'Special character', ok: /[@$!%*?&]/.test(password) },
        { label: '8+ characters', ok: password.length >= 8 },
    ];

    const score = checks.filter(c => c.ok).length;
    const width = `${(score / checks.length) * 100}%`;
    const color = score < 2 ? 'bg-red-500' : score < 4 ? 'bg-yellow-500' : 'bg-green-500';
    const label = score < 2 ? 'Weak' : score < 4 ? 'Fair' : score < 5 ? 'Good' : 'Strong';

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Password strength</span>
                <span className={`text-xs font-medium ${score < 2 ? 'text-red-600' : score < 4 ? 'text-yellow-600' : 'text-green-600'
                    }`}>{label}</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-300 ${color}`}
                    style={{ width }}
                />
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {checks.map(c => (
                    <div key={c.label} className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.ok ? 'bg-green-500' : 'bg-gray-300'
                            }`} />
                        <span className={`text-xs ${c.ok ? 'text-green-700' : 'text-gray-400'}`}>
                            {c.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}