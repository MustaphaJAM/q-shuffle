import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prismaDb from '@/app/libs/prismaDb';
import { authOptions } from '@/app/utils/authOptions';

export async function GET(req: NextRequest, { params }: { params: { examId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify exam ownership
    const exam = await prismaDb.exam.findFirst({
      where: {
        id: params.examId,
        userId: session.user.id,
      },
    });

    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    const examSessions = await prismaDb.examSession.findMany({
      where: {
        examId: params.examId,
      },
      orderBy: {
        startTime: 'desc',
      },
    });

    return NextResponse.json(examSessions);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}
