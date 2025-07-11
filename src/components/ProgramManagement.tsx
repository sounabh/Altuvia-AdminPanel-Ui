/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Edit,
  Trash2,
  Building,
  GraduationCap,
  BookOpen,
  FileText,
  Award,
  Search,
  Upload,
  Download,
  Eye,
  ExternalLink,
  TrendingUp,
  Link,
  Banknote,
} from "lucide-react";

export default function ProgramManagement() {
  const [activeTab, setActiveTab] = useState("programs");
  const [selectedUniversity, setSelectedUniversity] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data - in real app, this would come from API
  const [universities] = useState([
    { id: "1", name: "Stanford University", country: "USA", city: "Stanford" },
    { id: "2", name: "MIT", country: "USA", city: "Cambridge" },
    { id: "3", name: "Oxford University", country: "UK", city: "Oxford" },
  ]);

  const [departments, setDepartments] = useState([
    {
      id: "1",
      name: "Computer Science",
      slug: "cs",
      universityId: "1",
      programCount: 8,
    },
    {
      id: "2",
      name: "Engineering",
      slug: "engineering",
      universityId: "1",
      programCount: 12,
    },
    {
      id: "3",
      name: "Business",
      slug: "business",
      universityId: "1",
      programCount: 6,
    },
  ]);

  const [programs, setPrograms] = useState([
    {
      id: "1",
      programName: "Master of Science in Computer Science",
      programSlug: "ms-cs",
      universityId: "1",
      departmentId: "1",
      degreeType: "Masters",
      programLength: 2,
      specializations: "AI, Machine Learning, Software Engineering",
      programDescription:
        "Advanced computer science program focusing on cutting-edge technologies",
      curriculumOverview:
        "Core CS fundamentals, advanced algorithms, and specialized tracks",
      admissionRequirements:
        "Bachelor's degree in CS or related field, GRE scores",
      averageEntranceScore: 320,
      programTuitionFees: 55000,
      programAdditionalFees: 5000,
      programMetaTitle: "MS Computer Science - Stanford University",
      programMetaDescription: "Top-ranked MS CS program at Stanford",
      isActive: true,
      syllabusUploaded: true,
      rankingsCount: 3,
      externalLinksCount: 5,
    },
    {
      id: "2",
      programName: "Bachelor of Science in Engineering",
      programSlug: "bs-engineering",
      universityId: "1",
      departmentId: "2",
      degreeType: "Bachelors",
      programLength: 4,
      specializations: "Mechanical, Electrical, Civil",
      programDescription:
        "Comprehensive engineering program with multiple specializations",
      curriculumOverview:
        "Engineering fundamentals, mathematics, and specialized engineering courses",
      admissionRequirements:
        "High school diploma with strong math/science background",
      averageEntranceScore: 1450,
      programTuitionFees: 45000,
      programAdditionalFees: 3000,
      programMetaTitle: "BS Engineering - Stanford University",
      programMetaDescription: "Undergraduate engineering program at Stanford",
      isActive: true,
      syllabusUploaded: false,
      rankingsCount: 2,
      externalLinksCount: 3,
    },
  ]);

  const [syllabi, setSyllabi] = useState([
    {
      id: "1",
      programId: "1",
      fileUrl: "/syllabi/ms-cs.pdf",
      uploadedAt: "2024-01-15",
    },
  ]);

  const [programRankings, setProgramRankings] = useState([
    { id: "1", programId: "1", year: 2024, rank: 3, source: "QS Rankings" },
    { id: "2", programId: "1", year: 2023, rank: 5, source: "US News" },
    { id: "3", programId: "2", year: 2024, rank: 8, source: "THE Rankings" },
  ]);

  const [externalLinks, setExternalLinks] = useState([
    {
      id: "1",
      programId: "1",
      title: "Program Website",
      url: "https://cs.stanford.edu/ms",
    },
    {
      id: "2",
      programId: "1",
      title: "Faculty Directory",
      url: "https://cs.stanford.edu/faculty",
    },
    {
      id: "3",
      programId: "1",
      title: "Admissions Guide",
      url: "https://cs.stanford.edu/admissions",
    },
    {
      id: "4",
      programId: "2",
      title: "Engineering Program",
      url: "https://engineering.stanford.edu/bs",
    },
  ]);

  const [tuitionBreakdowns, setTuitionBreakdowns] = useState([
    {
      id: "1",
      programId: "1",
      year: 2024,
      tuitionFee: 55000,
      additionalFees: 5000,
      totalCost: 60000,
    },
    {
      id: "2",
      programId: "2",
      year: 2024,
      tuitionFee: 45000,
      additionalFees: 3000,
      totalCost: 48000,
    },
  ]);

  const [showAddProgram, setShowAddProgram] = useState(false);
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [showAddRanking, setShowAddRanking] = useState(false);
  const [showAddExternalLink, setShowAddExternalLink] = useState(false);
  const [showAddTuitionBreakdown, setShowAddTuitionBreakdown] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  );
  interface ProgramRanking {
    id: string;
    programId: string;
    year: number;
    rank: number;
    source: string;
  }
  const [editingRanking, setEditingRanking] = useState<ProgramRanking | null>(
    null
  );
  const [editingExternalLink, setEditingExternalLink] = useState(null);

  const [newProgram, setNewProgram] = useState({
    programName: "",
    programSlug: "",
    universityId: "",
    departmentId: "",
    degreeType: "",
    programLength: "",
    specializations: "",
    programDescription: "",
    curriculumOverview: "",
    admissionRequirements: "",
    averageEntranceScore: "",
    programTuitionFees: "",
    programAdditionalFees: "",
    programMetaTitle: "",
    programMetaDescription: "",
    isActive: true,
  });

  const [newDepartment, setNewDepartment] = useState({
    name: "",
    slug: "",
    universityId: "",
  });

  const [newRanking, setNewRanking] = useState({
    programId: "",
    year: new Date().getFullYear(),
    rank: "",
    source: "",
  });

  const [newExternalLink, setNewExternalLink] = useState({
    programId: "",
    title: "",
    url: "",
  });

  const [newTuitionBreakdown, setNewTuitionBreakdown] = useState({
    programId: "",
    year: new Date().getFullYear(),
    tuitionFee: "",
    additionalFees: "",
    totalCost: "",
  });

  const degreeTypes = ["Bachelors", "Masters", "PhD", "Diploma", "Certificate"];

  const filteredPrograms = programs.filter((program) => {
    const matchesSearch =
      program.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.programSlug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && program.isActive) ||
      (filterStatus === "inactive" && !program.isActive);
    const matchesUniversity =
      selectedUniversity === "all" ||
      program.universityId === selectedUniversity;
    const matchesDepartment =
      selectedDepartment === "all" ||
      program.departmentId === selectedDepartment;

    return (
      matchesSearch && matchesStatus && matchesUniversity && matchesDepartment
    );
  });

  const handleAddProgram = () => {
    if (
      newProgram.programName &&
      newProgram.universityId &&
      newProgram.departmentId
    ) {
      const program = {
        ...newProgram,
        id: Date.now().toString(),
        programLength: Number(newProgram.programLength) || 0,
        averageEntranceScore: Number(newProgram.averageEntranceScore) || 0,
        programTuitionFees: Number(newProgram.programTuitionFees) || 0,
        programAdditionalFees: Number(newProgram.programAdditionalFees) || 0,
        syllabusUploaded: false,
        rankingsCount: 0,
        externalLinksCount: 0,
      };
      setPrograms([...programs, program]);
      setNewProgram({
        programName: "",
        programSlug: "",
        universityId: "",
        departmentId: "",
        degreeType: "",
        programLength: "",
        specializations: "",
        programDescription: "",
        curriculumOverview: "",
        admissionRequirements: "",
        averageEntranceScore: "",
        programTuitionFees: "",
        programAdditionalFees: "",
        programMetaTitle: "",
        programMetaDescription: "",
        isActive: true,
      });
      setShowAddProgram(false);
    }
  };

  const handleAddDepartment = () => {
    if (newDepartment.name && newDepartment.universityId) {
      setDepartments([
        ...departments,
        {
          ...newDepartment,
          id: Date.now().toString(),
          slug:
            newDepartment.slug ||
            newDepartment.name.toLowerCase().replace(/\s+/g, "-"),
          programCount: 0,
        },
      ]);
      setNewDepartment({
        name: "",
        slug: "",
        universityId: "",
      });
      setShowAddDepartment(false);
    }
  };

  const handleAddRanking = () => {
    if (newRanking.programId && newRanking.year && newRanking.rank) {
      setProgramRankings([
        ...programRankings,
        {
          ...newRanking,
          id: Date.now().toString(),
          rank: parseInt(newRanking.rank),
          year: parseInt(newRanking.year.toString()),
        },
      ]);
      setNewRanking({
        programId: "",
        year: new Date().getFullYear(),
        rank: "",
        source: "",
      });
      setShowAddRanking(false);
    }
  };

  const handleAddExternalLink = () => {
    if (
      newExternalLink.programId &&
      newExternalLink.title &&
      newExternalLink.url
    ) {
      setExternalLinks([
        ...externalLinks,
        {
          ...newExternalLink,
          id: Date.now().toString(),
        },
      ]);
      setNewExternalLink({
        programId: "",
        title: "",
        url: "",
      });
      setShowAddExternalLink(false);
    }
  };

  const handleAddTuitionBreakdown = () => {
    if (newTuitionBreakdown.programId && newTuitionBreakdown.tuitionFee) {
      const tuitionFee = parseFloat(newTuitionBreakdown.tuitionFee);
      const additionalFees =
        parseFloat(newTuitionBreakdown.additionalFees) || 0;
      const totalCost = tuitionFee + additionalFees;

      setTuitionBreakdowns([
        ...tuitionBreakdowns,
        {
          ...newTuitionBreakdown,
          id: Date.now().toString(),
          tuitionFee,
          additionalFees,
          totalCost,
          year: newTuitionBreakdown.year,
        },
      ]);
      setNewTuitionBreakdown({
        programId: "",
        year: new Date().getFullYear(),
        tuitionFee: "",
        additionalFees: "",
        totalCost: "",
      });
      setShowAddTuitionBreakdown(false);
    }
  };

  const handleDeleteProgram = (id: string) => {
    setPrograms(programs.filter((program) => program.id !== id));
  };

  const handleDeleteDepartment = (id: string) => {
    setDepartments(departments.filter((dept) => dept.id !== id));
  };

  const handleDeleteRanking = (id: string) => {
    setProgramRankings(programRankings.filter((ranking) => ranking.id !== id));
  };

  const handleDeleteExternalLink = (id: string) => {
    setExternalLinks(externalLinks.filter((link) => link.id !== id));
  };

  const handleDeleteTuitionBreakdown = (id: string) => {
    setTuitionBreakdowns(
      tuitionBreakdowns.filter((breakdown) => breakdown.id !== id)
    );
  };

  const toggleProgramStatus = (id: string) => {
    setPrograms(
      programs.map((program) =>
        program.id === id
          ? { ...program, isActive: !program.isActive }
          : program
      )
    );
  };

  interface Syllabus {
    id: string;
    programId: string;
    fileUrl: string;
    uploadedAt: string;
  }

  interface FileUploadEvent extends React.ChangeEvent<HTMLInputElement> {}

  const handleFileUpload = (programId: string, event: FileUploadEvent) => {
    const file = event.target.files?.[0];
    if (file) {
      // In real app, upload to server and get URL
      const newSyllabus: Syllabus = {
        id: Date.now().toString(),
        programId,
        fileUrl: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString().split("T")[0],
      };
      setSyllabi([...syllabi, newSyllabus]);
      setPrograms(
        programs.map((p) =>
          p.id === programId ? { ...p, syllabusUploaded: true } : p
        )
      );
    }
  };

  interface University {
    id: string;
    name: string;
    country: string;
    city: string;
  }

  const getUniversityName = (universityId: string): string => {
    const university: University | undefined = universities.find(
      (u: University) => u.id === universityId
    );
    return university ? university.name : "Unknown University";
  };

  interface Department {
    id: string;
    name: string;
    slug: string;
    universityId: string;
    programCount: number;
  }

  const getDepartmentName = (departmentId: string): string => {
    const department: Department | undefined = departments.find(
      (d: Department) => d.id === departmentId
    );
    return department ? department.name : "Unknown Department";
  };

  interface Program {
    id: string;
    programName: string;
    programSlug: string;
    universityId: string;
    departmentId: string;
    degreeType: string;
    programLength: number;
    specializations: string;
    programDescription: string;
    curriculumOverview: string;
    admissionRequirements: string;
    averageEntranceScore: number;
    programTuitionFees: number;
    programAdditionalFees: number;
    programMetaTitle: string;
    programMetaDescription: string;
    isActive: boolean;
    syllabusUploaded: boolean;
    rankingsCount: number;
    externalLinksCount: number;
  }

  const getProgramName = (programId: string): string => {
    const program: Program | undefined = programs.find(
      (p: Program) => p.id === programId
    );
    return program ? program.programName : "Unknown Program";
  };

  const ProgramCard = ({ program }: { program: Program }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{program.programName}</CardTitle>
            <CardDescription className="mt-1">
              {getUniversityName(program.universityId)} •{" "}
              {getDepartmentName(program.departmentId)}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={program.isActive ? "default" : "secondary"}>
              {program.isActive ? "Active" : "Inactive"}
            </Badge>
            <Badge variant="outline">{program.degreeType}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Duration</p>
            <p className="font-medium">{program.programLength} years</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tuition Fees</p>
            <p className="font-medium">
              ${program.programTuitionFees?.toLocaleString()}
            </p>
          </div>
        </div>

        {program.specializations && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">Specializations</p>
            <p className="text-sm">{program.specializations}</p>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              {program.syllabusUploaded ? "Syllabus ✓" : "No Syllabus"}
            </span>
            <span className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              {
                programRankings.filter((r) => r.programId === program.id).length
              }{" "}
              Rankings
            </span>
            <span className="flex items-center">
              <ExternalLink className="h-4 w-4 mr-1" />
              {
                externalLinks.filter((l) => l.programId === program.id).length
              }{" "}
              Links
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Switch
              checked={program.isActive}
              onCheckedChange={() => toggleProgramStatus(program.id)}
            />
            <Label className="text-sm">Active</Label>
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditingProgram(program)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDeleteProgram(program.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const DepartmentCard = ({ department }: { department: Department }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{department.name}</CardTitle>
            <CardDescription>
              {getUniversityName(department.universityId)}
            </CardDescription>
          </div>
          <Badge variant="outline">
            {programs.filter((p) => p.departmentId === department.id).length}{" "}
            Programs
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Department Slug</p>
            <p className="font-medium">{department.slug}</p>
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditingDepartment(department)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDeleteDepartment(department.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ProgramForm = ({
    program,
    onSave,
    onCancel,
  }: {
    program: Program | null;
    onSave: () => void;
    onCancel: () => void;
  }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="programName">Program Name *</Label>
          <Input
            id="programName"
            value={program?.programName || newProgram.programName}
            onChange={(e) =>
              program
                ? setEditingProgram({ ...program, programName: e.target.value })
                : setNewProgram({ ...newProgram, programName: e.target.value })
            }
            placeholder="e.g., Master of Science in Computer Science"
          />
        </div>
        <div>
          <Label htmlFor="programSlug">Program Slug</Label>
          <Input
            id="programSlug"
            value={program?.programSlug || newProgram.programSlug}
            onChange={(e) =>
              program
                ? setEditingProgram({ ...program, programSlug: e.target.value })
                : setNewProgram({ ...newProgram, programSlug: e.target.value })
            }
            placeholder="e.g., ms-computer-science"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="university">University *</Label>
          <Select
            value={program?.universityId || newProgram.universityId}
            onValueChange={(value) =>
              program
                ? setEditingProgram({ ...program, universityId: value })
                : setNewProgram({ ...newProgram, universityId: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select University" />
            </SelectTrigger>
            <SelectContent>
              {universities.map((uni) => (
                <SelectItem key={uni.id} value={uni.id}>
                  {uni.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="department">Department *</Label>
          <Select
            value={program?.departmentId || newProgram.departmentId}
            onValueChange={(value) =>
              program
                ? setEditingProgram({ ...program, departmentId: value })
                : setNewProgram({ ...newProgram, departmentId: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="degreeType">Degree Type</Label>
          <Select
            value={program?.degreeType || newProgram.degreeType}
            onValueChange={(value) =>
              program
                ? setEditingProgram({ ...program, degreeType: value })
                : setNewProgram({ ...newProgram, degreeType: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Degree Type" />
            </SelectTrigger>
            <SelectContent>
              {degreeTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="programLength">Duration (Years)</Label>
          <Input
            id="programLength"
            type="number"
            value={program?.programLength || newProgram.programLength}
            onChange={(e) =>
              program
                ? setEditingProgram({
                    ...program,
                    programLength: Number(e.target.value),
                  })
                : setNewProgram({
                    ...newProgram,
                    programLength: e.target.value,
                  })
            }
            placeholder="e.g., 2"
          />
        </div>
        <div>
          <Label htmlFor="averageEntranceScore">Average Entrance Score</Label>
          <Input
            id="averageEntranceScore"
            type="number"
            value={
              program?.averageEntranceScore || newProgram.averageEntranceScore
            }
            onChange={(e) =>
              program
                ? setEditingProgram({
                    ...program,
                    averageEntranceScore: Number(e.target.value),
                  })
                : setNewProgram({
                    ...newProgram,
                    averageEntranceScore: e.target.value,
                  })
            }
            placeholder="e.g., 320"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="programTuitionFees">Tuition Fees ($)</Label>
          <Input
            id="programTuitionFees"
            type="number"
            value={program?.programTuitionFees || newProgram.programTuitionFees}
            onChange={(e) =>
              program
                ? setEditingProgram({
                    ...program,
                    programTuitionFees: Number(e.target.value),
                  })
                : setNewProgram({
                    ...newProgram,
                    programTuitionFees: e.target.value,
                  })
            }
            placeholder="e.g., 55000"
          />
        </div>
        <div>
          <Label htmlFor="programAdditionalFees">Additional Fees ($)</Label>
          <Input
            id="programAdditionalFees"
            type="number"
            value={
              program?.programAdditionalFees || newProgram.programAdditionalFees
            }
            onChange={(e) =>
              program
                ? setEditingProgram({
                    ...program,
                    programAdditionalFees: Number(e.target.value),
                  })
                : setNewProgram({
                    ...newProgram,
                    programAdditionalFees: e.target.value,
                  })
            }
            placeholder="e.g., 5000"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="specializations">Specializations</Label>
        <Input
          id="specializations"
          value={program?.specializations || newProgram.specializations}
          onChange={(e) =>
            program
              ? setEditingProgram({
                  ...program,
                  specializations: e.target.value,
                })
              : setNewProgram({
                  ...newProgram,
                  specializations: e.target.value,
                })
          }
          placeholder="e.g., AI, Machine Learning, Software Engineering"
        />
      </div>

      <div>
        <Label htmlFor="programDescription">Program Description</Label>
        <Textarea
          id="programDescription"
          value={program?.programDescription || newProgram.programDescription}
          onChange={(e) =>
            program
              ? setEditingProgram({
                  ...program,
                  programDescription: e.target.value,
                })
              : setNewProgram({
                  ...newProgram,
                  programDescription: e.target.value,
                })
          }
          placeholder="Brief description of the program"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="curriculumOverview">Curriculum Overview</Label>
        <Textarea
          id="curriculumOverview"
          value={program?.curriculumOverview || newProgram.curriculumOverview}
          onChange={(e) =>
            program
              ? setEditingProgram({
                  ...program,
                  curriculumOverview: e.target.value,
                })
              : setNewProgram({
                  ...newProgram,
                  curriculumOverview: e.target.value,
                })
          }
          placeholder="Overview of the curriculum and courses"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="admissionRequirements">Admission Requirements</Label>
        <Textarea
          id="admissionRequirements"
          value={
            program?.admissionRequirements || newProgram.admissionRequirements
          }
          onChange={(e) =>
            program
              ? setEditingProgram({
                  ...program,
                  admissionRequirements: e.target.value,
                })
              : setNewProgram({
                  ...newProgram,
                  admissionRequirements: e.target.value,
                })
          }
          placeholder="Requirements for admission"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="programMetaTitle">Meta Title</Label>
          <Input
            id="programMetaTitle"
            value={program?.programMetaTitle || newProgram.programMetaTitle}
            onChange={(e) =>
              program
                ? setEditingProgram({
                    ...program,
                    programMetaTitle: e.target.value,
                  })
                : setNewProgram({
                    ...newProgram,
                    programMetaTitle: e.target.value,
                  })
            }
            placeholder="SEO meta title"
          />
        </div>
        <div>
          <Label htmlFor="programMetaDescription">Meta Description</Label>
          <Input
            id="programMetaDescription"
            value={
              program?.programMetaDescription ||
              newProgram.programMetaDescription
            }
            onChange={(e) =>
              program
                ? setEditingProgram({
                    ...program,
                    programMetaDescription: e.target.value,
                  })
                : setNewProgram({
                    ...newProgram,
                    programMetaDescription: e.target.value,
                  })
            }
            placeholder="SEO meta description"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave}>Save Program</Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Program & Academics Management
          </h1>
          <p className="text-gray-500">
            Manage academic programs, departments, and related academic content
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setShowAddDepartment(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Department
          </Button>
          <Button onClick={() => setShowAddProgram(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Program
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="programs" className="flex items-center">
            <GraduationCap className="h-4 w-4 mr-2" />
            Programs
          </TabsTrigger>
          <TabsTrigger value="departments" className="flex items-center">
            <Building className="h-4 w-4 mr-2" />
            Departments
          </TabsTrigger>
          <TabsTrigger value="syllabus" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Syllabus
          </TabsTrigger>
          <TabsTrigger value="rankings" className="flex items-center">
            <Award className="h-4 w-4 mr-2" />
            Rankings
          </TabsTrigger>
          <TabsTrigger value="links" className="flex items-center">
            <Link className="h-4 w-4 mr-2" />
            Links
          </TabsTrigger>
          <TabsTrigger value="tuition" className="flex items-center">
            <Banknote className="h-4 w-4 mr-2" />
            Tuition
          </TabsTrigger>
        </TabsList>

        <TabsContent value="programs">
          <div className="space-y-4">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filter Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="search">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Search programs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="university-filter">University</Label>
                    {/* University Filter */}
                    <Select
                      value={selectedUniversity}
                      onValueChange={setSelectedUniversity}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Universities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Universities</SelectItem>
                        {universities.map((uni) => (
                          <SelectItem key={uni.id} value={uni.id}>
                            {uni.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Department Filter */}
                    <Select
                      value={selectedDepartment}
                      onValueChange={setSelectedDepartment}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="department-filter">Department</Label>
                    <Select
                      value={selectedDepartment}
                      onValueChange={setSelectedDepartment}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Departments</SelectItem>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status-filter">Status</Label>
                    <Select
                      value={filterStatus}
                      onValueChange={setFilterStatus}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Programs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.length > 0 ? (
                filteredPrograms.map((program) => (
                  <ProgramCard key={program.id} program={program} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No programs found
                  </h3>
                  <p className="mt-1 text-gray-500">
                    Try adjusting your search or filter to find what youre
                    looking for.
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => setShowAddProgram(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Program
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="departments">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">University Departments</h2>
              <Button onClick={() => setShowAddDepartment(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Department
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {departments.length > 0 ? (
                departments.map((department) => (
                  <DepartmentCard key={department.id} department={department} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Building className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No departments found
                  </h3>
                  <p className="mt-1 text-gray-500">
                    Departments will appear here once added to the system.
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="syllabus">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Program Syllabi</h2>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Syllabus Management</CardTitle>
                <CardDescription>
                  Upload and manage syllabus documents for each program
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Program
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          University
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Uploaded
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {programs.map((program) => {
                        const syllabus = syllabi.find(
                          (s) => s.programId === program.id
                        );
                        return (
                          <tr key={program.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {program.programName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {getDepartmentName(program.departmentId)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {getUniversityName(program.universityId)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge
                                variant={syllabus ? "default" : "destructive"}
                              >
                                {syllabus ? "Uploaded" : "Missing"}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {syllabus ? syllabus.uploadedAt : "Not available"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {syllabus ? (
                                <div className="flex space-x-2">
                                  <Button size="sm" variant="outline">
                                    <Download className="h-4 w-4 mr-1" />{" "}
                                    Download
                                  </Button>
                                  <Button size="sm" variant="destructive">
                                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                                  </Button>
                                </div>
                              ) : (
                                <div className="relative">
                                  <Button size="sm" asChild>
                                    <label
                                      htmlFor={`file-upload-${program.id}`}
                                      className="cursor-pointer"
                                    >
                                      <Upload className="h-4 w-4 mr-1" /> Upload
                                      <input
                                        id={`file-upload-${program.id}`}
                                        type="file"
                                        className="sr-only"
                                        onChange={(e) =>
                                          handleFileUpload(program.id, e)
                                        }
                                      />
                                    </label>
                                  </Button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rankings">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Program Rankings</h2>
              <Button onClick={() => setShowAddRanking(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Ranking
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Ranking Information</CardTitle>
                <CardDescription>
                  Manage ranking data for each program from different sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Program
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Year
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Rank
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Source
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {programRankings.map((ranking) => (
                        <tr key={ranking.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {getProgramName(ranking.programId)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {ranking.year}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="secondary">#{ranking.rank}</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {ranking.source}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingRanking(ranking)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteRanking(ranking.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="links">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">External Links</h2>
              <Button onClick={() => setShowAddExternalLink(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Program Related Links</CardTitle>
                <CardDescription>
                  Manage external links associated with each program
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Program
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Title
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          URL
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {externalLinks.map((link) => (
                        <tr key={link.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {getProgramName(link.programId)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {link.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center"
                            >
                              {link.url}{" "}
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingExternalLink(link)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  handleDeleteExternalLink(link.id)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tuition">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Tuition Details</h2>
              <Button onClick={() => setShowAddTuitionBreakdown(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Tuition
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Tuition Breakdown</CardTitle>
                <CardDescription>
                  Detailed tuition and fee information for each program
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Program
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Year
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Tuition
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Fees
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Total
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tuitionBreakdowns.map((breakdown) => (
                        <tr key={breakdown.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {getProgramName(breakdown.programId)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {breakdown.year}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${breakdown.tuitionFee?.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${breakdown.additionalFees?.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="default">
                              ${breakdown.totalCost?.toLocaleString()}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  console.log("Edit tuition", breakdown)
                                }
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  handleDeleteTuitionBreakdown(breakdown.id)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Modals */}
      <Dialog open={showAddProgram} onOpenChange={setShowAddProgram}>
        <DialogContent className="sm:max-w-4xl overflow-y-auto max-h-screen">
          <DialogHeader>
            <DialogTitle>
              {editingProgram ? "Edit Program" : "Add New Program"}
            </DialogTitle>
          </DialogHeader>
          <ProgramForm
            program={editingProgram}
            onSave={() => {
              if (editingProgram) {
                setPrograms(
                  programs.map((p) =>
                    p.id === editingProgram.id ? editingProgram : p
                  )
                );
                setEditingProgram(null);
              } else {
                handleAddProgram();
              }
              setShowAddProgram(false);
            }}
            onCancel={() => {
              setEditingProgram(null);
              setShowAddProgram(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showAddDepartment} onOpenChange={setShowAddDepartment}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Department</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="deptName">Department Name *</Label>
              <Input
                id="deptName"
                value={newDepartment.name}
                onChange={(e) =>
                  setNewDepartment({ ...newDepartment, name: e.target.value })
                }
                placeholder="e.g., Computer Science"
              />
            </div>
            <div>
              <Label htmlFor="deptSlug">Department Slug</Label>
              <Input
                id="deptSlug"
                value={newDepartment.slug}
                onChange={(e) =>
                  setNewDepartment({ ...newDepartment, slug: e.target.value })
                }
                placeholder="e.g., computer-science"
              />
            </div>
            <div>
              <Label htmlFor="deptUniversity">University *</Label>
              <Select
                value={newDepartment.universityId}
                onValueChange={(value) =>
                  setNewDepartment({ ...newDepartment, universityId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select University" />
                </SelectTrigger>
                <SelectContent>
                  {universities.map((uni) => (
                    <SelectItem key={uni.id} value={uni.id}>
                      {uni.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowAddDepartment(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddDepartment}>Add Department</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Ranking Modal */}
      <Dialog open={showAddRanking} onOpenChange={setShowAddRanking}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Program Ranking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rankingProgram">Program *</Label>
              <Select
                value={newRanking.programId}
                onValueChange={(value) =>
                  setNewRanking({ ...newRanking, programId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.programName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rankingYear">Year *</Label>
                <Input
                  id="rankingYear"
                  type="number"
                  value={newRanking.year}
                  onChange={(e) =>
                    setNewRanking({
                      ...newRanking,
                      year: Number(e.target.value),
                    })
                  }
                  placeholder="e.g., 2024"
                />
              </div>
              <div>
                <Label htmlFor="rankingPosition">Rank *</Label>
                <Input
                  id="rankingPosition"
                  type="number"
                  value={newRanking.rank}
                  onChange={(e) =>
                    setNewRanking({ ...newRanking, rank: e.target.value })
                  }
                  placeholder="e.g., 5"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="rankingSource">Source *</Label>
              <Input
                id="rankingSource"
                value={newRanking.source}
                onChange={(e) =>
                  setNewRanking({ ...newRanking, source: e.target.value })
                }
                placeholder="e.g., QS World Rankings"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowAddRanking(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddRanking}>Add Ranking</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add External Link Modal */}
      <Dialog open={showAddExternalLink} onOpenChange={setShowAddExternalLink}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add External Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="linkProgram">Program *</Label>
              <Select
                value={newExternalLink.programId}
                onValueChange={(value) =>
                  setNewExternalLink({ ...newExternalLink, programId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.programName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="linkTitle">Title *</Label>
              <Input
                id="linkTitle"
                value={newExternalLink.title}
                onChange={(e) =>
                  setNewExternalLink({
                    ...newExternalLink,
                    title: e.target.value,
                  })
                }
                placeholder="e.g., Program Brochure"
              />
            </div>
            <div>
              <Label htmlFor="linkUrl">URL *</Label>
              <Input
                id="linkUrl"
                value={newExternalLink.url}
                onChange={(e) =>
                  setNewExternalLink({
                    ...newExternalLink,
                    url: e.target.value,
                  })
                }
                placeholder="https://example.com/program-info"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowAddExternalLink(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddExternalLink}>Add Link</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Tuition Breakdown Modal */}
      <Dialog
        open={showAddTuitionBreakdown}
        onOpenChange={setShowAddTuitionBreakdown}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Tuition Breakdown</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="tuitionProgram">Program *</Label>
              <Select
                value={newTuitionBreakdown.programId}
                onValueChange={(value) =>
                  setNewTuitionBreakdown({
                    ...newTuitionBreakdown,
                    programId: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.programName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tuitionYear">Year *</Label>
              <Input
                id="tuitionYear"
                type="number"
                value={newTuitionBreakdown.year}
                onChange={(e) =>
                  setNewTuitionBreakdown({
                    ...newTuitionBreakdown,
                    year: Number(e.target.value),
                  })
                }
                placeholder="e.g., 2024"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tuitionFee">Tuition Fee ($) *</Label>
                <Input
                  id="tuitionFee"
                  type="number"
                  value={newTuitionBreakdown.tuitionFee}
                  onChange={(e) =>
                    setNewTuitionBreakdown({
                      ...newTuitionBreakdown,
                      tuitionFee: e.target.value,
                    })
                  }
                  placeholder="e.g., 50000"
                />
              </div>
              <div>
                <Label htmlFor="additionalFees">Additional Fees ($)</Label>
                <Input
                  id="additionalFees"
                  type="number"
                  value={newTuitionBreakdown.additionalFees}
                  onChange={(e) =>
                    setNewTuitionBreakdown({
                      ...newTuitionBreakdown,
                      additionalFees: e.target.value,
                    })
                  }
                  placeholder="e.g., 3000"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowAddTuitionBreakdown(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddTuitionBreakdown}>Add Tuition</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
