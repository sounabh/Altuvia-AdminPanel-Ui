/* eslint-disable @typescript-eslint/no-unused-vars */
// app/admin/universities/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, RefreshCw, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UniversityForm } from "./components/UniversityForm";
import { UniversityTable } from "./components/UniversityTable";
import { UniversityStatsCards } from "./components/UniversityStatsCards";
import { UniversityFiltersComponent } from "./components/UniversityFilter";
import { DeleteConfirmationDialog } from "./components/DeleteDialog";
import { UniversityImageManager } from "./components/UniversityImageManager";
import { 
  getUniversities, 
  createUniversity, 
  updateUniversity, 
  deleteUniversity, 
  toggleUniversityFeatured,
  getUniversityStats,
  getUniversityImages 
} from "./actions/UniActions";
import { University, UniversityFormData, UniversityFilters, UniversityImage } from "./types/university";
import { toast } from "sonner";

/**
 * Main university management page
 * Handles CRUD operations for universities with filtering and stats
 */
export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    featured: 0,
    active: 0,
    countries: 0,
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<University | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [universityToDelete, setUniversityToDelete] = useState<string | null>(null);
  const [filters, setFilters] = useState<UniversityFilters>({
    searchTerm: "",
    selectedCountry: "",
    showFeaturedOnly: false,
  });

  // Image management state
  const [imageManagerOpen, setImageManagerOpen] = useState(false);
  const [selectedUniversityForImages, setSelectedUniversityForImages] = useState<University | null>(null);
  const [universityImages, setUniversityImages] = useState<UniversityImage[]>([]);

  /**
   * Load universities and stats on component mount
   */
  useEffect(() => {
    loadData();
  }, []);

  /**
   * Apply filters when universities or filters change
   */
  useEffect(() => {
    applyFilters();
  }, [universities, filters]);

  /**
   * Load universities and statistics
   */
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [universitiesData, statsData] = await Promise.all([
        getUniversities(),
        getUniversityStats(),
      ]);
      
      setUniversities(universitiesData);
      setStats(statsData);
    } catch (error) {
      toast.error("Failed to load universities");
      console.error("Error loading universities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Apply filters to universities list
   */
  const applyFilters = () => {
    let filtered = universities;

    // Apply search filter
    if (filters.searchTerm) {
      filtered = filtered.filter(university =>
        university.universityName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        university.city.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        university.country.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Apply country filter
    if (filters.selectedCountry) {
      filtered = filtered.filter(university =>
        university.country === filters.selectedCountry
      );
    }

    // Apply featured filter
    if (filters.showFeaturedOnly) {
      filtered = filtered.filter(university => university.isFeatured);
    }

    setFilteredUniversities(filtered);
  };

  /**
   * Get unique countries for filter dropdown
   */
  const getUniqueCountries = (): string[] => {
    const countries = universities.map(uni => uni.country);
    return [...new Set(countries)].sort();
  };

  /**
   * Open form for creating new university
   */
  const handleCreateUniversity = () => {
    setSelectedUniversity(undefined);
    setIsFormOpen(true);
  };

  /**
   * Open form for editing existing university
   */
  const handleEditUniversity = (university: University) => {
    setSelectedUniversity(university);
    setIsFormOpen(true);
  };

  /**
   * Handle form submission (create or update)
   */
  const handleSaveUniversity = async (data: UniversityFormData) => {
    try {
      if (selectedUniversity) {
        await updateUniversity(selectedUniversity.id, data);
      } else {
        await createUniversity(data);
      }
      
      await loadData(); // Refresh data
      setIsFormOpen(false);
      setSelectedUniversity(undefined);
    } catch (error) {
      throw error; // Let form handle the error
    }
  };

  /**
   * Handle delete confirmation
   */
  const handleDeleteUniversity = (id: string) => {
    setUniversityToDelete(id);
    setDeleteDialogOpen(true);
  };

  /**
   * Confirm university deletion
   */
  const confirmDelete = async () => {
    if (universityToDelete) {
      try {
        await deleteUniversity(universityToDelete);
        await loadData(); // Refresh data
        toast.success("University deleted successfully");
      } catch (error) {
        toast.error("Failed to delete university");
      } finally {
        setDeleteDialogOpen(false);
        setUniversityToDelete(null);
      }
    }
  };

  /**
   * Toggle featured status
   */
  const handleToggleFeatured = async (id: string) => {
    try {
      await toggleUniversityFeatured(id);
      await loadData(); // Refresh data
      toast.success("Featured status updated");
    } catch (error) {
      toast.error("Failed to update featured status");
    }
  };

  /**
   * Open image manager for a university
   */
  const handleManageImages = async (university: University) => {
    try {
      setSelectedUniversityForImages(university);
      const images = await getUniversityImages(university.id);
      setUniversityImages(images);
      setImageManagerOpen(true);
    } catch (error) {
      toast.error("Failed to load university images");
      console.error("Error loading images:", error);
    }
  };

  /**
   * Handle images change in manager
   */
  const handleImagesChange = (updatedImages: UniversityImage[]) => {
    setUniversityImages(updatedImages);
    // Also refresh the main universities list to update image counts
    loadData();
  };

  /**
   * Refresh data
   */
  const handleRefresh = () => {
    loadData();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Universities</h1>
          <p className="text-gray-600">Manage university information and settings</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleCreateUniversity}>
            <Plus className="h-4 w-4 mr-2" />
            Add University
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <UniversityStatsCards stats={stats} />

      {/* Filters */}
      <UniversityFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        countries={getUniqueCountries()}
      />

      {/* Universities Table */}
      <UniversityTable
        universities={filteredUniversities}
        onEdit={handleEditUniversity}
        onDelete={handleDeleteUniversity}
        onToggleFeatured={handleToggleFeatured}
        onManageImages={handleManageImages}
      />

      {/* University Form Modal */}
      <UniversityForm
        university={selectedUniversity}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedUniversity(undefined);
        }}
        onSave={handleSaveUniversity}
      />

      {/* Image Manager Modal */}
      <Dialog open={imageManagerOpen} onOpenChange={setImageManagerOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Manage Images - {selectedUniversityForImages?.universityName}
            </DialogTitle>
            <DialogDescription>
              Upload and manage images for this university
            </DialogDescription>
          </DialogHeader>

          {selectedUniversityForImages && (
            <UniversityImageManager
              universityId={selectedUniversityForImages.id}
              images={universityImages}
              onImagesChange={handleImagesChange}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete University"
        description="Are you sure you want to delete this university? This action cannot be undone."
      />
    </div>
  );
}