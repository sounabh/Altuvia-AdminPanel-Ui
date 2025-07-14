/**
 * University image interface
 */
export interface UniversityImage {
  id: string;
  universityId: string;
  imageUrl: string;
  imageType?: string | null;
  imageTitle?: string | null;
  imageAltText: string;
  imageCaption?: string | null;
  isPrimary: boolean;
  displayOrder: number;
  fileSize?: number | null;
  width?: number | null;
  height?: number | null;
  createdAt: Date;

  university?: University;
}

/**
 * University entity interface matching Prisma schema
 */
export interface University {
  id: string;
  universityName: string;
  slug: string;
  city: string;
  state?: string | null;
  country: string;
  fullAddress?: string | null;
  shortDescription?: string | null;
  overview?: string | null;
  history?: string | null;
  missionStatement?: string | null;
  visionStatement?: string | null;
  accreditationDetails?: string | null;
  whyChooseHighlights?: string | null;
  careerOutcomes?: string | null;

  // Rankings
  ftGlobalRanking?: number | null;
  ftRegionalRanking?: number | null;
  ftRankingYear?: number | null;
  usNewsRanking?: number | null;
  qsRanking?: number | null;
  timesRanking?: number | null;

  // Admissions
  acceptanceRate?: number | null;
  gmatAverageScore?: number | null;
  gmatScoreMin?: number | null;
  gmatScoreMax?: number | null;
  minimumGpa?: number | null;
  languageTestRequirements?: string | null;

  // Fees
  tuitionFees?: number | null;
  additionalFees?: number | null;
  totalCost?: number | null;
  currency: string;
  scholarshipInfo?: string | null;
  financialAidDetails?: string | null;

  // Contact
  admissionsOfficeContact?: string | null;
  internationalOfficeContact?: string | null;
  generalInquiriesContact?: string | null;
  websiteUrl?: string | null;

  // SEO
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  canonicalUrl?: string | null;

  // Status
  isActive: boolean;
  isFeatured: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Relations
  images?: UniversityImage[];
}

/**
 * Form data interface for creating/updating universities
 */
export interface UniversityFormData {
  universityName: string;
  slug: string;
  city: string;
  state?: string | null;
  country: string;
  fullAddress?: string | null;
  shortDescription?: string | null;
  overview?: string | null;
  history?: string | null;
  missionStatement?: string | null;
  visionStatement?: string | null;
  accreditationDetails?: string | null;
  whyChooseHighlights?: string | null;
  careerOutcomes?: string | null;

  // Rankings
  ftGlobalRanking?: number | null;
  ftRegionalRanking?: number | null;
  ftRankingYear?: number | null;
  usNewsRanking?: number | null;
  qsRanking?: number | null;
  timesRanking?: number | null;

  // Admissions
  acceptanceRate?: number | null;
  gmatAverageScore?: number | null;
  gmatScoreMin?: number | null;
  gmatScoreMax?: number | null;
  minimumGpa?: number | null;
  languageTestRequirements?: string | null;

  // Fees
  tuitionFees?: number | null;
  additionalFees?: number | null;
  totalCost?: number | null;
  currency: string;
  scholarshipInfo?: string | null;
  financialAidDetails?: string | null;

  // Contact
  admissionsOfficeContact?: string | null;
  internationalOfficeContact?: string | null;
  generalInquiriesContact?: string | null;
  websiteUrl?: string | null;

  // SEO
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  canonicalUrl?: string | null;

  // Status
  isActive: boolean;
  isFeatured: boolean;
}

/**
 * University filters interface
 */
export interface UniversityFilters {
  searchTerm: string;
  selectedCountry: string;
  showFeaturedOnly: boolean;
}

/**
 * University statistics interface
 */
export interface UniversityStats {
  total: number;
  featured: number;
  active: number;
  countries: number;
}

/**
 * University search and pagination interface
 */
export interface UniversitySearchParams {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  featured?: boolean;
  sortBy?: 'name' | 'created' | 'ranking';
  sortOrder?: 'asc' | 'desc';
}

/**
 * University ranking information
 */
export interface UniversityRanking {
  type: 'FT' | 'QS' | 'USNews' | 'Times';
  globalRank?: number;
  regionalRank?: number;
  year?: number;
}

/**
 * University admission requirements
 */
export interface AdmissionRequirements {
  acceptanceRate?: number;
  minimumGpa?: number;
  gmatRequirements?: {
    average?: number;
    minimum?: number;
    maximum?: number;
  };
  languageRequirements?: string;
}

/**
 * University cost information
 */
export interface UniversityCost {
  tuitionFees?: number;
  additionalFees?: number;
  totalCost?: number;
  currency: string;
  scholarshipInfo?: string;
  financialAidDetails?: string;
}

/**
 * University contact information
 */
export interface UniversityContact {
  admissionsOffice?: string;
  internationalOffice?: string;
  generalInquiries?: string;
  website?: string;
}

/**
 * University SEO metadata
 */
export interface UniversitySEO {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
}

/**
 * University validation errors
 */
export interface UniversityValidationErrors {
  universityName?: string;
  slug?: string;
  city?: string;
  country?: string;
  [key: string]: string | undefined;
}
