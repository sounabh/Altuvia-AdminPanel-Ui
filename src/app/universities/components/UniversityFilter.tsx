// components/university/UniversityFilters.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Search } from "lucide-react";
import { UniversityFilters } from "../types/university";

interface UniversityFiltersProps {
  filters: UniversityFilters;                        // Current filter values
  onFiltersChange: (filters: UniversityFilters) => void; // Callback to update filters
  countries: string[];                               // List of available countries for selection
}

/**
 * UniversityFiltersComponent
 * --------------------------
 * UI component for filtering university listings.
 * Includes:
 * - Search input
 * - Country dropdown
 * - Featured-only checkbox
 */
export function UniversityFiltersComponent({
  filters,
  onFiltersChange,
  countries,
}: UniversityFiltersProps) {

  /**
   * Handles updating the search term
   */
  const handleSearchChange = (searchTerm: string) => {
    onFiltersChange({ ...filters, searchTerm });
  };

  /**
   * Handles updating the selected country
   */
  const handleCountryChange = (selectedCountry: string) => {
    onFiltersChange({ ...filters, selectedCountry });
  };

  /**
   * Handles toggling the featured-only filter
   */
  const handleFeaturedToggle = (showFeaturedOnly: boolean) => {
    onFiltersChange({ ...filters, showFeaturedOnly });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Search Input */}
          <div>
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Search universities..."
                value={filters.searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Country Selector */}
          <div>
            <Label htmlFor="country">Country</Label>
            <Select
              value={filters.selectedCountry}
              onValueChange={handleCountryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All countries" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="">All countries</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Featured Checkbox */}
          <div className="flex items-center space-x-2 pt-6">
            <Checkbox
              id="featured"
              checked={filters.showFeaturedOnly}
              onCheckedChange={(checked) => handleFeaturedToggle(checked === true)}
            />
            <Label htmlFor="featured">Featured only</Label>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
