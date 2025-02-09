'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Exam {
  id: string;
  name: string;
  description: string;
  published: boolean;
}

const ExamList = ({
  exams,
  onUpdateStatus,
  onDeleteExam,
}: {
  exams: Exam[];
  onUpdateStatus: (id: string, published: boolean) => void;
  onDeleteExam: (id: string) => void;
}) => {
  const [visibleCount, setVisibleCount] = useState(5);
  const [examToDelete, setExamToDelete] = useState<Exam | null>(null);
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, exams.length));
  };

  const handleShowLess = () => {
    setVisibleCount(5);
  };

  const handleDeleteClick = (exam: Exam) => {
    setExamToDelete(exam);
  };

  const handleConfirmDelete = () => {
    if (examToDelete) {
      onDeleteExam(examToDelete.id);
      setExamToDelete(null);
    }
  };

  const handleUpdateStatusClick = async (id: string, published: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [id]: true }));
    await onUpdateStatus(id, published);
    setLoadingStates((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mb-4 space-y-3">
          {exams.slice(0, visibleCount).map((exam) => (
            <div key={exam.id} className="rounded-lg bg-white p-4 shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-lg font-semibold text-gray-800">{exam.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600">{exam.description}</p>
                  <span
                    className={`mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      exam.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {exam.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/exams/${exam.id}`}
                    className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white transition hover:bg-blue-700"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleUpdateStatusClick(exam.id, !exam.published)}
                    disabled={loadingStates[exam.id]}
                    className={`rounded px-3 py-1.5 text-sm ${
                      exam.published
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {loadingStates[exam.id]
                      ? exam.published
                        ? 'Unpublishing...'
                        : 'Publishing...'
                      : exam.published
                        ? 'Unpublish'
                        : 'Publish'}
                  </button>
                  <button
                    onClick={() => handleDeleteClick(exam)}
                    className="rounded bg-red-600 px-3 py-1.5 text-sm text-white transition hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {(visibleCount < exams.length || visibleCount > 5) && (
        <div className="sticky bottom-0 border-t bg-gray-50 p-3">
          {visibleCount < exams.length ? (
            <button
              onClick={handleShowMore}
              className="w-full rounded border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Show More
            </button>
          ) : (
            <button
              onClick={handleShowLess}
              className="w-full rounded border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Show Less
            </button>
          )}
        </div>
      )}

      {/* Custom Delete Confirmation Dialog */}
      {examToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="w-[90%] max-w-md rounded-lg bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Delete Exam</h3>
            <p className="mb-6 text-sm text-gray-600">
              Are you sure you want to delete &quot;{examToDelete.name}&quot;? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setExamToDelete(null)}
                className="rounded bg-gray-100 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="rounded bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamList;
