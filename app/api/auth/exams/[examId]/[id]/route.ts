// app/api/auth/exams/[examId]/[id]/route.ts

import prismaDb from "@/app/libs/prismaDb";
import { authOptions } from "@/app/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { examId: string; id: string } }
) {
    try {
        const { examId, id } = params;

        if (!examId) {
            return NextResponse.json({ error: "Exam ID is required" }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if the exam exists and is owned by the user
        const exam = await prismaDb.exam.findUnique({
            where: {
                id: examId,
                userId: session.user.id
            }
        });

        if (!exam) {
            return NextResponse.json({ error: "Exam not found or unauthorized" }, { status: 404 });
        }

        // Delete a specific question within the exam
        const question = await prismaDb.question.findUnique({
            where: {
                id: id,
                examId: examId
            }
        });

        if (!question) {
            return NextResponse.json({ error: "Question not found" }, { status: 404 });
        }

        await prismaDb.question.delete({
            where: { id }
        });

        return NextResponse.json(
            { success: true, message: "Question deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error processing deletion:", error);
        return NextResponse.json(
            { error: "Failed to process deletion request" },
            { status: 500 }
        );
    }
}
//update
export async function PUT(
    req: NextRequest,
    { params }: { params: { examId: string; id: string } }
) {
    try {
        const { examId, id } = params;
        const body = await req.json();
        const { text, options, correctAnswers, time, image } = body;

        if (!examId) {
            return NextResponse.json({ error: "Exam ID is required" }, { status: 400 });
        }

        // Validate required fields
        if (!text || !options || !correctAnswers) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Validate options and correct answers
        if (options.length < 2) {
            return NextResponse.json(
                { error: "At least two options are required" },
                { status: 400 }
            );
        }

        if (correctAnswers.length < 1) {
            return NextResponse.json(
                { error: "At least one correct answer is required" },
                { status: 400 }
            );
        }

        // Validate that all correct answers are valid indices
        if (correctAnswers.some((index: number) => index >= options.length)) {
            return NextResponse.json(
                { error: "Invalid correct answer index" },
                { status: 400 }
            );
        }

        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if the exam exists and is owned by the user
        const exam = await prismaDb.exam.findUnique({
            where: {
                id: examId,
                userId: session.user.id
            }
        });

        if (!exam) {
            return NextResponse.json(
                { error: "Exam not found or unauthorized" },
                { status: 404 }
            );
        }

        // Check if the question exists and belongs to the exam
        const existingQuestion = await prismaDb.question.findUnique({
            where: {
                id: id,
                examId: examId
            }
        });

        if (!existingQuestion) {
            return NextResponse.json(
                { error: "Question not found" },
                { status: 404 }
            );
        }

        // Update the question
        const updatedQuestion = await prismaDb.question.update({
            where: { id },
            data: {
                text,
                options,
                correctAnswers,
                timeLimit: time || 30, // Default to 30 seconds if not provided
                image: image || null
            }
        });

        return NextResponse.json(updatedQuestion, { status: 200 });
    } catch (error) {
        console.error("Error updating question:", error);
        return NextResponse.json(
            { error: "Failed to update question" },
            { status: 500 }
        );
    }
}