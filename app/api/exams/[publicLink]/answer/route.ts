// Answer Submission (/api/exam/[publicLink]/answer):

// Saves individual answers
// Handles both navigation modes
// Calculates score when exam is completed
// Respects showResults setting
// Provides progress information
// /api/exam/[publicLink]/answer/route.ts
import { NextResponse } from 'next/server';
import prismaDb from '@/app/libs/prismaDb';

export async function POST(
    request: Request,
    { params }: { params: { publicLink: string } }
) {
    try {
        const body = await request.json();

        // Handle both single answer and array of answers
        const answers = Array.isArray(body) ? body : [body];

        if (answers.length === 0) {
            return NextResponse.json(
                { error: 'No answers provided' },
                { status: 400 }
            );
        }

        const sessionId = answers[0].sessionId;

        // Verify session and exam
        const session = await prismaDb.examSession.findUnique({
            where: { id: sessionId },
            include: { exam: true },
        });

        if (!session || session.completed) {
            return NextResponse.json(
                { error: 'Invalid or completed session' },
                { status: 400 }
            );
        }

        // Process each answer
        const savedAnswers = await Promise.all(
            answers.map(async (answerData) => {
                const { questionId, selectedOptions, timeSpent } = answerData;

                // First try to find an existing answer
                const existingAnswer = await prismaDb.answer.findFirst({
                    where: {
                        sessionId,
                        questionId,
                    },
                });

                if (existingAnswer) {
                    // Update existing answer
                    return await prismaDb.answer.update({
                        where: {
                            id: existingAnswer.id,
                        },
                        data: {
                            selectedOptions,
                            timeSpent,
                        },
                    });
                } else {
                    // Create new answer
                    return await prismaDb.answer.create({
                        data: {
                            sessionId,
                            questionId,
                            selectedOptions,
                            timeSpent,
                        },
                    });
                }
            })
        );

        // Check if exam is completed
        const answeredQuestions = await prismaDb.answer.count({
            where: { sessionId },
        });

        const totalQuestions = await prismaDb.question.count({
            where: { examId: session.exam.id },
        });

        const isCompleted = answeredQuestions === totalQuestions;

        if (isCompleted) {
            // Get all answers and questions for scoring
            const allAnswers = await prismaDb.answer.findMany({
                where: { sessionId },
            });

            const questions = await prismaDb.question.findMany({
                where: {
                    id: {
                        in: allAnswers.map(a => a.questionId)
                    }
                }
            });

            let correctAnswers = 0;
            allAnswers.forEach((answer) => {
                const question = questions.find(q => q.id === answer.questionId);
                if (question) {
                    const isCorrect = JSON.stringify(answer.selectedOptions.sort()) ===
                        JSON.stringify(question.correctAnswers.sort());
                    if (isCorrect) correctAnswers++;
                }
            });

            const score = (correctAnswers / totalQuestions) * 100;

            // Update session with score
            await prismaDb.examSession.update({
                where: { id: sessionId },
                data: {
                    completed: true,
                    score,
                    endTime: new Date(),
                },
            });

            if (session.exam.showResults) {
                return NextResponse.json({
                    completed: true,
                    score,
                    passed: score >= session.exam.passPercent,
                    answersSubmitted: savedAnswers.length,
                });
            }

            return NextResponse.json({
                completed: true,
                message: 'Exam completed successfully',
                answersSubmitted: savedAnswers.length,
            });
        }

        return NextResponse.json({
            saved: true,
            isCompleted,
            answersSubmitted: savedAnswers.length,
            remainingQuestions: totalQuestions - answeredQuestions,
        });

    } catch (error) {
        console.error('Answer submission error:', error);
        return NextResponse.json(
            { error: 'Failed to submit answer', details: error.message },
            { status: 500 }
        );
    }
}