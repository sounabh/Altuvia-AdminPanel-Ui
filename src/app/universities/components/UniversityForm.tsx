/* eslint-disable @typescript-eslint/no-unused-vars */
// components/university/UniversityForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Save, X, Loader2 } from "lucide-react";
import { University, UniversityFormData, UniversityImage } from "../types/university";
import { UniversityImageManager } from "./UniversityImageManager";
import { getUniversityImages } from "../actions/UniActions";
import { toast } from "sonner";

interface UniversityFormProps {
  university?: University;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UniversityFormData) => Promise<void>;
}

export function UniversityForm({ 
  university, 
  isOpen, 
  onClose, 
  onSave 
}: UniversityFormProps) {
  
  const [formData, setFormData] = useState<UniversityFormData>({
    universityName: "",
    slug: "",
    city: "",
    state: "",
    country: "",
    fullAddress: "",
    shortDescription: "",
    overview: "",
    history: "",
    missionStatement: "",
    visionStatement: "",
    accreditationDetails: "",
    whyChooseHighlights: [],
    careerOutcomes: "",
    ftGlobalRanking: undefined,
    ftRegionalRanking: undefined,
    ftRankingYear: undefined,
    usNewsRanking: undefined,
    qsRanking: undefined,
    timesRanking: undefined,
    acceptanceRate: undefined,
    gmatAverageScore: undefined,
    gmatScoreMin: undefined,
    gmatScoreMax: undefined,
    minimumGpa: undefined,
    languageTestRequirements: "",
    tuitionFees: undefined,
    additionalFees: undefined,
    totalCost: undefined,
    currency: "USD",
    scholarshipInfo: "",
    financialAidDetails: "",
    admissionsOfficeContact: "",
    internationalOfficeContact: "",
    generalInquiriesContact: "",
    websiteUrl: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    canonicalUrl: "",
    isActive: true,
    isFeatured: false,
    // New fields
    averageDeadlines: "",
    studentsPerYear: undefined,
    brochureUrl: "",
    additionalDocumentUrls: [],
    averageProgramLengthMonths: undefined,
    intakes: "",
  });

  const [activeTab, setActiveTab] = useState("basic");
  const [images, setImages] = useState<UniversityImage[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (university) {
      setFormData({
        universityName: university.universityName || "",
        slug: university.slug || "",
        city: university.city || "",
        state: university.state || "",
        country: university.country || "",
        fullAddress: university.fullAddress || "",
        shortDescription: university.shortDescription || "",
        overview: university.overview || "",
        history: university.history || "",
        missionStatement: university.missionStatement || "",
        visionStatement: university.visionStatement || "",
        accreditationDetails: university.accreditationDetails || "",
        whyChooseHighlights: university.whyChooseHighlights || [],
        careerOutcomes: university.careerOutcomes || "",
        ftGlobalRanking: university.ftGlobalRanking,
        ftRegionalRanking: university.ftRegionalRanking,
        ftRankingYear: university.ftRankingYear,
        usNewsRanking: university.usNewsRanking,
        qsRanking: university.qsRanking,
        timesRanking: university.timesRanking,
        acceptanceRate: university.acceptanceRate,
        gmatAverageScore: university.gmatAverageScore,
        gmatScoreMin: university.gmatScoreMin,
        gmatScoreMax: university.gmatScoreMax,
        minimumGpa: university.minimumGpa,
        languageTestRequirements: university.languageTestRequirements || "",
        tuitionFees: university.tuitionFees,
        additionalFees: university.additionalFees,
        totalCost: university.totalCost,
        currency: university.currency || "USD",
        scholarshipInfo: university.scholarshipInfo || "",
        financialAidDetails: university.financialAidDetails || "",
        admissionsOfficeContact: university.admissionsOfficeContact || "",
        internationalOfficeContact: university.internationalOfficeContact || "",
        generalInquiriesContact: university.generalInquiriesContact || "",
        websiteUrl: university.websiteUrl || "",
        metaTitle: university.metaTitle || "",
        metaDescription: university.metaDescription || "",
        metaKeywords: university.metaKeywords || "",
        canonicalUrl: university.canonicalUrl || "",
        isActive: university.isActive,
        isFeatured: university.isFeatured,
        // New fields
        averageDeadlines: university.averageDeadlines || "",
        studentsPerYear: university.studentsPerYear,
        brochureUrl: university.brochureUrl || "",
        additionalDocumentUrls: university.additionalDocumentUrls || [],
        averageProgramLengthMonths: university.averageProgramLengthMonths,
        intakes: university.intakes || "",
      });

      // Load images for existing university
      loadUniversityImages(university.id);
    } else {
      // Reset images for new university
      setImages([]);
    }
  }, [university]);

  // Reset submitting state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const loadUniversityImages = async (universityId: string) => {
    try {
      setIsLoadingImages(true);
      const universityImages = await getUniversityImages(universityId);
      setImages(universityImages);
    } catch (error) {
      console.error("Error loading university images:", error);
      toast.error("Failed to load university images");
    } finally {
      setIsLoadingImages(false);
    }
  };

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
    const tuition = parseFloat(formData.tuitionFees?.toString() || "0");
    const additional = parseFloat(formData.additionalFees?.toString() || "0");
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
      whyChooseHighlights: [
        "World-class faculty with industry experience",
        "Strong industry connections and placement opportunities",
        "State-of-the-art campus facilities",
        "Diverse student community from over 50 countries"
      ],
      ftGlobalRanking: Math.floor(Math.random() * 100) + 1,
      qsRanking: Math.floor(Math.random() * 200) + 1,
      usNewsRanking: Math.floor(Math.random() * 150) + 1,
      acceptanceRate: Math.floor(Math.random() * 30) + 5,
      gmatAverageScore: Math.floor(Math.random() * 100) + 650,
      gmatScoreMin: Math.floor(Math.random() * 50) + 600,
      gmatScoreMax: Math.floor(Math.random() * 50) + 750,
      minimumGpa: parseFloat((Math.random() * 1.5 + 2.5).toFixed(1)),
      tuitionFees,
      additionalFees,
      totalCost: tuitionFees + additionalFees,
      currency: "USD",
      websiteUrl: `https://www.${generateSlug(randomUniversity)}.edu`,
      languageTestRequirements: "IELTS 6.5 or TOEFL 80 or equivalent",
      isActive: true,
      isFeatured: Math.random() > 0.7,
      // New fields
      averageDeadlines: "January 15, May 15, September 15",
      studentsPerYear: Math.floor(Math.random() * 2000) + 1000,
      brochureUrl: `https://www.${generateSlug(randomUniversity)}.edu/brochure.pdf`,
      additionalDocumentUrls: [
        `https://www.${generateSlug(randomUniversity)}.edu/admission-requirements.pdf`,
        `https://www.${generateSlug(randomUniversity)}.edu/course-catalog.pdf`
      ],
      averageProgramLengthMonths: Math.floor(Math.random() * 24) + 12,
      intakes: "Fall, Spring, Summer",
    };

    setFormData({ ...formData, ...aiData });
    toast.success("AI-generated university data populated!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent double submission
    
    try {
      setIsSubmitting(true);
      await onSave(formData);
      onClose();
      toast.success(university ? "University updated successfully!" : "University created successfully!");
    } catch (error) {
      toast.error("Error saving university data");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImagesChange = (updatedImages: UniversityImage[]) => {
    setImages(updatedImages);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && onClose()}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {university ? "Edit University" : "Add New University"}
          </DialogTitle>
          <DialogDescription>
            {university
              ? "Update university information and manage images"
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
              disabled={isSubmitting}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate AI Data
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic" disabled={isSubmitting}>Basic Info</TabsTrigger>
              <TabsTrigger value="content" disabled={isSubmitting}>Content</TabsTrigger>
              <TabsTrigger value="rankings" disabled={isSubmitting}>Rankings</TabsTrigger>
              <TabsTrigger value="admissions" disabled={isSubmitting}>Admissions</TabsTrigger>
              <TabsTrigger value="images" disabled={isSubmitting}>Images</TabsTrigger>
              <TabsTrigger value="seo" disabled={isSubmitting}>SEO & Meta</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="universityName">University Name *</Label>
                  <Input
                    id="universityName"
                    value={formData.universityName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    value={formData.state || ""}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => setFormData({ ...formData, country: value })}
                    disabled={isSubmitting}
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
                  value={formData.fullAddress || ""}
                  onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  value={formData.websiteUrl || ""}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="brochureUrl">Brochure URL</Label>
                <Input
                  id="brochureUrl"
                  type="url"
                  value={formData.brochureUrl || ""}
                  onChange={(e) => setFormData({ ...formData, brochureUrl: e.target.value })}
                  disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                  <Label htmlFor="isFeatured">Featured</Label>
                </div>
              </div>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4">
              <div>
                <Label htmlFor="shortDescription">Short Description</Label>
                <Input
                  id="shortDescription"
                  value={formData.shortDescription || ""}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="overview">Overview</Label>
                <Textarea
                  id="overview"
                  value={formData.overview || ""}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  rows={4}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="history">History</Label>
                <Textarea
                  id="history"
                  value={formData.history || ""}
                  onChange={(e) => setFormData({ ...formData, history: e.target.value })}
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="missionStatement">Mission Statement</Label>
                <Textarea
                  id="missionStatement"
                  value={formData.missionStatement || ""}
                  onChange={(e) => setFormData({ ...formData, missionStatement: e.target.value })}
                  rows={2}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="visionStatement">Vision Statement</Label>
                <Textarea
                  id="visionStatement"
                  value={formData.visionStatement || ""}
                  onChange={(e) => setFormData({ ...formData, visionStatement: e.target.value })}
                  rows={2}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="whyChooseHighlights">Why Choose Highlights (one per line)</Label>
                <Textarea
                  id="whyChooseHighlights"
                  value={formData.whyChooseHighlights?.join("\n") || ""}
                  onChange={(e) => 
                    setFormData({ 
                      ...formData, 
                      whyChooseHighlights: e.target.value.split("\n") 
                    })
                  }
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="careerOutcomes">Career Outcomes</Label>
                <Textarea
                  id="careerOutcomes"
                  value={formData.careerOutcomes || ""}
                  onChange={(e) => setFormData({ ...formData, careerOutcomes: e.target.value })}
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>
            </TabsContent>

            {/* Rankings Tab */}
            <TabsContent value="rankings" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="ftGlobalRanking">FT Global Ranking</Label>
                  <Input
                    id="ftGlobalRanking"
                    type="number"
                    value={formData.ftGlobalRanking || ""}
                    onChange={(e) => setFormData({ ...formData, ftGlobalRanking: e.target.value ? parseInt(e.target.value) : undefined })}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="ftRegionalRanking">FT Regional Ranking</Label>
                  <Input
                    id="ftRegionalRanking"
                    type="number"
                    value={formData.ftRegionalRanking || ""}
                    onChange={(e) => setFormData({ ...formData, ftRegionalRanking: e.target.value ? parseInt(e.target.value) : undefined })}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="ftRankingYear">FT Ranking Year</Label>
                  <Input
                    id="ftRankingYear"
                    type="number"
                    value={formData.ftRankingYear || ""}
                    onChange={(e) => setFormData({ ...formData, ftRankingYear: e.target.value ? parseInt(e.target.value) : undefined })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="usNewsRanking">US News Ranking</Label>
                  <Input
                    id="usNewsRanking"
                    type="number"
                    value={formData.usNewsRanking || ""}
                    onChange={(e) => setFormData({ ...formData, usNewsRanking: e.target.value ? parseInt(e.target.value) : undefined })}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="qsRanking">QS Ranking</Label>
                  <Input
                    id="qsRanking"
                    type="number"
                    value={formData.qsRanking || ""}
                    onChange={(e) => setFormData({ ...formData, qsRanking: e.target.value ? parseInt(e.target.value) : undefined })}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="timesRanking">Times Ranking</Label>
                  <Input
                    id="timesRanking"
                    type="number"
                    value={formData.timesRanking || ""}
                    onChange={(e) => setFormData({ ...formData, timesRanking: e.target.value ? parseInt(e.target.value) : undefined })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Admissions Tab */}
            <TabsContent value="admissions" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="acceptanceRate">Acceptance Rate (%)</Label>
                  <Input
                    id="acceptanceRate"
                    type="number"
                    step="0.1"
                    value={formData.acceptanceRate || ""}
                    onChange={(e) => setFormData({ ...formData, acceptanceRate: e.target.value ? parseFloat(e.target.value) : undefined })}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="minimumGpa">Minimum GPA</Label>
                  <Input
                    id="minimumGpa"
                    type="number"
                    step="0.1"
                    value={formData.minimumGpa || ""}
                    onChange={(e) => setFormData({ ...formData, minimumGpa: e.target.value ? parseFloat(e.target.value) : undefined })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="gmatAverageScore">GMAT Average Score</Label>
                  <Input
                    id="gmatAverageScore"
                    type="number"
                    value={formData.gmatAverageScore || ""}
                    onChange={(e) => setFormData({ ...formData, gmatAverageScore: e.target.value ? parseInt(e.target.value) : undefined })}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="gmatScoreMin">GMAT Min Score</Label>
                  <Input
                    id="gmatScoreMin"
                    type="number"
                    value={formData.gmatScoreMin || ""}
                    onChange={(e) => setFormData({ ...formData, gmatScoreMin: e.target.value ? parseInt(e.target.value) : undefined })}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="gmatScoreMax">GMAT Max Score</Label>
                  <Input
                    id="gmatScoreMax"
                    type="number"
                    value={formData.gmatScoreMax || ""}
                    onChange={(e) => setFormData({ ...formData, gmatScoreMax: e.target.value ? parseInt(e.target.value) : undefined })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="languageTestRequirements">Language Test Requirements</Label>
                <Textarea
                  id="languageTestRequirements"
                  value={formData.languageTestRequirements || ""}
                  onChange={(e) => setFormData({ ...formData, languageTestRequirements: e.target.value })}
                  rows={2}
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tuitionFees">Tuition Fees</Label>
                  <Input
                    id="tuitionFees"
                    type="number"
                    value={formData.tuitionFees || ""}
                    onChange={(e) => setFormData({ ...formData, tuitionFees: e.target.value ? parseFloat(e.target.value) : undefined })}
                    onBlur={calculateTotalCost}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="additionalFees">Additional Fees</Label>
                  <Input
                    id="additionalFees"
                    type="number"
                    value={formData.additionalFees || ""}
                    onChange={(e) => setFormData({ ...formData, additionalFees: e.target.value ? parseFloat(e.target.value) : undefined })}
                    onBlur={calculateTotalCost}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="totalCost">Total Cost</Label>
                  <Input
                    id="totalCost"
                    type="number"
                    value={formData.totalCost || ""}
                    onChange={(e) => setFormData({ ...formData, totalCost: e.target.value ? parseFloat(e.target.value) : undefined })}
                    readOnly
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency }
                    onValueChange={(value) => setFormData({ ...formData, currency: value })}
                    disabled={isSubmitting}
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
                    value={formData.admissionsOfficeContact || ""}
                    onChange={(e) => setFormData({ ...formData, admissionsOfficeContact: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="internationalOfficeContact">International Office Contact</Label>
                  <Input
                    id="internationalOfficeContact"
                    type="email"
                    value={formData.internationalOfficeContact || ""}
                    onChange={(e) => setFormData({ ...formData, internationalOfficeContact: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="generalInquiriesContact">General Inquiries Contact</Label>
                  <Input
                    id="generalInquiriesContact"
                    type="email"
                    value={formData.generalInquiriesContact || ""}
                    onChange={(e) => setFormData({ ...formData, generalInquiriesContact: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="averageDeadlines">Average Deadlines</Label>
                  <Input
                    id="averageDeadlines"
                    value={formData.averageDeadlines || ""}
                    onChange={(e) => setFormData({ ...formData, averageDeadlines: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="studentsPerYear">Students Per Year</Label>
                  <Input
                    id="studentsPerYear"
                    type="number"
                    value={formData.studentsPerYear || ""}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      studentsPerYear: e.target.value ? parseInt(e.target.value) : undefined 
                    })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="averageProgramLengthMonths">Avg. Program Length (Months)</Label>
                  <Input
                    id="averageProgramLengthMonths"
                    type="number"
                    value={formData.averageProgramLengthMonths || ""}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      averageProgramLengthMonths: e.target.value ? parseInt(e.target.value) : undefined 
                    })}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="intakes">Intakes</Label>
                  <Input
                    id="intakes"
                    value={formData.intakes || ""}
                    onChange={(e) => setFormData({ ...formData, intakes: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="additionalDocumentUrls">Additional Document URLs (one per line)</Label>
                <Textarea
                  id="additionalDocumentUrls"
                  value={formData.additionalDocumentUrls?.join("\n") || ""}
                  onChange={(e) => 
                    setFormData({ 
                      ...formData, 
                      additionalDocumentUrls: e.target.value.split("\n") 
                    })
                  }
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="scholarshipInfo">Scholarship Information</Label>
                <Textarea
                  id="scholarshipInfo"
                  value={formData.scholarshipInfo || ""}
                  onChange={(e) => setFormData({ ...formData, scholarshipInfo: e.target.value })}
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="financialAidDetails">Financial Aid Details</Label>
                <Textarea
                  id="financialAidDetails"
                  value={formData.financialAidDetails || ""}
                  onChange={(e) => setFormData({ ...formData, financialAidDetails: e.target.value })}
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="accreditationDetails">Accreditation Details</Label>
                <Textarea
                  id="accreditationDetails"
                  value={formData.accreditationDetails || ""}
                  onChange={(e) => setFormData({ ...formData, accreditationDetails: e.target.value })}
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>
            </TabsContent>

            {/* Images Tab */}
            <TabsContent value="images" className="space-y-4">
              {university ? (
                <UniversityImageManager
                  universityId={university.id}
                  images={images}
                  onImagesChange={handleImagesChange}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Save the university first to manage images.</p>
                </div>
              )}
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle || ""}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription || ""}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="metaKeywords">Meta Keywords</Label>
                <Input
                  id="metaKeywords"
                  value={formData.metaKeywords || ""}
                  onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="canonicalUrl">Canonical URL</Label>
                <Input
                  id="canonicalUrl"
                  type="url"
                  value={formData.canonicalUrl || ""}
                  onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {university ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {university ? "Update University" : "Create University"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}