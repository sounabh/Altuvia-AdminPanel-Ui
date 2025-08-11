/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/upload/syllabus/route.ts
import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const programId = formData.get('programId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!programId) {
      return NextResponse.json(
        { error: 'Program ID is required' },
        { status: 400 }
      );
    }

    // Validate file type (PDF only)
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'File must be a PDF' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit for PDFs)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Verify program exists
    const program = await prisma.program.findUnique({
      where: { id: programId },
      select: { 
        id: true, 
        programName: true, 
        university: { select: { universityName: true } } 
      }
    });

    if (!program) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a clean filename
    const sanitizedProgramName = program.programName
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase();

    const timestamp = Date.now();

    // Upload to Cloudinary with corrected configuration for PDF
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw', // Changed from 'raw' to 'auto' for better PDF handling
          folder: `syllabi/${programId}`,
          public_id: `${sanitizedProgramName}-syllabus-${timestamp}`,
          format: 'pdf', // Explicitly set format
         // flags: 'inline', // This helps with proper PDF downloading
          overwrite: true,
          invalidate: true,
          access_mode: 'public', // Ensure public access
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    });

    const cloudinaryResult = uploadResponse as any;

    console.log('Cloudinary upload successful:', {
      secure_url: cloudinaryResult.secure_url,
      public_id: cloudinaryResult.public_id,
      resource_type: cloudinaryResult.resource_type,
      format: cloudinaryResult.format
    });

    // Create or update syllabus record in database using upsert
    const syllabus = await prisma.syllabus.upsert({
      where: { programId },
      update: { 
        fileUrl: cloudinaryResult.secure_url,
        uploadedAt: new Date()
      },
      create: {
        programId,
        fileUrl: cloudinaryResult.secure_url,
        uploadedAt: new Date() // Add uploadedAt for new records
      },
    });

    return NextResponse.json({
      success: true,
      fileUrl: cloudinaryResult.secure_url,
      syllabus,
      message: 'Syllabus uploaded successfully',
      programInfo: {
        name: program.programName,
        university: program.university.universityName
      },
      debugInfo: {
        public_id: cloudinaryResult.public_id,
        resource_type: cloudinaryResult.resource_type,
        format: cloudinaryResult.format
      }
    });

  } catch (error) {
    console.error('Error uploading syllabus:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload syllabus',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const programId = searchParams.get('programId');

    if (!programId) {
      return NextResponse.json(
        { error: 'Program ID is required' },
        { status: 400 }
      );
    }

    // Get existing syllabus to extract Cloudinary public ID
    const existingSyllabus = await prisma.syllabus.findUnique({
      where: { programId }
    });

    if (!existingSyllabus) {
      return NextResponse.json(
        { error: 'Syllabus not found' },
        { status: 404 }
      );
    }

    // Extract public ID from Cloudinary URL for deletion
    const urlParts = existingSyllabus.fileUrl.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1) {
      throw new Error('Invalid Cloudinary URL format');
    }

    // Get everything after 'upload/v{version_number}/'
    const pathAfterVersion = urlParts.slice(uploadIndex + 2).join('/');
    // Remove file extension for public_id
    const publicId = pathAfterVersion.replace(/\.[^/.]+$/, '');

    console.log('Attempting to delete from Cloudinary:', { publicId });

    // Delete from Cloudinary - use 'auto' resource type for PDFs uploaded with 'auto'
    try {
      const deleteResult = await cloudinary.uploader.destroy(publicId, { 
        resource_type: 'image', // Try 'image' first as 'auto' uploads are stored as 'image' type
        invalidate: true 
      });
      
      // If that fails, try with 'raw'
      if (deleteResult.result !== 'ok') {
        const deleteResultRaw = await cloudinary.uploader.destroy(publicId, { 
          resource_type: 'raw',
          invalidate: true 
        });
        console.log('Cloudinary delete result (raw):', deleteResultRaw);
      } else {
        console.log('Cloudinary delete result (image):', deleteResult);
      }
    } catch (cloudinaryError) {
      console.error('Error deleting from Cloudinary:', cloudinaryError);
      // Continue with database deletion even if Cloudinary deletion fails
    }

    // Delete from database
    await prisma.syllabus.delete({
      where: { programId }
    });

    return NextResponse.json({
      success: true,
      message: 'Syllabus deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting syllabus:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete syllabus',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}