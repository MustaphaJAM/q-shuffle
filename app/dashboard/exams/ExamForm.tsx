'use client';

import { useState } from 'react';

interface ExamFormProps {
    onSave: () => void;
}

const ExamForm = ({ onSave }: ExamFormProps) => {
    const [examName, setExamName] = useState('');
    const [examDescription, setExamDescription] = useState('');
    const [examDuration, setExamDuration] = useState(0);
    const [passPercent, setPassPercent] = useState(0);
    const [formError, setFormError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        setSuccessMessage('');
        setIsLoading(true);

        try {
            // Validate form inputs
            if (!examName || !examDescription || !examDuration || !passPercent) {
                setFormError('Please fill in all fields.');
                return;
            }

            if (examDuration <= 0) {
                setFormError('Duration must be greater than 0 minutes.');
                return;
            }

            if (passPercent < 0 || passPercent > 100) {
                setFormError('Pass percentage must be between 0 and 100.');
                return;
            }

            const newExam = {
                name: examName,
                description: examDescription,
                duration: examDuration,
                passPercent: passPercent,
                questions: [], // Initial empty questions array
                published: false
            };

            const response = await fetch('/api/auth/exams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newExam),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create exam');
            }

            setSuccessMessage('Exam created successfully!');
            onSave();
            resetForm();

        } catch (error) {
            console.error('Error creating exam:', error);
            setFormError(error instanceof Error ? error.message : 'Failed to create exam');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setExamName('');
        setExamDescription('');
        setExamDuration(0);
        setPassPercent(0);
        setFormError('');
        setSuccessMessage('');
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-6">
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                    {successMessage}
                </div>
            )}

            {formError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {formError}
                </div>
            )}

            <div>
                <label htmlFor="examName" className="block text-lg font-semibold text-gray-800 mb-2">
                    Exam Name
                </label>
                <input
                    id="examName"
                    type="text"
                    placeholder="Enter exam name"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={isLoading}
                    required
                />
            </div>

            <div>
                <label htmlFor="examDescription" className="block text-lg font-semibold text-gray-800 mb-2">
                    Description
                </label>
                <textarea
                    id="examDescription"
                    placeholder="Enter exam description"
                    value={examDescription}
                    onChange={(e) => setExamDescription(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={isLoading}
                    rows={4}
                    required
                />
            </div>

            <div>
                <label htmlFor="examDuration" className="block text-lg font-semibold text-gray-800 mb-2">
                    Duration (in minutes)
                </label>
                <input
                    id="examDuration"
                    type="number"
                    min="1"
                    placeholder="Enter exam duration"
                    value={examDuration}
                    onChange={(e) => setExamDuration(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={isLoading}
                    required
                />
            </div>

            <div>
                <label htmlFor="passPercent" className="block text-lg font-semibold text-gray-800 mb-2">
                    Pass Percentage
                </label>
                <input
                    id="passPercent"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Enter pass percentage"
                    value={passPercent}
                    onChange={(e) => setPassPercent(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={isLoading}
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
            >
                {isLoading ? 'Creating...' : 'Add Exam'}
            </button>
        </form>
    );
};

export default ExamForm;