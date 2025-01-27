import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Building, MapPin } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { Skill } from '@/types/portfolio'



const SkillList = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const res = await fetch('/api/portfolio/skill');
            if (!res.ok) throw new Error('Failed to fetch skills');
            const data = await res.json();
            setSkills(data.skills);
        } catch (err) {
            console.log(err)
            setError('Gagal memuat data skill');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus skill ini?')) return;

        try {
            const res = await fetch('/api/portfolio/skill', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            if (res.ok) {
                setSkills(prev => prev.filter(exp => exp.id !== id));
            } else {
                throw new Error('Failed to delete skill');
            }
        } catch (err) {
            console.log(err)
            setError('Gagal menghapus skill');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <p>{error}</p>
            </Alert>
        );
    }

    if (skills.length === 0) {
        return (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Belum ada pengalaman kerja yang ditambahkan</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {skills.map((skill) => (
                <div key={skill.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">{skill.name}</h3>
                            <div className="mt-2 space-y-2">
                                <div className="flex items-center text-gray-600">
                                    <Building className="h-4 w-4 mr-2" />
                                    <span>{skill.level}</span>
                                </div>
                                {skill.category && (
                                    <div className="flex items-center text-gray-600">
                                        <MapPin className="h-4 w-4 mr-2" />
                                        <span>{skill.category}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                                onClick={() => {/* Handle edit */ }}
                            >
                                <Edit className="h-5 w-5" />
                            </button>
                            <button
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                onClick={() => handleDelete(skill.id)}
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SkillList;