// src/app/page.tsx
'use client'

import React, { useEffect, useState } from 'react';
import { ExternalLink, Mail, MapPin, Briefcase, Link2, Phone } from 'lucide-react';
import Image from 'next/image';
import type { User, Experience, Project, Skill, Profile } from '@/types';

interface PortfolioData {
  user: User;
  profile: Profile | null;
  experiences: Experience[];
  projects: Project[];
  skills: Skill[];
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
      <div className="border-b border-green-500/30 p-2">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-4 text-sm">portfolio.exe - Terminal</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-12">
        {/* Profile Section */}
        <section className="flex flex-col-reverse md:flex-row md:justify-between items-center space-y-8 md:space-y-0 text-center md:text-left">
          {/* Left Section: Text */}
          <div className="space-y-4 md:flex-1">
            <div className="inline-block p-4 border border-green-500/30 rounded-full mb-4">
              <Briefcase className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{data?.user?.name || 'Anonymous'}</h1>
            <p className="text-xl text-green-400">{data?.profile?.headline || 'Product Designer (UX/UI)'}</p>
            <p className="max-w-2xl mx-auto md:mx-0 text-green-400/80">
              {data?.profile?.bio || 'I had the privilege of working with Google, YouTube, 123done & many many other great brands.'}
            </p>
          </div>

          {/* Right Section: Photo */}
          <div className="relative w-32 h-32 md:w-48 md:h-48 border-2 border-green-500/30 rounded-lg overflow-hidden group">
            {/* Scanlines overlay */}
            <div className="absolute inset-0 z-10 bg-repeat pointer-events-none 
                  mix-blend-overlay opacity-20"
              style={{
                backgroundImage: `repeating-linear-gradient(
             0deg,
             transparent,
             transparent 1px,
             rgba(0, 255, 0, 0.2) 2px,
             rgba(0, 255, 0, 0.2) 3px
           )`
              }}>
            </div>

            {/* CRT flicker animation */}
            <div className="absolute inset-0 z-20 pointer-events-none bg-green-500/5
                  animate-[flicker_0.15s_infinite_alternate]">
            </div>

            {/* Actual photo with green tint */}
            <div className="relative w-full h-full filter 
                  brightness-75 contrast-125 grayscale 
                  hover:brightness-100 transition-all duration-300">
              <Image
                src={data?.profile?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200'}
                alt="Profile"
                fill
                className="object-cover"
                style={{
                  mixBlendMode: 'screen',
                  filter: 'sepia(50%) hue-rotate(80deg) saturate(150%)',
                }}
              />
            </div>

            {/* Glowing effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-30
                  bg-green-500 transition-opacity duration-300">
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-3 gap-4">
          <div className="border border-green-500/30 p-6 text-center">
            <div className="text-2xl font-bold">15+</div>
            <div className="text-sm text-green-400/80">Years of Experience</div>
          </div>
          <div className="border border-green-500/30 p-6 text-center">
            <div className="text-2xl font-bold">100+</div>
            <div className="text-sm text-green-400/80">Projects Completed</div>
          </div>
          <div className="border border-green-500/30 p-6 text-center">
            <div className="text-2xl font-bold">30+</div>
            <div className="text-sm text-green-400/80">Satisfied Clients</div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold mb-4">&gt; ./list-skills</h2>
          <div className="grid grid-cols-3 gap-4">
            {data.skills?.map((skill) => (
              <div key={skill.id} className="border border-green-500/30 p-3 rounded">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{skill.name}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold mb-4">&gt; ./list-experience</h2>
          <div className="grid grid-cols-3 gap-4">
            {data.experiences?.map((experience) => (
              <div key={experience.id} className="border border-green-500/30 p-3 rounded">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{experience.title}</span>
                </div>
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
        <section className="space-y-4">
          <h2 className="text-xl font-bold mb-4">&gt; ./list-projects</h2>
          <div className="grid grid-cols-2 gap-6">
            {data.projects?.slice(0, 4).map((project) => (
              <div key={project.id} className="border border-green-500/30 p-4 space-y-4">
                <div className="aspect-video bg-green-900/20 rounded flex items-center justify-center">
                  <ExternalLink className="w-8 h-8 opacity-50" />
                </div>
                <div>
                  <h3 className="font-bold">{project.title}</h3>
                  <p className="text-sm text-green-400/80 mt-2">{project.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="text-xs border border-green-500/50 px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold">&gt; ./contact-info</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-green-500/30 p-4 flex items-center space-x-3">
              <MapPin className="w-5 h-5" />
              <span>San Francisco, United States</span>
            </div>
            <div className="border border-green-500/30 p-4 flex items-center space-x-3">
              <Link2 className="w-5 h-5" />
              <span>www.123d.one</span>
            </div>
            <div className="border border-green-500/30 p-4 flex items-center space-x-3">
              <Phone className="w-5 h-5" />
              <span>+1 231-231-2312</span>
            </div>
            <div className="border border-green-500/30 p-4 flex items-center space-x-3">
              <Mail className="w-5 h-5" />
              <span>hello@123d.one</span>
            </div>
          </div>

          <div className="border border-green-500/30 p-4 mt-4">
            <h3 className="font-bold mb-2">CONTACT AND SUPPORT</h3>
            <p className="text-sm text-green-400/80">Optimize your design process • 123d.one</p>
            <p className="text-sm text-green-400/80">Feel free to send us your feedback about the product at support@123d.one</p>
          </div>

          <div className="border border-green-500/30 p-4">
            <h3 className="font-bold mb-2">FOLLOW</h3>
            <div className="flex space-x-4 text-sm text-green-400/80">
              <a href="#" className="hover:text-green-300">Twitter</a>
              <span>|</span>
              <a href="#" className="hover:text-green-300">Instagram</a>
              <span>|</span>
              <a href="#" className="hover:text-green-300">Dribbble</a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}