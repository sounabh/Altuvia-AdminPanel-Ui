"use client"

import React, { useState, useEffect } from "react";
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
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Users,
  FileText,
  Target,
  GraduationCap,
  BookOpen,
  DollarSign,
  Activity,
  X,
  Save,
  Download,
  BarChart3,
} from "lucide-react";

// Mock data based on your Prisma schema
const mockAdmissions = [
  {
    id: "1",
    universityId: "u1",
    programId: "p1",
    universityName: "Stanford University",
    programName: "MS Computer Science",
    degreeType: "Masters",
    minimumGpa: 3.5,
    maximumGpa: 4.0,
    gmatMinScore: 650,
    gmatMaxScore: 800,
    gmatAverageScore: 720,
    greMinScore: 315,
    greMaxScore: 340,
    greAverageScore: 325,
    ieltsMinScore: 7.0,
    toeflMinScore: 100,
    applicationFee: 125,
    acceptanceRate: 15.5,
    totalApplications: 2450,
    totalAccepted: 380,
    statisticsYear: 2024,
    admissionStatus: "OPEN",
    isActive: true,
    intakes: [
      {
        id: "i1",
        intakeName: "Fall 2024",
        intakeType: "FALL",
        intakeYear: 2024,
        intakeMonth: 9,
        totalSeats: 120,
        availableSeats: 45,
        applicationOpenDate: "2024-01-15",
        applicationCloseDate: "2024-04-30",
        intakeStatus: "UPCOMING",
      },
      {
        id: "i2",
        intakeName: "Spring 2025",
        intakeType: "SPRING",
        intakeYear: 2025,
        intakeMonth: 1,
        totalSeats: 80,
        availableSeats: 65,
        applicationOpenDate: "2024-08-01",
        applicationCloseDate: "2024-11-15",
        intakeStatus: "UPCOMING",
      },
    ],
    deadlines: [
      {
        id: "d1",
        deadlineType: "APPLICATION",
        deadlineDate: "2024-04-30",
        title: "Application Deadline",
        priority: "HIGH",
      },
      {
        id: "d2",
        deadlineType: "DOCUMENT_SUBMISSION",
        deadlineDate: "2024-05-15",
        title: "Document Submission",
        priority: "HIGH",
      },
    ],
    createdAt: "2024-01-15",
    updatedAt: "2024-02-20",
  },
  {
    id: "2",
    universityId: "u2",
    programId: "p2",
    universityName: "MIT",
    programName: "MBA",
    degreeType: "Masters",
    minimumGpa: 3.0,
    maximumGpa: 4.0,
    gmatMinScore: 680,
    gmatMaxScore: 800,
    gmatAverageScore: 730,
    greMinScore: 320,
    greMaxScore: 340,
    greAverageScore: 330,
    ieltsMinScore: 7.5,
    toeflMinScore: 110,
    applicationFee: 200,
    acceptanceRate: 12.8,
    totalApplications: 3200,
    totalAccepted: 410,
    statisticsYear: 2024,
    admissionStatus: "OPEN",
    isActive: true,
    intakes: [
      {
        id: "i3",
        intakeName: "Fall 2024",
        intakeType: "FALL",
        intakeYear: 2024,
        intakeMonth: 9,
        totalSeats: 150,
        availableSeats: 30,
        applicationOpenDate: "2024-01-01",
        applicationCloseDate: "2024-04-15",
        intakeStatus: "ONGOING",
      },
    ],
    deadlines: [
      {
        id: "d3",
        deadlineType: "APPLICATION",
        deadlineDate: "2024-04-15",
        title: "Application Deadline",
        priority: "HIGH",
      },
    ],
    createdAt: "2024-01-10",
    updatedAt: "2024-02-18",
  },
  {
    id: "3",
    universityId: "u3",
    programId: "p3",
    universityName: "Harvard University",
    programName: "MS Data Science",
    degreeType: "Masters",
    minimumGpa: 3.3,
    maximumGpa: 4.0,
    gmatMinScore: 640,
    gmatMaxScore: 800,
    gmatAverageScore: 710,
    greMinScore: 310,
    greMaxScore: 340,
    greAverageScore: 320,
    ieltsMinScore: 6.5,
    toeflMinScore: 95,
    applicationFee: 150,
    acceptanceRate: 18.2,
    totalApplications: 1800,
    totalAccepted: 328,
    statisticsYear: 2024,
    admissionStatus: "CLOSED",
    isActive: false,
    intakes: [
      {
        id: "i4",
        intakeName: "Fall 2024",
        intakeType: "FALL",
        intakeYear: 2024,
        intakeMonth: 9,
        totalSeats: 100,
        availableSeats: 0,
        applicationOpenDate: "2024-01-01",
        applicationCloseDate: "2024-03-31",
        intakeStatus: "COMPLETED",
      },
    ],
    deadlines: [
      {
        id: "d4",
        deadlineType: "APPLICATION",
        deadlineDate: "2024-03-31",
        title: "Application Deadline",
        priority: "HIGH",
      },
    ],
    createdAt: "2024-01-08",
    updatedAt: "2024-03-31",
  },
];

