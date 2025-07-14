/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { revalidatePath } from "next/cache";

import { z } from "zod";

// Database imports - using both Drizzle and Prisma approaches

import { prisma } from "@/lib/prisma";






// Type imports
import { UniversityImage, UniversityFormData,University } from "../types/university";

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

/*const uploadImageSchema = z.object({
  universityId: z.string().min(1, "University ID is required"),
  imageFile: z.instanceof(File).refine(
    (file) => file.size <= 5 * 1024 * 1024,
    "File size must be less than 5MB"
  ).refine(
    (file) => file.type.startsWith("image/"),
    "File must be an image"
  ),
  imageType: z.enum(["campus", "building", "classroom", "library", "dormitory", "recreation", "laboratory", "other"]).optional(),
  imageTitle: z.string().optional(),
  imageAltText: z.string().optional(),
  imageCaption: z.string().optional(),
  isPrimary: z.boolean().optional(),
});

const updateImageSchema = z.object({
  id: z.string().min(1, "Image ID is required"),
  universityId: z.string().min(1, "University ID is required"),
  imageType: z.enum(["campus", "building", "classroom", "library", "dormitory", "recreation", "laboratory", "other"]).optional(),
  imageTitle: z.string().optional(),
  imageAltText: z.string().optional(),
  imageCaption: z.string().optional(),
  isPrimary: z.boolean().optional(),
});

const deleteImageSchema = z.object({
  id: z.string().min(1, "Image ID is required"),
  universityId: z.string().min(1, "University ID is required"),
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
  } catch (error) {
    console.error('Error fetching universities:', error);
    throw new Error('Failed to fetch universities');
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
 * Upload a new university image
 * Handles file upload to S3 and database record creation
 * Automatically sets as primary if it's the first image
 */
/*export async function uploadUniversityImage(formData: FormData) {
  try {
    const imageFile = formData.get("file") as File;
    const universityId = formData.get("universityId") as string;
    const imageType = formData.get("imageType") as string || "other";
    const imageTitle = formData.get("imageTitle") as string || imageFile.name;
    const imageAltText = formData.get("imageAltText") as string || imageFile.name;
    const imageCaption = formData.get("imageCaption") as string || "";
    const isPrimary = formData.get("isPrimary") === "true";

    // Validate input
    const validatedFields = uploadImageSchema.parse({
      universityId,
      imageFile,
      imageType,
      imageTitle,
      imageAltText,
      imageCaption,
      isPrimary,
    });

    // Get current images count for display order
    const existingImages = await db
      .select()
      .from(universityImages)
      .where(eq(universityImages.universityId, universityId))
      .orderBy(desc(universityImages.displayOrder));

    const nextDisplayOrder = existingImages.length > 0 
      ? existingImages[0].displayOrder + 1 
      : 0;

    // Upload file to S3
    const fileExtension = imageFile.name.split('.').pop();
    const fileName = `universities/${universityId}/images/${Date.now()}.${fileExtension}`;
    const imageUrl = await uploadFileToS3(imageFile, fileName);

    // If this is set as primary, update existing primary images
    if (isPrimary) {
      await db
        .update(universityImages)
        .set({ isPrimary: false })
        .where(
          and(
            eq(universityImages.universityId, universityId),
            eq(universityImages.isPrimary, true)
          )
        );
    }

    // Insert new image record
    const [newImage] = await db
      .insert(universityImages)
      .values({
        universityId,
        imageUrl,
        imageType: imageType as any,
        imageTitle,
        imageAltText,
        imageCaption,
        isPrimary: isPrimary || existingImages.length === 0, // First image is primary
        displayOrder: nextDisplayOrder,
      })
      .returning();

    revalidatePath(`/admin/universities/${universityId}`);
    revalidatePath(`/admin/universities`);

    return {
      success: true,
      image: newImage,
      message: "Image uploaded successfully",
    };

  } catch (error) {
    console.error("Error uploading university image:", error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        details: error.errors,
      };
    }

    return {
      success: false,
      error: "Failed to upload image",
    };
  }
}

/**
 * Update university image details
 * Updates metadata without changing the actual image file
 */
