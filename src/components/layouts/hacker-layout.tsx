// src/components/layouts/hacker-layout.tsx
import React from 'react';
import { Terminal, ChevronRight } from 'lucide-react';
import { useIpAddress } from '@/hooks/useIpAddress';

interface HackerLayoutProps {
    children: React.ReactNode;
    headerContent?: React.ReactNode;
    showNavigation?: boolean;
    authorName?: string;
}

export default function HackerLayout({ children, headerContent, showNavigation = false, authorName = "Dewa Ketut Satriawan" }: HackerLayoutProps) {

    const { ipAddress, loading } = useIpAddress();

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

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

                {/* Navigation or Custom Header Content */}
                {showNavigation ? (
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
                                    <Terminal className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="p-2">
                        {headerContent}
                    </div>
                )}
            </div>

            {/* Content with adjusted padding for header */}
            <div className="pt-20 sm:pt-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12">
                    {children}
                </div>
            </div>

            {/* Footer Section */}
            <footer className="border-t border-green-500/30 mt-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        {/* Left side - Terminal prompt */}
                        <div className="flex items-center space-x-2 text-green-400/80">
                            <Terminal className="w-4 h-4" />
                            <span className="text-sm font-mono">&gt; echo Made with ❤️ by {authorName}</span>
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
                        &gt; {loading ? 'Fetching IP address...' : `Connected from: ${ipAddress}`}
                        </p>
                    </div>
                </div>
            </footer>
        </main>
    );
}