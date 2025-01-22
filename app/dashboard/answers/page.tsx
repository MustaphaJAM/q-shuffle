'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ExamWithSessions {
    id: string;
    name: string;
    description: string;
    published: boolean;
    sessionCount: number;
}

export default function answers() {
    const [exams, setExams] = useState<ExamWithSessions[]>([]);
    const [visibleCount, setVisibleCount] = useState(5);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await fetch('/api/auth/exam-sessions');
                const data = await response.json();
                setExams(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>;
    }

    return (
        <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto">
                <div className="space-y-3 mb-4">
                    {exams.slice(0, visibleCount).map((exam) => (
                        <div key={exam.id} className="bg-white rounded-lg shadow p-4">
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                                        {exam.name}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                                        {exam.description}
                                    </p>
                                    <div className="flex gap-2 mt-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                            ${exam.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {exam.published ? 'Published' : 'Draft'}
                                        </span>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {exam.sessionCount} sessions
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/dashboard/answers/${exam.id}`}
                                        className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                                    >
                                        View Sessions
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {exams.length > 5 && (
                <div className="sticky bottom-0 p-3 bg-gray-50 border-t">
                    {visibleCount < exams.length ? (
                        <button
                            onClick={() => setVisibleCount(prev => Math.min(prev + 5, exams.length))}
                            className="w-full px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm rounded shadow-sm hover:bg-gray-50 transition"
                        >
                            Show More
                        </button>
                    ) : (
                        <button
                            onClick={() => setVisibleCount(5)}
                            className="w-full px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm rounded shadow-sm hover:bg-gray-50 transition"
                        >
                            Show Less
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}