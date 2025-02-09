import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';
import { z } from 'zod';
import prismaDb from '@/app/libs/prismaDb';

// Schema for question validation
const questionSchema = z.object({
  text: z.string().min(1, 'Question text is required'),
  options: z.array(z.string()).min(2, 'At least two options are required'),
  correctAnswers: z.array(z.number()).min(1, 'At least one correct answer is required'),
  time: z.number().min(1, 'Time must be greater than 0'),
  image: z.string().url().nullable().optional(),
});

// Schema for exam updates
const examUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(), // Optional but must have at least one character if provided
  name: z.string().min(1, 'Name is required').optional(), // Optional but must have at least one character if provided
  description: z.string().optional(), // Optional string for additional details
  published: z.boolean().optional(), // Optional boolean to indicate if the exam is published
  duration: z.number().min(1, 'Duration must be greater than 0').optional(), // Optional duration for the exam
  passPercent: z.number().min(0).max(100, 'Pass percentage must be between 0 and 100').optional(), // Optional passing percentage
  allowNavigation: z.boolean().optional(), // Optional flag for allowing navigation between questions
  showResults: z.boolean().optional(), // Optional flag for showing results after completion
  publicLink: z.string().url('Invalid URL').optional(), // Optional public link, must be a valid URL if provided
  publicActive: z.boolean().optional(), // Optional flag to indicate if the public link is active
});

// GET handler
export async function GET(req: NextRequest, { params }: { params: { examId: string } }) {
  try {
    if (!params.examId) {
      return NextResponse.json({ error: 'Exam ID is required' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const exam = await prismaDb.exam.findUnique({
      where: { id: params.examId },
      include: { questions: true },
    });

    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    if (exam.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json(exam);
  } catch (error) {
    console.error('Error fetching exam:', error);
    return NextResponse.json({ error: 'Failed to fetch exam' }, { status: 500 });
  }
}

// POST handler for adding questions
export async function POST(req: NextRequest, { params }: { params: { examId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const exam = await prismaDb.exam.findUnique({
      where: {
        id: params.examId,
        userId: session.user.id,
      },
    });

    if (!exam) {
      return NextResponse.json({ error: 'Exam not found or unauthorized' }, { status: 404 });
    }

    const body = await req.json();
    const validatedData = questionSchema.parse(body);

    const question = await prismaDb.question.create({
      data: {
        text: validatedData.text,
        options: validatedData.options,
        correctAnswers: validatedData.correctAnswers,
        timeLimit: validatedData.time,
        image: validatedData.image,
        examId: params.examId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        question,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }

    console.error('Error creating question:', error);
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
}

// Add DELETE handler
export async function DELETE(req: NextRequest, { params }: { params: { examId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const exam = await prismaDb.exam.findUnique({
      where: {
        id: params.examId,
        userId: session.user.id,
      },
    });

    if (!exam) {
      return NextResponse.json({ error: 'Exam not found or unauthorized' }, { status: 404 });
    }

    // Delete the exam and all related questions (assuming cascade delete is set up in your schema)
    await prismaDb.exam.delete({
      where: {
        id: params.examId,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting exam:', error);
    return NextResponse.json({ error: 'Failed to delete exam' }, { status: 500 });
  }
}

// Update PATCH handler to handle all fields
export async function PATCH(req: NextRequest, { params }: { params: { examId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const exam = await prismaDb.exam.findUnique({
      where: {
        id: params.examId,
        userId: session.user.id,
      },
    });

    if (!exam) {
      return NextResponse.json({ error: 'Exam not found or unauthorized' }, { status: 404 });
    }

    const body = await req.json();

    const validatedData = examUpdateSchema.parse(body);

    const updatedExam = await prismaDb.exam.update({
      where: {
        id: params.examId,
      },
      data: {
        ...validatedData,
        updatedAt: new Date(), // Ensure updatedAt is set
      },
    });

    return NextResponse.json(updatedExam);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }

    console.error('Error updating exam:', error);
    return NextResponse.json({ error: 'Failed to update exam' }, { status: 500 });
  }
}
