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

export default function ExamSessions({ params }: { params: { examId: string } }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch(`/api/auth/exam-sessions/${params.examId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch sessions');
        }
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
    const data = sessions.map((session) => [
      `${session.studentName} ${session.studentSurname}`,
      session.studentCNE,
      new Date(session.startTime).toLocaleString(),
      session.completed ? 'Completed' : 'In Progress',
      session.score !== null ? `${session.score}%` : '-',
    ]);

    const csvContent = [headers.join(','), ...data.map((row) => row.join(','))].join('\n');

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
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/answers" className="text-sm text-blue-600 hover:text-blue-800">
          ← Back
        </Link>
        <button
          onClick={exportToExcel}
          className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
        >
          Export to Excel
        </button>
      </div>
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                CNE
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Start Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Score
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {sessions.map((session) => (
              <tr
                key={session.id}
                onClick={() => handleRowClick(session.id)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {session.studentName} {session.studentSurname}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-900">{session.studentCNE}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {new Date(session.startTime).toLocaleString()}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      session.completed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {session.completed ? 'Completed' : 'In Progress'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
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
