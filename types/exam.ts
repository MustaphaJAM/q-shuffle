export interface StudentRegistrationData {
    studentName: string;
    studentSurname: string;
    studentCNE: string;
}

export interface Question {
    id: string;
    text: string;
    image?: string;
    options: string[];
}

export interface Answer {
    questionId: string;
    selectedOptions: number[];
    timeSpent: number;
}

export interface ExamSession {
    sessionId: string;
    allowNavigation: boolean;
}

export interface ExamResult {
    score: number;
    passed: boolean;
    showResults: boolean;
}