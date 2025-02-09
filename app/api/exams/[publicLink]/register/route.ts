import { NextResponse } from 'next/server';
import prismaDb from '@/app/libs/prismaDb';

// Student Registration (/api/exam/[publicLink]/register):
// Validates student information
// Creates an exam session
// Returns session ID and exam navigation settings

export async function POST(request: Request, { params }: { params: { publicLink: string } }) {
  try {
    const { studentName, studentSurname, studentCNE } = await request.json();

    // Validate student data
    if (!studentName || !studentSurname || !studentCNE) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check if exam exists and is active
    const exam = await prismaDb.exam.findFirst({
      where: {
        publicLink: params.publicLink,
        publicActive: true,
        published: true,
      },
    });

    if (!exam) {
      return NextResponse.json({ error: 'Exam not found or not available' }, { status: 404 });
    }

    // Create exam session
    const session = await prismaDb.examSession.create({
      data: {
        examId: exam.id,
        studentName,
        studentSurname,
        studentCNE,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      allowNavigation: exam.allowNavigation,
      duration: exam.duration,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to register for exam' }, { status: 500 });
  }
}
