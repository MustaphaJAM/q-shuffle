'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface Question {
    id: string;
    text: string;
    options: string[];
    correctAnswers: number[];
}

interface Answer {
    id: string;
    questionId: string;
    selectedOptions: number[];
    timeSpent: number;
    createdAt: string;
}

interface SessionDetails {
    id: string;
    studentName: string;
    studentSurname: string;
    studentCNE: string;
    startTime: string;
    endTime: string | null;
    completed: boolean;
    score: number | null;
    answers: Answer[];
    exam: {
        questions: Question[];
    };
}

export default function SessionDetails({ params }: { params: { examId: string; sessionId: string } }) {
    const [details, setDetails] = useState<SessionDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await fetch(`/api/auth/exam-sessions/${params.examId}/${params.sessionId}`);
                const data = await response.json();
                setDetails(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [params.sessionId]);

    if (loading) {
        return <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>;
    }

    if (!details) return <div>Session not found</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <Link
                    href={`/dashboard/answers/${params.examId}`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                >
                    ← Back
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Student Information</h2>
                        <div>
                            <p className="text-gray-600">Name</p>
                            <p className="font-medium">{details.studentName} {details.studentSurname}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">CNE</p>
                            <p className="font-medium">{details.studentCNE}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Session Details</h2>
                        <div>
                            <p className="text-gray-600">Start Time</p>
                            <p className="font-medium">{new Date(details.startTime).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">End Time</p>
                            <p className="font-medium">
                                {details.endTime ? new Date(details.endTime).toLocaleString() : 'In Progress'}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <div className="w-32 h-32">
                            <CircularProgressbar
                                value={details.score || 0}
                                text={`${details.score?.toFixed(1) || 0}%`}
                                strokeWidth={8}
                            />
                        </div>
                        <p className="mt-2 text-center font-medium">
                            {details.completed ? 'Completed' : 'In Progress'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Answers</h2>
                <div className="space-y-6">
                    {details.answers.map((answer, index) => {
                        const question = details.exam.questions.find(q => q.id === answer.questionId);
                        if (!question) return null;

                        return (
                            <div key={answer.id} className="border rounded-lg p-4">
                                <div className="mb-4">
                                    <h3 className="font-medium">Question {index + 1}</h3>
                                    <p className="text-gray-700 mt-2">{question.text}</p>
                                </div>

                                <div className="grid gap-2">
                                    {question.options.map((option, optIndex) => (
                                        <div
                                            key={optIndex}
                                            className={`p-3 rounded-lg ${answer.selectedOptions.includes(optIndex)
                                                ? question.correctAnswers.includes(optIndex)
                                                    ? 'bg-green-100 border-green-500'
                                                    : 'bg-red-100 border-red-500'
                                                : question.correctAnswers.includes(optIndex)
                                                    ? 'bg-blue-50 border-blue-500'
                                                    : 'bg-gray-50'
                                                } border`}
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 text-sm text-gray-600">
                                    Time spent: {Math.floor(answer.timeSpent / 60)}m {answer.timeSpent % 60}s
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}