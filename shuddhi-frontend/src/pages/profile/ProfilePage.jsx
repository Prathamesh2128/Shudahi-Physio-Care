import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '../../api/auth.api';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';

const ROLE_COLORS = {
    doctor: 'green', nurse: 'blue', receptionist: 'yellow',
    lab_technician: 'purple', pharmacist: 'indigo',
    accountant: 'gray', admin: 'red', super_admin: 'red', patient: 'blue',
};

export default function ProfilePage() {
    const { updateProfile, user } = useAuth();
    const queryClient = useQueryClient();
    const [editing, setEditing] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ['auth-me'],
        queryFn: () => authApi.getMe().then(r => r.data.data),
        initialData: user,
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm({ values: data });

    const mutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries(['auth-me']);
            setEditing(false);
            toast.success('Profile updated');
        },
        onError: (err) => toast.error(err.response?.data?.error || 'Update failed'),
    });

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Spinner size="lg" />
            </div>
        );
    }

    const profile = data || user;
    const initials = profile?.fullName?.split(' ').map(n => n[0]).slice(0, 2).join('') || 'U';

    return (
        <div className="max-w-2xl space-y-6">

            {/* Profile header card */}
            <div className="card">
                <div className="card-body">
                    <div className="flex items-start gap-5">
                        <div className="w-20 h-20 rounded-2xl bg-primary-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                            {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-xl font-bold text-gray-900">{profile?.fullName}</h2>
                            <p className="text-gray-500 text-sm">{profile?.email}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {profile?.roles?.map(role => (
                                    <Badge
                                        key={role}
                                        variant={ROLE_COLORS[role] || 'gray'}
                                        dot
                                        className="capitalize"
                                    >
                                        {role.replace('_', ' ')}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {!editing && (
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setEditing(true)}
                            >
                                Edit profile
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Editable form */}
            <div className="card">
                <div className="card-header">
                    <h3 className="text-base font-semibold text-gray-900">
                        Personal information
                    </h3>
                </div>
                <div className="card-body">
                    {editing ? (
                        <form
                            onSubmit={handleSubmit(d => mutation.mutate(d))}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Full name"
                                    required
                                    error={errors.fullName?.message}
                                    {...register('fullName', { required: 'Required' })}
                                />
                                <Input
                                    label="Phone number"
                                    {...register('phone')}
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <Button
                                    type="submit"
                                    loading={mutation.isPending}
                                    disabled={!isDirty || mutation.isPending}
                                >
                                    Save changes
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => { setEditing(false); reset(); }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
                            <ProfileField label="Full name" value={profile?.fullName} />
                            <ProfileField label="Email" value={profile?.email} />
                            <ProfileField label="Phone" value={profile?.phone || '—'} />
                            <ProfileField label="Employee ID" value={profile?.employeeId || '—'} />
                            <ProfileField
                                label="Email verified"
                                value={
                                    <span className={`inline-flex items-center gap-1 text-sm font-medium ${profile?.emailVerified ? 'text-green-700' : 'text-red-600'
                                        }`}>
                                        {profile?.emailVerified ? '✓ Verified' : '✗ Not verified'}
                                    </span>
                                }
                            />
                            <ProfileField
                                label="Last login"
                                value={profile?.lastLoginAt
                                    ? new Date(profile.lastLoginAt).toLocaleString()
                                    : '—'}
                            />
                        </dl>
                    )}
                </div>
            </div>

            {/* Permissions summary */}
            <div className="card">
                <div className="card-header flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-900">
                        Permissions
                    </h3>
                    <Badge variant="blue">{profile?.permissions?.length || 0} total</Badge>
                </div>
                <div className="card-body">
                    <div className="flex flex-wrap gap-2">
                        {profile?.permissions?.map(p => (
                            <span
                                key={p}
                                className="font-mono text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md"
                            >
                                {p}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProfileField({ label, value }) {
    return (
        <div>
            <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                {label}
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
                {value}
            </dd>
        </div>
    );
}