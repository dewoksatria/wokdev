import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Github, Terminal } from 'lucide-react';
import Image from 'next/image';
import type { Project } from '@/types/portfolio';

interface ProjectCarouselProps {
    projects: Project[];
}

const ProjectCarousel: React.FC<ProjectCarouselProps> = ({ projects }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(3);
    const [isAnimating, setIsAnimating] = useState(false);

    // Determine grid columns based on project count
    const getGridCols = () => {
        if (projects.length <= 2) return 'grid-cols-' + projects.length;
        return 'grid-cols-3';
    };

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setItemsPerPage(1);
            } else if (window.innerWidth < 1024) {
                setItemsPerPage(2);
            } else {
                setItemsPerPage(3);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const maxPages = Math.ceil(projects.length / itemsPerPage);
    const showNavigation = projects.length > itemsPerPage;

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

    const ProjectTechnologies = ({ technologies }: { technologies: string }) => {
        try {
            const techArray = JSON.parse(technologies);
            return (
                <div className="flex flex-wrap gap-2">
                    {techArray.map((tech: string, index: number) => (
                        <span
                            key={index}
                            className="px-2 py-1 text-xs border border-green-500/30 rounded-full text-green-400/80"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            );
        } catch (error) {
            console.error('Error parsing technologies:', error);
            return null;
        }
    };

    const visibleProjects = projects.slice(
        currentIndex * itemsPerPage,
        (currentIndex * itemsPerPage) + itemsPerPage
    );

    if (projects.length === 0) {
        return (
            <div className="text-center p-8 border border-green-500/30 rounded-lg">
                <Terminal className="w-12 h-12 text-green-500/40 mx-auto mb-4" />
                <p className="text-green-400/80">No projects available</p>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Navigation Buttons */}
            {showNavigation && (
                <>
                    <button
                        onClick={handlePrev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 bg-black/80 border border-green-500/30 rounded-full text-green-400/80 hover:text-green-400 transition-colors"
                        disabled={isAnimating}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 bg-black/80 border border-green-500/30 rounded-full text-green-400/80 hover:text-green-400 transition-colors"
                        disabled={isAnimating}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </>
            )}

            {/* Projects Grid */}
            <div
                className={`grid ${projects.length <= 3 ? getGridCols() : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'} gap-6 transition-all duration-500 ease-in-out`}
                style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                    opacity: isAnimating ? 0.7 : 1
                }}
            >
                {visibleProjects.map((project) => (
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
                            <h3 className="text-xl font-bold text-green-400">{project.title}</h3>
                            <p className="text-green-400/80">{project.description}</p>

                            <ProjectTechnologies technologies={project.technologies} />

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

            {/* Navigation Dots */}
            {showNavigation && (
                <div className="flex justify-center mt-6 gap-2">
                    {Array.from({ length: maxPages }).map((_, index) => (
                        <button
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                ? 'bg-green-400 w-4'
                                : 'bg-green-500/30'
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

export default ProjectCarousel;