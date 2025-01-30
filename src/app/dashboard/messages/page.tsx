// src/app/dashboard/messages/page.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { Mail, Calendar, Globe, Monitor, Check, Archive } from 'lucide-react';

interface Message {
    id: string;
    name: string;
    email: string;
    message: string;
    status: string;
    ipAddress: string | null;
    userAgent: string | null;
    readAt: string | null;
    createdAt: string;
}

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/messages');
            if (!res.ok) throw new Error('Failed to fetch messages');
            const data = await res.json();
            setMessages(data.messages);
        } catch (err) {
            setError('Failed to load messages');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            const res = await fetch(`/api/messages/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'READ' })
            });

            if (!res.ok) throw new Error('Failed to update message');

            setMessages(messages.map(msg =>
                msg.id === id ? { ...msg, status: 'READ', readAt: new Date().toISOString() } : msg
            ));
        } catch (err) {
            console.error(err);
        }
    };

    const archiveMessage = async (id: string) => {
        try {
            const res = await fetch(`/api/messages/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'ARCHIVED' })
            });

            if (!res.ok) throw new Error('Failed to archive message');

            setMessages(messages.map(msg =>
                msg.id === id ? { ...msg, status: 'ARCHIVED' } : msg
            ));
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-red-500 border border-red-500 rounded-lg">
                {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold text-green-400">Messages</h1>

            <div className="grid md:grid-cols-[350px,1fr] gap-6">
                {/* Messages List */}
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedMessage?.id === message.id
                                    ? 'border-green-500/50 bg-green-500/10'
                                    : 'border-green-500/30 hover:border-green-500/50'
                                }`}
                            onClick={() => setSelectedMessage(message)}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-green-400">{message.name}</h3>
                                    <p className="text-sm text-green-400/60">{message.email}</p>
                                </div>
                                {message.status === 'UNREAD' && (
                                    <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
                                        New
                                    </span>
                                )}
                            </div>
                            <p className="mt-2 text-sm text-green-400/80 line-clamp-2">
                                {message.message}
                            </p>
                            <div className="mt-2 text-xs text-green-400/60">
                                {new Date(message.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Message Detail */}
                {selectedMessage ? (
                    <div className="border border-green-500/30 rounded-lg p-6 space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-green-400">{selectedMessage.name}</h2>
                                <a href={`mailto:${selectedMessage.email}`} className="text-green-400/80 hover:text-green-400">
                                    {selectedMessage.email}
                                </a>
                            </div>
                            <div className="flex space-x-2">
                                {selectedMessage.status === 'UNREAD' && (
                                    <button
                                        onClick={() => markAsRead(selectedMessage.id)}
                                        className="p-2 text-green-400/60 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                                        title="Mark as read"
                                    >
                                        <Check className="w-5 h-5" />
                                    </button>
                                )}
                                <button
                                    onClick={() => archiveMessage(selectedMessage.id)}
                                    className="p-2 text-green-400/60 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                                    title="Archive"
                                >
                                    <Archive className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 border-t border-green-500/30 pt-4">
                            <div className="prose prose-invert">
                                <p className="text-green-400/80 whitespace-pre-line">{selectedMessage.message}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="p-4 border border-green-500/30 rounded-lg space-y-2">
                                    <div className="flex items-center space-x-2 text-green-400/60">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-sm">Sent on</span>
                                    </div>
                                    <p className="text-sm text-green-400">
                                        {new Date(selectedMessage.createdAt).toLocaleString()}
                                    </p>
                                </div>

                                <div className="p-4 border border-green-500/30 rounded-lg space-y-2">
                                    <div className="flex items-center space-x-2 text-green-400/60">
                                        <Globe className="w-4 h-4" />
                                        <span className="text-sm">IP Address</span>
                                    </div>
                                    <p className="text-sm text-green-400">
                                        {selectedMessage.ipAddress || 'Unknown'}
                                    </p>
                                </div>

                                <div className="p-4 border border-green-500/30 rounded-lg space-y-2 col-span-2">
                                    <div className="flex items-center space-x-2 text-green-400/60">
                                        <Monitor className="w-4 h-4" />
                                        <span className="text-sm">Browser Info</span>
                                    </div>
                                    <p className="text-sm text-green-400 break-all">
                                        {selectedMessage.userAgent || 'Unknown'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="border border-green-500/30 rounded-lg p-6 flex items-center justify-center text-green-400/60">
                        <div className="text-center">
                            <Mail className="w-12 h-12 mx-auto mb-4" />
                            <p>Select a message to view details</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}