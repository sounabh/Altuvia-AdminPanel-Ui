/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Star,
  MapPin,
  GraduationCap,
  Sparkles,
  Save,
  X,
  DollarSign,
  Globe,
  Award,
} from "lucide-react";
import { toast } from "sonner";

interface University {
  id: string;
  universityName: string;
  slug: string;
  city: string;
  state?: string;
  country: string;
  fullAddress?: string;
  shortDescription?: string;
  overview?: string;
  history?: string;
  missionStatement?: string;
  visionStatement?: string;
  accreditationDetails?: string;
  whyChooseHighlights?: string;
  careerOutcomes?: string;
  ftGlobalRanking?: number;
  ftRegionalRanking?: number;
  ftRankingYear?: number;
  usNewsRanking?: number;
  qsRanking?: number;
  timesRanking?: number;
  acceptanceRate?: number;
  gmatAverageScore?: number;
  gmatScoreMin?: number;
  gmatScoreMax?: number;
  minimumGpa?: number;
  languageTestRequirements?: string;
  tuitionFees?: number;
  additionalFees?: number;
  totalCost?: number;
  currency: string;
  scholarshipInfo?: string;
  financialAidDetails?: string;
  admissionsOfficeContact?: string;
  internationalOfficeContact?: string;
  generalInquiriesContact?: string;
  websiteUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  images?: UniversityImage[];
  programsCount?: number;
  departmentsCount?: number;
}

interface UniversityImage {
  id: string;
  universityId: string;
  imageUrl: string;
  imageType?: string;
  imageTitle?: string;
  imageAltText: string;
  imageCaption?: string;
  isPrimary: boolean;
  displayOrder: number;
}

// Mock data for demonstration
const mockUniversities: University[] = [
  {
    id: "1",
    universityName: "Stanford University",
    slug: "stanford-university",
    city: "Stanford",
    state: "California",
    country: "United States",
    fullAddress: "450 Jane Stanford Way, Stanford, CA 94305, USA",
    shortDescription: "Leading research university in Silicon Valley",
    overview: "Stanford University is a private research university in Stanford, California.",
    ftGlobalRanking: 3,
    usNewsRanking: 6,
    qsRanking: 5,
    acceptanceRate: 4.3,
    gmatAverageScore: 734,
    gmatScoreMin: 680,
    gmatScoreMax: 780,
    minimumGpa: 3.5,
    tuitionFees: 56169,
    additionalFees: 15000,
    totalCost: 71169,
    currency: "USD",
    websiteUrl: "https://www.stanford.edu",
    isActive: true,
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    programsCount: 65,
    departmentsCount: 18,
  },
  {
    id: "2",
    universityName: "Massachusetts Institute of Technology",
    slug: "mit",
    city: "Cambridge",
    state: "Massachusetts",
    country: "United States",
    fullAddress: "77 Massachusetts Ave, Cambridge, MA 02139, USA",
    shortDescription: "World-renowned institute of technology",
    overview: "MIT is a private research university in Cambridge, Massachusetts.",
    ftGlobalRanking: 1,
    usNewsRanking: 2,
    qsRanking: 1,
    acceptanceRate: 6.7,
    gmatAverageScore: 728,
    tuitionFees: 53818,
    additionalFees: 12000,
    totalCost: 65818,
    currency: "USD",
    websiteUrl: "https://www.mit.edu",
    isActive: true,
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    programsCount: 58,
    departmentsCount: 15,
  },
];

