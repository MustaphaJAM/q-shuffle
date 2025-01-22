import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';
import { uploadToCloudinary } from '@/app/utils/cloudinary';

export async function POST(req: NextRequest) {
    console.log("API route hit"); // Debug log

    try {
        const session = await getServerSession(authOptions);
        console.log("Session:", session); // Debug log

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        console.log("FormData received"); // Debug log

        const file = formData.get('file') as File;
        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        console.log("File details:", {
            type: file.type,
            size: file.size
        }); // Debug log

        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: "File must be an image" }, { status: 400 });
        }

        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 });
        }

        const imageUrl = await uploadToCloudinary(file);
        return NextResponse.json({ url: imageUrl });
    } catch (error) {
        console.error('Error in upload route:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to upload file" },
            { status: 500 }
        );
    }
}