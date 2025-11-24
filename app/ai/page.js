'use client';

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AIPage() {
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hello! I'm your department assistant. Ask me anything about teachers, courses, or research." }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("API Error Details:", errorData);
                throw new Error(errorData.error || "Failed to fetch response");
            }

            const data = await response.json();
            setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-6 bg-zinc-50/50 dark:bg-zinc-950 flex flex-col items-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-3xl flex flex-col h-[80vh]"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Department AI Assistant</h1>
                        <p className="text-zinc-500 dark:text-zinc-400">Powered by Gemini</p>
                    </div>
                </div>

                <Card className="flex-1 flex flex-col overflow-hidden border-zinc-200 dark:border-zinc-800 shadow-xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <AnimatePresence initial={false}>
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                                >
                                    <Avatar className={`w-8 h-8 ${msg.role === "assistant" ? "bg-primary/10" : "bg-zinc-100 dark:bg-zinc-800"}`}>
                                        <AvatarFallback>
                                            {msg.role === "assistant" ? <Bot className="w-4 h-4 text-primary" /> : <User className="w-4 h-4" />}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div
                                        className={`rounded-2xl px-4 py-2 max-w-[80%] ${msg.role === "user"
                                            ? "bg-primary text-white"
                                            : "bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700"
                                            }`}
                                    >
                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-2 text-zinc-400 text-sm ml-12"
                            >
                                <span className="animate-pulse">Thinking...</span>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about teachers, research, or courses..."
                                className="flex-1 bg-transparent border-zinc-200 dark:border-zinc-700 focus-visible:ring-primary caret-zinc-900 dark:caret-zinc-100"
                                disabled={isLoading}
                            />
                            <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="rounded-full">
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
