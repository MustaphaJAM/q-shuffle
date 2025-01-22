export const SessionList = ({ sessions }: { sessions: Session[] }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Exam Sessions</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>CNE</TableHead>
                            <TableHead>Start Time</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sessions.map((session) => {
                            const startTime = new Date(session.startTime);
                            const endTime = session.endTime ? new Date(session.endTime) : null;
                            const duration = endTime
                                ? Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))
                                : null;

                            return (
                                <TableRow key={session.id}>
                                    <TableCell>
                                        {session.studentName} {session.studentSurname}
                                    </TableCell>
                                    <TableCell>{session.studentCNE}</TableCell>
                                    <TableCell>
                                        {startTime.toLocaleDateString()} {startTime.toLocaleTimeString()}
                                    </TableCell>
                                    <TableCell>
                                        {duration ? `${duration} mins` : 'In Progress'}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs 
                        ${session.completed
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {session.completed ? 'Completed' : 'In Progress'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {session.completed ? `${session.score?.toFixed(1)}%` : '-'}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
