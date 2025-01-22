"use client";

import { useState, useEffect } from "react";
import { Plus, Trash, Image as ImageIcon, Check, X, Edit } from "lucide-react";
import QuestionForm from "./QuestionForm";

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
  const [error, setError] = useState<string>("");

  const fetchExam = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/auth/exams/${examId}`);
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions || []);
      } else {
        console.error("Failed to fetch exam:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching exam:", error);
    }
    setIsLoading(false);
  };

  const deleteQuestion = async (id: string) => {
    try {
      const response = await fetch(`/api/auth/exams/${examId}/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setQuestions((prevQuestions) =>
          prevQuestions.filter((q) => q.id !== id)
        );
      } else {
        console.error("Failed to delete question:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting question:", error);
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
    setError("");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB");
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
    formData.append("file", file);

    try {
      const response = await fetch("/api/auth/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      throw new Error("Error uploading image");
    }
  };

  const saveQuestion = async () => {
    if (!editingQuestion) return;

    try {
      let imageUrl = editingQuestion.image;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const filteredOptions = editingQuestion.options.filter(opt => opt.trim() !== "");
      if (filteredOptions.length < 2) {
        setError("At least two non-empty options are required");
        return;
      }

      const adjustedCorrectAnswers = editingQuestion.correctAnswers
        .filter(index => index < filteredOptions.length)
        .map(index => {
          const option = editingQuestion.options[index];
          return filteredOptions.indexOf(option);
        })
        .filter(index => index !== -1);

      if (adjustedCorrectAnswers.length === 0) {
        setError("Please select at least one correct answer");
        return;
      }

      const questionData = {
        text: editingQuestion.text.trim(),
        options: filteredOptions,
        correctAnswers: adjustedCorrectAnswers,
        timeLimit: editingQuestion.timeLimit,
        image: imageUrl
      };

      const response = await fetch(`/api/auth/exams/${examId}/${editingQuestion.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionData),
      });

      if (!response.ok) {
        throw new Error("Failed to update question");
      }

      const updatedQuestion = await response.json();
      setQuestions(questions.map(q =>
        q.id === editingQuestion.id ? updatedQuestion : q
      ));
      cancelEditing();
    } catch (error) {
      setError("Failed to save question");
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
  }, [examId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Questions</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Question
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <ul className="space-y-4">
        {questions.map((question) => (
          <li key={question.id} className="bg-white shadow-md rounded-lg p-4">
            {editingId === question.id ? (
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Question Text</label>
                  <textarea
                    value={editingQuestion?.text}
                    onChange={(e) => setEditingQuestion(prev => prev ? {
                      ...prev,
                      text: e.target.value
                    } : null)}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Image</label>
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
                        className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50"
                      >
                        <ImageIcon size={20} />
                        Upload Image
                      </label>
                      {editingQuestion?.image && (
                        <button
                          onClick={removeImage}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                    {editingQuestion?.image && (
                      <img
                        src={editingQuestion.image}
                        alt="Question"
                        className="max-h-40 object-cover rounded-md"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block mb-1 font-medium">Options</label>
                  {editingQuestion?.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={editingQuestion.correctAnswers.includes(index)}
                        onChange={(e) => {
                          const newCorrectAnswers = e.target.checked
                            ? [...editingQuestion.correctAnswers, index]
                            : editingQuestion.correctAnswers.filter((i) => i !== index);
                          setEditingQuestion(prev => prev ? {
                            ...prev,
                            correctAnswers: newCorrectAnswers
                          } : null);
                        }}
                        className="w-4 h-4"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...editingQuestion.options];
                          newOptions[index] = e.target.value;
                          setEditingQuestion(prev => prev ? {
                            ...prev,
                            options: newOptions
                          } : null);
                        }}
                        className="flex-1 p-2 border rounded-md"
                        placeholder={`Option ${index + 1}`}
                      />
                      {editingQuestion.options.length > 2 && (
                        <button
                          onClick={() => {
                            const newOptions = editingQuestion.options.filter(
                              (_, i) => i !== index
                            );
                            const newCorrectAnswers = editingQuestion.correctAnswers
                              .filter((i) => i !== index)
                              .map((i) => (i > index ? i - 1 : i));
                            setEditingQuestion(prev => prev ? {
                              ...prev,
                              options: newOptions,
                              correctAnswers: newCorrectAnswers
                            } : null);
                          }}
                          className="text-red-500"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => setEditingQuestion(prev => prev ? {
                      ...prev,
                      options: [...prev.options, ""]
                    } : null)}
                    className="text-blue-500 text-sm"
                  >
                    + Add Option
                  </button>
                </div>

                <div>
                  <label className="block mb-1 font-medium">Time Limit (seconds)</label>
                  <input
                    type="number"
                    value={editingQuestion?.timeLimit}
                    onChange={(e) => setEditingQuestion(prev => prev ? {
                      ...prev,
                      time: Math.max(1, Number(e.target.value))
                    } : null)}
                    className="w-full p-2 border rounded-md"
                    min={1}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={cancelEditing}
                    className="px-4 py-2 border rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveQuestion}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{question.text}</h3>
                  {question.image && (
                    <img
                      src={question.image}
                      alt="Question"
                      className="max-h-40 object-cover rounded-md mb-4"
                    />
                  )}
                  <div className="space-y-2">
                    {question.options.map((option, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded-md ${question.correctAnswers.includes(index)
                          ? "bg-green-100"
                          : "bg-gray-100"
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
                    className="text-blue-500 hover:text-blue-700 p-2"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => deleteQuestion(question.id)}
                    className="text-red-500 hover:text-red-700 p-2"
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