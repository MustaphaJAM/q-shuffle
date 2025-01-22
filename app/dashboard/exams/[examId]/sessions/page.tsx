'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function ExamSessionsPage() {
    const params = useParams();
    const [sessions, setSessions] = useState([]);
    const [exam, setExam] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const [examResponse, sessionsResponse] = await Promise.all([
                fetch(`/api/exams/${params.examId}`),
                fetch(`/api/exams/${params.examId}/sessions`),
            ]);

            const [examData, sessionsData] = await Promise.all([
                examResponse.json(),
                sessionsResponse.json(),
            ]);

            setExam(examData);
            setSessions(sessionsData);
        };

        fetchData();
    }, [params.examId]);

    const exportToCSV = () => {
        const headers = ['Name', 'Surname', 'CNE', 'Start Time', 'End Time', 'Score', 'Status'];
        const csvData = sessions.map(session => [
            session.studentName,
            session.studentSurname,
            session.studentCNE,
            new Date(session.startTime).toLocaleString(),
            session.endTime ? new Date(session.endTime).toLocaleString() : 'N/A',
            session.score ? `${session.score.toFixed(2)}%` : 'N/A',
            session.completed ? 'Completed' : 'In Progress',
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(',')),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${exam.name}-sessions.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    if (!exam) {
        return <div>Loading...</div>;
    }

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Exam Sessions: {exam.name}</CardTitle>
                <Button onClick={exportToCSV}>
                    <Download className="mr-2 h-4 w-4" />
                    Export to CSV
                </Button>
            </CardHeader>