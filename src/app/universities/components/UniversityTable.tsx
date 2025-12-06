/* eslint-disable @typescript-eslint/no-unused-vars */
// components/university/UniversityTable.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Edit, 
  Trash2, 
  Star, 
  StarOff, 
  MoreHorizontal, 
  ExternalLink,
  Image as ImageIcon,
  MapPin,
  DollarSign,
  Calendar,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { University } from "../types/university";

interface UniversityTableProps {
  universities: University[];
  onEdit: (university: University) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onManageImages?: (university: University) => void;
}

export function UniversityTable({ 
  universities, 
  onEdit, 
  onDelete, 
  onToggleFeatured,
  onManageImages
}: UniversityTableProps) {
  
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<keyof University>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleSort = (field: keyof University) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedUniversities = [...universities].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    if (aValue instanceof Date && bValue instanceof Date) {
      return sortDirection === 'asc' 
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }

    return 0;
  });

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number | null, currency: string = 'USD') => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getImageCount = (university: University) => {
    return university.images?.length || 0;
  };

  const getPrimaryImage = (university: University) => {
    return university.images?.find(img => img.isPrimary);
  };

  if (universities.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No universities found matching your criteria.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Universities ({universities.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {sortedUniversities.map((university) => {
              const primaryImage = getPrimaryImage(university);
              const imageCount = getImageCount(university);
              const isExpanded = expandedRows.has(university.id);
              
              return (
                <div key={university.id} className="p-4 hover:bg-gray-50">
                  {/* Main Row */}
                  <div className="flex items-start gap-4">
                    {/* Image */}
                    <div className="flex-shrink-0">
                      {primaryImage ? (
                        <img
                          src={primaryImage.imageUrl}
                          alt={primaryImage.imageAltText}
                          className="w-16 h-16 object-cover rounded-lg"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          {/* Title and Status */}
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{university.universityName}</h3>
                            {university.isFeatured && (
                              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            )}
                          </div>

                          {/* Location */}
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <MapPin className="h-3 w-3 mr-1" />
                            {university.city}
                            {university.state && `, ${university.state}`}
                            {university.country && `, ${university.country}`}
                          </div>

                          {/* Description */}
                          <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                            {university.shortDescription || 'No description'}
                          </p>

                          {/* Quick Info - Always Visible */}
                          <div className="flex flex-wrap items-center gap-3 text-sm">
                            {/* Status Badge */}
                            <Badge variant={university.isActive ? 'default' : 'secondary'}>
                              {university.isActive ? 'Active' : 'Inactive'}
                            </Badge>

                            {/* Tuition */}
                            <div className="flex items-center text-gray-600">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {formatCurrency(Number(university.tuitionFees), university.currency)}
                            </div>

                            {/* Image Count */}
                            <div className="flex items-center text-gray-600">
                              <ImageIcon className="h-3 w-3 mr-1" />
                              {imageCount} image{imageCount !== 1 ? 's' : ''}
                            </div>

                            {/* Website Link */}
                            {university.websiteUrl && (
                              <a
                                href={university.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-600 hover:text-blue-800"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Website
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRowExpansion(university.id)}
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onEdit(university)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onToggleFeatured(university.id)}>
                                {university.isFeatured ? (
                                  <StarOff className="h-4 w-4 mr-2 text-yellow-500" />
                                ) : (
                                  <Star className="h-4 w-4 mr-2" />
                                )}
                                {university.isFeatured ? 'Unfeature' : 'Feature'}
                              </DropdownMenuItem>
                              {onManageImages && (
                                <DropdownMenuItem onClick={() => onManageImages(university)}>
                                  <ImageIcon className="h-4 w-4 mr-2" />
                                  Manage Images
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => onDelete(university.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-4 pl-20 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                      {/* Rankings */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Rankings</h4>
                        <div className="space-y-1">
                          {university.ftGlobalRanking && (
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">FT Global:</span> #{university.ftGlobalRanking}
                            </div>
                          )}
                          {university.qsRanking && (
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">QS World:</span> #{university.qsRanking}
                            </div>
                          )}
                          {university.usNewsRanking && (
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">US News:</span> #{university.usNewsRanking}
                            </div>
                          )}
                          {!university.ftGlobalRanking && !university.qsRanking && !university.usNewsRanking && (
                            <div className="text-sm text-gray-400">No rankings available</div>
                          )}
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Additional Information</h4>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-3 w-3 mr-2" />
                            <span className="font-medium mr-1">Created:</span> {formatDate(university.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}