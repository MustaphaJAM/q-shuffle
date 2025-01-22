'use client';

import { useEffect, useState } from 'react';
import ExamForm from './ExamForm';
import ExamList from './ExamList';

interface Exam {
    id: string;
    name: string;
    description: string;
    duration: number;
    passPercent: number;
    published: boolean;
    questions: any[];
    createdAt: string;
    updatedAt: string;
}

const ExamsPage = () => {
    const [exams, setExams] = useState<Exam[]>([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch('/api/auth/exams');

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch exams');
            }

            const data = await response.json();
            setExams(data);
        } catch (error) {
            console.error('Error fetching exams:', error);
            setError(error instanceof Error ? error.message : 'Failed to fetch exams');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveExam = async () => {
        await fetchExams();
        setIsFormVisible(false);
    };

    const handleUpdateStatus = async (id: string, published: boolean) => {
        try {
            setError(null);

            const response = await fetch(`/api/auth/exams/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ published }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update exam status');
            }

            const updatedExam = await response.json();

            // Update the state with the modified exam
            setExams((prevExams) =>
                prevExams.map((exam) =>
                    exam.id === id ? { ...exam, ...updatedExam } : exam
                )
            );
        } catch (error) {
            console.error('Error updating exam status:', error);
            setError(error instanceof Error ? error.message : 'Failed to update exam status');
        }
    };



    const handleDeleteExam = async (id: string) => {
        // if (!window.confirm('Are you sure you want to delete this exam?')) return;

        try {
            setError(null);
            const response = await fetch(`/api/auth/exams/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete exam');
            }

            setExams((prevExams) => prevExams.filter((exam) => exam.id !== id));
        } catch (error) {
            console.error('Error deleting exam:', error);
            setError(error instanceof Error ? error.message : 'Failed to delete exam');
        }
    };

    return (
        <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Exam Management</h1>
                <button
                    onClick={() => setIsFormVisible(true)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                >
                    Add Exam
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <div className="flex-1 overflow-hidden flex flex-col">
                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : exams.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <p className="text-lg mb-2">No exams found</p>
                        <p className="text-sm">Click "Add Exam" to create your first exam</p>
                    </div>
                ) : (
                    <ExamList
                        exams={exams}
                        onUpdateStatus={handleUpdateStatus}
                        onDeleteExam={handleDeleteExam}
                    />
                )}
            </div>

            {isFormVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-lg relative">
                        <div className="p-6">
                            <button
                                onClick={() => setIsFormVisible(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <ExamForm onSave={handleSaveExam} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamsPage;