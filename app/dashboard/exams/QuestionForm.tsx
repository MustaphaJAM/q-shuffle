'use client';

import { useState } from 'react';

const QuestionForm = ({ onAdd }: { onAdd: (question: any) => void }) => {
    const [questionText, setQuestionText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newQuestion = { text: questionText };
        onAdd(newQuestion);
        setQuestionText('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Question Text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                required
            />
            <button type="submit">Add Question</button>
        </form>
    );
};

export default QuestionForm;
