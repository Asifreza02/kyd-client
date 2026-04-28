'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Users, Circle, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { io } from 'socket.io-client';

// ── Helpers ──
function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function getAvatarColor(name) {
    const colors = [
        'bg-rose-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500',
        'bg-violet-500', 'bg-cyan-500', 'bg-pink-500', 'bg-indigo-500',
        'bg-teal-500', 'bg-orange-500',
    ];
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

function timeAgo(date) {
    const now = new Date();
    const d = new Date(date);
    const diffMs = now - d;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);

    if (diffSec < 30) return 'just now';
    if (diffMin < 1) return `${diffSec}s ago`;
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ── Component ──
export default function ChatRoom({ communityId, communityName, user }) {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [typingUsers, setTypingUsers] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [showUsers, setShowUsers] = useState(false);

    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const userId = user?.id || user?.email;
    const userName = user?.name || 'Anonymous';

    // ── Auto-scroll to bottom ──
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // ── Socket.io Connection ──
    useEffect(() => {
        if (!communityId || !userId) return;

        const socket = io({
            path: '/socket.io',
            transports: ['websocket', 'polling'],
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            setIsConnected(true);
            socket.emit('join-room', { communityId, userName, userId });
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        socket.on('message-history', (history) => {
            setMessages(history);
        });

        socket.on('new-message', (message) => {
            setMessages(prev => [...prev, message]);
        });

        socket.on('room-users', (users) => {
            setOnlineUsers(users);
        });

        socket.on('user-typing', ({ userName: typingUser }) => {
            setTypingUsers(prev => {
                if (!prev.includes(typingUser)) return [...prev, typingUser];
                return prev;
            });
        });

        socket.on('user-stop-typing', ({ userName: typingUser }) => {
            setTypingUsers(prev => prev.filter(u => u !== typingUser));
        });

        socket.on('user-joined', ({ userName: joinedUser }) => {
            // Could show a system message here
        });

        socket.on('user-left', ({ userName: leftUser }) => {
            setTypingUsers(prev => prev.filter(u => u !== leftUser));
        });

        socket.on('error-msg', ({ message }) => {
            console.error('Socket error:', message);
        });

        return () => {
            socket.disconnect();
        };
    }, [communityId, userId, userName]);

    // ── Send Message ──
    const handleSend = (e) => {
        e?.preventDefault();
        const text = inputText.trim();
        if (!text || !socketRef.current) return;

        socketRef.current.emit('send-message', {
            communityId,
            text,
            userId,
            userName,
        });

        // Stop typing indicator
        socketRef.current.emit('stop-typing', { communityId });
        setInputText('');
        inputRef.current?.focus();
    };

    // ── Typing Indicator ──
    const handleInputChange = (e) => {
        setInputText(e.target.value);
        if (!socketRef.current) return;

        socketRef.current.emit('typing', { communityId, userName });

        // Clear previous timeout
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socketRef.current?.emit('stop-typing', { communityId });
        }, 2000);
    };

    // ── Group consecutive messages from the same user ──
    const isConsecutive = (msg, idx) => {
        if (idx === 0) return false;
        const prev = messages[idx - 1];
        return prev.userId === msg.userId &&
            (new Date(msg.createdAt) - new Date(prev.createdAt)) < 60000;
    };

    return (
        <div className="flex flex-col h-[calc(100vh-16rem)] bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white">
                            <MessageCircle className="w-5 h-5" />
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900 ${isConnected ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{communityName}</h3>
                        <p className="text-xs text-zinc-500">
                            {isConnected ? `${onlineUsers.length} online` : 'Connecting...'}
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setShowUsers(prev => !prev)}
                    className="relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                    <Users className="w-4 h-4" />
                    <span>{onlineUsers.length}</span>
                </button>
            </div>

            {/* ── Online Users Panel (toggleable) ── */}
            <AnimatePresence>
                {showUsers && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50"
                    >
                        <div className="px-5 py-3 flex flex-wrap gap-2">
                            {onlineUsers.map((u, i) => (
                                <Badge
                                    key={i}
                                    variant="secondary"
                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
                                >
                                    <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" />
                                    {u.userName}
                                    {u.userId === userId && <span className="text-zinc-400">(you)</span>}
                                </Badge>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Messages ── */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1 scroll-smooth"
                 style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgb(161 161 170 / 0.3) transparent' }}
            >
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-zinc-400 dark:text-zinc-600">
                        <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                            <MessageCircle className="w-8 h-8" />
                        </div>
                        <p className="font-medium">No messages yet</p>
                        <p className="text-sm mt-1">Be the first to say hello! 👋</p>
                    </div>
                )}

                {messages.map((msg, idx) => {
                    const isMe = msg.userId === userId;
                    const consecutive = isConsecutive(msg, idx);

                    return (
                        <motion.div
                            key={msg._id || idx}
                            initial={{ opacity: 0, y: 8, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : ''} ${consecutive ? 'mt-0.5' : 'mt-4'}`}
                        >
                            {/* Avatar */}
                            {!consecutive ? (
                                <Avatar className={`w-8 h-8 shrink-0 ${getAvatarColor(msg.userName)} text-white`}>
                                    <AvatarFallback className={`${getAvatarColor(msg.userName)} text-white text-xs font-bold`}>
                                        {getInitials(msg.userName)}
                                    </AvatarFallback>
                                </Avatar>
                            ) : (
                                <div className="w-8 shrink-0" />
                            )}

                            {/* Bubble */}
                            <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                                {!consecutive && (
                                    <div className={`flex items-baseline gap-2 mb-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                                        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                            {isMe ? 'You' : msg.userName}
                                        </span>
                                        <span className="text-[10px] text-zinc-400">
                                            {timeAgo(msg.createdAt)}
                                        </span>
                                    </div>
                                )}
                                <div
                                    className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed break-words ${
                                        isMe
                                            ? 'bg-gradient-to-br from-primary to-primary/80 text-white rounded-br-md'
                                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-md'
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {/* Typing Indicator */}
                <AnimatePresence>
                    {typingUsers.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="flex items-center gap-2 mt-3 pl-10"
                        >
                            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 px-3.5 py-2 rounded-2xl rounded-bl-md">
                                <div className="flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                            <span className="text-xs text-zinc-400">
                                {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
            </div>

            {/* ── Input Area ── */}
            <div className="px-4 py-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-md">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                    <div className="flex-1 relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputText}
                            onChange={handleInputChange}
                            placeholder="Type a message..."
                            maxLength={2000}
                            className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                        />
                    </div>
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!inputText.trim() || !isConnected}
                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
