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

interface ExamCardProps {
  exam: ExamWithSessions;
}

const ExamCard = ({ exam }: ExamCardProps) => (
  <div className="rounded-lg bg-white p-4 shadow">
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-lg font-semibold text-gray-800">{exam.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-600">{exam.description}</p>
        <div className="mt-2 flex gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              exam.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {exam.published ? 'Published' : 'Draft'}
          </span>
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            {exam.sessionCount} sessions
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href={`/dashboard/answers/${exam.id}`}
          className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white transition hover:bg-blue-700"
        >
          View Sessions
        </Link>
      </div>
    </div>
  </div>
);

export default function Answers() {
  const [exams, setExams] = useState<ExamWithSessions[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch('/api/auth/exam-sessions');
        if (!response.ok) {
          throw new Error('Failed to fetch exams');
        }
        const data = await response.json();
        setExams(data);
        setError(null);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load exams. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <div className="flex h-64 items-center justify-center text-red-600">{error}</div>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mb-4 space-y-3">
          {exams.slice(0, visibleCount).map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      </div>

      {exams.length > 5 && (
        <div className="sticky bottom-0 border-t bg-gray-50 p-3">
          {visibleCount < exams.length ? (
            <button
              onClick={() => setVisibleCount((prev) => Math.min(prev + 5, exams.length))}
              className="w-full rounded border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Show More
            </button>
          ) : (
            <button
              onClick={() => setVisibleCount(5)}
              className="w-full rounded border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Show Less
            </button>
          )}
        </div>
      )}
    </div>
  );
}
