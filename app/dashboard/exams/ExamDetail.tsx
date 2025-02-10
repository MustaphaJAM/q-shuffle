import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings,
  Edit,
  Trash2,
  Clock,
  PercentIcon,
  Globe,
  Navigation,
  Eye,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { CustomInput } from '@/components/ui/customInput';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const router = useRouter();

  const navigateToExams = () => {
    window.location.href = '/dashboard/exams';
  };

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
  }, [examId]);

  useEffect(() => {
    fetchExam();
  }, [fetchExam]);

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

  const toggleSetting = async (settingKey: keyof Exam) => {
    if (!exam) return;
    const currentValue = exam[settingKey];
    await updateExam({ [settingKey]: !currentValue });
  };

  const renderSettingsDialog = () => (
    <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
      <DialogTrigger asChild>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="rounded-full p-2 hover:bg-gray-100"
        >
          <Settings className="h-6 w-6 text-gray-600" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Exam Settings</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Time Settings */}
          <div className="border-b pb-4">
            <h3 className="mb-3 flex items-center text-lg font-semibold">
              <Clock className="mr-2 h-5 w-5 text-gray-600" />
              Time Settings
            </h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="duration" className="mb-2 block text-sm font-medium text-gray-700">
                  Time Limit (minutes)
                </label>
                <div className="flex items-center space-x-2">
                  <CustomInput
                    id="duration"
                    type="number"
                    value={tempDuration || ''}
                    onChange={(e) => {
                      setTempDuration(Number(e.target.value));
                    }}
                    className="max-w-[200px]"
                  />
                  <Button variant="outline" onClick={() => updateExam({ duration: tempDuration })}>
                    Update
                  </Button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="passPercent"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Pass Percentage
                </label>
                <div className="flex items-center space-x-2">
                  <CustomInput
                    id="passPercent"
                    type="number"
                    value={tempPassPercent || ''}
                    onChange={(e) => {
                      setTempPassPercent(Number(e.target.value));
                    }}
                    min="0"
                    max="100"
                    className="max-w-[200px]"
                  />
                  <Button
                    variant="outline"
                    onClick={() => updateExam({ passPercent: tempPassPercent })}
                  >
                    Update
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {/* Behavior Settings */}
          <div className="border-b pb-4">
            <h3 className="mb-3 flex items-center text-lg font-semibold">
              <Navigation className="mr-2 h-5 w-5 text-gray-600" />
              Behavior Settings
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Navigation className="h-5 w-5 text-gray-600" />
                  <label htmlFor="navigation" className="text-sm font-medium text-gray-700">
                    Allow Free Navigation
                  </label>
                </div>
                <Switch
                  id="navigation"
                  checked={exam?.allowNavigation}
                  onCheckedChange={() => toggleSetting('allowNavigation')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-gray-600" />
                  <label htmlFor="results" className="text-sm font-medium text-gray-700">
                    Show Results
                  </label>
                </div>
                <Switch
                  id="results"
                  checked={exam?.showResults}
                  onCheckedChange={() => toggleSetting('showResults')}
                />
              </div>
            </div>
          </div>
          {/* Access Settings */}
          <div>
            <h3 className="mb-3 flex items-center text-lg font-semibold">
              <Globe className="mr-2 h-5 w-5 text-gray-600" />
              Access Settings
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-gray-600" />
                  <label htmlFor="publicAccess" className="text-sm font-medium text-gray-700">
                    Public Access
                  </label>
                </div>
                <Switch
                  id="publicAccess"
                  checked={exam?.publicActive}
                  onCheckedChange={() => toggleSetting('publicActive')}
                />
              </div>

              {exam?.publicActive && exam?.publicLink && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Public Link
                  </label>
                  <div className="flex space-x-2">
                    <CustomInput
                      value={`https://q-shuffle.vercel.app/exams/${exam.publicLink}`}
                      readOnly
                    />
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `https://q-shuffle.vercel.app/exams/${exam.publicLink}`,
                        )
                      }
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderDeleteConfirmModal = () =>
    showDeleteConfirm && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
          <h3 className="mb-2 flex items-center text-lg font-semibold">
            <Trash2 className="mr-2 text-red-500" />
            Delete Exam
          </h3>
          <p className="mb-4 text-sm text-gray-600">
            Are you sure you want to delete this exam? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                await deleteExam();
                setShowDeleteConfirm(false);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    );

  const renderPublishAndReviewSection = () => (
    <div className="flex items-center space-x-4 rounded-md border border-gray-200 bg-gray-50 p-4">
      <TooltipProvider>
        <div className="flex items-center space-x-2">
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center space-x-2">
                <Switch
                  id="publish"
                  checked={exam?.published}
                  onCheckedChange={() => toggleSetting('published')}
                />
                <label htmlFor="publish" className="text-sm font-medium">
                  Publish Exam
                </label>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {exam?.published
                ? 'This exam is currently published and visible to students'
                : 'Publish this exam to make it available for students'}
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="mx-3 h-6 border-l border-gray-300" />

        <div className="flex items-center space-x-2">
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="outline"
                onClick={() => router.push(`/dashboard/exams/${examId}/review`)}
                className="flex items-center space-x-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Review Exam</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Carefully review and validate exam questions before publishing
            </TooltipContent>
          </Tooltip>
        </div>

        {!exam?.published && (
          <div className="flex items-center space-x-2 text-yellow-600">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">Exam is not published</span>
          </div>
        )}
      </TooltipProvider>
    </div>
  );

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
        <Button className="mt-4" onClick={navigateToExams}>
          Return to Exam List
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-2 sm:p-4">
      <div className="rounded-md bg-white p-3 shadow-md sm:p-6">
        {/* Title and Quick Actions */}
        <div className="mb-4 flex flex-col space-y-4 sm:mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              {isEditingName ? (
                <input
                  type="text"
                  value={exam?.name}
                  onChange={(e) => setExam(exam ? { ...exam, name: e.target.value } : null)}
                  onBlur={() => {
                    updateExam({ name: exam?.name });
                    setEditingName(false);
                  }}
                  className="w-full rounded-md border border-gray-300 p-2 text-xl font-bold sm:text-3xl"
                  autoFocus
                />
              ) : (
                <h1
                  className="flex cursor-pointer items-center text-xl font-bold hover:text-gray-700 sm:text-3xl"
                  onClick={() => setEditingName(true)}
                >
                  {exam?.name}
                  <Edit className="ml-2 h-4 w-4 text-gray-500 opacity-50 group-hover:opacity-100 sm:h-5 sm:w-5" />
                </h1>
              )}
            </div>
            <div className="flex items-center gap-2">
              {renderSettingsDialog()}
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-sm sm:text-base"
              >
                Delete
              </Button>
            </div>
          </div>

          {/* Publish and Review Section */}
          <div className="flex flex-col items-start gap-4 rounded-md border border-gray-200 bg-gray-50 p-3 sm:flex-row sm:items-center sm:gap-0 sm:space-x-4 sm:p-4">
            <TooltipProvider>
              <div className="flex items-center space-x-2">
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="publish"
                        checked={exam?.published}
                        onCheckedChange={() => toggleSetting('published')}
                      />
                      <label htmlFor="publish" className="whitespace-nowrap text-sm font-medium">
                        Publish Exam
                      </label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {exam?.published
                      ? 'This exam is currently published and visible to students'
                      : 'Publish this exam to make it available for students'}
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="mx-3 hidden h-6 border-l border-gray-300 sm:block" />

              <div className="flex items-center space-x-2">
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/dashboard/exams/${examId}/review`)}
                      className="flex items-center space-x-2 text-sm sm:text-base"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Review Exam</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Carefully review and validate exam questions before publishing
                  </TooltipContent>
                </Tooltip>
              </div>

              {!exam?.published && (
                <div className="mt-2 flex items-center space-x-2 text-yellow-600 sm:mt-0">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-xs sm:text-sm">Exam is not published</span>
                </div>
              )}
            </TooltipProvider>
          </div>
        </div>

        {/* Description */}
        {isEditingDescription ? (
          <input
            type="text"
            value={exam?.description}
            onChange={(e) => setExam(exam ? { ...exam, description: e.target.value } : null)}
            onBlur={() => {
              updateExam({ description: exam?.description });
              setEditingDescription(false);
            }}
            className="mb-4 w-full rounded-md border border-gray-300 p-2 text-sm text-gray-600 sm:mb-6 sm:text-base"
            autoFocus
          />
        ) : (
          <p
            className="mb-4 flex cursor-pointer items-center text-sm text-gray-600 hover:text-gray-800 sm:mb-6 sm:text-base"
            onClick={() => setEditingDescription(true)}
          >
            {exam?.description || 'Add a description'}
            <Edit className="ml-2 h-3 w-3 text-gray-500 opacity-50 group-hover:opacity-100 sm:h-4 sm:w-4" />
          </p>
        )}

        {/* Delete confirmation modal */}
        {renderDeleteConfirmModal()}
      </div>
    </div>
  );
};

export default ExamDetail;