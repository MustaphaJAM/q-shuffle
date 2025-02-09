import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prismaDb from '@/app/libs/prismaDb';
import { authOptions } from '@/app/utils/authOptions';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Prisma } from '@prisma/client';

// Schema for exam validation
const examSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  duration: z.number().min(1, 'Duration must be greater than 0'),
  passPercent: z.number().min(0).max(100, 'Pass percentage must be between 0 and 100'),
  published: z.boolean().optional(),
  questions: z.array(z.any()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Log request start
    console.log('Starting exam creation process');

    // 2. Session validation
    const session = await getServerSession(authOptions);
    console.log('Session check:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: 'Unauthorized: No valid session found',
        },
        { status: 401 },
      );
    }

    // 3. Body parsing
    const body = await req.json();
    console.log('Request body:', {
      name: body.name,
      duration: body.duration,
      passPercent: body.passPercent,
      hasQuestions: !!body.questions,
    });

    // 4. Data validation
    const validatedData = examSchema.parse(body);

    // 5. Create base exam data
    const examData = {
      name: validatedData.name,
      description: validatedData.description,
      duration: validatedData.duration,
      passPercent: validatedData.passPercent,
      published: validatedData.published ?? false,
      allowNavigation: true,
      showResults: true,
      publicActive: false,
      publicLink: uuidv4(), // Assign a unique public link
      userId: session.user.id,
    };
    // 6. Attempt database operation
    console.log('Attempting to create exam with data:', examData);

    const exam = await prismaDb.exam.create({
      data: examData,
      include: {
        questions: true,
      },
    });

    console.log('Exam created successfully:', exam.id);

    return NextResponse.json(exam, { status: 201 });
  } catch (error) {
    console.error('Full error object:', error);

    // Handle Prisma-specific errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma error code:', error.code);
      console.error('Prisma error message:', error.message);

      // Handle specific Prisma error codes
      switch (error.code) {
        case 'P2002':
          return NextResponse.json(
            {
              error: 'A unique constraint failed',
              details: error.message,
            },
            { status: 409 },
          );
        case 'P2014':
          return NextResponse.json(
            {
              error: 'The change you are trying to make would violate the required relation',
              details: error.message,
            },
            { status: 400 },
          );
        case 'P2003':
          return NextResponse.json(
            {
              error: 'Foreign key constraint failed',
              details: error.message,
            },
            { status: 400 },
          );
        default:
          return NextResponse.json(
            {
              error: 'Database error',
              code: error.code,
              details: error.message,
            },
            { status: 500 },
          );
      }
    }

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400 },
      );
    }

    // Handle any other errors
    return NextResponse.json(
      {
        error: 'Failed to create exam',
        details: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.constructor.name : typeof error,
      },
      { status: 500 },
    );
  }
}

// GET endpoint remains the same but with added error logging
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    console.log(
      'GET - Session data:',
      JSON.stringify({
        userId: session?.user?.id,
        userEmail: session?.user?.email,
      }),
    );

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const exams = await prismaDb.exam.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        questions: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(exams);
  } catch (error) {
    console.error('Error fetching exams:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch exams',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