const getStatusBadge = (status: string) => {
  const statusConfig = {
    OPEN: {
      variant: "default" as const,
      icon: CheckCircle,
      color: "text-green-500",
    },
    CLOSED: {
      variant: "destructive" as const,
      icon: XCircle,
      color: "text-red-500",
    },
    WAITLIST: {
      variant: "secondary" as const,
      icon: Clock,
      color: "text-orange-500",
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.OPEN;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className={`h-3 w-3 ${config.color}`} />
      {status}
    </Badge>
  );
};

const getIntakeStatusBadge = (status: string) => {
  const statusConfig = {
    UPCOMING: {
      variant: "secondary" as const,
      icon: Clock,
      color: "text-blue-500",
    },
    ONGOING: {
      variant: "default" as const,
      icon: Activity,
      color: "text-green-500",
    },
    COMPLETED: {
      variant: "outline" as const,
      icon: CheckCircle,
      color: "text-gray-500",
    },
    CANCELLED: {
      variant: "destructive" as const,
      icon: XCircle,
      color: "text-red-500",
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.UPCOMING;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className={`h-3 w-3 ${config.color}`} />
      {status}
    </Badge>
  );
};

export default function AdmissionsManagement() {
  const [admissions, setAdmissions] = useState(mockAdmissions);
  const [filteredAdmissions, setFilteredAdmissions] = useState(mockAdmissions);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [degreeFilter, setDegreeFilter] = useState("");
  const [activeView, setActiveView] = useState("overview");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedAdmission, setSelectedAdmission] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  // Filter admissions based on search and filters
  useEffect(() => {
    const filtered = admissions.filter((admission) => {
      const matchesSearch =
        admission.universityName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        admission.programName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        !statusFilter || admission.admissionStatus === statusFilter;
      const matchesDegree =
        !degreeFilter || admission.degreeType === degreeFilter;

      return matchesSearch && matchesStatus && matchesDegree;
    });
    setFilteredAdmissions(filtered);
  }, [searchTerm, statusFilter, degreeFilter, admissions]);

  // Calculate analytics
  const analytics = {
    totalAdmissions: admissions.length,
    openAdmissions: admissions.filter((a) => a.admissionStatus === "OPEN")
      .length,
    closedAdmissions: admissions.filter((a) => a.admissionStatus === "CLOSED")
      .length,
    averageAcceptanceRate: (
      admissions.reduce((sum, a) => sum + (a.acceptanceRate || 0), 0) /
      admissions.length
    ).toFixed(1),
    totalApplications: admissions.reduce(
      (sum, a) => sum + (a.totalApplications || 0),
      0
    ),
    totalSeats: admissions.reduce(
      (sum, a) =>
        sum +
        a.intakes.reduce(
          (intakeSum, intake) => intakeSum + (intake.totalSeats || 0),
          0
        ),
      0
    ),
    availableSeats: admissions.reduce(
      (sum, a) =>
        sum +
        a.intakes.reduce(
          (intakeSum, intake) => intakeSum + (intake.availableSeats || 0),
          0
        ),
      0
    ),
    averageGmatScore: (
      admissions.reduce((sum, a) => sum + (a.gmatAverageScore || 0), 0) /
      admissions.length
    ).toFixed(0),
    averageApplicationFee: (
      admissions.reduce((sum, a) => sum + (a.applicationFee || 0), 0) /
      admissions.length
    ).toFixed(0),
  };

  const handleDelete = (id: string) => {
    setAdmissions(admissions.filter((admission) => admission.id !== id));
  };

interface Intake {
  id: string;
  intakeName: string;
  intakeStatus: string; // or: "open" | "closed" | "upcoming"
  totalSeats: number;
  availableSeats: number;
  applicationOpenDate: string;
  applicationCloseDate: string;
}

interface Admission {
  id: string;
  programId: string;
  universityId: string;
  intakes: Intake[];
}


  const handleEdit = (admission: Admission) => {
    setSelectedAdmission(admission);
    setShowEditForm(true);
  };

  const handleView = (admission: Admission) => {
    setSelectedAdmission(admission);
    setActiveView("details");
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Admissions
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {analytics.totalAdmissions}
            </div>
            <div className="text-xs text-blue-600">Active programs</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Open Admissions
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {analytics.openAdmissions}
            </div>
            <div className="text-xs text-green-600">Currently accepting</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Avg Acceptance Rate
            </CardTitle>
            <Target className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {analytics.averageAcceptanceRate}%
            </div>
            <div className="text-xs text-orange-600">Across all programs</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Applications
            </CardTitle>
            <FileText className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {analytics.totalApplications.toLocaleString()}
            </div>
            <div className="text-xs text-purple-600">This year</div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Available Seats
            </CardTitle>
            <Users className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {analytics.availableSeats}
            </div>
            <div className="text-xs text-indigo-600">
              Out of {analytics.totalSeats} total
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Avg GMAT Score
            </CardTitle>
            <BookOpen className="h-4 w-4 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {analytics.averageGmatScore}
            </div>
            <div className="text-xs text-teal-600">Required minimum</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Avg Application Fee
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              ${analytics.averageApplicationFee}
            </div>
            <div className="text-xs text-green-600">USD</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Closed Admissions
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {analytics.closedAdmissions}
            </div>
            <div className="text-xs text-red-600">Past deadline</div>
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
                  placeholder="Search by university or program..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                  <SelectItem value="WAITLIST">Waitlist</SelectItem>
                </SelectContent>
              </Select>
              <Select value={degreeFilter} onValueChange={setDegreeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Degree" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Degrees</SelectItem>
                  <SelectItem value="Masters">Masters</SelectItem>
                  <SelectItem value="Bachelors">Bachelors</SelectItem>
                  <SelectItem value="PhD">PhD</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Admission
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Admissions Data ({filteredAdmissions.length})</CardTitle>
          <CardDescription>
            Manage admission requirements and intake information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>University & Program</TableHead>
                  <TableHead>Academic Requirements</TableHead>
                  <TableHead>Test Scores</TableHead>
                  <TableHead>Acceptance Rate</TableHead>
                  <TableHead>Intakes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdmissions.map((admission) => (
                  <TableRow key={admission.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {admission.universityName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {admission.programName}
                        </div>
                        <div className="text-xs text-gray-400">
                          {admission.degreeType}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          GPA: {admission.minimumGpa} - {admission.maximumGpa}
                        </div>
                        <div className="text-sm text-gray-500">
                          Fee: ${admission.applicationFee}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {admission.gmatAverageScore && (
                          <div className="text-sm">
                            GMAT: {admission.gmatAverageScore} avg
                          </div>
                        )}
                        {admission.greAverageScore && (
                          <div className="text-sm">
                            GRE: {admission.greAverageScore} avg
                          </div>
                        )}
                        <div className="text-sm text-gray-500">
                          IELTS: {admission.ieltsMinScore}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="text-lg font-semibold">
                          {admission.acceptanceRate}%
                        </div>
                        <div className="text-xs text-gray-500">
                          {admission.totalAccepted}/
                          {admission.totalApplications}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {admission.intakes.map((intake) => (
                          <div
                            key={intake.id}
                            className="flex items-center gap-2"
                          >
                            <div className="text-sm">{intake.intakeName}</div>
                            {getIntakeStatusBadge(intake.intakeStatus)}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(admission.admissionStatus)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(admission)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(admission)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(admission.id)}
                        >
                          <Trash2 className="h-4 w-4" />
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

  const renderDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => setActiveView("overview")}>
          ← Back to Overview
        </Button>
        <h2 className="text-2xl font-bold">Admission Details</h2>
      </div>

      {selectedAdmission && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    University
                  </label>
                  <p className="text-sm">{selectedAdmission.universityName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Program
                  </label>
                  <p className="text-sm">{selectedAdmission.programName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Degree Type
                  </label>
                  <p className="text-sm">{selectedAdmission.degreeType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Status
                  </label>
                  <div className="mt-1">
                    {getStatusBadge(selectedAdmission.admissionStatus)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Acceptance Rate
                </label>
                <p className="text-2xl font-bold text-blue-600">
                  {selectedAdmission.acceptanceRate}%
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Total Applications
                </label>
                <p className="text-lg font-semibold">
                  {selectedAdmission.totalApplications}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Total Accepted
                </label>
                <p className="text-lg font-semibold">
                  {selectedAdmission.totalAccepted}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Application Fee
                </label>
                <p className="text-lg font-semibold">
                  ${selectedAdmission.applicationFee}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Academic Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Academic Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    GPA Range
                  </label>
                  <p className="text-sm">
                    {selectedAdmission.minimumGpa} -{" "}
                    {selectedAdmission.maximumGpa}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    GMAT Score
                  </label>
                  <p className="text-sm">
                    {selectedAdmission.gmatMinScore} -{" "}
                    {selectedAdmission.gmatMaxScore}
                  </p>
                  <p className="text-xs text-gray-500">
                    Avg: {selectedAdmission.gmatAverageScore}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    GRE Score
                  </label>
                  <p className="text-sm">
                    {selectedAdmission.greMinScore} -{" "}
                    {selectedAdmission.greMaxScore}
                  </p>
                  <p className="text-xs text-gray-500">
                    Avg: {selectedAdmission.greAverageScore}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Language Tests
                  </label>
                  <p className="text-sm">
                    IELTS: {selectedAdmission.ieltsMinScore}
                  </p>
                  <p className="text-sm">
                    TOEFL: {selectedAdmission.toeflMinScore}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Intakes */}
          <Card>
            <CardHeader>
              <CardTitle>Intakes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedAdmission.intakes.map(
  (intake: {
    id: string;
    intakeName: string;
    intakeStatus: string;
    totalSeats: number;
    availableSeats: number;
    applicationOpenDate: string;
    applicationCloseDate: string;
  }) => (
    <div key={intake.id} className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium">{intake.intakeName}</h4>
        {getIntakeStatusBadge(intake.intakeStatus)}
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-600">Total Seats:</span>{" "}
          {intake.totalSeats}
        </div>
        <div>
          <span className="text-gray-600">Available:</span>{" "}
          {intake.availableSeats}
        </div>
        <div>
          <span className="text-gray-600">Opens:</span>{" "}
          {new Date(intake.applicationOpenDate).toLocaleDateString()}
        </div>
        <div>
          <span className="text-gray-600">Closes:</span>{" "}
          {new Date(intake.applicationCloseDate).toLocaleDateString()}
        </div>
      </div>
    </div>
  )
)}

              </div>
            </CardContent>
          </Card>

          {/* Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle>Important Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedAdmission.deadlines.map(
                  (deadline: {
                    id: string;
                    title: string;
                    deadlineType: string;
                    deadlineDate: string;
                    priority: string;
                  }) => (
                    <div
                      key={deadline.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{deadline.title}</p>
                        <p className="text-sm text-gray-500">
                          {deadline.deadlineType}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">
                          {new Date(deadline.deadlineDate).toLocaleDateString()}
                        </p>
                        <Badge
                          variant={
                            deadline.priority === "HIGH"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {deadline.priority}
                        </Badge>
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => setActiveView("overview")}>
          ← Back to Overview
        </Button>
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
      </div>

      {/* Advanced Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Admission Trends
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">+12.5%</div>
            <div className="text-xs text-green-600">From last year</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Seat Utilization
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(
                ((analytics.totalSeats - analytics.availableSeats) /
                  analytics.totalSeats) *
                  100
              )}
              %
            </div>
            <div className="text-xs text-blue-600">Seats occupied</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Revenue Potential
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              $
              {(
                analytics.totalApplications *
                parseFloat(analytics.averageApplicationFee)
              ).toLocaleString()}
            </div>
            <div className="text-xs text-green-600">Total application fees</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Admission Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Open</span>
                </div>
                <span className="text-sm font-medium">
                  {analytics.openAdmissions}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Closed</span>
                </div>
                <span className="text-sm font-medium">
                  {analytics.closedAdmissions}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Waitlist</span>
                </div>
                <span className="text-sm font-medium">
                  {
                    admissions.filter((a) => a.admissionStatus === "WAITLIST")
                      .length
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Score Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>GMAT Average</span>
                  <span>{analytics.averageGmatScore}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${
                        (parseInt(analytics.averageGmatScore) / 800) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>GRE Average</span>
                  <span>
                    {Math.round(
                      admissions.reduce(
                        (sum, a) => sum + (a.greAverageScore || 0),
                        0
                      ) / admissions.length
                    )}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${
                        (Math.round(
                          admissions.reduce(
                            (sum, a) => sum + (a.greAverageScore || 0),
                            0
                          ) / admissions.length
                        ) /
                          340) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>IELTS Average</span>
                  <span>
                    {(
                      admissions.reduce(
                        (sum, a) => sum + (a.ieltsMinScore || 0),
                        0
                      ) / admissions.length
                    ).toFixed(1)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{
                      width: `${
                        (admissions.reduce(
                          (sum, a) => sum + (a.ieltsMinScore || 0),
                          0
                        ) /
                          admissions.length /
                          9) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tables */}
      <Card>
        <CardHeader>
          <CardTitle>University Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>University</TableHead>
                  <TableHead>Total Programs</TableHead>
                  <TableHead>Open Programs</TableHead>
                  <TableHead>Avg Acceptance Rate</TableHead>
                  <TableHead>Total Applications</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from(
                  new Set(admissions.map((a) => a.universityName))
                ).map((university) => {
                  const universityAdmissions = admissions.filter(
                    (a) => a.universityName === university
                  );
                  const totalPrograms = universityAdmissions.length;
                  const openPrograms = universityAdmissions.filter(
                    (a) => a.admissionStatus === "OPEN"
                  ).length;
                  const avgAcceptanceRate = (
                    universityAdmissions.reduce(
                      (sum, a) => sum + a.acceptanceRate,
                      0
                    ) / totalPrograms
                  ).toFixed(1);
                  const totalApplications = universityAdmissions.reduce(
                    (sum, a) => sum + a.totalApplications,
                    0
                  );
                  const revenue = universityAdmissions.reduce(
                    (sum, a) => sum + a.totalApplications * a.applicationFee,
                    0
                  );

                  return (
                    <TableRow key={university}>
                      <TableCell className="font-medium">
                        {university}
                      </TableCell>
                      <TableCell>{totalPrograms}</TableCell>
                      <TableCell>{openPrograms}</TableCell>
                      <TableCell>{avgAcceptanceRate}%</TableCell>
                      <TableCell>
                        {totalApplications.toLocaleString()}
                      </TableCell>
                      <TableCell>${revenue.toLocaleString()}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export & Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Analytics
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Generate Report
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Advanced Charts
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCreateForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Create New Admission
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCreateForm(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  University Name
                </label>
                <Input placeholder="Enter university name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Program Name
                </label>
                <Input placeholder="Enter program name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Degree Type
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select degree type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bachelors">Bachelors</SelectItem>
                    <SelectItem value="Masters">Masters</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Admission Status
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                    <SelectItem value="WAITLIST">Waitlist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Minimum GPA
                </label>
                <Input type="number" step="0.1" placeholder="3.0" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Maximum GPA
                </label>
                <Input type="number" step="0.1" placeholder="4.0" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  GMAT Min Score
                </label>
                <Input type="number" placeholder="600" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  GMAT Max Score
                </label>
                <Input type="number" placeholder="800" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  GRE Min Score
                </label>
                <Input type="number" placeholder="310" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  GRE Max Score
                </label>
                <Input type="number" placeholder="340" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  IELTS Min Score
                </label>
                <Input type="number" step="0.5" placeholder="6.5" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  TOEFL Min Score
                </label>
                <Input type="number" placeholder="90" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Application Fee
                </label>
                <Input type="number" placeholder="150" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Acceptance Rate (%)
                </label>
                <Input type="number" step="0.1" placeholder="15.5" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Total Applications
                </label>
                <Input type="number" placeholder="2000" />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                Create Admission
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEditForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Edit Admission
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEditForm(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedAdmission && (
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    University Name
                  </label>
                  <Input defaultValue={selectedAdmission.universityName} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Program Name
                  </label>
                  <Input defaultValue={selectedAdmission.programName} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Degree Type
                  </label>
                  <Select defaultValue={selectedAdmission.degreeType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bachelors">Bachelors</SelectItem>
                      <SelectItem value="Masters">Masters</SelectItem>
                      <SelectItem value="PhD">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Admission Status
                  </label>
                  <Select defaultValue={selectedAdmission.admissionStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPEN">Open</SelectItem>
                      <SelectItem value="CLOSED">Closed</SelectItem>
                      <SelectItem value="WAITLIST">Waitlist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Minimum GPA
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    defaultValue={selectedAdmission.minimumGpa}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Maximum GPA
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    defaultValue={selectedAdmission.maximumGpa}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    GMAT Min Score
                  </label>
                  <Input
                    type="number"
                    defaultValue={selectedAdmission.gmatMinScore}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    GMAT Max Score
                  </label>
                  <Input
                    type="number"
                    defaultValue={selectedAdmission.gmatMaxScore}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    GRE Min Score
                  </label>
                  <Input
                    type="number"
                    defaultValue={selectedAdmission.greMinScore}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    GRE Max Score
                  </label>
                  <Input
                    type="number"
                    defaultValue={selectedAdmission.greMaxScore}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    IELTS Min Score
                  </label>
                  <Input
                    type="number"
                    step="0.5"
                    defaultValue={selectedAdmission.ieltsMinScore}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    TOEFL Min Score
                  </label>
                  <Input
                    type="number"
                    defaultValue={selectedAdmission.toeflMinScore}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Application Fee
                  </label>
                  <Input
                    type="number"
                    defaultValue={selectedAdmission.applicationFee}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Acceptance Rate (%)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    defaultValue={selectedAdmission.acceptanceRate}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Total Applications
                  </label>
                  <Input
                    type="number"
                    defaultValue={selectedAdmission.totalApplications}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowEditForm(false)}
                >
                  Cancel
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Update Admission
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Admissions Management
          </h1>
          <p className="text-gray-500">
            Manage admission requirements, intakes, and deadlines
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setActiveView("overview")}>
            Overview
          </Button>
          <Button variant="outline" onClick={() => setActiveView("analytics")}>
            Analytics
          </Button>
        </div>
      </div>

      {/* Main Content */}
      {activeView === "overview" && renderOverview()}
      {activeView === "details" && renderDetails()}
      {activeView === "analytics" && renderAnalytics()}

      {/* Create Form Modal */}
      {showCreateForm && renderCreateForm()}

      {/* Edit Form Modal */}
      {showEditForm && renderEditForm()}
    </div>
  );
}
