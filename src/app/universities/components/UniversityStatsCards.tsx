// components/university/UniversityStatsCards.tsx

import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Star, Award, Globe } from "lucide-react";

interface UniversityStatsProps {
  stats: {
    total: number;       // Total number of universities
    featured: number;    // Number of featured universities
    active: number;      // Number of active universities
    countries: number;   // Number of represented countries
  };
}

/**
 * UniversityStatsCards
 * ---------------------
 * Displays key university metrics as individual statistic cards.
 * Includes:
 * - Total universities
 * - Featured universities
 * - Active universities
 * - Total countries represented
 */
export function UniversityStatsCards({ stats }: UniversityStatsProps) {
  // Array of stat items with title, value, icon, and color
  const statItems = [
    {
      title: "Total Universities",
      value: stats.total,
      icon: GraduationCap,
      color: "text-blue-500",
    },
    {
      title: "Featured",
      value: stats.featured,
      icon: Star,
      color: "text-yellow-500",
    },
    {
      title: "Active",
      value: stats.active,
      icon: Award,
      color: "text-green-500",
    },
    {
      title: "Countries",
      value: stats.countries,
      icon: Globe,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {statItems.map((item) => (
        <Card key={item.title}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              
              {/* Stat Title and Value */}
              <div>
                <p className="text-sm text-gray-600">{item.title}</p>
                <p className="text-2xl font-bold">{item.value}</p>
              </div>

              {/* Stat Icon */}
              <item.icon className={`h-8 w-8 ${item.color}`} />

            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
