// src/app/blog/[slug]/page.tsx
import prisma from '@/lib/prisma';
import ArticleContent from '@/components/article/article-content';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Article } from '@/types';

interface ArticleDetailProps {
    params: {
        slug: string;
    };
}

export default async function ArticleDetailPage({ params }: ArticleDetailProps) {
    const article = await prisma.article.findUnique({
        where: {
            slug: params.slug
        },
        include: {
            user: {
                select: {
                    name: true,
                    profile: {
                        select: {
                            avatar: true
                        }
                    }
                }
            }
        }
    }) as Article | null;

    if (!article) {
        return (
            <div className="min-h-screen bg-black text-green-500 font-mono p-4">
                <p>&gt; Article not found</p>
                <Link href="/blog" className="inline-flex items-center space-x-2 mt-4 text-green-400/80 hover:text-green-400">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to articles</span>
                </Link>
            </div>
        );
    }

    return <ArticleContent article={article} />;
}