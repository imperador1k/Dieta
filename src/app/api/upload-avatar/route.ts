import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToCloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    // For now, let's bypass Firebase Admin SDK verification and just upload the image
    // We'll rely on the client-side authentication for now
    
    console.log('=== Avatar Upload API Route Called ===');
    
    // Get the uploaded file
    let formData;
    try {
      console.log('Parsing form data...');
      formData = await request.formData();
      console.log('Form data parsed successfully');
    } catch (error) {
      console.error('Error parsing form data:', error);
      return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
    }
    
    const file = formData.get('file') as File | null;
    console.log('File received:', file ? `${file.name} (${file.size} bytes)` : 'No file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Upload to Cloudinary
    let uploadResult;
    try {
      console.log('Uploading file to Cloudinary:', file.name);
      uploadResult = await uploadImageToCloudinary(file);
      console.log('File uploaded successfully:', uploadResult.url);
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      return NextResponse.json({ error: `Failed to upload to Cloudinary: ${error instanceof Error ? error.message : 'Unknown error'}` }, { status: 500 });
    }

    console.log('Avatar upload completed successfully');
    return NextResponse.json({
      url: uploadResult.url,
      public_id: uploadResult.public_id
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return NextResponse.json({ error: `Failed to upload avatar: ${error instanceof Error ? error.message : 'Unknown error'}` }, { status: 500 });
  }
}