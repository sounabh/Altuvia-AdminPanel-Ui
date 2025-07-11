"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Eye,
  Mail,
  Phone,
  User,
  GraduationCap,
  MapPin,
  Calendar,
  CreditCard,
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country: string;
  gpa: number;
  testScore: number;
  testType: string;
  applications: number;
  subscriptionPlan: "free" | "premium" | "pro";
  registrationDate: string;
  lastActive: string;
  status: "active" | "inactive";
}

const mockStudents: Student[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1-555-0123",
    country: "United States",
    gpa: 3.8,
    testScore: 1450,
    testType: "SAT",
    applications: 5,
    subscriptionPlan: "premium",
    registrationDate: "2024-01-15",
    lastActive: "2024-02-20",
    status: "active",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1-555-0124",
    country: "Canada",
    gpa: 3.9,
    testScore: 320,
    testType: "GRE",
    applications: 8,
    subscriptionPlan: "pro",
    registrationDate: "2024-01-20",
    lastActive: "2024-02-21",
    status: "active",
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    country: "China",
    gpa: 3.7,
    testScore: 110,
    testType: "TOEFL",
    applications: 3,
    subscriptionPlan: "free",
    registrationDate: "2024-02-01",
    lastActive: "2024-02-19",
    status: "active",
  },
  {
    id: "4",
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    phone: "+44-20-7946-0958",
    country: "United Kingdom",
    gpa: 3.6,
    testScore: 1380,
    testType: "SAT",
    applications: 6,
    subscriptionPlan: "premium",
    registrationDate: "2024-01-10",
    lastActive: "2024-02-18",
    status: "active",
  },
  {
    id: "5",
    name: "Rajesh Patel",
    email: "rajesh.patel@email.com",
    country: "India",
    gpa: 3.85,
    testScore: 7.5,
    testType: "IELTS",
    applications: 4,
    subscriptionPlan: "premium",
    registrationDate: "2024-01-25",
    lastActive: "2024-02-17",
    status: "active",
  },
];

const getSubscriptionBadge = (plan: string) => {
  const variants = {
    free: "secondary",
    premium: "default",
    pro: "destructive",
  } as const;

  return (
    <Badge variant={variants[plan as keyof typeof variants] || "secondary"}>
      {plan.charAt(0).toUpperCase() + plan.slice(1)}
    </Badge>
  );
};

export default function StudentManagement() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterPlan, setFilterPlan] = useState("");

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry =
      filterCountry === "all" ||
      !filterCountry ||
      student.country === filterCountry;
    const matchesPlan =
      filterPlan === "all" ||
      !filterPlan ||
      student.subscriptionPlan === filterPlan;

    return matchesSearch && matchesCountry && matchesPlan;
  });

  const countries = [...new Set(students.map((student) => student.country))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Student Management
          </h1>
          <p className="text-gray-500">
            Manage student profiles and subscriptions
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Students
            </CardTitle>
            <User className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {students.length.toLocaleString()}
            </div>
            <div className="text-xs text-green-600">+12.5% from last month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Premium Users
            </CardTitle>
            <CreditCard className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {students.filter((s) => s.subscriptionPlan !== "free").length}
            </div>
            <div className="text-xs text-green-600">+8.3% from last month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Applications
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {students.reduce((sum, s) => sum + s.applications, 0)}
            </div>
            <div className="text-xs text-green-600">+15.2% from last month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Countries
            </CardTitle>
            <MapPin className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {countries.length}
            </div>
            <div className="text-xs text-green-600">Global reach</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search students by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={filterCountry} onValueChange={setFilterCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select value={filterPlan} onValueChange={setFilterPlan}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Students ({filteredStudents.length})</CardTitle>
          <CardDescription>Overview of all registered students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Academic Info</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Registration</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {student.email}
                        </div>
                        {student.phone && (
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {student.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        {student.country}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">GPA: {student.gpa}</div>
                        <div className="text-sm text-gray-500">
                          {student.testType}: {student.testScore}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {student.applications} active
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getSubscriptionBadge(student.subscriptionPlan)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                        {new Date(
                          student.registrationDate
                        ).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500">
                        {new Date(student.lastActive).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4" />
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
