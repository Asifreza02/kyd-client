'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Shield, GraduationCap, Mail, Settings, Key, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return <div className="min-h-screen pt-32 flex justify-center text-zinc-500">Loading profile...</div>;
    }

    if (!session?.user) return null;

    const { name, rollNumber, role, permissions } = session.user;

    const formatPermission = (perm) => {
        return perm.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-6 bg-zinc-50/50 dark:bg-zinc-950">
            <div className="container mx-auto max-w-4xl">
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row gap-8 items-start"
                >
                    {/* Left Column - Main Profile Card */}
                    <div className="w-full md:w-1/3 space-y-6">
                        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-lg border-t-4 border-t-primary">
                            <CardContent className="pt-8 pb-6 flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 ring-4 ring-white dark:ring-zinc-900 shadow-sm relative">
                                    <User className="w-12 h-12 text-primary" />
                                    {role === 'admin' && (
                                        <div className="absolute -bottom-2 -right-2 bg-rose-500 text-white p-1.5 rounded-full shadow-md">
                                            <Shield className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{name}</h2>
                                <p className="text-zinc-500 dark:text-zinc-400 font-medium mt-1">Roll No: {rollNumber}</p>
                                
                                <div className="mt-6 w-full pt-6 border-t border-zinc-100 dark:border-zinc-800">
                                    <Badge variant={role === 'admin' ? 'default' : 'secondary'} className={`px-4 py-1.5 text-sm ${role === 'admin' ? 'bg-rose-500 hover:bg-rose-600 border-0' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>
                                        {role === 'admin' ? 'Administrator' : 'Student'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Details & Permissions */}
                    <div className="w-full md:w-2/3 space-y-6">
                        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-md">
                            <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Key className="w-5 h-5 text-primary" />
                                    My Permissions
                                </CardTitle>
                                <CardDescription>Your current access rights and privileges within the college portal.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                {permissions && permissions.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {permissions.map((perm, index) => (
                                            <motion.div 
                                                key={perm}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700/50"
                                            >
                                                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-green-600 dark:text-green-400">
                                                    <Star className="w-4 h-4" />
                                                </div>
                                                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                                                    {formatPermission(perm)}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
                                        <GraduationCap className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
                                        <h3 className="text-lg font-medium text-zinc-700 dark:text-zinc-300">Standard Access</h3>
                                        <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mt-2 text-sm">
                                            You currently have standard student access. Apply for communities or events to gain specific management permissions.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-md">
                            <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Settings className="w-5 h-5 text-primary" />
                                    Account Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                    <div>
                                        <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Update Password</h4>
                                        <p className="text-sm text-zinc-500">Ensure your account stays secure.</p>
                                    </div>
                                    <Button variant="outline" size="sm">Change</Button>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                    <div>
                                        <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Notification Preferences</h4>
                                        <p className="text-sm text-zinc-500">Manage how you receive college updates.</p>
                                    </div>
                                    <Button variant="outline" size="sm">Manage</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
