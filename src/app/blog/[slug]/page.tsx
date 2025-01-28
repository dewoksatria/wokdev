// src/app/blog/[slug]/page.tsx
import prisma from '@/lib/prisma';
import ArticleContent from '@/components/article/article-content';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Article } from '@/types';
import HackerLayout from '@/components/layouts/hacker-layout';

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
        const headerContent = (
            <Link 
                href="/blog" 
                className="inline-flex items-center space-x-2 text-green-400/80 hover:text-green-400"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to articles</span>
            </Link>
        );

        return (
            <HackerLayout headerContent={headerContent}>
                <div className="p-4">
                    <p className="text-xl">&gt; Article not found</p>
                </div>
            </HackerLayout>
        );
    }

    return <ArticleContent article={article} />;
}