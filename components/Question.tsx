import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Timer } from 'lucide-react';
import { Question as QuestionType, Answer } from '@/types/exam';

interface QuestionProps {
  question: QuestionType;
  onAnswer: (answer: Answer) => void;
  userAnswer?: Answer;
  allowChange?: boolean;
}

export const Question: React.FC<QuestionProps> = ({
  question,
  onAnswer,
  userAnswer,
  allowChange = true,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);

  // Reset state when question changes
  useEffect(() => {
    setSelectedOptions(userAnswer?.selectedOptions || []);
    setTimeSpent(userAnswer?.timeSpent || 0);
  }, [question.id, userAnswer]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (allowChange) {
      interval = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [allowChange]);

  const handleOptionSelect = (optionIndex: number) => {
    if (!allowChange) return;

    const newSelection = selectedOptions.includes(optionIndex)
      ? selectedOptions.filter((i) => i !== optionIndex)
      : [...selectedOptions, optionIndex];

    setSelectedOptions(newSelection);
    onAnswer({
      questionId: question.id,
      selectedOptions: newSelection,
      timeSpent,
    });
  };

  return (
    <Card className="mb-4 w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{question.text}</CardTitle>
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            <span>{timeSpent}s</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {question.image && (
          <img
            src={question.image}
            alt="Question illustration"
            className="mb-4 h-auto max-w-full rounded-lg"
          />
        )}
        <RadioGroup className="space-y-2">
          {question.options.map((option, index) => (
            <div
              key={`${question.id}-${index}`}
              className={`flex cursor-pointer items-center rounded-lg border p-3 ${
                selectedOptions.includes(index)
                  ? 'border-primary bg-primary/10'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleOptionSelect(index)}
            >
              <RadioGroupItem
                value={index.toString()}
                id={`q${question.id}-${index}`}
                checked={selectedOptions.includes(index)}
                className="mr-3"
              />
              <label htmlFor={`q${question.id}-${index}`} className="flex-grow cursor-pointer">
                {option}
              </label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
