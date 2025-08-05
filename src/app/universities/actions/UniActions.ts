/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

// Type imports
import { UniversityImage, UniversityFormData, University } from "../types/university";

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

const updateImageSchema = z.object({
  id: z.string().min(1, "Image ID is required"),
  universityId: z.string().min(1, "University ID is required"),
  imageType: z.enum(["campus", "building", "classroom", "library", "dormitory", "recreation", "laboratory", "other"]).optional(),
  imageTitle: z.string().optional(),
  imageAltText: z.string().optional(),
  imageCaption: z.string().optional(),
  isPrimary: z.boolean().optional(),
});

const reorderImagesSchema = z.object({
  universityId: z.string().min(1, "University ID is required"),
  imageOrders: z.array(z.object({
    id: z.string(),
    displayOrder: z.number()
  }))
});

// =============================================================================
// UNIVERSITY CRUD OPERATIONS
// =============================================================================

/**
 * Get all universities with optional filtering
 * Returns universities with their primary images
 */
export async function getUniversities(): Promise<University[]> {
  try {
    const universities = await prisma.university.findMany({
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return universities;
  } catch (error: any) {
    console.error("🔴 Error fetching universities:", error);
    throw new Error("Failed to fetch universities");
  }
}

/**
 * Get university by ID with all related data
 * Includes all images ordered by display order
 */
export async function getUniversityById(id: string) {
  try {
    const university = await prisma.university.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    return university;
  } catch (error) {
    console.error('Error fetching university:', error);
    throw new Error('Failed to fetch university');
  }
}

/**
 * Create a new university
 * Automatically generates slug if not provided
 */
export async function createUniversity(data: UniversityFormData) {
  try {
    const university = await prisma.university.create({
      data: {
        ...data,
        slug: data.slug || generateSlug(data.universityName),
      },
    });

    revalidatePath('/admin/universities');
    return university;
  } catch (error) {
    console.error('Error creating university:', error);
    throw new Error('Failed to create university');
  }
}

/**
 * Update an existing university
 * Updates the updatedAt timestamp automatically
 */
export async function updateUniversity(id: string, data: UniversityFormData) {
  try {
    const university = await prisma.university.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    revalidatePath('/admin/universities');
    return university;
  } catch (error) {
    console.error('Error updating university:', error);
    throw new Error('Failed to update university');
  }
}

/**
 * Delete a university
 * Note: This will cascade delete related images if foreign key constraints are set
 */
export async function deleteUniversity(id: string) {
  try {
    // First, delete all associated images from Cloudinary
    const images = await prisma.universityImage.findMany({
      where: { universityId: id },
    });

    // Delete images from Cloudinary
    for (const image of images) {
      try {
        const publicId = extractPublicIdFromUrl(image.imageUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (cloudinaryError) {
        console.error('Error deleting image from Cloudinary:', cloudinaryError);
      }
    }

    // Delete university (this will cascade delete images due to foreign key)
    await prisma.university.delete({
      where: { id },
    });

    revalidatePath('/admin/universities');
    return { success: true };
  } catch (error) {
    console.error('Error deleting university:', error);
    throw new Error('Failed to delete university');
  }
}

/**
 * Toggle featured status of a university
 * Switches between featured and non-featured state
 */
export async function toggleUniversityFeatured(id: string) {
  try {
    const university = await prisma.university.findUnique({
      where: { id },
      select: { isFeatured: true },
    });

    if (!university) {
      throw new Error('University not found');
    }

    const updatedUniversity = await prisma.university.update({
      where: { id },
      data: { isFeatured: !university.isFeatured },
    });

    revalidatePath('/admin/universities');
    return updatedUniversity;
  } catch (error) {
    console.error('Error toggling featured status:', error);
    throw new Error('Failed to update featured status');
  }
}

// =============================================================================
// UNIVERSITY IMAGE OPERATIONS
// =============================================================================

/**
 * Update university image details
 * Updates metadata without changing the actual image file
 */
export async function updateUniversityImage(data: {
  id: string;
  universityId: string;
  imageType?: string;
  imageTitle?: string;
  imageAltText?: string;
  imageCaption?: string;
  isPrimary?: boolean;
}) {
  try {
    // Validate input
    const validatedFields = updateImageSchema.parse(data);

    // Check if image exists
    const existingImage = await prisma.universityImage.findFirst({
      where: {
        id: validatedFields.id,
        universityId: validatedFields.universityId,
      },
    });

    if (!existingImage) {
      return {
        success: false,
        error: "Image not found",
      };
    }

    // If setting as primary, update other images
    if (validatedFields.isPrimary) {
      await prisma.universityImage.updateMany({
        where: {
          universityId: validatedFields.universityId,
          isPrimary: true,
        },
        data: { isPrimary: false },
      });
    }

    // Update image
    const updatedImage = await prisma.universityImage.update({
      where: { id: validatedFields.id },
      data: {
        imageType: validatedFields.imageType as any,
        imageTitle: validatedFields.imageTitle,
        imageAltText: validatedFields.imageAltText,
        imageCaption: validatedFields.imageCaption,
        isPrimary: validatedFields.isPrimary,
       
      },
    });

    revalidatePath(`/admin/universities/${validatedFields.universityId}`);
    revalidatePath(`/admin/universities`);

    return {
      success: true,
      image: updatedImage,
      message: "Image updated successfully",
    };

  } catch (error) {
    console.error("Error updating university image:", error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        details: error,
      };
    }

    return {
      success: false,
      error: "Failed to update image",
    };
  }
}

/**
 * Delete university image
 * Removes image from both Cloudinary and database
 * Automatically promotes another image to primary if needed
 */
export async function deleteUniversityImage(imageId: string, universityId: string) {
  try {
    // Get image details
    const imageToDelete = await prisma.universityImage.findFirst({
      where: {
        id: imageId,
        universityId: universityId,
      },
    });

    if (!imageToDelete) {
      return {
        success: false,
        error: "Image not found",
      };
    }

    // Delete from Cloudinary
    try {
      const publicId = extractPublicIdFromUrl(imageToDelete.imageUrl);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (cloudinaryError) {
      console.error("Error deleting from Cloudinary:", cloudinaryError);
      // Continue with DB deletion even if Cloudinary fails
    }

    // Delete from database
    await prisma.universityImage.delete({
      where: { id: imageId },
    });

    // If this was the primary image, set another image as primary
    if (imageToDelete.isPrimary) {
      const remainingImages = await prisma.universityImage.findFirst({
        where: { universityId: universityId },
        orderBy: { displayOrder: 'asc' },
      });

      if (remainingImages) {
        await prisma.universityImage.update({
          where: { id: remainingImages.id },
          data: { isPrimary: true },
        });
      }
    }

    revalidatePath(`/admin/universities/${universityId}`);
    revalidatePath(`/admin/universities`);

    return {
      success: true,
      message: "Image deleted successfully",
    };

  } catch (error) {
    console.error("Error deleting university image:", error);
    
    return {
      success: false,
      error: "Failed to delete image",
    };
  }
}

/**
 * Reorder university images
 * Updates display order for multiple images in batch
 */
export async function reorderUniversityImages(data: {
  universityId: string;
  imageOrders: Array<{ id: string; displayOrder: number }>;
}) {
  try {
    // Validate input
    const validatedFields = reorderImagesSchema.parse(data);

    // Update display orders in batch
    const updatePromises = validatedFields.imageOrders.map(({ id, displayOrder }) =>
      prisma.universityImage.update({
        where: {
          id,
          universityId: validatedFields.universityId,
        },
        data: { 
          displayOrder,
        
        },
      })
    );

    await Promise.all(updatePromises);

    revalidatePath(`/admin/universities/${validatedFields.universityId}`);
    revalidatePath(`/admin/universities`);

    return {
      success: true,
      message: "Images reordered successfully",
    };

  } catch (error) {
    console.error("Error reordering university images:", error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        details: error,
      };
    }

    return {
      success: false,
      error: "Failed to reorder images",
    };
  }
}

/**
 * Get university images
 * Returns all images for a university ordered by display order
 */
export async function getUniversityImages(universityId: string): Promise<UniversityImage[]> {
  try {
    const images = await prisma.universityImage.findMany({
      where: { universityId },
      orderBy: { displayOrder: 'asc' },
    });

    return images;
  } catch (error) {
    console.error("Error fetching university images:", error);
    return [];
  }
}

/**
 * Set primary image
 * Designates a specific image as the primary image for a university
 */
export async function setPrimaryUniversityImage(imageId: string, universityId: string) {
  try {
    // Reset all images to non-primary
    await prisma.universityImage.updateMany({
      where: { universityId },
      data: { isPrimary: false },
    });

    // Set the selected image as primary
    await prisma.universityImage.update({
      where: {
        id: imageId,
        universityId: universityId,
      },
      data: { 
        isPrimary: true,
       
      },
    });

    revalidatePath(`/admin/universities/${universityId}`);
    revalidatePath(`/admin/universities`);

    return {
      success: true,
      message: "Primary image updated successfully",
    };

  } catch (error) {
    console.error("Error setting primary image:", error);
    
    return {
      success: false,
      error: "Failed to set primary image",
    };
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Generate slug from university name
 * Converts name to URL-friendly format
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Extract public_id from Cloudinary URL
 */
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

/**
 * Get university statistics
 * Returns aggregated data for dashboard/analytics
 */
export async function getUniversityStats() {
  try {
    const [total, featured, active, countries] = await Promise.all([
      prisma.university.count(),
      prisma.university.count({ where: { isFeatured: true } }),
      prisma.university.count({ where: { isActive: true } }),
      prisma.university.findMany({
        select: { country: true },
        distinct: ['country'],
      }),
    ]);

    return {
      total,
      featured,
      active,
      countries: countries.length,
    };
  } catch (error) {
    console.error('Error fetching university stats:', error);
    throw new Error('Failed to fetch university statistics');
  }
}