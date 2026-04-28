'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { Shield, ArrowLeft, Users, UserCog, UserMinus, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function ManageCommunityPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const communityId = params.id;

    const [community, setCommunity] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [newManagerId, setNewManagerId] = useState('');
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch community
            const commRes = await fetch(`/api/communities/${communityId}`);
            if (commRes.ok) {
                setCommunity(await commRes.json());
            }

            // Fetch applications
            const appRes = await fetch(`/api/applications?communityId=${communityId}`);
            if (appRes.ok) {
                setApplications(await appRes.json());
            }
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    }, [communityId]);

    useEffect(() => {
        if (status === 'authenticated') {
            fetchData();
        } else if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, fetchData, router]);

    if (loading || status === 'loading') {
        return (
            <div className="min-h-screen pt-28 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!community) {
        return <div className="pt-28 text-center">Community not found.</div>;
    }

    const isLeader = community.leaderId === session?.user?.id;
    const isManager = community.managers?.includes(session?.user?.id);
    const isAdmin = session?.user?.role === 'admin';

    if (!isLeader && !isManager && !isAdmin) {
        return (
            <div className="pt-28 text-center text-red-500">
                You do not have permission to manage this community.
            </div>
        );
    }

    // Handlers
    const handleApproveReject = async (appId, newStatus) => {
        setActionLoading(`app-${appId}`);
        try {
            const res = await fetch('/api/applications', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: appId, status: newStatus })
            });
            if (res.ok) {
                showToast(`Application ${newStatus}`);
                fetchData();
            } else {
                showToast('Failed to update application', 'error');
            }
        } catch (error) {
            showToast('An error occurred', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const handleAddManager = async () => {
        if (!newManagerId.trim()) return;
        setActionLoading('add-manager');
        try {
            const res = await fetch(`/api/communities/${communityId}/managers`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ managerId: newManagerId.trim() })
            });
            if (res.ok) {
                showToast('Manager added successfully');
                setNewManagerId('');
                fetchData();
            } else {
                const data = await res.json();
                showToast(data.error || 'Failed to add manager', 'error');
            }
        } catch (error) {
            showToast('An error occurred', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const handleRemoveManager = async (managerId) => {
        if (!confirm('Remove this manager?')) return;
        setActionLoading(`remove-manager-${managerId}`);
        try {
            const res = await fetch(`/api/communities/${communityId}/managers`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ managerId })
            });
            if (res.ok) {
                showToast('Manager removed');
                fetchData();
            } else {
                showToast('Failed to remove manager', 'error');
            }
        } catch (error) {
            showToast('An error occurred', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const handleRemoveMember = async (memberId) => {
        if (!confirm('Remove this member from the community?')) return;
        setActionLoading(`remove-member-${memberId}`);
        try {
            const res = await fetch(`/api/communities/${communityId}/members`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ memberId })
            });
            if (res.ok) {
                showToast('Member removed');
                fetchData();
            } else {
                showToast('Failed to remove member', 'error');
            }
        } catch (error) {
            showToast('An error occurred', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-6 bg-zinc-50/50 dark:bg-zinc-950">
            {toast && (
                <div className={`fixed top-28 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-in slide-in-from-right ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}>
                    {toast.message}
                </div>
            )}

            <div className="container mx-auto max-w-4xl space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={`/communities/${communityId}`}>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Shield className="w-6 h-6 text-primary" /> Manage {community.name}
                        </h1>
                        <p className="text-zinc-500 text-sm">Review applications and manage access</p>
                    </div>
                </div>

                {/* Applications Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2"><Users className="w-5 h-5" /> Pending Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {applications.filter(a => a.status === 'pending').length === 0 ? (
                            <p className="text-zinc-500 text-sm">No pending applications.</p>
                        ) : (
                            <div className="space-y-3">
                                {applications.filter(a => a.status === 'pending').map(app => (
                                    <div key={app._id || app.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 gap-4">
                                        <div>
                                            <p className="font-medium">{app.userName} <span className="text-zinc-500 font-normal text-sm">({app.rollNumber})</span></p>
                                            <p className="text-xs text-zinc-500">{app.department} · {app.year}</p>
                                            {app.reason && <p className="text-sm mt-1 text-zinc-700 dark:text-zinc-300">"{app.reason}"</p>}
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 h-8" disabled={actionLoading === `app-${app._id || app.id}`} onClick={() => handleApproveReject(app._id || app.id, 'approved')}>
                                                <Check className="w-4 h-4 mr-1" /> Approve
                                            </Button>
                                            <Button size="sm" variant="destructive" className="h-8" disabled={actionLoading === `app-${app._id || app.id}`} onClick={() => handleApproveReject(app._id || app.id, 'rejected')}>
                                                <X className="w-4 h-4 mr-1" /> Reject
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Managers Section (Leader Only) */}
                {isLeader && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2"><UserCog className="w-5 h-5" /> Managers</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2 max-w-sm">
                                <Input placeholder="User ID to add as manager" value={newManagerId} onChange={(e) => setNewManagerId(e.target.value)} />
                                <Button onClick={handleAddManager} disabled={actionLoading === 'add-manager'}>Add</Button>
                            </div>
                            {community.managers && community.managers.length > 0 && (
                                <div className="space-y-2 mt-4">
                                    {community.managers.map(managerId => (
                                        <div key={managerId} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                                            <span className="text-sm font-medium">User ID: {managerId}</span>
                                            <Button size="sm" variant="ghost" className="text-red-500 h-8 px-2" onClick={() => handleRemoveManager(managerId)} disabled={actionLoading === `remove-manager-${managerId}`}>
                                                <UserMinus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Members Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2"><Users className="w-5 h-5" /> Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {community.members && community.members.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {community.members.map(memberId => (
                                    <div key={memberId} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                                        <span className="text-sm font-medium">User ID: {memberId}</span>
                                        <Button size="sm" variant="ghost" className="text-red-500 h-8 w-8 p-0" onClick={() => handleRemoveMember(memberId)} disabled={actionLoading === `remove-member-${memberId}`}>
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-zinc-500 text-sm">No members yet.</p>
                        )}
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
