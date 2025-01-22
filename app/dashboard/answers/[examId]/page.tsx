'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


interface Session {
    id: string;
    studentName: string;
    studentSurname: string;
    studentCNE: string;
    startTime: string;
    endTime: string | null;
    completed: boolean;
    score: number | null;
}

export default function answers({ params }: { params: { examId: string } }) {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await fetch(`/api/auth/exam-sessions/${params.examId}`);
                const data = await response.json();
                setSessions(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, [params.examId]);

    const exportToExcel = () => {
        const headers = ['Student Name', 'CNE', 'Start Time', 'Status', 'Score'];
        const data = sessions.map(session => [
            `${session.studentName} ${session.studentSurname}`,
            session.studentCNE,
            new Date(session.startTime).toLocaleString(),
            session.completed ? 'Completed' : 'In Progress',
            session.score !== null ? `${session.score}%` : '-'
        ]);

        const csvContent = [
            headers.join(','),
            ...data.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `exam-sessions-${params.examId}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const handleRowClick = (sessionId: string) => {
        router.push(`/dashboard/answers/${params.examId}/${sessionId}`);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Link
                    href="/dashboard/answers"
                    className="text-sm text-blue-600 hover:text-blue-800"
                >
                    ← Back
                </Link>
                <button
                    onClick={exportToExcel}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                    Export to Excel
                </button>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Student
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                CNE
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Start Time
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Score
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sessions.map((session) => (
                            <tr key={session.id}
                                onClick={() => handleRowClick(session.id)}
                                className="cursor-pointer hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {session.studentName} {session.studentSurname}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{session.studentCNE}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {new Date(session.startTime).toLocaleString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${session.completed
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'}`}>
                                        {session.completed ? 'Completed' : 'In Progress'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {session.score !== null ? `${session.score}%` : '-'}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}