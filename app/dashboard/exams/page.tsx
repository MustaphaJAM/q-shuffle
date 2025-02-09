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
        prevExams.map((exam) => (exam.id === id ? { ...exam, ...updatedExam } : exam)),
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
    <div className="flex flex-1 flex-col">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Exam Management</h1>
        <button
          onClick={() => setIsFormVisible(true)}
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700"
        >
          Add Exam
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          </div>
        ) : exams.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-gray-500">
            <p className="mb-2 text-lg">No exams found</p>
            <p className="text-sm">Click &#34;Add Exam&#34; to create your first exam</p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-[90%] max-w-lg rounded-lg bg-white shadow-xl">
            <div className="p-6">
              <button
                onClick={() => setIsFormVisible(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
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
