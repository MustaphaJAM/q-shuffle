'use client';

import ExamDetail from '../ExamDetail';
import QuestionList from './QuestionList';
import QuestionForm from './QuestionForm';
import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function ExamPage({ params }: { params: { examId: string } }) {
  const [isFormVisible, setFormVisible] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 scrollbar-thumb-rounded-full scrollbar-track-rounded-full hover:scrollbar-thumb-gray-500 relative min-h-screen">
      <div className="h-full overflow-y-auto">
        <ExamDetail examId={params.examId} />
        <div className="mx-auto max-w-5xl p-4">
          <QuestionList examId={params.examId} />
        </div>
      </div>

      {/* Scroll to top button */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 transform rounded-full bg-blue-500 p-3 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-blue-600"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
