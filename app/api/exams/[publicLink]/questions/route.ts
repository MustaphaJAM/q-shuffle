import prismaDb from '@/app/libs/prismaDb';
import { NextResponse } from 'next/server';
// Question Retrieval (/api/exam/[publicLink]/questions):
// If navigation is allowed: returns all questions
// If navigation is not allowed: returns only the next unanswered question
// Handles session validation
// Excludes correct answers from response for security
export async function GET(request: Request, { params }: { params: { publicLink: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Verify session exists and is not completed
    const session = await prismaDb.examSession.findUnique({
      where: { id: sessionId },
      include: { exam: true },
    });

    if (!session || session.completed) {
      return NextResponse.json({ error: 'Invalid or completed session' }, { status: 400 });
    }

    // Get exam questions based on navigation setting
    const exam = await prismaDb.exam.findFirst({
      where: {
        publicLink: params.publicLink,
        publicActive: true,
      },
      include: {
        questions: {
          select: {
            id: true,
            text: true,
            options: true,
            image: true,
            timeLimit: true,
          },
        },
      },
    });

    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    // If navigation is not allowed, return only unanswered questions
    if (!exam.allowNavigation) {
      const answeredQuestions = await prismaDb.answer.findMany({
        where: { sessionId },
        select: { questionId: true },
      });

      const answeredIds = answeredQuestions.map((q) => q.questionId);
      const nextQuestion = exam.questions.find((q) => !answeredIds.includes(q.id));

      return NextResponse.json({
        currentQuestion: nextQuestion || null,
        totalQuestions: exam.questions.length,
        answeredCount: answeredIds.length,
      });
    }

    // If navigation is allowed, return all questions
    return NextResponse.json({
      questions: exam.questions,
      totalQuestions: exam.questions.length,
    });
  } catch (error) {
    console.error('Questions fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}
