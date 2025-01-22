import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Types for our components
type Session = {
    id: string;
    studentName: string;
    studentSurname: string;
    studentCNE: string;
    startTime: string;
    endTime?: string;
    score?: number;
    completed: boolean;
};

type SessionStats = {
    totalSessions: number;
    completedSessions: number;
    averageScore: number;
    scoreDistribution: { range: string; count: number }[];
};

export const SessionStats = ({ sessions }: { sessions: Session[] }) => {
    const stats = useMemo(() => {
        const completed = sessions.filter(s => s.completed);
        const avgScore = completed.reduce((acc, s) => acc + (s.score || 0), 0) / (completed.length || 1);

        // Create score distribution
        const distribution = Array(5).fill(0).map((_, i) => ({
            range: `${i * 20}-${(i + 1) * 20}`,
            count: completed.filter(s => {
                const score = s.score || 0;
                return score >= i * 20 && score < (i + 1) * 20;
            }).length
        }));

        return {
            totalSessions: sessions.length,
            completedSessions: completed.length,
            averageScore: avgScore,
            scoreDistribution: distribution
        };
    }, [sessions]);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalSessions}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {stats.completedSessions}
                        <span className="text-sm text-muted-foreground ml-2">
                            ({Math.round(stats.completedSessions / stats.totalSessions * 100)}%)
                        </span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {stats.averageScore.toFixed(1)}%
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Score Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={60}>
                        <BarChart data={stats.scoreDistribution}>
                            <Bar dataKey="count" fill="#4f46e5" />
                            <Tooltip />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};