const UniversityForm = ({
  university,
  isOpen,
  onClose,
  onSave,
}: {
  university?: University;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}) => {
  const [formData, setFormData] = useState({
    universityName: university?.universityName || "",
    slug: university?.slug || "",
    city: university?.city || "",
    state: university?.state || "",
    country: university?.country || "",
    fullAddress: university?.fullAddress || "",
    shortDescription: university?.shortDescription || "",
    overview: university?.overview || "",
    history: university?.history || "",
    missionStatement: university?.missionStatement || "",
    visionStatement: university?.visionStatement || "",
    accreditationDetails: university?.accreditationDetails || "",
    whyChooseHighlights: university?.whyChooseHighlights || "",
    careerOutcomes: university?.careerOutcomes || "",
    ftGlobalRanking: university?.ftGlobalRanking || "",
    ftRegionalRanking: university?.ftRegionalRanking || "",
    ftRankingYear: university?.ftRankingYear || "",
    usNewsRanking: university?.usNewsRanking || "",
    qsRanking: university?.qsRanking || "",
    timesRanking: university?.timesRanking || "",
    acceptanceRate: university?.acceptanceRate || "",
    gmatAverageScore: university?.gmatAverageScore || "",
    gmatScoreMin: university?.gmatScoreMin || "",
    gmatScoreMax: university?.gmatScoreMax || "",
    minimumGpa: university?.minimumGpa || "",
    languageTestRequirements: university?.languageTestRequirements || "",
    tuitionFees: university?.tuitionFees || "",
    additionalFees: university?.additionalFees || "",
    totalCost: university?.totalCost || "",
    currency: university?.currency || "USD",
    scholarshipInfo: university?.scholarshipInfo || "",
    financialAidDetails: university?.financialAidDetails || "",
    admissionsOfficeContact: university?.admissionsOfficeContact || "",
    internationalOfficeContact: university?.internationalOfficeContact || "",
    generalInquiriesContact: university?.generalInquiriesContact || "",
    websiteUrl: university?.websiteUrl || "",
    metaTitle: university?.metaTitle || "",
    metaDescription: university?.metaDescription || "",
    metaKeywords: university?.metaKeywords || "",
    canonicalUrl: university?.canonicalUrl || "",
    isActive: university?.isActive ?? true,
    isFeatured: university?.isFeatured ?? false,
  });

  const [activeTab, setActiveTab] = useState("basic");

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      universityName: name,
      slug: generateSlug(name),
    });
  };

  const calculateTotalCost = () => {
    const tuition = parseFloat(formData.tuitionFees.toString()) || 0;
    const additional = parseFloat(formData.additionalFees.toString()) || 0;
    const total = tuition + additional;
    setFormData({ ...formData, totalCost: total });
  };

  const generateAIData = () => {
    const universities = [
      "University of Excellence",
      "Global Institute of Technology",
      "Metropolitan University",
      "International College of Sciences",
      "Advanced Studies University",
    ];
    
    const cities = [
      { city: "San Francisco", state: "California", country: "United States" },
      { city: "New York", state: "New York", country: "United States" },
      { city: "London", state: "", country: "United Kingdom" },
      { city: "Toronto", state: "Ontario", country: "Canada" },
      { city: "Sydney", state: "New South Wales", country: "Australia" },
    ];

    const randomUniversity = universities[Math.floor(Math.random() * universities.length)];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];

    const tuitionFees = Math.floor(Math.random() * 40000) + 30000;
    const additionalFees = Math.floor(Math.random() * 10000) + 5000;
    const aiData = {
      universityName: randomUniversity,
      slug: generateSlug(randomUniversity),
      city: randomCity.city,
      state: randomCity.state,
      country: randomCity.country,
      shortDescription: "A leading institution of higher education and research excellence",
      overview: `${randomUniversity} is a prestigious institution known for its academic excellence, innovative research, and commitment to student success. Founded with the mission to provide world-class education, the university has consistently ranked among the top institutions globally.`,
      missionStatement: "To educate leaders, advance knowledge, and serve society through excellence in teaching, learning, and research.",
      visionStatement: "To be a globally recognized center of academic excellence and innovation.",
      ftGlobalRanking: Math.floor(Math.random() * 100) + 1,
      qsRanking: Math.floor(Math.random() * 200) + 1,
      usNewsRanking: Math.floor(Math.random() * 150) + 1,
      acceptanceRate: Math.floor(Math.random() * 30) + 5,
      gmatAverageScore: Math.floor(Math.random() * 100) + 650,
      gmatScoreMin: Math.floor(Math.random() * 50) + 600,
      gmatScoreMax: Math.floor(Math.random() * 50) + 750,
      minimumGpa: (Math.random() * 1.5 + 2.5).toFixed(1),
      tuitionFees,
      additionalFees,
      totalCost: tuitionFees + additionalFees,
      currency: "USD",
      websiteUrl: `https://www.${generateSlug(randomUniversity)}.edu`,
      languageTestRequirements: "IELTS 6.5 or TOEFL 80 or equivalent",
      isActive: true,
      isFeatured: Math.random() > 0.7,
    };

    setFormData({ ...formData, ...aiData });
    toast.success("AI-generated university data populated!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        ftGlobalRanking: formData.ftGlobalRanking ? parseInt(formData.ftGlobalRanking.toString()) : null,
        ftRegionalRanking: formData.ftRegionalRanking ? parseInt(formData.ftRegionalRanking.toString()) : null,
        ftRankingYear: formData.ftRankingYear ? parseInt(formData.ftRankingYear.toString()) : null,
        usNewsRanking: formData.usNewsRanking ? parseInt(formData.usNewsRanking.toString()) : null,
        qsRanking: formData.qsRanking ? parseInt(formData.qsRanking.toString()) : null,
        timesRanking: formData.timesRanking ? parseInt(formData.timesRanking.toString()) : null,
        acceptanceRate: formData.acceptanceRate ? parseFloat(formData.acceptanceRate.toString()) : null,
        gmatAverageScore: formData.gmatAverageScore ? parseInt(formData.gmatAverageScore.toString()) : null,
        gmatScoreMin: formData.gmatScoreMin ? parseInt(formData.gmatScoreMin.toString()) : null,
        gmatScoreMax: formData.gmatScoreMax ? parseInt(formData.gmatScoreMax.toString()) : null,
        minimumGpa: formData.minimumGpa ? parseFloat(formData.minimumGpa.toString()) : null,
        tuitionFees: formData.tuitionFees ? parseFloat(formData.tuitionFees.toString()) : null,
        additionalFees: formData.additionalFees ? parseFloat(formData.additionalFees.toString()) : null,
        totalCost: formData.totalCost ? parseFloat(formData.totalCost.toString()) : null,
      };

      await onSave(payload);
      onClose();
      toast.success(university ? "University updated successfully!" : "University created successfully!");
    } catch (error) {
      toast.error("Error saving university data");
      console.error("Error:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {university ? "Edit University" : "Add New University"}
          </DialogTitle>
          <DialogDescription>
            {university
              ? "Update university information"
              : "Add a new university to the platform"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-end mb-4">
            <Button
              type="button"
              variant="outline"
              onClick={generateAIData}
              className="mr-2"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate AI Data
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="rankings">Rankings</TabsTrigger>
              <TabsTrigger value="admissions">Admissions</TabsTrigger>
              <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="universityName">University Name *</Label>
                  <Input
                    id="universityName"
                    value={formData.universityName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => setFormData({ ...formData, country: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="France">France</SelectItem>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="China">China</SelectItem>
                      <SelectItem value="Japan">Japan</SelectItem>
                      <SelectItem value="South Korea">South Korea</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="fullAddress">Full Address</Label>
                <Input
                  id="fullAddress"
                  value={formData.fullAddress}
                  onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, isActive: checked as boolean })
                    }
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, isFeatured: checked as boolean })
                    }
                  />
                  <Label htmlFor="isFeatured">Featured</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <div>
                <Label htmlFor="shortDescription">Short Description</Label>
                <Input
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="overview">Overview</Label>
                <Textarea
                  id="overview"
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="history">History</Label>
                <Textarea
                  id="history"
                  value={formData.history}
                  onChange={(e) => setFormData({ ...formData, history: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="missionStatement">Mission Statement</Label>
                <Textarea
                  id="missionStatement"
                  value={formData.missionStatement}
                  onChange={(e) => setFormData({ ...formData, missionStatement: e.target.value })}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="visionStatement">Vision Statement</Label>
                <Textarea
                  id="visionStatement"
                  value={formData.visionStatement}
                  onChange={(e) => setFormData({ ...formData, visionStatement: e.target.value })}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="whyChooseHighlights">Why Choose Highlights</Label>
                <Textarea
                  id="whyChooseHighlights"
                  value={formData.whyChooseHighlights}
                  onChange={(e) => setFormData({ ...formData, whyChooseHighlights: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="careerOutcomes">Career Outcomes</Label>
                <Textarea
                  id="careerOutcomes"
                  value={formData.careerOutcomes}
                  onChange={(e) => setFormData({ ...formData, careerOutcomes: e.target.value })}
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="rankings" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="ftGlobalRanking">FT Global Ranking</Label>
                  <Input
                    id="ftGlobalRanking"
                    type="number"
                    value={formData.ftGlobalRanking}
                    onChange={(e) => setFormData({ ...formData, ftGlobalRanking: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="ftRegionalRanking">FT Regional Ranking</Label>
                  <Input
                    id="ftRegionalRanking"
                    type="number"
                    value={formData.ftRegionalRanking}
                    onChange={(e) => setFormData({ ...formData, ftRegionalRanking: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="ftRankingYear">FT Ranking Year</Label>
                  <Input
                    id="ftRankingYear"
                    type="number"
                    value={formData.ftRankingYear}
                    onChange={(e) => setFormData({ ...formData, ftRankingYear: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="usNewsRanking">US News Ranking</Label>
                  <Input
                    id="usNewsRanking"
                    type="number"
                    value={formData.usNewsRanking}
                    onChange={(e) => setFormData({ ...formData, usNewsRanking: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="qsRanking">QS Ranking</Label>
                  <Input
                    id="qsRanking"
                    type="number"
                    value={formData.qsRanking}
                    onChange={(e) => setFormData({ ...formData, qsRanking: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="timesRanking">Times Ranking</Label>
                  <Input
                    id="timesRanking"
                    type="number"
                    value={formData.timesRanking}
                    onChange={(e) => setFormData({ ...formData, timesRanking: e.target.value })}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="admissions" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="acceptanceRate">Acceptance Rate (%)</Label>
                  <Input
                    id="acceptanceRate"
                    type="number"
                    step="0.1"
                    value={formData.acceptanceRate}
                    onChange={(e) => setFormData({ ...formData, acceptanceRate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="minimumGpa">Minimum GPA</Label>
                  <Input
                    id="minimumGpa"
                    type="number"
                    step="0.1"
                    value={formData.minimumGpa}
                    onChange={(e) => setFormData({ ...formData, minimumGpa: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="gmatAverageScore">GMAT Average Score</Label>
                  <Input
                    id="gmatAverageScore"
                    type="number"
                    value={formData.gmatAverageScore}
                    onChange={(e) => setFormData({ ...formData, gmatAverageScore: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="gmatScoreMin">GMAT Min Score</Label>
                  <Input
                    id="gmatScoreMin"
                    type="number"
                    value={formData.gmatScoreMin}
                    onChange={(e) => setFormData({ ...formData, gmatScoreMin: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="gmatScoreMax">GMAT Max Score</Label>
                  <Input
                    id="gmatScoreMax"
                    type="number"
                    value={formData.gmatScoreMax}
                    onChange={(e) => setFormData({ ...formData, gmatScoreMax: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="languageTestRequirements">Language Test Requirements</Label>
                <Textarea
                  id="languageTestRequirements"
                  value={formData.languageTestRequirements}
                  onChange={(e) => setFormData({ ...formData, languageTestRequirements: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tuitionFees">Tuition Fees</Label>
                  <Input
                    id="tuitionFees"
                    type="number"
                    value={formData.tuitionFees}
                    onChange={(e) => setFormData({ ...formData, tuitionFees: e.target.value })}
                    onBlur={calculateTotalCost}
                  />
                </div>
                <div>
                  <Label htmlFor="additionalFees">Additional Fees</Label>
                  <Input
                    id="additionalFees"
                    type="number"
                    value={formData.additionalFees}
                    onChange={(e) => setFormData({ ...formData, additionalFees: e.target.value })}
                    onBlur={calculateTotalCost}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="totalCost">Total Cost</Label>
                  <Input
                    id="totalCost"
                    type="number"
                    value={formData.totalCost}
                    onChange={(e) => setFormData({ ...formData, totalCost: e.target.value })}
                    readOnly
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData({ ...formData, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="CAD">CAD</SelectItem>
                      <SelectItem value="AUD">AUD</SelectItem>
                      <SelectItem value="INR">INR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="admissionsOfficeContact">Admissions Office Contact</Label>
                  <Input
                    id="admissionsOfficeContact"
                    type="email"
                    value={formData.admissionsOfficeContact}
                    onChange={(e) => setFormData({ ...formData, admissionsOfficeContact: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="internationalOfficeContact">International Office Contact</Label>
                  <Input
                    id="internationalOfficeContact"
                    type="email"
                    value={formData.internationalOfficeContact}
                    onChange={(e) => setFormData({ ...formData, internationalOfficeContact: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="generalInquiriesContact">General Inquiries Contact</Label>
                  <Input
                    id="generalInquiriesContact"
                    type="email"
                    value={formData.generalInquiriesContact}
                    onChange={(e) => setFormData({ ...formData, generalInquiriesContact: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="scholarshipInfo">Scholarship Information</Label>
                <Textarea
                  id="scholarshipInfo"
                  value={formData.scholarshipInfo}
                  onChange={(e) => setFormData({ ...formData, scholarshipInfo: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="financialAidDetails">Financial Aid Details</Label>
                <Textarea
                  id="financialAidDetails"
                  value={formData.financialAidDetails}
                  onChange={(e) => setFormData({ ...formData, financialAidDetails: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="accreditationDetails">Accreditation Details</Label>
                <Textarea
                  id="accreditationDetails"
                  value={formData.accreditationDetails}
                  onChange={(e) => setFormData({ ...formData, accreditationDetails: e.target.value })}
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="metaKeywords">Meta Keywords</Label>
                <Input
                  id="metaKeywords"
                  value={formData.metaKeywords}
                  onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="canonicalUrl">Canonical URL</Label>
                <Input
                  id="canonicalUrl"
                  type="url"
                  value={formData.canonicalUrl}
                  onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {university ? "Update University" : "Create University"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function UniversityManagement() {
  const [universities, setUniversities] = useState<University[]>(mockUniversities);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState<University | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const filteredUniversities = universities.filter((uni) => {
    const matchesSearch = uni.universityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         uni.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         uni.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === "" || uni.country === selectedCountry;
    const matchesFeatured = !showFeaturedOnly || uni.isFeatured;
    
    return matchesSearch && matchesCountry && matchesFeatured;
  });

  const countries = Array.from(new Set(universities.map(uni => uni.country))).sort();

  const handleSave = async (data: any) => {
    if (editingUniversity) {
      // Update existing university
      setUniversities(universities.map(uni => 
        uni.id === editingUniversity.id 
          ? { ...uni, ...data, updatedAt: new Date() }
          : uni
      ));
    } else {
      // Create new university
      const newUniversity: University = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setUniversities([...universities, newUniversity]);
    }
    setIsFormOpen(false);
    setEditingUniversity(undefined);
  };

  const handleEdit = (university: University) => {
    setEditingUniversity(university);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setUniversities(universities.filter(uni => uni.id !== id));
    toast.success("University deleted successfully!");
  };

  const handleToggleFeatured = (id: string) => {
    setUniversities(universities.map(uni => 
      uni.id === id ? { ...uni, isFeatured: !uni.isFeatured } : uni
    ));
  };


  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">University Management</h1>
          <p className="text-gray-600">Manage universities and their information</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add University
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Universities</p>
                <p className="text-2xl font-bold">{universities.length}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Featured</p>
                <p className="text-2xl font-bold">{universities.filter(u => u.isFeatured).length}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold">{universities.filter(u => u.isActive).length}</p>
              </div>
              <Award className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Countries</p>
                <p className="text-2xl font-bold">{countries.length}</p>
              </div>
              <Globe className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search universities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="All countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All countries</SelectItem>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <Checkbox
                id="featured"
                checked={showFeaturedOnly}
                onCheckedChange={checked => setShowFeaturedOnly(checked === true)}
              />
              <Label htmlFor="featured">Featured only</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Universities Table */}
      <Card>
        <CardHeader>
          <CardTitle>Universities ({filteredUniversities.length})</CardTitle>
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
              {filteredUniversities.map((university) => (
                <TableRow key={university.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{university.universityName}</div>
                      <div className="text-sm text-gray-500">{university.shortDescription}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{university.city}, {university.country}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {university.ftGlobalRanking && (
                        <Badge variant="outline">FT #{university.ftGlobalRanking}</Badge>
                      )}
                      {university.qsRanking && (
                        <Badge variant="outline">QS #{university.qsRanking}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span>
                        {university.totalCost?.toLocaleString()} {university.currency}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Badge variant={university.isActive ? "default" : "secondary"}>
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
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(university)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleFeatured(university.id)}
                      >
                        <Star className={`h-4 w-4 ${university.isFeatured ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(university.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <UniversityForm
        university={editingUniversity}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingUniversity(undefined);
        }}
        onSave={handleSave}
      />
    </div>
  );
}