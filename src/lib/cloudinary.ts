import { v2 as cloudinary } from 'cloudinary';

// Only configure Cloudinary on the server side
if (typeof window === 'undefined') {
  // Configure Cloudinary with environment variables
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export interface CloudinaryUploadResult {
  url: string;
  public_id: string;
  width: number;
  height: number;
}

/**
 * Uploads an image file to Cloudinary
 * @param file The image file to upload
 * @returns Promise with upload result containing URL and metadata
 */
export async function uploadImageToCloudinary(file: File): Promise<CloudinaryUploadResult> {
  // This function should only run on the server side
  if (typeof window !== 'undefined') {
    throw new Error('Cloudinary upload must be called on the server side');
  }
  
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'dieta-evolution-photos',
        upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
          });
        } else {
          reject(new Error('Upload failed with no result'));
        }
      }
    );
    
    // Convert file to stream and pipe to Cloudinary
    const reader = new FileReader();
    reader.onload = () => {
      const buffer = Buffer.from(reader.result as ArrayBuffer);
      uploadStream.end(buffer);
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Deletes an image from Cloudinary
 * @param publicId The public ID of the image to delete
 * @returns Promise that resolves when deletion is complete
 */
export async function deleteImageFromCloudinary(publicId: string): Promise<void> {
  // This function should only run on the server side
  if (typeof window !== 'undefined') {
    throw new Error('Cloudinary delete must be called on the server side');
  }
  
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}