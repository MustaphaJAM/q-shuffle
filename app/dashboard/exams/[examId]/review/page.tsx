"use client";

import { useEffect, useState } from 'react';
import ExamReview from '@/components/ExamReview';

export default function ReviewPage({ params }: { params: { examId: string } }) {
    const [exam, setExam] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchExam = async () => {
            try {
                const response = await fetch(`/api/auth/exams/${params.examId}`);
                if (response.ok) {
                    const data = await response.json();
                    setExam(data);
                }
            } catch (error) {
                console.error('Error fetching exam:', error);
            }
            setIsLoading(false);
        };

        fetchExam();
    }, [params.examId]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
        );
    }

    if (!exam) {
        return (
            <div className="text-center py-8">
                <h2 className="text-2xl font-semibold text-gray-700">Exam not found</h2>
            </div>
        );
    }

    return <ExamReview exam={exam} />;
}