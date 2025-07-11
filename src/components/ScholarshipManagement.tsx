import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Plus, 
  Eye, 
  Edit,
  Award,
  DollarSign,
  Users,
  Calendar
} from "lucide-react";

interface Scholarship {
  id: string;
  name: string;
  university: string;
  amount: number;
  type: 'merit' | 'need' | 'sports' | 'academic';
  applicants: number;
  awarded: number;
  deadline: string;
  status: 'active' | 'closed' | 'upcoming';
}

const mockScholarships: Scholarship[] = [
  {
    id: '1',
    name: 'Excellence Merit Scholarship',
    university: 'Stanford University',
    amount: 50000,
    type: 'merit',
    applicants: 245,
    awarded: 12,
    deadline: '2024-03-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'Need-Based Financial Aid',
    university: 'MIT',
    amount: 35000,
    type: 'need',
    applicants: 189,
    awarded: 25,
    deadline: '2024-04-01',
    status: 'active'
  },
  {
    id: '3',
    name: 'International Student Grant',
    university: 'Harvard University',
    amount: 40000,
    type: 'academic',
    applicants: 312,
    awarded: 18,
    deadline: '2024-02-28',
    status: 'closed'
  },
  {
    id: '4',
    name: 'STEM Excellence Award',
    university: 'UC Berkeley',
    amount: 25000,
    type: 'academic',
    applicants: 156,
    awarded: 8,
    deadline: '2024-05-15',
    status: 'upcoming'
  }
];

const getTypeBadge = (type: string) => {
  const colors = {
    merit: 'bg-blue-100 text-blue-800',
    need: 'bg-green-100 text-green-800',
    sports: 'bg-orange-100 text-orange-800',
    academic: 'bg-purple-100 text-purple-800'
  };
  
  return (
    <Badge className={colors[type as keyof typeof colors] || colors.academic}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </Badge>
  );
};

const getStatusBadge = (status: string) => {
  const variants = {
    active: 'default',
    closed: 'destructive',
    upcoming: 'secondary'
  } as const;
  
  return (
    <Badge variant={variants[status as keyof typeof variants] || 'default'}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default function ScholarshipManagement() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [scholarships, setScholarships] = useState<Scholarship[]>(mockScholarships);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredScholarships = scholarships.filter(scholarship =>
    scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scholarship.university.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = scholarships.reduce((sum, s) => sum + s.amount, 0);
  const totalApplicants = scholarships.reduce((sum, s) => sum + s.applicants, 0);
  const totalAwarded = scholarships.reduce((sum, s) => sum + s.awarded, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Scholarship Management</h1>
          <p className="text-gray-500">Manage scholarships and financial aid programs</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Scholarship
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Scholarships</CardTitle>
            <Award className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{scholarships.length}</div>
            <div className="text-xs text-green-600">+3 new this month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${totalAmount.toLocaleString()}</div>
            <div className="text-xs text-green-600">Available funding</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Applicants</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalApplicants}</div>
            <div className="text-xs text-blue-600">+12% from last cycle</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Awarded</CardTitle>
            <Award className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalAwarded}</div>
            <div className="text-xs text-green-600">Success rate: {Math.round((totalAwarded / totalApplicants) * 100)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search scholarships by name or university..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Scholarships Table */}
      <Card>
        <CardHeader>
          <CardTitle>Scholarships ({filteredScholarships.length})</CardTitle>
          <CardDescription>
            Overview of all scholarship programs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scholarship</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Applicants</TableHead>
                  <TableHead>Awarded</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredScholarships.map((scholarship) => (
                  <TableRow key={scholarship.id}>
                    <TableCell>
                      <div className="font-medium">{scholarship.name}</div>
                    </TableCell>
                    <TableCell>{scholarship.university}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                        {scholarship.amount.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getTypeBadge(scholarship.type)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-gray-400" />
                        {scholarship.applicants}
                      </div>
                    </TableCell>
                    <TableCell>{scholarship.awarded}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                        {new Date(scholarship.deadline).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(scholarship.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
