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
                setTimeSpent(prev => prev + 1);
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
            ? selectedOptions.filter(i => i !== optionIndex)
            : [...selectedOptions, optionIndex];

        setSelectedOptions(newSelection);
        onAnswer({
            questionId: question.id,
            selectedOptions: newSelection,
            timeSpent
        });
    };

    return (
        <Card className="w-full mb-4">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{question.text}</CardTitle>
                    <div className="flex items-center gap-2">
                        <Timer className="w-4 h-4" />
                        <span>{timeSpent}s</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {question.image && (
                    <img
                        src={question.image}
                        alt="Question illustration"
                        className="max-w-full h-auto mb-4 rounded-lg"
                    />
                )}
                <RadioGroup className="space-y-2">
                    {question.options.map((option, index) => (
                        <div
                            key={`${question.id}-${index}`}
                            className={`flex items-center p-3 rounded-lg cursor-pointer border ${selectedOptions.includes(index) ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'
                                }`}
                            onClick={() => handleOptionSelect(index)}
                        >
                            <RadioGroupItem
                                value={index.toString()}
                                id={`q${question.id}-${index}`}
                                checked={selectedOptions.includes(index)}
                                className="mr-3"
                            />
                            <label
                                htmlFor={`q${question.id}-${index}`}
                                className="flex-grow cursor-pointer"
                            >
                                {option}
                            </label>
                        </div>
                    ))}
                </RadioGroup>
            </CardContent>
        </Card>
    );
};