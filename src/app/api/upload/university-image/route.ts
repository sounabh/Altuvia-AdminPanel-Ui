/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/upload/university-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const universityId = formData.get('universityId') as string;
    const imageType = formData.get('imageType') as string || 'other';
    const imageTitle = formData.get('imageTitle') as string || file.name;
    const imageAltText = formData.get('imageAltText') as string || file.name;
    const imageCaption = formData.get('imageCaption') as string || '';
    const isPrimary = Boolean(formData.get('isPrimary'));

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!universityId) {
      return NextResponse.json(
        { error: 'University ID is required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: `universities/${universityId}`,
          public_id: `${Date.now()}-${file.name.split('.')[0]}`,
          transformation: [
            { width: 1200, height: 800, crop: 'limit', quality: 'auto' },
            { format: 'auto' }
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    const cloudinaryResult = uploadResponse as any;

    // Get current images count for display order
    const existingImages = await prisma.universityImage.findMany({
      where: { universityId },
      orderBy: { displayOrder: 'desc' },
      take: 1,
    });

    const nextDisplayOrder = existingImages.length > 0 
      ? existingImages[0].displayOrder + 1 
      : 0;

    // If this is set as primary, update existing primary images
    if (isPrimary) {
      await prisma.universityImage.updateMany({
        where: {
          universityId,
          isPrimary: true,
        },
        data: { isPrimary: false },
      });
    }

    // Check if this is the first image (should be primary by default)
    const totalImages = await prisma.universityImage.count({
      where: { universityId },
    });

    const shouldBePrimary = isPrimary || totalImages === 0;

    // Create image record in database
    const newImage = await prisma.universityImage.create({
      data: {
        universityId,
        imageUrl: cloudinaryResult.secure_url,
        imageType: imageType as any,
        imageTitle,
        imageAltText,
        imageCaption,
        isPrimary: shouldBePrimary,
        displayOrder: nextDisplayOrder,
        fileSize: file.size,
        width: cloudinaryResult.width || null,
        height: cloudinaryResult.height || null,
      },
    });

    return NextResponse.json({
      success: true,
      imageUrl: cloudinaryResult.secure_url,
      image: newImage,
      message: 'Image uploaded successfully',
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}