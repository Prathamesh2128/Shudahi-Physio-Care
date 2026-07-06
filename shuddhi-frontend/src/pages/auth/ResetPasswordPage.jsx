import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authApi } from '../../api/auth.api';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { ROUTES } from '../../constants/routes';

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const token = searchParams.get('token') || '';

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    if (!token) {
        return (
            <AuthLayout>
                <div className="px-8 py-10 text-center">
                    <p className="text-red-600 font-medium">Invalid or missing reset token.</p>
                    <Link to={ROUTES.FORGOT_PASSWORD}
                        className="mt-4 inline-block text-primary-600 text-sm hover:underline">
                        Request a new link
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    const onSubmit = async ({ newPassword, confirmPassword }) => {
        setLoading(true);
        try {
            await authApi.resetPassword({ token, newPassword, confirmPassword });
            toast.success('Password reset successfully!');
            navigate(ROUTES.LOGIN, { replace: true });
        } catch (err) {
            const msg = err.response?.data?.error || 'Reset failed';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="px-8 py-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Reset password</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Choose a strong new password
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="New password"
                        type="password"
                        placeholder="Min 8 chars, 1 upper, 1 digit, 1 special"
                        required
                        error={errors.newPassword?.message}
                        {...register('newPassword', {
                            required: 'Password is required',
                            minLength: { value: 8, message: 'Minimum 8 characters' },
                            pattern: {
                                value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/,
                                message: 'Must contain uppercase, lowercase, digit and special character',
                            },
                        })}
                    />

                    <Input
                        label="Confirm new password"
                        type="password"
                        placeholder="Re-enter new password"
                        required
                        error={errors.confirmPassword?.message}
                        {...register('confirmPassword', {
                            required: 'Please confirm your password',
                            validate: val =>
                                val === watch('newPassword') || 'Passwords do not match',
                        })}
                    />

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-700">
                            After resetting, you will be redirected to login. All existing sessions will be revoked.
                        </p>
                    </div>

                    <Button type="submit" fullWidth size="lg" loading={loading}>
                        {loading ? 'Resetting...' : 'Reset password'}
                    </Button>
                </form>
            </div>
        </AuthLayout>
    );
}