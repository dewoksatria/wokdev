// src/app/page.tsx
'use client'

import React, { useEffect, useState } from 'react';
import { ExternalLink, Mail, Terminal, MapPin, Briefcase, Link2, Github, Code, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import type { User, Experience, Project, Skill, Profile } from '@/types';
import ImageModal from '@/components/ui/ImageModal';

interface Social {
  id: string;
  platform: string;
  url: string;
}

interface PortfolioData {
  user: User;
  profile: Profile | null;
  experiences: Experience[];
  projects: Project[];
  skills: Skill[];
  socials?: Social[]; // Tambahkan ini
}

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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
    <main className="min-h-screen bg-black text-green-500 font-mono hacker-portfolio">
      {/* Terminal Header */}
      <div className="fixed top-0 left-0 right-0 bg-black z-50 border-b border-green-500/30">
        {/* Terminal Controls */}
        <div className="p-2 border-b border-green-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-sm hidden sm:inline">portfolio.exe - Terminal</span>
            <span className="text-sm sm:hidden">portfolio.exe</span>
          </div>
        </div>

        {/* Navigation Links - Mobile Optimized */}
        <div className="scrollbar-hide overflow-x-auto">
          <div className="flex items-center space-x-4 p-2 min-w-max">
            {[
              { id: 'hero', label: './home' },
              { id: 'skills', label: './skills' },
              { id: 'experience', label: './exp' },
              { id: 'projects', label: './projects' },
              { id: 'contact', label: './contact' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="flex items-center space-x-1 text-green-400/80 hover:text-green-400 transition-colors text-xs sm:text-sm whitespace-nowrap px-2 py-1 rounded hover:bg-green-500/10"
              >
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content with adjusted padding for mobile */}
      <div className="pt-20 sm:pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12">
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
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { value: "15+", label: "Years of Experience" },
              { value: "100+", label: "Projects Completed" },
              { value: "30+", label: "Satisfied Clients" }
            ].map((stat, index) => (
              <div key={index} className="border border-green-500/30 p-4 sm:p-6 text-center">
                <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                <div className="text-xs sm:text-sm text-green-400/80">{stat.label}</div>
              </div>
            ))}
          </section>

          {/* Skills Section */}
          <section id="skills" className="space-y-4 sm:space-y-6">
            <div className="flex items-center space-x-2 text-green-400/80">
              <Code className="w-4 h-4 sm:w-5 sm:h-5" />
              <h2 className="text-lg sm:text-xl font-bold">./display-skills.sh</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.skills?.map((skill) => (
                <div
                  key={skill.id}
                  className="border border-green-500/30 p-3 sm:p-4 rounded-lg hover:border-green-500/60 transition-colors group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-green-400">{skill.name}</h3>
                      <p className="text-xs sm:text-sm text-green-400/60">{skill.category}</p>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${i < skill.level ? 'bg-green-500' : 'bg-green-500/20'
                            } group-hover:bg-green-400 transition-colors`}
                        />
                      ))}
                    </div>
                  </div>
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

            <div className="space-y-4">
              {data.experiences?.map((exp) => (
                <div
                  key={exp.id}
                  className="border border-green-500/30 p-6 rounded-lg hover:border-green-500/60 transition-all group"
                >
                  <div className="grid md:grid-cols-[1fr,2fr] gap-6">
                    {/* Left Column - Company Info */}
                    <div>
                      <h3 className="font-bold text-green-400 text-lg">{exp.company}</h3>
                      <p className="text-green-400/60">{exp.location}</p>
                      <p className="text-sm text-green-400/80 mt-2">
                        {new Date(exp.startDate).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric'
                        })}
                        {' - '}
                        {exp.current ? 'Present' : new Date(exp?.endDate || "").toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>

                    {/* Right Column - Role & Description */}
                    <div>
                      <h4 className="text-lg font-semibold text-green-400">{exp.title}</h4>
                      <p className="mt-2 text-green-400/80 whitespace-pre-line">{exp.description}</p>
                    </div>
                  </div>

                  {exp.image && (
                    <div className="mt-4 relative h-48 rounded-lg overflow-hidden">
                      <Image
                        src={exp.image}
                        alt={exp.company}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Brands Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold mb-4">&gt; ./list-brands</h2>
            <p className="text-green-400/80 mb-4">I had the privilege of working with</p>
            <div className="flex flex-wrap justify-center gap-8">
              <span className="text-gray-500">Google</span>
              <span className="text-gray-500">YouTube</span>
              <span className="text-gray-500">Dribbble</span>
              <span className="text-gray-500">Facebook</span>
              <span className="text-gray-500">123done</span>
            </div>
          </section>

          {/* Projects Section */}
          <section id="projects" className="space-y-6">
            <div className="flex items-center space-x-2 text-green-400/80">
              <Terminal className="w-5 h-5" />
              <h2 className="text-xl font-bold">./showcase-projects.sh</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.projects?.map((project) => (
                <div
                  key={project.id}
                  className="border border-green-500/30 rounded-lg overflow-hidden group hover:border-green-500/60 transition-all"
                >
                  {project.image ? (
                    <div className="relative h-48">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    </div>
                  ) : (
                    <div className="h-48 bg-green-900/20 flex items-center justify-center">
                      <Terminal className="w-12 h-12 text-green-500/40" />
                    </div>
                  )}

                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-green-400">{project.title}</h3>
                    <p className="text-green-400/80">{project.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs border border-green-500/30 rounded-full text-green-400/80"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex space-x-4 pt-4">
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-green-400/80 hover:text-green-400"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Live Demo</span>
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-green-400/80 hover:text-green-400"
                        >
                          <Github className="w-4 h-4" />
                          <span>Source Code</span>
                        </a>
                      )}
                    </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.profile?.location && (
                <div className="border border-green-500/30 p-4 rounded-lg flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-green-400" />
                  <span>{data.profile.location}</span>
                </div>
              )}
              {data.profile?.website && (
                <div className="border border-green-500/30 p-4 rounded-lg flex items-center space-x-3">
                  <Link2 className="w-5 h-5 text-green-400" />
                  <a
                    href={data.profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-green-400"
                  >
                    {data.profile.website}
                  </a>
                </div>
              )}
              {data.user?.email && (
                <div className="border border-green-500/30 p-4 rounded-lg flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-green-400" />
                  <a
                    href={`mailto:${data.user.email}`}
                    className="hover:text-green-400"
                  >
                    {data.user.email}
                  </a>
                </div>
              )}
            </div>

            {/* Image Modal */}
            <ImageModal
              src={data.profile?.avatar || '/placeholder.jpg'}
              alt={data.user?.name || ''}
              isOpen={isImageModalOpen}
              onClose={() => setIsImageModalOpen(false)}
            />
          </section>
        </div>
      </div>
      {/* Footer Section */}
      <footer className="border-t border-green-500/30 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Left side - Terminal prompt */}
            <div className="flex items-center space-x-2 text-green-400/80">
              <Terminal className="w-4 h-4" />
              <span className="text-sm font-mono">&gt; echo Made with ❤️ by {data.user?.name}</span>
            </div>

            {/* Center - Quick Links */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <button
                onClick={() => scrollToSection('hero')}
                className="text-green-400/60 hover:text-green-400 transition-colors flex items-center space-x-1"
              >
                <ChevronRight className="w-3 h-3" />
                <span>cd ~</span>
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-green-400/60 hover:text-green-400 transition-colors flex items-center space-x-1"
              >
                <ChevronRight className="w-3 h-3" />
                <span>contact</span>
              </button>
            </div>

            {/* Right side - Copyright */}
            <div className="text-green-400/60 text-sm">
              <span className="font-mono">© {new Date().getFullYear()} chmod 755</span>
            </div>
          </div>

          {/* Bottom Credits - Optional */}
          <div className="mt-6 text-center text-xs text-green-400/40">
            <p className="font-mono">
              &gt; Built with Next.js + Tailwind CSS // Deployed on Vercel
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}