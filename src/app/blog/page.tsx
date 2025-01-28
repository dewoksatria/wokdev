// src/app/blog/page.tsx
'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Terminal, ChevronRight } from 'lucide-react';
import type { Article } from '@/types';

export default function BlogPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchArticles() {
            try {
                const res = await fetch('/api/articles');
                if (res.ok) {
                    const data = await res.json();
                    setArticles(data.articles);
                }
            } catch (error) {
                console.error('Error fetching articles:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchArticles();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black text-green-500 font-mono p-4">
                <div className="animate-pulse">
                    <p>&gt; Loading articles...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-black text-green-500 font-mono">
            <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center space-x-2 mb-4">
                        <Terminal className="w-5 h-5" />
                        <h1 className="text-2xl font-bold">&gt; ./list-articles.sh</h1>
                    </div>
                    <p className="text-green-400/80">Browse through my technical writings and insights.</p>
                </div>

                {/* Articles Grid */}
                <div className="grid gap-8 md:grid-cols-2">
                    {articles.map((article) => (
                        <Link
                            key={article.id}
                            href={`/blog/${article.slug}`}
                            className="block border border-green-500/30 rounded-lg overflow-hidden hover:border-green-500/60 transition-all"
                        >
                            {article.coverImage ? (
                                <div className="relative h-48">
                                    <Image
                                        src={article.coverImage}
                                        alt={article.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                </div>
                            ) : (
                                <div className="h-48 bg-green-900/20 flex items-center justify-center">
                                    <Terminal className="w-12 h-12 text-green-500/40" />
                                </div>
                            )}

                            <div className="p-6 space-y-4">
                                <div className="text-sm text-green-400/60">
                                    {article.publishedAt && new Date(article.publishedAt).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </div>

                                <h2 className="text-xl font-bold text-green-400">{article.title}</h2>
                                {article.excerpt && (
                                    <p className="text-green-400/80 line-clamp-3">{article.excerpt}</p>
                                )}

                                <div className="inline-flex items-center space-x-2 text-green-400/80 hover:text-green-400">
                                    <span>Read article</span>
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}