'use client';

import { motion } from "framer-motion";
import { FileText, BookOpen, Download, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notesData, pyqsData } from "@/lib/data";

export default function Resources() {
    const resources = [
        {
            title: "Lecture Notes",
            description: "Access comprehensive lecture notes for all semesters.",
            icon: BookOpen,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            items: Object.keys(notesData), // Get years from data
            link: "/notes"
        },
        {
            title: "Previous Year Questions",
            description: "Practice with PYQs from the last 5 years.",
            icon: FileText,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            items: Object.keys(pyqsData), // Get years from data
            link: "/pyqs"
        }
    ];

    return (
        <section id="resources" className="py-12 md:py-24 bg-zinc-50 dark:bg-zinc-950">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Student Resources</h2>
                    <div className="w-20 h-1 bg-primary rounded-full"></div>
                    <p className="mt-4 text-zinc-500 dark:text-zinc-400 text-center max-w-2xl">
                        Everything you need to excel in your studies, all in one place.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {resources.map((resource, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            viewport={{ once: true }}
                        >
                            <Card className="h-full border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                                <CardHeader>
                                    <div className={`w-12 h-12 rounded-lg ${resource.bg} flex items-center justify-center mb-4`}>
                                        <resource.icon className={`w-6 h-6 ${resource.color}`} />
                                    </div>
                                    <CardTitle className="text-2xl">{resource.title}</CardTitle>
                                    <CardDescription>{resource.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col">
                                    <ul className="space-y-3 mb-6 flex-1">
                                        {resource.items.map((item, i) => (
                                            <li key={i} className="flex items-center justify-between p-3 rounded-md bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group cursor-pointer">
                                                <span className="font-medium text-zinc-700 dark:text-zinc-300">{item}</span>
                                                <div className="w-4 h-4 text-zinc-400 group-hover:text-primary transition-colors">
                                                    <ExternalLink className="w-4 h-4" />
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link href={resource.link} className="w-full">
                                        <Button className="w-full" variant="outline">
                                            View All <ExternalLink className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
