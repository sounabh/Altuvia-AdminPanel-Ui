// components/university/UniversityTable.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Edit, Trash2, Star, MapPin, DollarSign } from "lucide-react";

import { University } from "../types/university";

interface UniversityTableProps {
  universities: University[]; // List of universities to display
  onEdit: (university: University) => void; // Callback to edit university
  onDelete: (id: string) => void; // Callback to delete university
  onToggleFeatured: (id: string) => void; // Callback to toggle featured status
}

/**
 * UniversityTable
 * ----------------
 * Displays university information in a table format with actions.
 * Shows name, location, rankings, cost, status, and allows edit/feature/delete.
 */
export function UniversityTable({
  universities,
  onEdit,
  onDelete,
  onToggleFeatured,
}: UniversityTableProps) {
  /**
   * Formats cost into a readable currency string
   */
  const formatCurrency = (amount: number | undefined, currency: string) => {
    if (!amount) return "N/A";
    return `${amount.toLocaleString()} ${currency}`;
  };

  /**
   * Returns badges for available rankings
   */
  const getRankingBadges = (university: University) => {
    const badges = [];

    if (university.ftGlobalRanking) {
      badges.push(
        <Badge key="ft" variant="outline">
          FT #{university.ftGlobalRanking}
        </Badge>
      );
    }

    if (university.qsRanking) {
      badges.push(
        <Badge key="qs" variant="outline">
          QS #{university.qsRanking}
        </Badge>
      );
    }

    if (university.usNewsRanking) {
      badges.push(
        <Badge key="us" variant="outline">
          US #{university.usNewsRanking}
        </Badge>
      );
    }

    return badges;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Universities ({universities.length})</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>University</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Rankings</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {universities.map((university) => (
              <TableRow key={university.id}>
                {/* University Name and Short Description */}
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {university.universityName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {university.shortDescription}
                    </div>
                  </div>
                </TableCell>

                {/* Location with Icon */}
                <TableCell>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>
                      {university.city}
                      {university.state && `, ${university.state}`},{" "}
                      {university.country}
                    </span>
                  </div>
                </TableCell>

                {/* Ranking Badges */}
                <TableCell>
                  <div className="space-y-1">
                    {getRankingBadges(university)}
                  </div>
                </TableCell>

                {/* Cost Display */}
                <TableCell>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span>
                      {formatCurrency(
                        university.totalCost ?? undefined, // Convert null to undefined
                        university.currency
                      )}
                    </span>
                  </div>
                </TableCell>

                {/* Status and Featured Badge */}
                <TableCell>
                  <div className="flex space-x-2">
                    <Badge
                      variant={university.isActive ? "default" : "secondary"}
                    >
                      {university.isActive ? "Active" : "Inactive"}
                    </Badge>

                    {university.isFeatured && (
                      <Badge variant="outline">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </TableCell>

                {/* Action Buttons */}
                <TableCell>
                  <div className="flex space-x-2">
                    {/* Edit Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(university)}
                      title="Edit university"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    {/* Toggle Featured Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onToggleFeatured(university.id)}
                      title="Toggle featured status"
                    >
                      <Star
                        className={`h-4 w-4 ${
                          university.isFeatured
                            ? "fill-current text-yellow-500"
                            : ""
                        }`}
                      />
                    </Button>

                    {/* Delete Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(university.id)}
                      title="Delete university"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
