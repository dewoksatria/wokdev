import React from 'react';
import { Code2, Briefcase, Award } from 'lucide-react';
import type { Experience, Project, Skill } from '@/types/portfolio';

interface PortfolioStatsProps {
    experiences: Experience[];
    projects: Project[];
    skills: Skill[];
}

const PortfolioStats: React.FC<PortfolioStatsProps> = ({ experiences = [], projects = [], skills = [] }) => {
    // Calculate total years of experience
    const calculateYearsOfExperience = () => {
        if (!experiences.length) return 0;

        const uniqueYears = new Set();

        experiences.forEach(exp => {
            const startYear = new Date(exp.startDate).getFullYear();
            const endYear = exp.current ?
                new Date().getFullYear() :
                exp.endDate ? new Date(exp.endDate).getFullYear() : startYear;

            for (let year = startYear; year <= endYear; year++) {
                uniqueYears.add(year);
            }
        });

        return uniqueYears.size;
    };

    // Calculate total number of technologies used across all projects
    const calculateUniqueTechnologies = () => {
        if (!projects.length) return 0;

        const uniqueTech = new Set();
        projects.forEach(project => {
            try {
                const techArray = JSON.parse(project.technologies);
                techArray.forEach((tech: string) => uniqueTech.add(tech.toLowerCase()));
            } catch (error) {
                console.error('Error parsing technologies:', error);
            }
        });

        return uniqueTech.size;
    };

    // Get the most proficient skill category
    const getTopSkillCategory = () => {
        if (!skills.length) return { category: 'No Skills', avgLevel: 0 };

        const categories = skills.reduce((acc: Record<string, { total: number; count: number }>, skill) => {
            if (!acc[skill.category]) {
                acc[skill.category] = { total: 0, count: 0 };
            }
            acc[skill.category].total += skill.level;
            acc[skill.category].count += 1;
            return acc;
        }, {});

        let topCategory = { category: '', avgLevel: 0 };

        Object.entries(categories).forEach(([category, data]) => {
            const avgLevel = data.total / data.count;
            if (avgLevel > topCategory.avgLevel) {
                topCategory = { category, avgLevel };
            }
        });

        return topCategory;
    };

    const stats = [
        {
            icon: <Briefcase className="w-6 h-6 text-green-400" />,
            value: `${calculateYearsOfExperience()}+`,
            label: "Years of Experience"
        },
        {
            icon: <Code2 className="w-6 h-6 text-green-400" />,
            value: `${calculateUniqueTechnologies()}+`,
            label: "Technologies Used"
        },
        {
            icon: <Award className="w-6 h-6 text-green-400" />,
            value: getTopSkillCategory().category,
            label: "Top Expertise"
        }
    ];

    return (
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="border rounded-lg border-green-500/30 p-4 sm:p-6 text-center group hover:border-green-500/60 transition-all duration-300"
                >
                    <div className="flex justify-center mb-3">
                        {stat.icon}
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-green-400">
                        {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-green-400/80">
                        {stat.label}
                    </div>
                </div>
            ))}
        </section>
    );
};

export default PortfolioStats;