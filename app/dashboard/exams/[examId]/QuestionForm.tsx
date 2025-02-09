'use client';

import { useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';

interface Question {
  text: string;
  options: string[];
  correctAnswers: number[];
  time?: number;
  image?: string | null;
}

interface QuestionFormProps {
  examId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const QuestionForm = ({ examId, onClose, onSuccess }: QuestionFormProps) => {
  const [question, setQuestion] = useState<Question>({
    text: '',
    options: ['', ''],
    correctAnswers: [],
    time: 30,
    image: null,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      setImageFile(file);
      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setQuestion({ ...question, image: e.target?.result as string });
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
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const validateQuestion = () => {
    if (!question.text.trim()) {
      setError('Question text is required');
      return false;
    }
    // Filter out empty options first
    const validOptions = question.options.filter((opt) => opt.trim() !== '');
    if (validOptions.length < 2) {
      setError('At least two non-empty options are required');
      return false;
    }
    if (question.correctAnswers.length === 0) {
      setError('Please select at least one correct answer');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateQuestion() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError('');

      let imageUrl = null;
      if (imageFile) {
        try {
          imageUrl = await uploadImage(imageFile);
        } catch (error) {
          setError('Failed to upload image. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }

      // Filter out empty options and adjust correctAnswers
      const filteredOptions = question.options.filter((opt) => opt.trim() !== '');
      const adjustedCorrectAnswers = question.correctAnswers
        .filter((index) => index < filteredOptions.length)
        .map((index) => {
          const option = question.options[index];
          return filteredOptions.indexOf(option);
        })
        .filter((index) => index !== -1);

      // Prepare the question data
      const questionData = {
        text: question.text.trim(),
        options: filteredOptions,
        correctAnswers: adjustedCorrectAnswers,
        time: question.time,
        image: imageUrl,
      };

      const response = await fetch(`/api/auth/exams/${examId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Invalid server response' }));
        throw new Error(data.error || 'Failed to create question');
      }

      const data = await response.json().catch(() => null);
      if (!data) {
        throw new Error('Invalid response format');
      }

      onSuccess();
    } catch (error) {
      console.error('Error creating question:', error);
      setError(error instanceof Error ? error.message : 'Failed to create question');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setQuestion({ ...question, image: null });
  };

  return (
    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-lg">
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold">Add New Question</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        {error && <div className="mb-4 rounded-md bg-red-100 p-3 text-red-700">{error}</div>}

        <div className="space-y-4">
          <div>
            <label className="mb-1 block font-medium">Question Text</label>
            <textarea
              value={question.text}
              onChange={(e) => {
                setError('');
                setQuestion({ ...question, text: e.target.value });
              }}
              className="w-full rounded-md border p-2"
              rows={3}
              placeholder="Enter your question"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">Image (optional)</label>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="image-upload"
                  className="flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ImageIcon size={20} />
                  Upload Image
                </label>
                {question.image && (
                  <button
                    onClick={removeImage}
                    className="text-red-500 hover:text-red-700"
                    disabled={isSubmitting}
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
              {question.image && (
                <div className="relative w-fit">
                  <img
                    src={question.image}
                    alt="Preview"
                    className="max-h-40 rounded-md object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1 block font-medium">Options</label>
            {question.options.map((option, index) => (
              <div key={index} className="mb-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={question.correctAnswers.includes(index)}
                  onChange={(e) => {
                    setError('');
                    const newCorrectAnswers = e.target.checked
                      ? [...question.correctAnswers, index]
                      : question.correctAnswers.filter((i) => i !== index);
                    setQuestion({ ...question, correctAnswers: newCorrectAnswers });
                  }}
                  className="h-4 w-4"
                  disabled={isSubmitting}
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    setError('');
                    const newOptions = [...question.options];
                    newOptions[index] = e.target.value;
                    setQuestion({ ...question, options: newOptions });
                  }}
                  className="flex-1 rounded-md border p-2"
                  placeholder={`Option ${index + 1}`}
                  disabled={isSubmitting}
                />
                {question.options.length > 2 && (
                  <button
                    onClick={() => {
                      const newOptions = question.options.filter((_, i) => i !== index);
                      const newCorrectAnswers = question.correctAnswers
                        .filter((i) => i !== index)
                        .map((i) => (i > index ? i - 1 : i));
                      setQuestion({
                        ...question,
                        options: newOptions,
                        correctAnswers: newCorrectAnswers,
                      });
                    }}
                    className="text-red-500"
                    disabled={isSubmitting}
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => setQuestion({ ...question, options: [...question.options, ''] })}
              className="mt-2 text-sm text-blue-500"
              disabled={isSubmitting}
            >
              + Add Option
            </button>
          </div>

          <div>
            <label className="mb-1 block font-medium">Time Limit (seconds)</label>
            <input
              type="number"
              value={question.time}
              onChange={(e) => {
                setError('');
                setQuestion({ ...question, time: Math.max(1, Number(e.target.value)) });
              }}
              className="w-full rounded-md border p-2"
              min={1}
              disabled={isSubmitting}
            />
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="rounded-md border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Question'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionForm;
