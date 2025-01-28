// src/components/article/article-content.tsx
'use client'

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import type { Article } from '@/types';
import ReactMarkdown from 'react-markdown';

interface ArticleContentProps {
    article: Article;
}

export default function ArticleContent({ article }: ArticleContentProps) {
    return (
        <main className="min-h-screen bg-black text-green-500 font-mono">
            <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6">
                {/* Back Button */}
                <Link
                    href="/blog"
                    className="inline-flex items-center space-x-2 text-green-400/80 hover:text-green-400 mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to articles</span>
                </Link>

                {/* Article Header */}
                <article className="space-y-8">
                    {article.coverImage && (
                        <div className="relative h-64 sm:h-96 rounded-lg overflow-hidden">
                            <Image
                                src={article.coverImage}
                                alt={article.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        </div>
                    )}

                    <div className="space-y-4">
                        <h1 className="text-3xl sm:text-4xl font-bold text-green-400">{article.title}</h1>

                        <div className="flex flex-wrap gap-4 text-sm text-green-400/60">
                            {article.user?.name && (
                                <div className="flex items-center space-x-2">
                                    <User className="w-4 h-4" />
                                    <span>{article.user.name}</span>
                                </div>
                            )}
                            {article.publishedAt && (
                                <div className="flex items-center space-x-2">
                                    <Calendar className="w-4 h-4" />
                                    <time dateTime={article.publishedAt.toString()}>
                                        {new Date(article.publishedAt).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </time>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Article Content */}
                    <div className="prose prose-invert prose-green max-w-none">
                        <ReactMarkdown>{article.content}</ReactMarkdown>
                    </div>
                </article>
            </div>
        </main>
    );
}