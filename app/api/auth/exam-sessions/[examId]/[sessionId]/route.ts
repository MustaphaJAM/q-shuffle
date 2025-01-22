import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prismaDb from '@/app/libs/prismaDb';
import { authOptions } from '@/app/utils/authOptions';

export async function GET(
    req: NextRequest,
    { params }: { params: { sessionId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const examSession = await prismaDb.examSession.findUnique({
            where: {
                id: params.sessionId,
            },
            include: {
                exam: {
                    include: {
                        questions: true
                    }
                },
                answers: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            }
        });

        if (!examSession) {
            return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }

        if (examSession.exam.userId !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json(examSession);
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: "Failed to fetch session details" }, { status: 500 });
    }
}