// components/university/UniversityTable.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
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
  Calendar
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
  
  const [sortField, setSortField] = useState<keyof University>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

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
    <Card>
      <CardHeader>
        <CardTitle>
          Universities ({universities.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Image</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('universityName')}
                >
                  University Name
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('city')}
                >
                  Location
                </TableHead>
                <TableHead className="text-center">Rankings</TableHead>
                <TableHead className="text-center">Fees</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Images</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('createdAt')}
                >
                  Created
                </TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUniversities.map((university) => {
                const primaryImage = getPrimaryImage(university);
                const imageCount = getImageCount(university);
                
                return (
                  <TableRow key={university.id} className="hover:bg-gray-50">
                    {/* Primary Image */}
                    <TableCell>
                      {primaryImage ? (
                        <img
                          src={primaryImage.imageUrl}
                          alt={primaryImage.imageAltText}
                          className="w-12 h-12 object-cover rounded"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <ImageIcon className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                    </TableCell>

                    {/* University Name */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{university.universityName}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {university.shortDescription || 'No description'}
                        </div>
                        {university.websiteUrl && (
                          <a
                            href={university.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Website
                          </a>
                        )}
                      </div>
                    </TableCell>

                    {/* Location */}
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                        <div>
                          {university.city}
                          {university.state && `, ${university.state}`}
                          {university.country && `, ${university.country}`}
                        </div>
                      </div>
                    </TableCell>

                    {/* Rankings */}
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        {university.ftGlobalRanking && (
                          <Badge variant="outline" className="text-xs">
                            FT: #{university.ftGlobalRanking}
                          </Badge>
                        )}
                        {university.qsRanking && (
                          <Badge variant="outline" className="text-xs">
                            QS: #{university.qsRanking}
                          </Badge>
                        )}
                        {university.usNewsRanking && (
                          <Badge variant="outline" className="text-xs">
                            US: #{university.usNewsRanking}
                          </Badge>
                        )}
                        {!university.ftGlobalRanking && !university.qsRanking && !university.usNewsRanking && (
                          <span className="text-gray-400 text-xs">No rankings</span>
                        )}
                      </div>
                    </TableCell>

                    {/* Fees */}
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center text-sm">
                        <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                        <span>
                          {formatCurrency(Number(university.tuitionFees), university.currency)}
                        </span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="text-center">
                      <div className="flex justify-center space-x-2">
                        <Badge variant={university.isActive ? 'default' : 'secondary'}>
                          {university.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        {university.isFeatured && (
                          <Badge variant="outline">
                            <Star className="h-3 w-3 mr-1 fill-current text-yellow-500" />
                            Featured
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    {/* Images */}
                    <TableCell className="text-center">
                      <Badge variant="secondary">
                        {imageCount} image{imageCount !== 1 ? 's' : ''}
                      </Badge>
                    </TableCell>

                    {/* Created */}
                    <TableCell className="text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                        {formatDate(university.createdAt)}
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-center">
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
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}