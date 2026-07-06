import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authApi } from '../../api/auth.api';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function ChangePasswordPage() {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        setError,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await authApi.changePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword,
            });
            toast.success('Password changed. Other devices have been logged out.');
            reset();
        } catch (err) {
            const msg = err.response?.data?.error || 'Password change failed';
            if (msg.toLowerCase().includes('current')) {
                setError('currentPassword', { message: 'Current password is incorrect' });
            } else if (msg.toLowerCase().includes('same')) {
                setError('newPassword', { message: 'New password must differ from current' });
            } else {
                toast.error(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md">
            <div className="card">
                <div className="card-header">
                    <h2 className="text-lg font-semibold text-gray-900">Change password</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        After changing, all other sessions will be revoked
                    </p>
                </div>
                <div className="card-body space-y-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input
                            label="Current password"
                            type="password"
                            placeholder="Your current password"
                            required
                            error={errors.currentPassword?.message}
                            {...register('currentPassword', {
                                required: 'Current password is required',
                            })}
                        />

                        <hr className="border-gray-100" />

                        <Input
                            label="New password"
                            type="password"
                            placeholder="Minimum 8 characters"
                            required
                            error={errors.newPassword?.message}
                            {...register('newPassword', {
                                required: 'New password is required',
                                minLength: { value: 8, message: 'Minimum 8 characters' },
                                pattern: {
                                    value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/,
                                    message: 'Needs uppercase, lowercase, digit and special character',
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

                        {/* Warning box */}
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-2">
                            <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5"
                                fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd" />
                            </svg>
                            <p className="text-amber-800 text-xs leading-relaxed">
                                Changing your password will log you out from all other devices and sessions.
                            </p>
                        </div>

                        <Button type="submit" fullWidth loading={loading} variant="primary">
                            {loading ? 'Updating...' : 'Update password'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}