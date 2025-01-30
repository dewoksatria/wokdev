import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Terminal } from 'lucide-react';
import Image from 'next/image';
import type { Experience } from '@/types/portfolio';

interface VerticalExperienceCarouselProps {
    experiences: Experience[];
}

const VerticalExperienceCarousel: React.FC<VerticalExperienceCarouselProps> = ({ experiences }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const itemsPerView = 3;
    const maxPages = Math.ceil(experiences.length / itemsPerView);
    const showNavigation = experiences.length > itemsPerView;

    const handlePrev = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxPages - 1));
        setTimeout(() => setIsAnimating(false), 500);
    };

    const handleNext = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev < maxPages - 1 ? prev + 1 : 0));
        setTimeout(() => setIsAnimating(false), 500);
    };

    const visibleExperiences = experiences.slice(
        currentIndex * itemsPerView,
        (currentIndex * itemsPerView) + itemsPerView
    );

    if (experiences.length === 0) {
        return (
            <div className="text-center p-8 border border-green-500/30 rounded-lg">
                <Terminal className="w-12 h-12 text-green-500/40 mx-auto mb-4" />
                <p className="text-green-400/80">No experience available</p>
            </div>
        );
    }

    // If 3 or fewer experiences, render without carousel
    if (experiences.length <= itemsPerView) {
        return (
            <div className="space-y-4">
                {experiences.map((exp) => (
                    <ExperienceCard key={exp.id} experience={exp} />
                ))}
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Navigation Buttons */}
            {showNavigation && (
                <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
                    <button
                        onClick={handlePrev}
                        className="p-2 bg-black/80 border border-green-500/30 rounded-full text-green-400/80 hover:text-green-400 transition-colors disabled:opacity-50"
                        disabled={isAnimating}
                    >
                        <ChevronUp className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="p-2 bg-black/80 border border-green-500/30 rounded-full text-green-400/80 hover:text-green-400 transition-colors disabled:opacity-50"
                        disabled={isAnimating}
                    >
                        <ChevronDown className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Experiences Container */}
            <div className="relative overflow-hidden">
                <div
                    className="space-y-4 transition-all duration-500 ease-in-out"
                    style={{
                        transform: `translateY(-${currentIndex * (100 / maxPages)}%)`,
                        opacity: isAnimating ? 0.7 : 1
                    }}
                >
                    {visibleExperiences.map((exp) => (
                        <ExperienceCard key={exp.id} experience={exp} />
                    ))}
                </div>
            </div>

            {/* Navigation Dots */}
            {showNavigation && (
                <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 ml-4">
                    {Array.from({ length: maxPages }).map((_, index) => (
                        <button
                            key={index}
                            className={`w-2 transition-all duration-300 rounded-full ${index === currentIndex
                                    ? 'h-4 bg-green-400'
                                    : 'h-2 bg-green-500/30'
                                }`}
                            onClick={() => {
                                if (!isAnimating) {
                                    setIsAnimating(true);
                                    setCurrentIndex(index);
                                    setTimeout(() => setIsAnimating(false), 500);
                                }
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// Experience Card Component
const ExperienceCard: React.FC<{ experience: Experience }> = ({ experience }) => {
    return (
        <div className="border border-green-500/30 p-6 rounded-lg hover:border-green-500/60 transition-all group">
            <div className="grid md:grid-cols-[1fr,2fr] gap-6">
                {/* Left Column - Company Info */}
                <div>
                    <h3 className="font-bold text-green-400 text-lg">{experience.company}</h3>
                    <p className="text-green-400/60">{experience.location}</p>
                    <p className="text-sm text-green-400/80 mt-2">
                        {new Date(experience.startDate).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric'
                        })}
                        {' - '}
                        {experience.current ? 'Present' : experience.endDate && new Date(experience.endDate).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric'
                        })}
                    </p>
                </div>

                {/* Right Column - Role & Description */}
                <div>
                    <h4 className="text-lg font-semibold text-green-400">{experience.title}</h4>
                    <p className="mt-2 text-green-400/80 whitespace-pre-line">{experience.description}</p>
                </div>
            </div>

            {experience.image && (
                <div className="mt-4 relative h-48 rounded-lg overflow-hidden">
                    <Image
                        src={experience.image}
                        alt={experience.company}
                        fill
                        className="object-cover"
                    />
                </div>
            )}
        </div>
    );
};

export default VerticalExperienceCarousel;