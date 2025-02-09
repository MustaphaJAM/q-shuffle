import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Exam {
  id: string;
  name: string;
  description: string;
  duration?: number;
  passPercent?: number;
  questions: any[];
  published?: boolean;
  allowNavigation?: boolean;
  publicActive?: boolean;
  showResults?: boolean;
  publicLink?: string;
}

interface ExamDetailProps {
  examId: string;
}

const ExamDetail = ({ examId }: ExamDetailProps) => {
  const [exam, setExam] = useState<Exam | null>(null);
  const [isEditingName, setEditingName] = useState(false);
  const [isEditingDescription, setEditingDescription] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tempDuration, setTempDuration] = useState<number | undefined>();
  const [tempPassPercent, setTempPassPercent] = useState<number | undefined>();
  const [showDurationUpdate, setShowDurationUpdate] = useState(false);
  const [showTimeLimitUpdate, setShowTimeLimitUpdate] = useState(false);
  const [showPassPercentUpdate, setShowPassPercentUpdate] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  const navigateToExams = () => {
    window.location.href = '/dashboard/exams';
  };

  // Wrap fetchExam in useCallback to avoid unnecessary recreations
  const fetchExam = useCallback(async () => {
    if (!examId) return;
    try {
      const response = await fetch(`/api/auth/exams/${examId}`);
      if (response.ok) {
        const data = await response.json();
        setExam(data);
        setTempDuration(data.duration);
        setTempPassPercent(data.passPercent);
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error('Error fetching exam:', error);
    }
    setIsLoading(false);
  }, [examId]); // Add examId as a dependency

  useEffect(() => {
    fetchExam();
  }, [fetchExam]); // Add fetchExam as a dependency

  const updateExam = async (updatedData: Partial<Exam>) => {
    if (!examId || !exam) return false;
    try {
      const response = await fetch(`/api/auth/exams/${examId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const updatedExam = await response.json();
        setExam(updatedExam);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating exam:', error);
      return false;
    }
  };

  const deleteExam = async () => {
    try {
      const response = await fetch(`/api/auth/exams/${examId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        navigateToExams();
      }
    } catch (error) {
      console.error('Error deleting exam:', error);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (exam) {
      setExam({ ...exam, name: e.target.value });
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (exam) {
      setExam({ ...exam, description: e.target.value });
    }
  };

  const saveName = async () => {
    if (exam) {
      const success = await updateExam({ name: exam.name });
      if (success) setEditingName(false);
    }
  };

  const saveDescription = async () => {
    if (exam) {
      const success = await updateExam({ description: exam.description });
      if (success) setEditingDescription(false);
    }
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempDuration(Number(e.target.value));
    setShowDurationUpdate(true);
  };

  const handlePassPercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempPassPercent(Number(e.target.value));
    setShowPassPercentUpdate(true);
  };

  const updateDuration = async () => {
    const success = await updateExam({ duration: tempDuration });
    if (success) {
      setShowDurationUpdate(false);
    }
  };

  const updatePassPercent = async () => {
    const success = await updateExam({ passPercent: tempPassPercent });
    if (success) {
      setShowPassPercentUpdate(false);
    }
  };

  // Toggle functions for all settings
  const togglePublished = async () => {
    if (!exam) return;
    await updateExam({ published: !exam.published });
  };

  const toggleNavigation = async () => {
    if (!exam) return;
    await updateExam({ allowNavigation: !exam.allowNavigation });
  };

  const togglePublicAccess = async () => {
    if (!exam) return;
    await updateExam({ publicActive: !exam.publicActive });
  };

  const toggleShowResults = async () => {
    if (!exam) return;
    await updateExam({ showResults: !exam.showResults });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="py-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-700">Exam not found</h2>
        <button
          onClick={navigateToExams}
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          Return to Exam List
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-4">
      <div className="rounded-md bg-white p-6 shadow-md">
        {/* Title and Quick Actions */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex-1">
            {isEditingName ? (
              <input
                type="text"
                value={exam.name}
                onChange={(e) => setExam({ ...exam, name: e.target.value })}
                onBlur={() => {
                  updateExam({ name: exam.name });
                  setEditingName(false);
                }}
                className="w-full rounded-md border border-gray-300 p-2 text-3xl font-bold"
                autoFocus
              />
            ) : (
              <h1
                className="cursor-pointer text-3xl font-bold hover:text-gray-700"
                onClick={() => setEditingName(true)}
              >
                {exam.name}
              </h1>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={togglePublished}
              className={`rounded px-3 py-1 text-sm ${exam.published ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'
                }`}
            >
              {exam.published ? 'Published' : 'Draft'}
            </button>
            <button
              onClick={() => router.push(`/dashboard/exams/${examId}/review`)}
              className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
            >
              Review
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Description */}
        {isEditingDescription ? (
          <input
            type="text"
            value={exam.description}
            onChange={(e) => setExam({ ...exam, description: e.target.value })}
            onBlur={() => {
              updateExam({ description: exam.description });
              setEditingDescription(false);
            }}
            className="mb-6 w-full rounded-md border border-gray-300 p-2 text-gray-600"
            autoFocus
          />
        ) : (
          <p
            className="mb-6 cursor-pointer text-gray-600 hover:text-gray-800"
            onClick={() => setEditingDescription(true)}
          >
            {exam.description}
          </p>
        )}

        {/* Settings Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Time Settings */}
          <div className="space-y-4 rounded-md bg-gray-50 p-4">
            <h3 className="text-lg font-semibold">Time Settings</h3>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Time Limit (minutes)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={tempDuration || ''}
                  onChange={handleDurationChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  min="1"
                />
                {showDurationUpdate && (
                  <button
                    onClick={updateDuration}
                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  >
                    Update
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Pass Percentage
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={tempPassPercent || ''}
                  onChange={(e) => {
                    setTempPassPercent(Number(e.target.value));
                    setShowPassPercentUpdate(true);
                  }}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  min="0"
                  max="100"
                />
                {showPassPercentUpdate && (
                  <button
                    onClick={async () => {
                      await updateExam({ passPercent: tempPassPercent });
                      setShowPassPercentUpdate(false);
                    }}
                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  >
                    Update
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Behavior Settings */}
          <div className="space-y-4 rounded-md bg-gray-50 p-4">
            <h3 className="text-lg font-semibold">Behavior Settings</h3>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Navigation</h4>
                <p className="text-sm text-gray-600">
                  Allow users to move between questions freely
                </p>
              </div>
              <button
                onClick={toggleNavigation}
                className={`rounded px-4 py-2 transition-colors ${exam.allowNavigation
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
              >
                {exam.allowNavigation ? 'Free Navigation' : 'Linear Only'}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Results Display</h4>
                <p className="text-sm text-gray-600">Show results immediately after completion</p>
              </div>
              <button
                onClick={toggleShowResults}
                className={`rounded px-4 py-2 transition-colors ${exam.showResults
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
              >
                {exam.showResults ? 'Show Results' : 'Hide Results'}
              </button>
            </div>
          </div>

          {/* Access Settings */}
          <div className="space-y-4 rounded-md bg-gray-50 p-4">
            <h3 className="text-lg font-semibold">Access Settings</h3>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Public Access</h4>
                <p className="text-sm text-gray-600">Make exam accessible via public link</p>
              </div>
              <button
                onClick={togglePublicAccess}
                className={`rounded px-4 py-2 transition-colors ${exam.publicActive
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
              >
                {exam.publicActive ? 'Public' : 'Private'}
              </button>
            </div>

            {exam.publicActive && exam.publicLink && (
              <div className="mt-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">Public Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={exam.publicLink}
                    className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
                    readOnly
                  />
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `https://q-shuffle.vercel.app/exams/${exam.publicLink || ''}`,
                      )
                    }
                    className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-sm rounded-lg bg-white p-6">
              <h3 className="mb-2 text-lg font-semibold">Delete Exam</h3>
              <p className="mb-4 text-gray-600">
                Are you sure you want to delete this exam? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await deleteExam();
                    setShowDeleteConfirm(false);
                  }}
                  className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamDetail;
