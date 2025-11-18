import { NextRequest } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const { publicId } = await request.json();
    
    if (!publicId) {
      return new Response(
        JSON.stringify({ error: 'No publicId provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Delete from Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });

    return new Response(
      JSON.stringify({ success: true, result }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting image:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete image' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}