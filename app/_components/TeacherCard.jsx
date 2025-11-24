'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, BookOpen, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function TeacherCard({ teacher, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
        >
            <Card className="h-full overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/50 backdrop-blur-sm dark:bg-zinc-900/50">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <Avatar className="h-16 w-16 border-2 border-primary/10">
                        <AvatarImage src={teacher.avatarUrl} alt={teacher.name} />
                        <AvatarFallback className="bg-primary/5 text-primary font-bold text-lg">
                            {teacher.initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <CardTitle className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
                            {teacher.name}
                        </CardTitle>
                        <CardDescription className="text-primary font-medium flex items-center gap-1">
                            <User className="w-3 h-3" /> {teacher.title}
                        </CardDescription>
                        <span className="inline-block mt-1 text-xs bg-primary/10 text-primary rounded px-1">
                            {teacher.department}
                        </span>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                    <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary/70" />
                        <span className="truncate">{teacher.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary/70" />
                        <span>{teacher.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary/70" />
                        <span>{teacher.office}</span>
                    </div>
                    <div className="flex items-start gap-2 mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                        <BookOpen className="w-4 h-4 text-primary/70 mt-0.5" />
                        <span className="line-clamp-2 text-xs italic">{teacher.research}</span>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
