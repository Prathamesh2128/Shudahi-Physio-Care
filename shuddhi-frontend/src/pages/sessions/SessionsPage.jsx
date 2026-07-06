import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '../../api/auth.api';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';

export default function SessionsPage() {
    const queryClient = useQueryClient();
    const [revoking, setRevoking] = useState(null);

    const { data, isLoading } = useQuery({
        queryKey: ['sessions'],
        queryFn: () => authApi.getSessions().then(r => r.data.data),
        refetchInterval: 30_000,   // auto-refresh every 30 sec
    });

    const revokeMutation = useMutation({
        mutationFn: (id) => authApi.revokeSession(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['sessions']);
            toast.success('Session revoked');
        },
        onError: () => toast.error('Failed to revoke session'),
        onSettled: () => setRevoking(null),
    });

    const revokeAllMutation = useMutation({
        mutationFn: () => authApi.revokeAllOtherSessions(),
        onSuccess: (data) => {
            queryClient.invalidateQueries(['sessions']);
            toast.success(data.data.message || 'All other sessions revoked');
        },
        onError: () => toast.error('Failed to revoke sessions'),
    });

    const sessions = data || [];

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="page-title">Active sessions</h2>
                    <p className="page-sub">{sessions.length} device(s) signed in</p>
                </div>

                {sessions.filter(s => !s.isCurrent).length > 0 && (
                    <Button
                        variant="danger"
                        size="sm"
                        loading={revokeAllMutation.isPending}
                        onClick={() => revokeAllMutation.mutate()}
                    >
                        Sign out all others
                    </Button>
                )}
            </div>

            {sessions.length === 0 ? (
                <div className="card">
                    <div className="card-body text-center py-12 text-gray-400">
                        No active sessions found
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    {sessions.map(session => (
                        <SessionCard
                            key={session.id}
                            session={session}
                            onRevoke={() => {
                                setRevoking(session.id);
                                revokeMutation.mutate(session.id);
                            }}
                            isRevoking={revoking === session.id && revokeMutation.isPending}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function SessionCard({ session, onRevoke, isRevoking }) {
    const lastActive = new Date(session.lastActive);
    const expiresAt = new Date(session.expiresAt);
    const isExpiringSoon =
        expiresAt.getTime() - Date.now() < 1000 * 60 * 30;  // < 30 min

    return (
        <div className={`card transition-all ${session.isCurrent ? 'ring-2 ring-primary-500' : ''
            }`}>
            <div className="card-body flex items-start gap-4">
                {/* Device icon */}
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-500">
                    <DeviceIcon className="w-5 h-5" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {session.deviceInfo || 'Unknown device'}
                        </p>
                        {session.isCurrent && (
                            <Badge variant="green" dot>Current session</Badge>
                        )}
                        {isExpiringSoon && !session.isCurrent && (
                            <Badge variant="yellow">Expiring soon</Badge>
                        )}
                    </div>

                    <div className="mt-1.5 grid grid-cols-2 gap-x-6 gap-y-1">
                        <p className="text-xs text-gray-500">
                            <span className="font-medium">IP:</span> {session.ipAddress || '—'}
                        </p>
                        <p className="text-xs text-gray-500">
                            <span className="font-medium">Last active:</span>{' '}
                            {formatRelative(lastActive)}
                        </p>
                        <p className="text-xs text-gray-500">
                            <span className="font-medium">Expires:</span>{' '}
                            {expiresAt.toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Revoke button */}
                {!session.isCurrent && (
                    <Button
                        variant="danger"
                        size="xs"
                        loading={isRevoking}
                        onClick={onRevoke}
                    >
                        {isRevoking ? 'Revoking...' : 'Revoke'}
                    </Button>
                )}
            </div>
        </div>
    );
}

function formatRelative(date) {
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return date.toLocaleDateString();
}

function DeviceIcon(p) {
    return (
        <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    );
}