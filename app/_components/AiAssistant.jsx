'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, X, Bot, User, Trash2, ChevronDown, Loader2, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AiAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            sender: 'bot',
            text: "Hello! 👋 I'm your **KYD AI Assistant**, powered by Gemini. Ask me anything about department notes, PYQs, faculty members, upcoming events, or campus policies!",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const quickQuestions = [
        "How to find PYQs?",
        "Who is Dr. Dharampal Singh?",
        "Available notes for BTech?",
        "Upcoming events schedule?"
    ];

    const sendMessage = async (textToSend) => {
        const query = textToSend || input.trim();
        if (!query || loading) return;

        const userMsg = {
            id: Date.now().toString(),
            sender: 'user',
            text: query,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages((prev) => [...prev, userMsg]);
        if (!textToSend) setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: query,
                    history: messages.slice(1) // exclude welcome message
                })
            });

            const data = await res.json();

            if (res.ok && data.response) {
                const botMsg = {
                    id: (Date.now() + 1).toString(),
                    sender: 'bot',
                    text: data.response,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages((prev) => [...prev, botMsg]);
            } else {
                throw new Error(data.error || 'Failed to get response');
            }
        } catch (err) {
            console.error(err);
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    sender: 'bot',
                    text: "Sorry, I couldn't process your request right now. Please try again or email support@jisuniversity.edu.",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([
            {
                id: 'welcome',
                sender: 'bot',
                text: "Chat cleared! 👋 How can I help you today?",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ]);
    };

    // Simple helper to format basic bold text and bullet points from Markdown
    const renderFormattedText = (content) => {
        const lines = content.split('\n');
        return lines.map((line, idx) => {
            // Bold text conversion **text**
            const parts = line.split(/(\*\*.*?\*\*)/g).map((part, pIdx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={pIdx} className="font-semibold text-zinc-900 dark:text-white">{part.slice(2, -2)}</strong>;
                }
                return part;
            });

            if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                return (
                    <li key={idx} className="ml-4 list-disc my-0.5">
                        {parts.slice(1)}
                    </li>
                );
            }

            return (
                <p key={idx} className={idx > 0 ? "mt-1.5" : ""}>
                    {parts}
                </p>
            );
        });
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            {/* Chat Popup Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="pointer-events-auto mb-4 w-[90vw] sm:w-[400px] h-[540px] max-h-[82vh] rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-black/5"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-primary/10 via-indigo-500/10 to-transparent border-b border-zinc-200/80 dark:border-zinc-800">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white shadow-md">
                                        <Bot className="w-5 h-5" />
                                    </div>
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full"></span>
                                </div>
                                <div>
                                    <div className="flex items-center space-x-1.5">
                                        <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">KYD AI Assistant</h3>
                                        <span className="text-[10px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">Gemini</span>
                                    </div>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Ask about notes, PYQs, faculty & events</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={clearChat}
                                    title="Clear chat"
                                    className="h-8 w-8 rounded-full text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsOpen(false)}
                                    title="Close chat"
                                    className="h-8 w-8 rounded-full text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                >
                                    <ChevronDown className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Quick Prompt Chips */}
                        <div className="px-4 py-2 bg-zinc-50/80 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                            <span className="text-[11px] text-zinc-400 font-medium whitespace-nowrap flex items-center gap-1 mr-1">
                                <HelpCircle className="w-3 h-3" /> FAQs:
                            </span>
                            {quickQuestions.map((q, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => sendMessage(q)}
                                    disabled={loading}
                                    className="text-xs whitespace-nowrap bg-white dark:bg-zinc-800 hover:bg-primary/10 dark:hover:bg-primary/20 text-zinc-700 dark:text-zinc-300 hover:text-primary dark:hover:text-primary-foreground border border-zinc-200 dark:border-zinc-700/60 rounded-full px-2.5 py-1 transition-colors font-medium shadow-xs disabled:opacity-50"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                >
                                    <div
                                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5 ${msg.sender === 'user'
                                                ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900'
                                                : 'bg-primary text-white shadow-xs'
                                            }`}
                                    >
                                        {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </div>

                                    <div
                                        className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${msg.sender === 'user'
                                                ? 'bg-primary text-white rounded-tr-xs shadow-md'
                                                : 'bg-zinc-100 dark:bg-zinc-800/90 text-zinc-800 dark:text-zinc-200 rounded-tl-xs border border-zinc-200/60 dark:border-zinc-700/50'
                                            }`}
                                    >
                                        <div className="space-y-1">{renderFormattedText(msg.text)}</div>
                                        <span
                                            className={`block text-[10px] mt-1.5 text-right ${msg.sender === 'user' ? 'text-white/70' : 'text-zinc-400 dark:text-zinc-500'
                                                }`}
                                        >
                                            {msg.time}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {loading && (
                                <div className="flex items-start gap-2.5">
                                    <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div className="bg-zinc-100 dark:bg-zinc-800/90 rounded-2xl rounded-tl-xs px-4 py-3 border border-zinc-200/60 dark:border-zinc-700/50 flex items-center space-x-2">
                                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                        <span className="text-xs text-zinc-500 dark:text-zinc-400">Gemini is thinking...</span>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-white dark:bg-zinc-900 border-t border-zinc-200/80 dark:border-zinc-800">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    sendMessage();
                                }}
                                className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800/80 rounded-full px-4 py-1.5 border border-zinc-200 dark:border-zinc-700/70 focus-within:border-primary dark:focus-within:border-primary transition-all shadow-inner"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask about notes, PYQs, faculty..."
                                    className="flex-1 bg-transparent text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none py-1.5"
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={!input.trim() || loading}
                                    className="h-8 w-8 rounded-full bg-primary hover:bg-primary/90 text-white disabled:opacity-40 transition-all flex-shrink-0 shadow-xs"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Trigger Button */}
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="pointer-events-auto"
            >
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative rounded-full h-14 px-5 bg-gradient-to-r from-primary via-indigo-600 to-indigo-700 hover:from-primary/90 hover:to-indigo-800 text-white shadow-xl hover:shadow-2xl border border-white/20 flex items-center space-x-2.5 group transition-all duration-300"
                >
                    <div className="relative">
                        <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                    </div>
                    <span className="font-semibold text-sm tracking-wide">
                        {isOpen ? 'Close Assistant' : 'Ask KYD AI'}
                    </span>
                    {!isOpen && (
                        <span className="flex h-2.5 w-2.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
                        </span>
                    )}
                </Button>
            </motion.div>
        </div>
    );
}
