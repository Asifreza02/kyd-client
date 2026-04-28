'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { Shield, ArrowLeft, Users, UserCog, UserMinus, Check, X, Loader2, Settings, Plus, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
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

    // Settings state
    const [desc, setDesc] = useState('');
    const [img, setImg] = useState('');
    const [rules, setRules] = useState([]);
    const [newRule, setNewRule] = useState('');

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const commRes = await fetch(`/api/communities/${communityId}`);
            if (commRes.ok) {
                const data = await commRes.json();
                setCommunity(data);
                setDesc(data.description || '');
                setImg(data.image || '');
                setRules(data.rules || []);
            }
            const appRes = await fetch(`/api/applications?communityId=${communityId}`);
            if (appRes.ok) setApplications(await appRes.json());
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
        return <div className="pt-28 text-center text-red-500">Unauthorized access.</div>;
    }

    const handleSaveSettings = async () => {
        setActionLoading('save-settings');
        try {
            const res = await fetch(`/api/communities/${communityId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: desc, image: img, rules })
            });
            if (res.ok) {
                showToast('Settings updated');
                fetchData();
            }
        } catch (err) {
            showToast('Failed to save settings', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const addRule = () => {
        if (!newRule.trim()) return;
        setRules([...rules, newRule.trim()]);
        setNewRule('');
    };

    const removeRule = (idx) => {
        setRules(rules.filter((_, i) => i !== idx));
    };

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
            }
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
                showToast('Manager added');
                setNewManagerId('');
                fetchData();
            }
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-6 bg-zinc-50/50 dark:bg-zinc-950">
            {toast && (
                <div className={`fixed top-28 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-in slide-in-from-right ${toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'} text-white`}>
                    {toast.message}
                </div>
            )}

            <div className="container mx-auto max-w-4xl space-y-8">
                <div className="flex items-center gap-4">
                    <Link href={`/communities/${communityId}`}>
                        <Button variant="ghost" size="icon" className="rounded-full"><ArrowLeft className="w-5 h-5" /></Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2"><Shield className="w-6 h-6 text-primary" /> Manage {community.name}</h1>
                        <p className="text-zinc-500 text-sm">Control community settings and member access</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Settings Column */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Applications */}
                        <Card className="border-zinc-200 dark:border-zinc-800">
                            <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800 mb-4">
                                <CardTitle className="text-lg flex items-center gap-2"><Users className="w-5 h-5 text-blue-500" /> Pending Applications</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {applications.filter(a => a.status === 'pending').length === 0 ? (
                                    <p className="text-zinc-500 text-sm py-4">No pending applications.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {applications.filter(a => a.status === 'pending').map(app => (
                                            <div key={app._id} className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex justify-between items-start gap-4">
                                                <div>
                                                    <p className="font-bold text-sm">{app.userName}</p>
                                                    <p className="text-xs text-zinc-500">{app.department} · {app.year}</p>
                                                    <p className="text-sm mt-2 italic text-zinc-600 dark:text-zinc-400">"{app.reason}"</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 h-8 px-3" onClick={() => handleApproveReject(app._id, 'approved')} disabled={actionLoading === `app-${app._id}`}>Approve</Button>
                                                    <Button size="sm" variant="destructive" className="h-8 px-3" onClick={() => handleApproveReject(app._id, 'rejected')} disabled={actionLoading === `app-${app._id}`}>Reject</Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* General Settings */}
                        <Card className="border-zinc-200 dark:border-zinc-800">
                            <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800 mb-4">
                                <CardTitle className="text-lg flex items-center gap-2"><Settings className="w-5 h-5 text-primary" /> Community Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={4} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Banner Image URL</Label>
                                    <Input value={img} onChange={(e) => setImg(e.target.value)} placeholder="https://..." />
                                </div>
                                <div className="space-y-4">
                                    <Label>Community Rules</Label>
                                    <div className="flex gap-2">
                                        <Input value={newRule} onChange={(e) => setNewRule(e.target.value)} placeholder="Add a new rule..." onKeyDown={(e) => e.key === 'Enter' && addRule()} />
                                        <Button type="button" onClick={addRule} variant="secondary"><Plus className="w-4 h-4" /></Button>
                                    </div>
                                    <div className="space-y-2">
                                        {rules.map((rule, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 group">
                                                <span className="text-sm text-zinc-700 dark:text-zinc-300">{idx + 1}. {rule}</span>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all" onClick={() => removeRule(idx)}><Trash2 className="w-4 h-4" /></Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Button className="w-full gap-2 py-6 rounded-xl shadow-lg" onClick={handleSaveSettings} disabled={actionLoading === 'save-settings'}>
                                    {actionLoading === 'save-settings' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save Community Profile
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Column */}
                    <div className="space-y-8">
                        {/* Managers */}
                        <Card className="border-zinc-200 dark:border-zinc-800">
                            <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800 mb-4">
                                <CardTitle className="text-sm flex items-center gap-2 font-bold uppercase tracking-wider text-zinc-500"><UserCog className="w-4 h-4" /> Managers</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Input placeholder="User ID" value={newManagerId} onChange={(e) => setNewManagerId(e.target.value)} />
                                    <Button size="sm" onClick={handleAddManager} disabled={actionLoading === 'add-manager'}>Add</Button>
                                </div>
                                <div className="space-y-2">
                                    {community.managers?.map(mid => (
                                        <div key={mid} className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-xs">
                                            <span className="font-medium truncate">{mid}</span>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500"><UserMinus className="w-3 h-3" /></Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Members Summary */}
                        <Card className="border-zinc-200 dark:border-zinc-800">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">Members</h3>
                                    <Badge variant="secondary">{community.members?.length || 0}</Badge>
                                </div>
                                <p className="text-xs text-zinc-500 leading-relaxed">Regular members are added automatically when their applications are approved.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
