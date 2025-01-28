import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Terminal } from 'lucide-react';

interface SkillCarouselProps {
    category: string;
    skills: Array<{
        id: string;
        name: string;
        level: number;
    }>;
}

export default function SkillCarousel({ category, skills }: SkillCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleSlideChange = useCallback((direction: 'prev' | 'next') => {
        if (isTransitioning) return;

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsTransitioning(true);

        setCurrentIndex(prev => {
            if (direction === 'next') {
                return prev === skills.length - 1 ? 0 : prev + 1;
            }
            return prev === 0 ? skills.length - 1 : prev - 1;
        });

        setTimeout(() => {
            setIsTransitioning(false);
        }, 500);
    }, [isTransitioning, skills.length]);

    useEffect(() => {
        const startTimer = () => {
            timeoutRef.current = setTimeout(() => {
                handleSlideChange('next');
            }, 5000);
        };

        startTimer();
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [currentIndex, handleSlideChange]);

    const currentSkill = skills[currentIndex];

    return (
        <div className="terminal-container">
            {/* Terminal Header */}
            <div className="terminal-header">
                <div className="flex items-center space-x-2">
                    <div className="flex space-x-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                    </div>
                    <span className="category-label">{category}.sh</span>
                </div>

                {/* Navigation Buttons - Moved to header right */}
                <div className="flex items-center space-x-1">
                    <button
                        onClick={() => handleSlideChange('prev')}
                        className="nav-button"
                        aria-label="Previous skill"
                    >
                        <ChevronLeft size={14} />
                    </button>
                    <button
                        onClick={() => handleSlideChange('next')}
                        className="nav-button"
                        aria-label="Next skill"
                    >
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            {/* Terminal Content */}
            <div className="terminal-content">
                <div className={`skill-slide ${isTransitioning ? 'transitioning' : ''}`}>
                    <div className="skill-content">
                        <div className="terminal-line">
                            <Terminal className="w-4 h-4" />
                            <span>$ executing {currentSkill.name}</span>
                        </div>

                        <div className="skill-info">
                            <div className="flex items-center justify-between">
                                <h4 className="text-lg font-bold text-green-400">{currentSkill.name}</h4>
                                <div className="flex space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`skill-level-dot ${i < currentSkill.level ? 'active' : ''}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="text-sm text-green-400/80 font-mono">
                                Level: {
                                    currentSkill.level === 5 ? 'Expert' :
                                        currentSkill.level === 4 ? 'Advanced' :
                                            currentSkill.level === 3 ? 'Intermediate' :
                                                currentSkill.level === 2 ? 'Basic' : 'Beginner'
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Indicators - Moved to bottom */}
            <div className="terminal-footer">
                <div className="flex justify-center items-center space-x-2 py-2">
                    <span className="text-xs text-green-400/60 font-mono">
                        {currentIndex + 1}/{skills.length}
                    </span>
                    <div className="flex space-x-1">
                        {skills.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-1 h-1 rounded-full ${idx === currentIndex ? 'bg-green-500' : 'bg-green-500/20'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}