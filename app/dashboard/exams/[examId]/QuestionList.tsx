'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Plus, Trash, Image as ImageIcon, Check, X, Edit } from 'lucide-react';
import QuestionForm from './QuestionForm';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswers: number[];
  timeLimit?: number;
  image?: string | null;
  examId?: string;
}

const QuestionList = ({ examId }: { examId: string }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const fetchExam = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/auth/exams/${examId}`);
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions || []);
      } else {
        console.error('Failed to fetch exam:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching exam:', error);
    }
    setIsLoading(false);
  }, [examId]);

  const deleteQuestion = async (id: string) => {
    try {
      const response = await fetch(`/api/auth/exams/${examId}/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== id));
      } else {
        console.error('Failed to delete question:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const startEditing = (question: Question) => {
    setEditingId(question.id);
    setEditingQuestion({ ...question });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingQuestion(null);
    setImageFile(null);
    setError('');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (editingQuestion) {
          setEditingQuestion({
            ...editingQuestion,
            image: e.target?.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/auth/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      throw new Error('Error uploading image');
    }
  };

  const saveQuestion = async () => {
    if (!editingQuestion) return;

    try {
      let imageUrl = editingQuestion.image;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const filteredOptions = editingQuestion.options.filter((opt) => opt.trim() !== '');
      if (filteredOptions.length < 2) {
        setError('At least two non-empty options are required');
        return;
      }

      const adjustedCorrectAnswers = editingQuestion.correctAnswers
        .filter((index) => index < filteredOptions.length)
        .map((index) => {
          const option = editingQuestion.options[index];
          return filteredOptions.indexOf(option);
        })
        .filter((index) => index !== -1);

      if (adjustedCorrectAnswers.length === 0) {
        setError('Please select at least one correct answer');
        return;
      }

      const questionData = {
        text: editingQuestion.text.trim(),
        options: filteredOptions,
        correctAnswers: adjustedCorrectAnswers,
        timeLimit: editingQuestion.timeLimit,
        image: imageUrl,
      };

      const response = await fetch(`/api/auth/exams/${examId}/${editingQuestion.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
      });

      if (!response.ok) {
        throw new Error('Failed to update question');
      }

      const updatedQuestion = await response.json();
      setQuestions(questions.map((q) => (q.id === editingQuestion.id ? updatedQuestion : q)));
      cancelEditing();
    } catch (error) {
      setError('Failed to save question');
    }
  };

  const removeImage = () => {
    if (editingQuestion) {
      setImageFile(null);
      setEditingQuestion({
        ...editingQuestion,
        image: null,
      });
    }
  };

  useEffect(() => {
    fetchExam();
  }, [fetchExam]);

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Questions</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Question
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <QuestionForm
            examId={examId}
            onClose={() => setShowForm(false)}
            onSuccess={() => {
              setShowForm(false);
              fetchExam();
            }}
          />
        </div>
      )}

      {error && <div className="rounded-md bg-red-100 p-3 text-red-700">{error}</div>}

      <ul className="space-y-4">
        {questions.map((question) => (
          <li key={question.id} className="rounded-lg bg-white p-4 shadow-md">
            {editingId === question.id ? (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block font-medium">Question Text</label>
                  <textarea
                    value={editingQuestion?.text}
                    onChange={(e) =>
                      setEditingQuestion((prev) =>
                        prev
                          ? {
                              ...prev,
                              text: e.target.value,
                            }
                          : null,
                      )
                    }
                    className="w-full rounded-md border p-2"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="mb-1 block font-medium">Image</label>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id={`image-upload-${question.id}`}
                      />
                      <label
                        htmlFor={`image-upload-${question.id}`}
                        className="flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 hover:bg-gray-50"
                      >
                        <ImageIcon size={20} />
                        Upload Image
                      </label>
                      {editingQuestion?.image && (
                        <button onClick={removeImage} className="text-red-500 hover:text-red-700">
                          <X size={20} />
                        </button>
                      )}
                    </div>
                    {editingQuestion?.image && (
                      <Image
                        src={editingQuestion.image}
                        alt="Question"
                        width={200}
                        height={200}
                        className="max-h-40 rounded-md object-cover"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block font-medium">Options</label>
                  {editingQuestion?.options.map((option, index) => (
                    <div key={index} className="mb-2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editingQuestion.correctAnswers.includes(index)}
                        onChange={(e) => {
                          const newCorrectAnswers = e.target.checked
                            ? [...editingQuestion.correctAnswers, index]
                            : editingQuestion.correctAnswers.filter((i) => i !== index);
                          setEditingQuestion((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  correctAnswers: newCorrectAnswers,
                                }
                              : null,
                          );
                        }}
                        className="h-4 w-4"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...editingQuestion.options];
                          newOptions[index] = e.target.value;
                          setEditingQuestion((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  options: newOptions,
                                }
                              : null,
                          );
                        }}
                        className="flex-1 rounded-md border p-2"
                        placeholder={`Option ${index + 1}`}
                      />
                      {editingQuestion.options.length > 2 && (
                        <button
                          onClick={() => {
                            const newOptions = editingQuestion.options.filter(
                              (_, i) => i !== index,
                            );
                            const newCorrectAnswers = editingQuestion.correctAnswers
                              .filter((i) => i !== index)
                              .map((i) => (i > index ? i - 1 : i));
                            setEditingQuestion((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    options: newOptions,
                                    correctAnswers: newCorrectAnswers,
                                  }
                                : null,
                            );
                          }}
                          className="text-red-500"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setEditingQuestion((prev) =>
                        prev
                          ? {
                              ...prev,
                              options: [...prev.options, ''],
                            }
                          : null,
                      )
                    }
                    className="text-sm text-blue-500"
                  >
                    + Add Option
                  </button>
                </div>

                <div>
                  <label className="mb-1 block font-medium">Time Limit (seconds)</label>
                  <input
                    type="number"
                    value={editingQuestion?.timeLimit}
                    onChange={(e) =>
                      setEditingQuestion((prev) =>
                        prev
                          ? {
                              ...prev,
                              timeLimit: Math.max(1, Number(e.target.value)),
                            }
                          : null,
                      )
                    }
                    className="w-full rounded-md border p-2"
                    min={1}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={cancelEditing}
                    className="rounded-md border px-4 py-2 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveQuestion}
                    className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-semibold">{question.text}</h3>
                  {question.image && (
                    <Image
                      src={question.image}
                      alt="Question"
                      width={200}
                      height={200}
                      className="mb-4 max-h-40 rounded-md object-cover"
                    />
                  )}
                  <div className="space-y-2">
                    {question.options.map((option, index) => (
                      <div
                        key={index}
                        className={`rounded-md p-2 ${
                          question.correctAnswers.includes(index) ? 'bg-green-100' : 'bg-gray-100'
                        }`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Time limit: {question.timeLimit} seconds
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditing(question)}
                    className="p-2 text-blue-500 hover:text-blue-700"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => deleteQuestion(question.id)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <Trash size={20} />
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionList;
