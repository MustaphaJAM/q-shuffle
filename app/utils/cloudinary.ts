// utils/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const base64Data = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64Data}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'exam-questions',
      resource_type: 'auto',
    });

    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image to bla');
  }
};

export const deleteFromCloudinary = async (url: string) => {
  try {
    // Extract public_id from the URL
    const publicId = url.split('/').slice(-1)[0].split('.')[0];
    await cloudinary.uploader.destroy(`exam-questions/${publicId}`);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
  }
};