/*export async function updateUniversityImage(data: {
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
    const existingImage = await db
      .select()
      .from(universityImages)
      .where(
        and(
          eq(universityImages.id, validatedFields.id),
          eq(universityImages.universityId, validatedFields.universityId)
        )
      )
      .limit(1);

    if (existingImage.length === 0) {
      return {
        success: false,
        error: "Image not found",
      };
    }

    // If setting as primary, update other images
    if (validatedFields.isPrimary) {
      await db
        .update(universityImages)
        .set({ isPrimary: false })
        .where(
          and(
            eq(universityImages.universityId, validatedFields.universityId),
            eq(universityImages.isPrimary, true)
          )
        );
    }

    // Update image
    const [updatedImage] = await db
      .update(universityImages)
      .set({
        imageType: validatedFields.imageType as any,
        imageTitle: validatedFields.imageTitle,
        imageAltText: validatedFields.imageAltText,
        imageCaption: validatedFields.imageCaption,
        isPrimary: validatedFields.isPrimary,
        updatedAt: new Date(),
      })
      .where(eq(universityImages.id, validatedFields.id))
      .returning();

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
        details: error.errors,
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
 * Removes image from both S3 and database
 * Automatically promotes another image to primary if needed
 */
/*export async function deleteUniversityImage(data: {
  id: string;
  universityId: string;
}) {
  try {
    // Validate input
    const validatedFields = deleteImageSchema.parse(data);

    // Get image details for S3 deletion
    const imageToDelete = await db
      .select()
      .from(universityImages)
      .where(
        and(
          eq(universityImages.id, validatedFields.id),
          eq(universityImages.universityId, validatedFields.universityId)
        )
      )
      .limit(1);

    if (imageToDelete.length === 0) {
      return {
        success: false,
        error: "Image not found",
      };
    }

    // Delete from S3
    try {
      await deleteFileFromS3(imageToDelete[0].imageUrl);
    } catch (s3Error) {
      console.error("Error deleting from S3:", s3Error);
      // Continue with DB deletion even if S3 fails
    }

    // Delete from database
    await db
      .delete(universityImages)
      .where(eq(universityImages.id, validatedFields.id));

    // If this was the primary image, set another image as primary
    if (imageToDelete[0].isPrimary) {
      const remainingImages = await db
        .select()
        .from(universityImages)
        .where(eq(universityImages.universityId, validatedFields.universityId))
        .orderBy(asc(universityImages.displayOrder))
        .limit(1);

      if (remainingImages.length > 0) {
        await db
          .update(universityImages)
          .set({ isPrimary: true })
          .where(eq(universityImages.id, remainingImages[0].id));
      }
    }

    revalidatePath(`/admin/universities/${validatedFields.universityId}`);
    revalidatePath(`/admin/universities`);

    return {
      success: true,
      message: "Image deleted successfully",
    };

  } catch (error) {
    console.error("Error deleting university image:", error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        details: error.errors,
      };
    }

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
/*export async function reorderUniversityImages(data: {
  universityId: string;
  imageOrders: Array<{ id: string; displayOrder: number }>;
}) {
  try {
    // Validate input
    const validatedFields = reorderImagesSchema.parse(data);

    // Update display orders in batch
    const updatePromises = validatedFields.imageOrders.map(({ id, displayOrder }) =>
      db
        .update(universityImages)
        .set({ 
          displayOrder,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(universityImages.id, id),
            eq(universityImages.universityId, validatedFields.universityId)
          )
        )
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
        details: error.errors,
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
/*export async function getUniversityImages(universityId: string): Promise<UniversityImage[]> {
  try {
    const images = await db
      .select()
      .from(universityImages)
      .where(eq(universityImages.universityId, universityId))
      .orderBy(asc(universityImages.displayOrder));

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
/*export async function setPrimaryUniversityImage(data: {
  id: string;
  universityId: string;
}) {
  try {
    const validatedFields = z.object({
      id: z.string().min(1),
      universityId: z.string().min(1),
    }).parse(data);

    // Reset all images to non-primary
    await db
      .update(universityImages)
      .set({ isPrimary: false })
      .where(eq(universityImages.universityId, validatedFields.universityId));

    // Set the selected image as primary
    await db
      .update(universityImages)
      .set({ 
        isPrimary: true,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(universityImages.id, validatedFields.id),
          eq(universityImages.universityId, validatedFields.universityId)
        )
      );

    revalidatePath(`/admin/universities/${validatedFields.universityId}`);
    revalidatePath(`/admin/universities`);

    return {
      success: true,
      message: "Primary image updated successfully",
    };

  } catch (error) {
    console.error("Error setting primary image:", error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        details: error.errors,
      };
    }

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