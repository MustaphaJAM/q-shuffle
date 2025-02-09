import { useState, useEffect, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Question } from './Question';
import { Question as QuestionType, Answer, ExamResult } from '@/types/exam';

interface ExamComponentProps {
  sessionId: string;
  allowNavigation: boolean;
  publicLink: string;
}

export const ExamComponent: React.FC<ExamComponentProps> = ({
  sessionId,
  allowNavigation,
  publicLink,
}) => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [examCompleted, setExamCompleted] = useState(false);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`/api/exams/${publicLink}/questions?sessionId=${sessionId}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setQuestions(allowNavigation ? data.questions : [data.currentQuestion]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (answer: Answer) => {
    const updatedAnswers = { ...answers, [answer.questionId]: answer };
    setAnswers(updatedAnswers);

    if (!allowNavigation) {
      await submitAnswer(answer);
    }
  };

  const submitAnswer = async (answer: Answer) => {
    try {
      const response = await fetch(`/api/exams/${publicLink}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          questionId: answer.questionId,
          selectedOptions: answer.selectedOptions,
          timeSpent: answer.timeSpent,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      if (data.completed) {
        setExamCompleted(true);
        setExamResult({
          score: data.score || null,
          passed: data.passed || null,
          message: data.message || null,
          answersSubmitted: data.answersSubmitted,
        });
      } else if (!allowNavigation) {
        fetchQuestions();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleSubmitExam = async () => {
    if (allowNavigation) {
      const answersArray = Object.values(answers).map((answer) => ({
        sessionId,
        questionId: answer.questionId,
        selectedOptions: answer.selectedOptions,
        timeSpent: answer.timeSpent,
      }));

      try {
        const response = await fetch(`/api/exams/${publicLink}/answer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(answersArray),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error);

        setExamCompleted(true);
        setExamResult({
          score: data.score || null,
          passed: data.passed || null,
          message: data.message || null,
          answersSubmitted: data.answersSubmitted,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    }
  };

  if (loading) {
    return <div className="text-center">Loading exam...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (examCompleted) {
    return (
      <Card className="mx-auto w-full max-w-lg">
        <CardHeader>
          <CardTitle>Exam Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {examResult?.score !== null && (
              <div className="text-center text-2xl font-bold">
                Your Score: {examResult?.score.toFixed(1)}%
              </div>
            )}
            {examResult?.passed !== null && (
              <div className="flex items-center justify-center gap-2">
                {examResult?.passed ? (
                  <Check className="h-6 w-6 text-green-500" />
                ) : (
                  <X className="h-6 w-6 text-red-500" />
                )}
                <span>{examResult?.passed ? 'Passed' : 'Failed'}</span>
              </div>
            )}
            {examResult?.message && <div className="text-center text-lg">{examResult.message}</div>}
            <div className="text-center text-sm text-gray-500">
              You submitted {examResult?.answersSubmitted} answers.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <Progress value={(Object.keys(answers).length / questions.length) * 100} className="w-full" />

      {allowNavigation && (
        <div className="mb-4 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <span>
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {questions[currentQuestionIndex] && (
        <Question
          question={questions[currentQuestionIndex]}
          onAnswer={handleAnswer}
          userAnswer={answers[questions[currentQuestionIndex].id]}
          allowChange={allowNavigation}
        />
      )}

      {allowNavigation && (
        <div className="mt-4 flex justify-end">
          <Button
            onClick={handleSubmitExam}
            disabled={Object.keys(answers).length !== questions.length}
          >
            Submit Exam
          </Button>
        </div>
      )}
    </div>
  );
};
