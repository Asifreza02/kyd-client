'use client';

import { motion } from "framer-motion";
import { Users, BookOpen, GraduationCap } from "lucide-react";

const stats = [
    {
        label: "Students",
        value: "1200+",
        icon: Users,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        label: "Faculty Members",
        value: "50+",
        icon: GraduationCap,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
    },
    {
        label: "Research Papers",
        value: "300+",
        icon: BookOpen,
        color: "text-green-500",
        bg: "bg-green-500/10",
    },
];

export default function Stats() {
    return (
        <section className="py-12 bg-white dark:bg-zinc-950 border-y border-zinc-100 dark:border-zinc-800">
            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="flex items-center p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 hover:border-primary/20 transition-colors"
                        >
                            <div className={`p-4 rounded-xl ${stat.bg} mr-4`}>
                                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                                    {stat.value}
                                </h3>
                                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                    {stat.label}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
