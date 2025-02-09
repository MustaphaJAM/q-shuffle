export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prismaDb from '@/app/libs/prismaDb';
import { authOptions } from '@/app/utils/authOptions';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const examsWithSessions = await prismaDb.exam.findMany({
      where: {
        userId: session.user.id,
        sessions: {
          some: {}, // Only get exams that have at least one session
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        published: true,
        createdAt: true,
        _count: {
          select: { sessions: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const transformedExams = examsWithSessions.map((exam) => ({
      id: exam.id,
      name: exam.name,
      description: exam.description,
      published: exam.published,
      sessionCount: exam._count.sessions,
    }));

    return NextResponse.json(transformedExams);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch exams' }, { status: 500 });
  }
}
