'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, UserCog, Users, FileText, GraduationCap, CalendarDays, BookOpen, FileQuestion, Plus, Check, X, Trash2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

const TABS = [
    { id: 'users', label: 'Users', icon: UserCog, desc: 'Manage users and roles' },
    { id: 'communities', label: 'Communities', icon: Users, desc: 'Manage all communities' },
    { id: 'community-requests', label: 'Comm. Requests', icon: FileText, desc: 'Approve or reject new community proposals' },
    { id: 'teachers', label: 'Teachers', icon: GraduationCap, desc: 'Manage faculty directory' },
    { id: 'events', label: 'Events', icon: CalendarDays, desc: 'Review & manage events' },
    { id: 'notes', label: 'Notes', icon: BookOpen, desc: 'Review & manage notes' },
    { id: 'pyqs', label: 'PYQs', icon: FileQuestion, desc: 'Review & manage PYQs' },
];

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('users');
    const [data, setData] = useState({
        users: [], communities: [], applications: [],
        teachers: [], events: [], notes: [], pyqs: []
    });
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(null); // tracks which item is being acted on
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchData = useCallback(async (tab) => {
        setLoading(true);
        try {
            let url = `/api/${tab}`;
            // For communities and community-requests, fetch all from communities endpoint
            if (tab === 'communities' || tab === 'community-requests') {
                url = '/api/communities?all=true';
            }
            const res = await fetch(url);
            if (res.ok) {
                let json = await res.json();
                // For community-requests, filter to only pending
                if (tab === 'community-requests') {
                    json = json.filter(c => c.status === 'pending');
                }
                setData(prev => ({ ...prev, [tab]: json }));
            }
        } catch (error) {
            console.error(`Failed to fetch ${tab}`, error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(activeTab);
    }, [activeTab, fetchData]);

    // ── Actions ──
    const handleCreate = async (e) => {
        e.preventDefault();
        setIsCreating(true);
        const formData = new FormData(e.target);
        const body = Object.fromEntries(formData.entries());

        if (['events', 'notes', 'pyqs'].includes(activeTab)) {
            body.status = 'approved';
            body.submittedBy = session?.user?.name || 'Admin';
        }

        try {
            const res = await fetch(`/api/${activeTab}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (res.ok) {
                setIsCreateOpen(false);
                showToast('Created successfully');
                fetchData(activeTab);
            }
        } catch (error) {
            showToast('Failed to create', 'error');
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        setActionLoading(id);
        try {
            const res = await fetch(`/api/${activeTab}/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setData(prev => ({
                    ...prev,
                    [activeTab]: prev[activeTab].filter(item => item._id !== id && item.id !== id)
                }));
                showToast('Deleted successfully');
            }
        } catch (error) {
            showToast('Failed to delete', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        setActionLoading(id + newStatus);
        try {
            let res;
            if (activeTab === 'applications') {
                res = await fetch('/api/applications', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id, status: newStatus })
                });
            } else if (activeTab === 'community-requests') {
                res = await fetch(`/api/communities/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus })
                });
            } else {
                res = await fetch(`/api/${activeTab}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus })
                });
            }
            if (res.ok) {
                showToast(`${newStatus === 'approved' ? 'Approved' : 'Declined'} successfully`);
                fetchData(activeTab);
            } else {
                showToast('Action failed', 'error');
            }
        } catch (error) {
            showToast('Action failed', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const currentTab = TABS.find(t => t.id === activeTab);
    const items = data[activeTab] || [];
    const canCreate = ['communities', 'teachers', 'events', 'notes', 'pyqs'].includes(activeTab);
    const hasStatus = ['events', 'notes', 'pyqs', 'applications', 'community-requests'].includes(activeTab);

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-6 bg-zinc-50/50 dark:bg-zinc-950 flex flex-col md:flex-row gap-6">

            {/* ── Toast ── */}
            {toast && (
                <div className={`fixed top-28 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-in slide-in-from-right ${
                    toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
                }`}>
                    {toast.message}
                </div>
            )}

            {/* ── Sidebar ── */}
            <div className="w-full md:w-64 shrink-0 space-y-2">
                <div className="flex items-center gap-3 mb-6 px-4">
                    <div className="bg-rose-100 dark:bg-rose-900/30 p-2 rounded-xl text-rose-600 dark:text-rose-400">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">Admin</h1>
                </div>

                <div className="flex flex-col gap-1">
                    {TABS.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all cursor-pointer ${
                                    isActive
                                        ? 'bg-primary text-primary-foreground shadow-md'
                                        : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100'
                                }`}
                            >
                                <Icon className="w-5 h-5" /> {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Main Content ── */}
            <div className="flex-1 min-w-0">
                <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-md h-full min-h-[500px]">
                    <CardHeader className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle>{currentTab?.label}</CardTitle>
                            <CardDescription>{currentTab?.desc}</CardDescription>
                        </div>

                        {canCreate && (
                            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                                <DialogTrigger asChild>
                                    <Button className="gap-2"><Plus className="w-4 h-4" /> Add New</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Create {activeTab.slice(0, -1)}</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleCreate} className="space-y-4 mt-4">
                                        {activeTab === 'communities' && (
                                            <>
                                                <div className="space-y-2"><Label>Name</Label><Input name="name" required /></div>
                                                <div className="space-y-2"><Label>Lead Name</Label><Input name="lead" required /></div>
                                                <div className="space-y-2"><Label>Leader ID (User ID)</Label><Input name="leaderId" required placeholder="e.g. 3" /></div>
                                                <div className="space-y-2"><Label>Category</Label><Input name="category" required /></div>
                                                <div className="space-y-2"><Label>Tags</Label><Input name="tags" /></div>
                                                <div className="space-y-2"><Label>Description</Label><textarea name="description" required className="w-full p-2 border rounded" /></div>
                                            </>
                                        )}
                                        {activeTab === 'teachers' && (
                                            <>
                                                <div className="space-y-2"><Label>Name</Label><Input name="name" required /></div>
                                                <div className="space-y-2"><Label>Title</Label><Input name="title" required /></div>
                                                <div className="space-y-2"><Label>Email</Label><Input name="email" type="email" required /></div>
                                                <div className="space-y-2"><Label>Department</Label><Input name="department" required /></div>
                                                <div className="space-y-2"><Label>Research</Label><Input name="research" /></div>
                                            </>
                                        )}
                                        {activeTab === 'events' && (
                                            <>
                                                <div className="space-y-2"><Label>Title</Label><Input name="title" required /></div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2"><Label>Date</Label><Input name="date" type="date" required /></div>
                                                    <div className="space-y-2"><Label>Time</Label><Input name="time" placeholder="e.g. 10:00 AM - 5:00 PM" /></div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2"><Label>Location</Label><Input name="location" required /></div>
                                                    <div className="space-y-2">
                                                        <Label>Category</Label>
                                                        <select name="category" className="w-full p-2 border rounded bg-background" defaultValue="Others">
                                                            <option value="Cultural">Cultural</option>
                                                            <option value="Departmental">Departmental</option>
                                                            <option value="Sports">Sports</option>
                                                            <option value="Others">Others</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="space-y-2"><Label>Organizer</Label><Input name="organizer" placeholder="e.g. Department of CS" /></div>
                                                <div className="space-y-2"><Label>Image URL (optional)</Label><Input name="image" type="url" placeholder="https://..." /></div>
                                                <div className="space-y-2"><Label>Registration Link (optional)</Label><Input name="registrationLink" type="url" placeholder="https://..." /></div>
                                                <div className="space-y-2"><Label>Description</Label><textarea name="description" required className="w-full p-2 border rounded min-h-[80px]" /></div>
                                            </>
                                        )}
                                        {['notes', 'pyqs'].includes(activeTab) && (
                                            <>
                                                <div className="space-y-2"><Label>Title</Label><Input name="title" required /></div>
                                                <div className="space-y-2"><Label>Subject</Label><Input name="subject" required /></div>
                                                {activeTab === 'pyqs' && <div className="space-y-2"><Label>Year</Label><Input name="year" required /></div>}
                                                <div className="space-y-2"><Label>Link URL</Label><Input name="fileUrl" required type="url" /></div>
                                            </>
                                        )}
                                        <DialogFooter>
                                            <Button type="submit" disabled={isCreating}>
                                                {isCreating ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...</> : "Save"}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        )}
                    </CardHeader>

                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex items-center justify-center py-16">
                                <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
                            </div>
                        ) : items.length === 0 ? (
                            <div className="text-center py-16 text-zinc-500">No data found.</div>
                        ) : (
                            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {items.map((item, i) => (
                                    <ItemRow
                                        key={item._id || item.id || i}
                                        item={item}
                                        tab={activeTab}
                                        hasStatus={hasStatus}
                                        actionLoading={actionLoading}
                                        onApprove={(id) => handleStatusUpdate(id, 'approved')}
                                        onDecline={(id) => handleStatusUpdate(id, (activeTab === 'applications' || activeTab === 'community-requests') ? 'rejected' : 'declined')}
                                        onDelete={(id) => handleDelete(id)}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// ── Reusable Row Component ──
function ItemRow({ item, tab, hasStatus, actionLoading, onApprove, onDecline, onDelete }) {
    const id = item._id || item.id;
    const isPending = item.status === 'pending';
    const canApprove = hasStatus && isPending;
    const canDelete = ['communities', 'teachers', 'events', 'notes', 'pyqs'].includes(tab);

    // Status badge colors
    const statusColor = {
        approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        declined: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
            {/* Details */}
            <div className="flex-1 min-w-0">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {item.name || item.title || item.userName}
                </div>
                <div className="text-zinc-500 text-xs mt-1 space-x-1">
                    {tab === 'users' && <span>Roll: {item.rollNumber} · Role: {item.role}</span>}
                    {tab === 'communities' && <span>Lead: {item.lead} · {item.category} · {item.memberCount} members · Status: {item.status || 'approved'}</span>}
                    {tab === 'teachers' && <span>{item.title} · {item.department} · {item.email}</span>}
                    {tab === 'events' && <span>{item.date} · {item.location}</span>}
                    {tab === 'notes' && <span>{item.subject} · by {item.submittedBy}</span>}
                    {tab === 'pyqs' && <span>{item.subject} · {item.year} · by {item.submittedBy}</span>}
                    {tab === 'community-requests' && (
                        <span>
                            Lead: {item.lead} · Category: {item.category}
                            {item.description && <> · {item.description.substring(0, 80)}...</>}
                        </span>
                    )}
                    {tab === 'applications' && (
                        <span>
                            Community: {typeof item.communityId === 'object' ? item.communityId?.name : `ID ${item.communityId}`}
                            {' · '}Dept: {item.department} · Year: {item.year}
                            {item.reason && <> · Reason: {item.reason}</>}
                        </span>
                    )}
                </div>
            </div>

            {/* Status + Actions */}
            <div className="flex items-center gap-2 shrink-0">
                {hasStatus && item.status && (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor[item.status] || 'bg-zinc-100 text-zinc-600'}`}>
                        {item.status}
                    </span>
                )}

                {canApprove && (
                    <>
                        <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 h-8"
                            disabled={actionLoading === id + 'approved'}
                            onClick={() => onApprove(id)}
                        >
                            {actionLoading === id + 'approved'
                                ? <Loader2 className="w-3 h-3 animate-spin" />
                                : <Check className="w-3 h-3" />}
                            Approve
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            className="gap-1 h-8"
                            disabled={actionLoading === id + 'rejected' || actionLoading === id + 'declined'}
                            onClick={() => onDecline(id)}
                        >
                            {(actionLoading === id + 'rejected' || actionLoading === id + 'declined')
                                ? <Loader2 className="w-3 h-3 animate-spin" />
                                : <X className="w-3 h-3" />}
                            Decline
                        </Button>
                    </>
                )}

                {canDelete && (
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 h-8 w-8 p-0"
                        disabled={actionLoading === id}
                        onClick={() => onDelete(id)}
                    >
                        {actionLoading === id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </Button>
                )}
            </div>
        </div>
    );
}
