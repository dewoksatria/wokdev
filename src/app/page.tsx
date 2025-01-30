// src/app/page.tsx
'use client'

import React, { useEffect, useState } from 'react';
import { Mail, Terminal, MapPin, Briefcase, Link2, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import type { PortfolioData } from '@/types';
import ImageModal from '@/components/ui/ImageModal';
import HackerLayout from '@/components/layouts/hacker-layout';
import SkillCarousel from '@/components/skills/SkillCarousel';
import PortfolioStats from '@/components/portfolio/PortfolioStats';
import ProjectCarousel from '@/components/project/ProjectCarousel';
import VerticalExperienceCarousel from '@/components/experience/VerticalExperienceCarousel';
import ContactForm from '@/components/portfolio/ContactForm';
import Link from 'next/link';


const useTypingEffect = (text: string, speed = 50) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return displayText;
};

export default function HackerPortfolio() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const welcomeText = useTypingEffect('&gt; Initializing system...', 50);
  const accessText = useTypingEffect('&gt; Access granted...', 50);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    async function fetchPortfolioData() {
      try {
        const res = await fetch('/api/portfolio');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPortfolioData();
  }, []);

  useEffect(() => {
    const cards = document.querySelectorAll('.skill-file-card');

    const handleMouseMove = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const card = e.currentTarget as HTMLElement;
      const rect = card.getBoundingClientRect();

      const x = ((mouseEvent.clientX - rect.left) / rect.width) * 100;
      const y = ((mouseEvent.clientY - rect.top) / rect.height) * 100;

      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    };

    cards.forEach(card => {
      card.addEventListener('mousemove', handleMouseMove as EventListener);
    });

    return () => {
      cards.forEach(card => {
        card.removeEventListener('mousemove', handleMouseMove as EventListener);
      });
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-green-500 font-mono p-4">
        <div className="animate-pulse">
          <p>{welcomeText}</p>
          <p className="mt-2">{accessText}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <HackerLayout showNavigation>
      {/* Hero Section - Mobile Optimized */}
      <section id="hero" className="pt-4 sm:pt-8">
        <div className="relative border border-green-500/30 rounded-lg p-4 sm:p-8">
          <div className="relative z-10">
            <div className="flex flex-col items-start gap-6 sm:gap-8">
              {/* Command Line Prompt */}
              <div className="w-full">
                <div className="inline-flex items-center space-x-2 text-green-400/80">
                  <Terminal className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm">&gt; executing profile.sh</span>
                </div>
              </div>

              {/* Main Content Container */}
              <div className="w-full flex flex-col items-center sm:items-start sm:flex-row gap-6 sm:gap-8">
                {/* Profile Image with Click Handler */}
                <div
                  className="relative w-36 h-36 sm:w-48 sm:h-48 border-2 border-green-500/30 rounded-lg overflow-hidden group flex-shrink-0 cursor-pointer"
                  onClick={() => setIsImageModalOpen(true)}
                >
                  <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 to-black/60 group-hover:opacity-50 transition-opacity"></div>
                  <Image
                    src={data.profile?.avatar || '/placeholder.jpg'}
                    alt={data.user?.name || ''}
                    fill
                    className="object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-green-400 text-sm">Click to view</span>
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 space-y-4 text-center sm:text-left">
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-green-400">{data.user?.name}</h1>
                  <p className="text-lg sm:text-xl text-green-500">{data.profile?.headline}</p>
                  <p className="text-sm sm:text-base text-green-400/80 text-justify leading-relaxed">{data.profile?.bio}</p>

                  {/* Social Links */}
                  <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 pt-4">
                    {data.socials?.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-green-400/60 hover:text-green-400 transition-colors text-sm"
                      >
                        <Link2 className="w-4 h-4" />
                        <span>{social.platform}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Mobile Optimized */}
      <PortfolioStats
        experiences={data.experiences || []}
        projects={data.projects || []}
        skills={data.skills || []}
      />

      {/* Skills Section with grouped carousels */}
      <section id="skills" className="space-y-6">
        <div className="flex items-center space-x-2 text-green-400/80">
          <Terminal className="w-5 h-5" />
          <h2 className="text-xl font-bold">./display-skills.sh</h2>
        </div>

        {/* Grid untuk grup skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(
            data.skills?.reduce((acc, skill) => {
              if (!acc[skill.category]) {
                acc[skill.category] = [];
              }
              acc[skill.category].push(skill);
              return acc;
            }, {} as Record<string, typeof data.skills>)
          ).map(([category, skills], index) => (
            <div key={category} className="animate-slideIn" style={{ animationDelay: `${index * 100}ms` }}>
              <SkillCarousel category={category} skills={skills || []} />
            </div>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="space-y-6">
        <div className="flex items-center space-x-2 text-green-400/80">
          <Briefcase className="w-5 h-5" />
          <h2 className="text-xl font-bold">./list-experience.sh</h2>
        </div>

        <VerticalExperienceCarousel experiences={data.experiences || []} />
      </section>

      {/* Projects Section */}
      <section id="projects" className="space-y-6">
        <div className="flex items-center space-x-2 text-green-400/80">
          <Terminal className="w-5 h-5" />
          <h2 className="text-xl font-bold">./showcase-projects.sh</h2>
        </div>

        <ProjectCarousel projects={data.projects || []} />
      </section>

      {/* Latest Articles Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between text-green-400/80">
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5" />
            <h2 className="text-xl font-bold">./latest-articles.sh</h2>
          </div>

          <Link
            href="/blog"
            className="group flex items-center space-x-2 hover:text-green-400 transition-colors"
          >
            <span className="text-sm font-mono">&gt; cd /blog</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.articles?.map((article) => (
            <div
              key={article.id}
              className="border border-green-500/30 rounded-lg overflow-hidden group hover:border-green-500/60 transition-all"
            >
              {article.coverImage ? (
                <div className="relative h-48">
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform filter grayscale group-hover:grayscale-0 scale-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <div
                    className="absolute inset-0 bg-green-500 mix-blend-color opacity-50 group-hover:opacity-0 transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent scale-100 group-hover:scale-105 transition-all duration-500" />
                </div>
              ) : (
                <div className="h-48 bg-green-900/20 flex items-center justify-center">
                  <Terminal className="w-12 h-12 text-green-500/40" />
                </div>
              )}

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-green-400/60">
                    {article.publishedAt && new Date(article.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-green-400 line-clamp-2">{article.title}</h3>
                {article.excerpt && (
                  <p className="text-green-400/80 text-sm line-clamp-3">{article.excerpt}</p>
                )}

                <a
                  href={`/blog/${article.slug}`}
                  className="inline-flex items-center space-x-2 text-green-400/80 hover:text-green-400 text-sm"
                >
                  <span>Read more</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="space-y-6">
        <div className="flex items-center space-x-2 text-green-400/80">
          <Mail className="w-5 h-5" />
          <h2 className="text-xl font-bold">./contact-info.sh</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr,1.5fr] gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            {data.profile?.location && (
              <div className="border border-green-500/30 p-4 rounded-lg flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-green-400" />
                <span>{data.profile.location}</span>
              </div>
            )}
            {data.profile?.website && (
              <div className="border border-green-500/30 p-4 rounded-lg flex items-center space-x-3">
                <Link2 className="w-5 h-5 text-green-400" />

                <Link href={data.profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-400">
                  {data.profile.website}
                </Link>


              </div>
            )}
            {data.user?.email && (
              <div className="border border-green-500/30 p-4 rounded-lg flex items-center space-x-3">
                <Mail className="w-5 h-5 text-green-400" />

                <Link
                  href={`mailto:${data.user.email}`}
                  className="hover:text-green-400"
                >
                  {data.user.email}
                </Link>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <ContactForm />
        </div>
      </section>

      {/* Image Modal */}
      <ImageModal
        src={data.profile?.avatar || '/placeholder.jpg'}
        alt={data.user?.name || ''}
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
      />
    </HackerLayout>
  );
}