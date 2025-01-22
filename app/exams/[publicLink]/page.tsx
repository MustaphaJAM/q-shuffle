'use client';

import { useState } from 'react';
import { StudentRegistration } from '@/components/StudentRegistration';
import { ExamComponent } from '@/components/ExamComponent';
import { ExamSession } from '@/types/exam';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PageProps {
    params: {
        publicLink: string;
    };
}

const ExamPage = ({ params }: PageProps) => {
    const { publicLink } = params;
    const [examSession, setExamSession] = useState<ExamSession | null>(null);
    const [error, setError] = useState<string>('');

    const handleRegistrationComplete = (sessionData: ExamSession) => {
        setExamSession(sessionData);
    };

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {!examSession ? (
                <StudentRegistration
                    onRegistrationComplete={handleRegistrationComplete}
                    publicLink={publicLink}
                />
            ) : (
                <ExamComponent
                    sessionId={examSession.sessionId}
                    allowNavigation={examSession.allowNavigation}
                    publicLink={publicLink}
                />
            )}
        </div>
    );
};

export default ExamPage;