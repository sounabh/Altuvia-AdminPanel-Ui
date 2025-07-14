/* eslint-disable @typescript-eslint/no-unused-vars */
// components/university/UniversityImageManager.tsx
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Upload, 
  X, 
  Star, 
  Edit, 
  Save, 
  ArrowUp, 
  ArrowDown, 
  Image as ImageIcon,
 
} from "lucide-react";
import { UniversityImage } from "../types/university";
import { toast } from "sonner";

interface UniversityImageManagerProps {
  universityId: string;
  images: UniversityImage[];
  onImagesChange: (images: UniversityImage[]) => void;
}

interface ImageFormData {
  id?: string;
  imageUrl: string;
  imageType: string;
  imageTitle: string;
  imageAltText: string;
  imageCaption: string;
  isPrimary: boolean;
  displayOrder: number;
}

/**
 * Component for managing university images
 * Handles upload, editing, reordering, and deletion of university images
 */
export function UniversityImageManager({ 
  universityId, 
  images, 
  onImagesChange 
}: UniversityImageManagerProps) {
  
  const [editingImage, setEditingImage] = useState<ImageFormData | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const imageTypes = [
    { value: "campus", label: "Campus" },
    { value: "building", label: "Building" },
    { value: "classroom", label: "Classroom" },
    { value: "library", label: "Library" },
    { value: "dormitory", label: "Dormitory" },
    { value: "recreation", label: "Recreation" },
    { value: "laboratory", label: "Laboratory" },
    { value: "other", label: "Other" },
  ];

  /**
   * Handle file upload
   */
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);
      
      // Create FormData for upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('universityId', universityId);
      
      // Call your upload API endpoint
      const response = await fetch('/api/upload/university-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { imageUrl } = await response.json();
      
      // Create new image entry
      const newImage: UniversityImage = {
        id: `temp-${Date.now()}`, // Temporary ID
        universityId,
        imageUrl,
        imageType: "other",
        imageTitle: file.name,
        imageAltText: file.name,
        imageCaption: "",
        isPrimary: images.length === 0, // First image is primary
        displayOrder: images.length,
        createdAt: new Date(),
        fileSize: file.size,
        width: null,  
        height: null,
        university: undefined, // Will be populated later
      };

      onImagesChange([...images, newImage]);
      toast.success("Image uploaded successfully");
      
    } catch (error) {
      toast.error("Failed to upload image");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Start editing an image
   */
  const startEditingImage = (image: UniversityImage) => {
    setEditingImage({
      id: image.id,
      imageUrl: image.imageUrl,
      imageType: image.imageType || "other",
      imageTitle: image.imageTitle || "",
      imageAltText: image.imageAltText,
      imageCaption: image.imageCaption || "",
      isPrimary: image.isPrimary,
      displayOrder: image.displayOrder,
    });
  };

  /**
   * Save edited image
   */
  const saveEditedImage = () => {
    if (!editingImage) return;

    const updatedImages = images.map(img => 
      img.id === editingImage.id ? {
        ...img,
        imageType: editingImage.imageType,
        imageTitle: editingImage.imageTitle,
        imageAltText: editingImage.imageAltText,
        imageCaption: editingImage.imageCaption,
        isPrimary: editingImage.isPrimary,
        displayOrder: editingImage.displayOrder,
      } : img
    );

    // Ensure only one primary image
    if (editingImage.isPrimary) {
      updatedImages.forEach(img => {
        if (img.id !== editingImage.id) {
          img.isPrimary = false;
        }
      });
    }

    onImagesChange(updatedImages);
    setEditingImage(null);
    toast.success("Image updated successfully");
  };

  /**
   * Delete an image
   */
  const deleteImage = (imageId: string) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    onImagesChange(updatedImages);
    toast.success("Image deleted successfully");
  };

  /**
   * Set image as primary
   */
  const setPrimaryImage = (imageId: string) => {
    const updatedImages = images.map(img => ({
      ...img,
      isPrimary: img.id === imageId,
    }));
    onImagesChange(updatedImages);
    toast.success("Primary image updated");
  };

  /**
   * Move image up in display order
   */
  const moveImageUp = (imageId: string) => {
    const imageIndex = images.findIndex(img => img.id === imageId);
    if (imageIndex > 0) {
      const updatedImages = [...images];
      [updatedImages[imageIndex], updatedImages[imageIndex - 1]] = 
      [updatedImages[imageIndex - 1], updatedImages[imageIndex]];
      
      // Update display orders
      updatedImages.forEach((img, index) => {
        img.displayOrder = index;
      });
      
      onImagesChange(updatedImages);
    }
  };

  /**
   * Move image down in display order
   */
  const moveImageDown = (imageId: string) => {
    const imageIndex = images.findIndex(img => img.id === imageId);
    if (imageIndex < images.length - 1) {
      const updatedImages = [...images];
      [updatedImages[imageIndex], updatedImages[imageIndex + 1]] = 
      [updatedImages[imageIndex + 1], updatedImages[imageIndex]];
      
      // Update display orders
      updatedImages.forEach((img, index) => {
        img.displayOrder = index;
      });
      
      onImagesChange(updatedImages);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          University Images ({images.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        
        {/* Upload Section */}
        <div className="mb-6">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? "Uploading..." : "Upload Image"}
          </Button>
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <Card key={image.id} className="relative">
              <CardContent className="p-4">
                
                {/* Image */}
                <div className="relative mb-3">
                  <img
                    src={image.imageUrl}
                    alt={image.imageAltText}
                    className="w-full h-32 object-cover rounded"
                  />
                  
                  {/* Primary Badge */}
                  {image.isPrimary && (
                    <Badge className="absolute top-2 left-2">
                      <Star className="h-3 w-3 mr-1" />
                      Primary
                    </Badge>
                  )}
                  
                  {/* Type Badge */}
                  {image.imageType && (
                    <Badge variant="secondary" className="absolute top-2 right-2">
                      {image.imageType}
                    </Badge>
                  )}
                </div>

                {/* Image Info */}
                <div className="mb-3">
                  <p className="font-medium text-sm truncate">
                    {image.imageTitle || "Untitled"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {image.imageCaption || "No caption"}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center">
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEditingImage(image)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    
                    {!image.isPrimary && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPrimaryImage(image.id)}
                      >
                        <Star className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveImageUp(image.id)}
                      disabled={images.findIndex(img => img.id === image.id) === 0}
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveImageDown(image.id)}
                      disabled={images.findIndex(img => img.id === image.id) === images.length - 1}
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteImage(image.id)}
                    >
                      <X className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Images Message */}
        {images.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No images uploaded yet. Click Upload Image to add your first image.</p>
          </div>
        )}

        {/* Edit Image Modal */}
        {editingImage && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Edit Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="imageTitle">Image Title</Label>
                  <Input
                    id="imageTitle"
                    value={editingImage.imageTitle}
                    onChange={(e) => setEditingImage({
                      ...editingImage,
                      imageTitle: e.target.value,
                    })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="imageType">Image Type</Label>
                  <Select
                    value={editingImage.imageType}
                    onValueChange={(value) => setEditingImage({
                      ...editingImage,
                      imageType: value,
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {imageTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="imageAltText">Alt Text</Label>
                <Input
                  id="imageAltText"
                  value={editingImage.imageAltText}
                  onChange={(e) => setEditingImage({
                    ...editingImage,
                    imageAltText: e.target.value,
                  })}
                  placeholder="Describe the image for accessibility"
                />
              </div>

              <div>
                <Label htmlFor="imageCaption">Caption</Label>
                <Textarea
                  id="imageCaption"
                  value={editingImage.imageCaption}
                  onChange={(e) => setEditingImage({
                    ...editingImage,
                    imageCaption: e.target.value,
                  })}
                  placeholder="Optional caption for the image"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPrimary"
                  checked={editingImage.isPrimary}
                  onCheckedChange={(checked) => setEditingImage({
                    ...editingImage,
                    isPrimary: checked as boolean,
                  })}
                />
                <Label htmlFor="isPrimary">Set as primary image</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingImage(null)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={saveEditedImage}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}