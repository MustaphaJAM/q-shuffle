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
        <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto">
                <div className="space-y-3 mb-4">
                    {exams.slice(0, visibleCount).map((exam) => (
                        <div
                            key={exam.id}
                            className="bg-white rounded-lg shadow p-4"
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                                        {exam.name}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                                        {exam.description}
                                    </p>
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2
                                            ${exam.published
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'}`}
                                    >
                                        {exam.published ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/dashboard/exams/${exam.id}`}
                                        className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleUpdateStatusClick(exam.id, !exam.published)}
                                        disabled={loadingStates[exam.id]}
                                        className={`px-3 py-1.5 text-sm rounded ${exam.published
                                                ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                                : 'bg-green-600 hover:bg-green-700 text-white'
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
                                        className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
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
                <div className="sticky bottom-0 p-3 bg-gray-50 border-t">
                    {visibleCount < exams.length ? (
                        <button
                            onClick={handleShowMore}
                            className="w-full px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm rounded shadow-sm hover:bg-gray-50 transition"
                        >
                            Show More
                        </button>
                    ) : (
                        <button
                            onClick={handleShowLess}
                            className="w-full px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm rounded shadow-sm hover:bg-gray-50 transition"
                        >
                            Show Less
                        </button>
                    )}
                </div>
            )}

            {/* Custom Delete Confirmation Dialog */}
            {examToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-md p-6" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Delete Exam
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to delete "{examToDelete.name}"? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setExamToDelete(null)}
                                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700 transition"
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
