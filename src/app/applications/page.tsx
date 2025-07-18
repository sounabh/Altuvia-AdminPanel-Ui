/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useState, useEffect } from 'react';
import { 
  User, 
  FileText, 
  Upload, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Eye,
  Edit,
  Download,
  Plus,
  Filter,
  Search,
  BarChart3,
  Users
} from 'lucide-react';

// Type definitions
interface University {
  id: string;
  universityName: string;
  city: string;
  country: string;
}

interface Program {
  id: string;
  programName: string;
  degreeType: string;
  programLength: number;
}

interface Intake {
  id: string;
  intakeName: string;
  intakeType: string;
  intakeYear: number;
  startDate: string;
}

interface Document {
  id: string;
  documentType: string;
  documentTitle: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  isRequired: boolean;
  isVerified: boolean;
  verifiedAt?: string;
  documentStatus: string;
  uploadedAt: string;
}

interface ApplicationProgress {
  id: string;
  stageName: string;
  stageStatus: string;
  startedAt?: string | null;
  completedAt?: string | null;
  notes?: string | null;
}

interface Interview {
  id: string;
  interviewType: string;
  scheduledDate: string;
  interviewerName: string;
  interviewerEmail: string;
  meetingLink: string;
  interviewStatus: string;
  duration: number;
}

interface ScholarshipApplication {
  id: string;
  scholarshipName: string;
  applicationStatus: string;
  awardAmount: number;
  submissionDate: string;
}

interface EssaySubmission {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  status: string;
  submissionDate: string;
  essayPrompt: {
    promptTitle: string;
    wordLimit: number;
  };
}

interface Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  currentGpa: number;
  gmatScore: number | null;
  greScore: number | null;
  ieltsScore: number | null;
  toeflScore: number | null;
  workExperienceMonths: number;
  workExperienceDetails: string;
  applicationStatus: string;
  currentStage: string;
  stageUpdatedAt: string;
  completionPercentage: number;
  submissionDate: string;
  reviewDate: string | null;
  decisionDate: string | null;
  lastActivityAt: string;
  applicationFeesPaid: boolean;
  applicationFeesAmount: number;
  documentsVerified: boolean;
  lastContactDate: string;
  contactNotes: string;
  createdAt: string;
  updatedAt: string;
  university: University;
  program: Program;
  intake: Intake;
  documents: Document[];
  applicationProgress: ApplicationProgress[];
  interviews: Interview[];
  scholarshipApplications: ScholarshipApplication[];
  essaySubmissions: EssaySubmission[];
}

const ApplicationManagementPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [documentFilter, setDocumentFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual database operations
  const mockApplications: Application[] = [
    {
      id: 'app_001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '+1-555-0123',
      dateOfBirth: '1995-06-15',
      nationality: 'American',
      currentGpa: 3.8,
      gmatScore: 720,
      greScore: null,
      ieltsScore: 7.5,
      toeflScore: null,
      workExperienceMonths: 24,
      workExperienceDetails: 'Software Engineer at Tech Corp',
      applicationStatus: 'UNDER_REVIEW',
      currentStage: 'DOCUMENT_REVIEW',
      stageUpdatedAt: '2024-01-15T10:30:00Z',
      completionPercentage: 85.5,
      submissionDate: '2024-01-10T14:20:00Z',
      reviewDate: '2024-01-12T09:15:00Z',
      decisionDate: null,
      lastActivityAt: '2024-01-15T16:45:00Z',
      applicationFeesPaid: true,
      applicationFeesAmount: 100,
      documentsVerified: false,
      lastContactDate: '2024-01-14T11:30:00Z',
      contactNotes: 'Requested additional transcript copy',
      createdAt: '2024-01-08T08:00:00Z',
      updatedAt: '2024-01-15T16:45:00Z',
      university: {
        id: 'uni_001',
        universityName: 'Stanford University',
        city: 'Stanford',
        country: 'USA'
      },
      program: {
        id: 'prog_001',
        programName: 'Master of Science in Computer Science',
        degreeType: 'Masters',
        programLength: 2
      },
      intake: {
        id: 'int_001',
        intakeName: 'Fall 2024',
        intakeType: 'FALL',
        intakeYear: 2024,
        startDate: '2024-09-01'
      },
      documents: [
        {
          id: 'doc_001',
          documentType: 'TRANSCRIPT',
          documentTitle: 'Official Transcript',
          fileName: 'transcript_john_doe.pdf',
          fileUrl: '/uploads/transcript_john_doe.pdf',
          fileSize: 2048000,
          isRequired: true,
          isVerified: true,
          verifiedAt: '2024-01-12T10:00:00Z',
          documentStatus: 'VERIFIED',
          uploadedAt: '2024-01-09T15:30:00Z'
        },
        {
          id: 'doc_002',
          documentType: 'SOP',
          documentTitle: 'Statement of Purpose',
          fileName: 'sop_john_doe.pdf',
          fileUrl: '/uploads/sop_john_doe.pdf',
          fileSize: 1024000,
          isRequired: true,
          isVerified: false,
          documentStatus: 'PENDING',
          uploadedAt: '2024-01-10T12:00:00Z'
        },
        {
          id: 'doc_003',
          documentType: 'RESUME',
          documentTitle: 'Resume/CV',
          fileName: 'resume_john_doe.pdf',
          fileUrl: '/uploads/resume_john_doe.pdf',
          fileSize: 512000,
          isRequired: true,
          isVerified: true,
          verifiedAt: '2024-01-11T14:30:00Z',
          documentStatus: 'VERIFIED',
          uploadedAt: '2024-01-09T10:15:00Z'
        }
      ],
      applicationProgress: [
        {
          id: 'prog_001',
          stageName: 'DOCUMENT_COLLECTION',
          stageStatus: 'COMPLETED',
          startedAt: '2024-01-08T08:00:00Z',
          completedAt: '2024-01-10T18:00:00Z',
          notes: 'All required documents uploaded'
        },
        {
          id: 'prog_002',
          stageName: 'DOCUMENT_REVIEW',
          stageStatus: 'IN_PROGRESS',
          startedAt: '2024-01-11T09:00:00Z',
          completedAt: null,
          notes: 'Reviewing transcript and SOP'
        },
        {
          id: 'prog_003',
          stageName: 'INTERVIEW',
          stageStatus: 'PENDING',
          startedAt: null,
          completedAt: null,
          notes: null
        }
      ],
      interviews: [
        {
          id: 'int_001',
          interviewType: 'VIDEO',
          scheduledDate: '2024-01-20T14:00:00Z',
          interviewerName: 'Dr. Sarah Johnson',
          interviewerEmail: 'sarah.johnson@stanford.edu',
          meetingLink: 'https://zoom.us/meeting/123',
          interviewStatus: 'SCHEDULED',
          duration: 60
        }
      ],
      scholarshipApplications: [
        {
          id: 'schol_001',
          scholarshipName: 'Merit Scholarship',
          applicationStatus: 'UNDER_REVIEW',
          awardAmount: 15000,
          submissionDate: '2024-01-10T16:00:00Z'
        }
      ],
      essaySubmissions: [
        {
          id: 'essay_001',
          title: 'Why Computer Science?',
          content: 'My passion for computer science began...',
          wordCount: 650,
          status: 'SUBMITTED',
          submissionDate: '2024-01-10T20:00:00Z',
          essayPrompt: {
            promptTitle: 'Personal Statement',
            wordLimit: 750
          }
        }
      ]
    }
  ];

  useEffect(() => {
    loadApplications();
  });

  const loadApplications = async () => {
    setLoading(true);
    try {
      setApplications(mockApplications);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    console.log(`Updating application ${applicationId} status to ${newStatus}`);
  };

  const uploadDocument = async (applicationId: string, documentData: Partial<Document>) => {
    console.log(`Uploading document for application ${applicationId}`);
  };

  const verifyDocument = async (documentId: string) => {
    console.log(`Verifying document ${documentId}`);
  };

  const scheduleInterview = async (applicationId: string, interviewData: Partial<Interview>) => {
    console.log(`Scheduling interview for application ${applicationId}`);
  };

  const updateApplicationProgress = async (applicationId: string, progressData: Partial<ApplicationProgress>) => {
    console.log(`Updating progress for application ${applicationId}`);
  };

  const sendNotification = async (applicationId: string, notificationData: Record<string, unknown>) => {
    console.log(`Sending notification for application ${applicationId}`);
  };

  const generateReport = async (reportType: string, filters: Record<string, unknown>) => {
    console.log(`Generating ${reportType} report with filters:`, filters);
  };

  const exportApplicationData = async (applicationId: string) => {
    console.log(`Exporting data for application ${applicationId}`);
  };

  // Filter applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.university.universityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.program.programName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || app.applicationStatus === statusFilter;
    
    const matchesDocument = documentFilter === 'all' || 
      (documentFilter === 'verified' && app.documentsVerified) ||
      (documentFilter === 'pending' && !app.documentsVerified);

    return matchesSearch && matchesStatus && matchesDocument;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'DRAFT': 'bg-gray-100 text-gray-800',
      'IN_PROGRESS': 'bg-blue-100 text-blue-800',
      'SUBMITTED': 'bg-indigo-100 text-indigo-800',
      'UNDER_REVIEW': 'bg-yellow-100 text-yellow-800',
      'INTERVIEW_SCHEDULED': 'bg-purple-100 text-purple-800',
      'ACCEPTED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'WAITLISTED': 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'REJECTED':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Analytics
  const analytics = {
    totalApplications: applications.length
  };

  return (
    <div className="min-h-screen  bg-white shadow-sm border-b">
      {/* Header */}
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4"> {/* Reduced padding */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Application Management</h1> {/* Smaller font */}
            </div>
            <div className="flex items-center space-x-3"> {/* Reduced spacing */}
              <button
                onClick={() => generateReport('overview', {})}
                className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm" /* Smaller button */
              >
                <BarChart3 className="w-4 h-4 mr-1" /> {/* Smaller icon */}
                Generate Report
              </button>
            </div>
          </div>
        </div>



      {/* Analytics Dashboard */}
      {/* Analytics Dashboard - Made Compact */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"> {/* Reduced padding */}
        <div className="mb-4"> {/* Reduced margin */}
          <div className="bg-white p-4 rounded-lg shadow w-48"> {/* Compact size */}
            <div className="flex items-center">
              <Users className="w-6 h-6 text-blue-600" /> {/* Smaller icon */}
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Total Applications</p>
                <p className="text-lg font-bold text-gray-900">{analytics.totalApplications}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="DRAFT">Draft</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="REJECTED">Rejected</option>
              </select>

              <select
                value={documentFilter}
                onChange={(e) => setDocumentFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Documents</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documents
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {application.firstName} {application.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{application.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{application.program.programName}</div>
                      <div className="text-sm text-gray-500">{application.university.universityName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.applicationStatus)}`}>
                        {application.applicationStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${application.completionPercentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {application.completionPercentage}% Complete
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900">
                          {application.documents.filter(doc => doc.isVerified).length}/{application.documents.length}
                        </span>
                        {application.documentsVerified ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-yellow-600" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(application.lastActivityAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedApplication(application)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(application.id, 'UNDER_REVIEW')}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => exportApplicationData(application.id)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Application Detail Modal */}
        {selectedApplication && (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-auto"> {/* Added overflow */}
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[85vh] overflow-y-auto"> 
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedApplication.firstName} {selectedApplication.lastName} - Application Details
                  </h3>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b">
                <nav className="flex space-x-8 px-6">
                  {['overview', 'documents', 'progress', 'interviews', 'essays', 'scholarships'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 text-sm font-medium capitalize ${
                        activeTab === tab
                          ? 'border-b-2 border-blue-500 text-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900">Personal Information</h4>
                      <div className="space-y-2">
                        <p><span className="font-medium">Name:</span> {selectedApplication.firstName} {selectedApplication.lastName}</p>
                        <p><span className="font-medium">Email:</span> {selectedApplication.email}</p>
                        <p><span className="font-medium">Phone:</span> {selectedApplication.phone}</p>
                        <p><span className="font-medium">Date of Birth:</span> {selectedApplication.dateOfBirth}</p>
                        <p><span className="font-medium">Nationality:</span> {selectedApplication.nationality}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900">Academic Information</h4>
                      <div className="space-y-2">
                        <p><span className="font-medium">GPA:</span> {selectedApplication.currentGpa}</p>
                        <p><span className="font-medium">GMAT Score:</span> {selectedApplication.gmatScore || 'N/A'}</p>
                        <p><span className="font-medium">IELTS Score:</span> {selectedApplication.ieltsScore || 'N/A'}</p>
                        <p><span className="font-medium">Work Experience:</span> {selectedApplication.workExperienceMonths} months</p>
                        <p><span className="font-medium">Experience Details:</span> {selectedApplication.workExperienceDetails}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900">Program Information</h4>
                      <div className="space-y-2">
                        <p><span className="font-medium">University:</span> {selectedApplication.university.universityName}</p>
                        <p><span className="font-medium">Program:</span> {selectedApplication.program.programName}</p>
                        <p><span className="font-medium">Degree Type:</span> {selectedApplication.program.degreeType}</p>
                        <p><span className="font-medium">Duration:</span> {selectedApplication.program.programLength} years</p>
                        <p><span className="font-medium">Intake:</span> {selectedApplication.intake.intakeName}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900">Application Status</h4>
                      <div className="space-y-2">
                        <p><span className="font-medium">Status:</span> 
                          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedApplication.applicationStatus)}`}>
                            {selectedApplication.applicationStatus.replace('_', ' ')}
                          </span>
                        </p>
                        <p><span className="font-medium">Current Stage:</span> {selectedApplication.currentStage}</p>
                        <p><span className="font-medium">Completion:</span> {selectedApplication.completionPercentage}%</p>
                        <p><span className="font-medium">Fees Paid:</span> {selectedApplication.applicationFeesPaid ? 'Yes' : 'No'}</p>
                        <p><span className="font-medium">Submission Date:</span> {formatDate(selectedApplication.submissionDate)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Documents</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedApplication.documents.map((document) => (
                        <div key={document.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-blue-600" />
                              <span className="font-medium">{document.documentTitle}</span>
                              {getDocumentStatusIcon(document.documentStatus)}
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => verifyDocument(document.id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button className="text-blue-600 hover:text-blue-900">
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p><span className="font-medium">Type:</span> {document.documentType}</p>
                            <p><span className="font-medium">File:</span> {document.fileName}</p>
                            <p><span className="font-medium">Size:</span> {formatFileSize(document.fileSize)}</p>
                            <p><span className="font-medium">Required:</span> {document.isRequired ? 'Yes' : 'No'}</p>
                            <p><span className="font-medium">Uploaded:</span> {formatDate(document.uploadedAt)}</p>
                            {document.verifiedAt && (
                              <p><span className="font-medium">Verified:</span> {formatDate(document.verifiedAt)}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'progress' && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Application Progress</h4>
                    <div className="space-y-4">
                      {selectedApplication.applicationProgress.map((stage, index) => (
                        <div key={stage.id} className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              stage.stageStatus === 'COMPLETED' ? 'bg-green-100 text-green-600' :
                              stage.stageStatus === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-600' :
                              'bg-gray-100 text-gray-400'
                            }`}>
                              {stage.stageStatus === 'COMPLETED' ? (
                                <CheckCircle className="w-5 h-5" />
                              ) : stage.stageStatus === 'IN_PROGRESS' ? (
                                <Clock className="w-5 h-5" />
                              ) : (
                                <AlertCircle className="w-5 h-5" />
                              )}
                            </div>
                            {index < selectedApplication.applicationProgress.length - 1 && (
                              <div className="w-0.5 h-8 bg-gray-200 mx-auto mt-2"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium text-gray-900">{stage.stageName.replace('_', ' ')}</h5>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                stage.stageStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                stage.stageStatus === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {stage.stageStatus.replace('_', ' ')}
                              </span>
                            </div>
                            <div className="mt-1 text-sm text-gray-600">
                              {stage.startedAt && (
                                <p>Started: {formatDate(stage.startedAt)}</p>
                              )}
                              {stage.completedAt && (
                                <p>Completed: {formatDate(stage.completedAt)}</p>
                              )}
                              {stage.notes && (
                                <p className="mt-2 text-sm text-gray-700">{stage.notes}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'interviews' && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Interviews</h4>
                    
                    {selectedApplication.interviews.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedApplication.interviews.map((interview) => (
                          <div key={interview.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-gray-900">{interview.interviewType} Interview</h5>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                interview.interviewStatus === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                                interview.interviewStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {interview.interviewStatus}
                              </span>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p><span className="font-medium">Date:</span> {formatDate(interview.scheduledDate)}</p>
                              <p><span className="font-medium">Interviewer:</span> {interview.interviewerName}</p>
                              <p><span className="font-medium">Email:</span> {interview.interviewerEmail}</p>
                              <p><span className="font-medium">Duration:</span> {interview.duration} minutes</p>
                              {interview.meetingLink && (
                                <p><span className="font-medium">Meeting Link:</span> 
                                  <a href={interview.meetingLink} className="text-blue-600 hover:text-blue-800 ml-1">
                                    Join Meeting
                                  </a>
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">No interviews scheduled yet.</p>
                    )}
                  </div>
                )}

                {activeTab === 'essays' && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Essay Submissions</h4>
                    
                    {selectedApplication.essaySubmissions.length > 0 ? (
                      <div className="space-y-4">
                        {selectedApplication.essaySubmissions.map((essay) => (
                          <div key={essay.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-gray-900">{essay.title}</h5>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                essay.status === 'SUBMITTED' ? 'bg-green-100 text-green-800' :
                                essay.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {essay.status}
                              </span>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600">
                              <p><span className="font-medium">Prompt:</span> {essay.essayPrompt.promptTitle}</p>
                              <p><span className="font-medium">Word Count:</span> {essay.wordCount}/{essay.essayPrompt.wordLimit}</p>
                              <p><span className="font-medium">Submitted:</span> {formatDate(essay.submissionDate)}</p>
                            </div>
                            <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                              <p className="text-gray-700">{essay.content.substring(0, 150)}...</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">No essays submitted yet.</p>
                    )}
                  </div>
                )}

                {activeTab === 'scholarships' && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Scholarship Applications</h4>
                    
                    {selectedApplication.scholarshipApplications.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedApplication.scholarshipApplications.map((scholarship) => (
                          <div key={scholarship.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-gray-900">{scholarship.scholarshipName}</h5>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                scholarship.applicationStatus === 'UNDER_REVIEW' ? 'bg-yellow-100 text-yellow-800' :
                                scholarship.applicationStatus === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {scholarship.applicationStatus.replace('_', ' ')}
                              </span>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p><span className="font-medium">Award Amount:</span> ${scholarship.awardAmount.toLocaleString()}</p>
                              <p><span className="font-medium">Submitted:</span> {formatDate(scholarship.submissionDate)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">No scholarship applications submitted.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="border-t px-6 py-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => sendNotification(selectedApplication.id, { type: 'status_update' })}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Send Notification
                    </button>
                    <button
                      onClick={() => exportApplicationData(selectedApplication.id)}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </button>
                  </div>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationManagementPage;