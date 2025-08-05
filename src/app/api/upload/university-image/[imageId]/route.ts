// app/api/upload/university-image/[imageId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { imageId: string } }
) {
  try {
    const { imageId } = params;

    if (!imageId) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    // Get image details from database
    const image = await prisma.universityImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Extract public_id from Cloudinary URL
    const publicId = extractPublicIdFromUrl(image.imageUrl);

    // Delete from Cloudinary
    try {
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (cloudinaryError) {
      console.error('Error deleting from Cloudinary:', cloudinaryError);
      // Continue with database deletion even if Cloudinary fails
    }

    // Delete from database
    await prisma.universityImage.delete({
      where: { id: imageId },
    });

    // If this was the primary image, set another image as primary
    if (image.isPrimary) {
      const remainingImages = await prisma.universityImage.findFirst({
        where: { universityId: image.universityId },
        orderBy: { displayOrder: 'asc' },
      });

      if (remainingImages) {
        await prisma.universityImage.update({
          where: { id: remainingImages.id },
          data: { isPrimary: true },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}

// Helper function to extract public_id from Cloudinary URL
function extractPublicIdFromUrl(url: string): string | null {
  try {
    const urlParts = url.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    
    if (uploadIndex === -1) return null;
    
    // Get everything after /upload/v{version}/
    const publicIdWithExtension = urlParts.slice(uploadIndex + 2).join('/');
    
    // Remove file extension
    const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, '');
    
    return publicId;
  } catch (error) {
    console.error('Error extracting public_id:', error);
    return null;
  }
}