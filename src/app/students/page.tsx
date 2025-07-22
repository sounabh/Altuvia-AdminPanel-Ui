/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useState, useEffect } from 'react';
import { 
  Users, Mail, Calendar, Download, Search, Filter, 
  MoreHorizontal, Bell, ChevronDown, FileText, Clock,
  CheckCircle, AlertCircle, GraduationCap, Phone,
  MapPin, Globe, Award, DollarSign, Edit3, Eye,
  TrendingUp, AlertTriangle, User
} from 'lucide-react';

// ==================== TYPE DEFINITIONS ====================
interface ApplicationDocument {
  id: string;
  documentType: string;
  documentTitle: string;
  documentStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NEEDS_REVISION';
  uploadedAt: string;
  verifiedAt?: string;
  verificationNotes?: string;
}

interface ApplicationProgress {
  id: string;
  stageName: string;
  stageStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';
  startedAt?: string;
  completedAt?: string;
  notes?: string;
}

interface Interview {
  id: string;
  interviewType: 'PHONE' | 'VIDEO' | 'IN_PERSON';
  scheduledDate?: string;
  interviewStatus: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  interviewScore?: number;
  interviewFeedback?: string;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  nationality?: string;
  
  // Academic Information
  currentGpa?: number;
  gmatScore?: number;
  greScore?: number;
  ieltsScore?: number;
  toeflScore?: number;
  workExperienceMonths?: number;
  
  // Application Details
  universityName: string;
  programName: string;
  intakeName: string;
  applicationStatus: 'DRAFT' | 'IN_PROGRESS' | 'DOCUMENTS_PENDING' | 'DOCUMENTS_COMPLETE' | 'SUBMITTED' | 'UNDER_REVIEW' | 'INTERVIEW_SCHEDULED' | 'INTERVIEW_COMPLETED' | 'DECISION_PENDING' | 'ACCEPTED' | 'REJECTED' | 'WAITLISTED' | 'DEFERRED';
  currentStage: 'DOCUMENT_COLLECTION' | 'DOCUMENT_REVIEW' | 'INTERVIEW' | 'FINAL_REVIEW' | 'DECISION';
  completionPercentage: number;
  
  // Important Dates
  submissionDate?: string;
  lastActivityAt: string;
  decisionDate?: string;
  
  // Related Data
  documents: ApplicationDocument[];
  progress: ApplicationProgress[];
  interviews: Interview[];
}

interface Metrics {
  totalStudents: number;
  activeApplications: number;
  pendingDocuments: number;
  upcomingInterviews: number;
  acceptedStudents: number;
  rejectedStudents: number;
}

// ==================== MAIN COMPONENT ====================
const StudentManagementSystem = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    applicationStatus: '',
    currentStage: '',
    university: '',
    nationality: ''
  });

  // Mock data based on Prisma schema
  const mockStudents: Student[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '+1-555-0123',
      dateOfBirth: '1995-08-15',
      nationality: 'USA',
      currentGpa: 3.8,
      gmatScore: 720,
      ieltsScore: 7.5,
      workExperienceMonths: 36,
      universityName: 'Harvard Business School',
      programName: 'Master of Business Administration',
      intakeName: 'Fall 2024',
      applicationStatus: 'UNDER_REVIEW',
      currentStage: 'DOCUMENT_REVIEW',
      completionPercentage: 85,
      submissionDate: '2024-02-15',
      lastActivityAt: '2024-02-20',
      documents: [
        {
          id: 'd1',
          documentType: 'TRANSCRIPT',
          documentTitle: 'Undergraduate Transcript',
          documentStatus: 'VERIFIED',
          uploadedAt: '2024-02-10',
          verifiedAt: '2024-02-12'
        },
        {
          id: 'd2',
          documentType: 'SOP',
          documentTitle: 'Statement of Purpose',
          documentStatus: 'PENDING',
          uploadedAt: '2024-02-14'
        },
        {
          id: 'd3',
          documentType: 'LOR',
          documentTitle: 'Letter of Recommendation',
          documentStatus: 'NEEDS_REVISION',
          uploadedAt: '2024-02-13',
          verificationNotes: 'Please provide signature'
        }
      ],
      progress: [
        {
          id: 'p1',
          stageName: 'DOCUMENT_COLLECTION',
          stageStatus: 'COMPLETED',
          startedAt: '2024-02-01',
          completedAt: '2024-02-14'
        },
        {
          id: 'p2',
          stageName: 'DOCUMENT_REVIEW',
          stageStatus: 'IN_PROGRESS',
          startedAt: '2024-02-15'
        }
      ],
      interviews: []
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.j@email.com',
      phone: '+1-555-0124',
      dateOfBirth: '1994-03-22',
      nationality: 'Canada',
      currentGpa: 3.9,
      greScore: 330,
      toeflScore: 110,
      workExperienceMonths: 48,
      universityName: 'Stanford University',
      programName: 'Master of Science in Computer Science',
      intakeName: 'Spring 2024',
      applicationStatus: 'ACCEPTED',
      currentStage: 'DECISION',
      completionPercentage: 100,
      submissionDate: '2023-11-20',
      lastActivityAt: '2024-01-15',
      decisionDate: '2024-01-15',
      documents: [
        {
          id: 'd4',
          documentType: 'TRANSCRIPT',
          documentTitle: 'Graduate Transcript',
          documentStatus: 'VERIFIED',
          uploadedAt: '2023-11-15',
          verifiedAt: '2023-11-18'
        },
        {
          id: 'd5',
          documentType: 'RESUME',
          documentTitle: 'Professional Resume',
          documentStatus: 'VERIFIED',
          uploadedAt: '2023-11-16',
          verifiedAt: '2023-11-19'
        }
      ],
      progress: [
        {
          id: 'p3',
          stageName: 'DOCUMENT_COLLECTION',
          stageStatus: 'COMPLETED',
          startedAt: '2023-11-01',
          completedAt: '2023-11-16'
        },
        {
          id: 'p4',
          stageName: 'DOCUMENT_REVIEW',
          stageStatus: 'COMPLETED',
          startedAt: '2023-11-17',
          completedAt: '2023-12-01'
        },
        {
          id: 'p5',
          stageName: 'INTERVIEW',
          stageStatus: 'COMPLETED',
          startedAt: '2023-12-05',
          completedAt: '2023-12-20'
        }
      ],
      interviews: [
        {
          id: 'i1',
          interviewType: 'VIDEO',
          scheduledDate: '2023-12-15',
          interviewStatus: 'COMPLETED',
          interviewScore: 4.5,
          interviewFeedback: 'Excellent technical knowledge'
        }
      ]
    },
    {
      id: '3',
      firstName: 'Raj',
      lastName: 'Patel',
      email: 'raj.patel@email.com',
      phone: '+91-98765-43210',
      dateOfBirth: '1996-11-08',
      nationality: 'India',
      currentGpa: 3.6,
      gmatScore: 700,
      ieltsScore: 7.0,
      workExperienceMonths: 24,
      universityName: 'MIT Sloan School of Management',
      programName: 'Master of Business Administration',
      intakeName: 'Fall 2024',
      applicationStatus: 'INTERVIEW_SCHEDULED',
      currentStage: 'INTERVIEW',
      completionPercentage: 75,
      submissionDate: '2024-01-30',
      lastActivityAt: '2024-02-18',
      documents: [
        {
          id: 'd6',
          documentType: 'TRANSCRIPT',
          documentTitle: 'Engineering Transcript',
          documentStatus: 'REJECTED',
          uploadedAt: '2024-01-25',
          verificationNotes: 'Transcript not from accredited institution'
        },
        {
          id: 'd7',
          documentType: 'SOP',
          documentTitle: 'Statement of Purpose',
          documentStatus: 'VERIFIED',
          uploadedAt: '2024-01-28',
          verifiedAt: '2024-02-01'
        }
      ],
      progress: [
        {
          id: 'p6',
          stageName: 'DOCUMENT_COLLECTION',
          stageStatus: 'COMPLETED',
          startedAt: '2024-01-15',
          completedAt: '2024-01-28'
        },
        {
          id: 'p7',
          stageName: 'DOCUMENT_REVIEW',
          stageStatus: 'COMPLETED',
          startedAt: '2024-01-29',
          completedAt: '2024-02-10'
        },
        {
          id: 'p8',
          stageName: 'INTERVIEW',
          stageStatus: 'IN_PROGRESS',
          startedAt: '2024-02-12'
        }
      ],
      interviews: [
        {
          id: 'i2',
          interviewType: 'VIDEO',
          scheduledDate: '2024-02-25',
          interviewStatus: 'SCHEDULED'
        }
      ]
    }
  ];

  const metrics: Metrics = {
    totalStudents: 156,
    activeApplications: 89,
    pendingDocuments: 23,
    upcomingInterviews: 8,
    acceptedStudents: 42,
    rejectedStudents: 12
  };

  useEffect(() => {
    setStudents(mockStudents);
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.universityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.programName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.applicationStatus ? student.applicationStatus === filters.applicationStatus : true;
    const matchesStage = filters.currentStage ? student.currentStage === filters.currentStage : true;
    const matchesUniversity = filters.university ? student.universityName.includes(filters.university) : true;
    const matchesNationality = filters.nationality ? student.nationality === filters.nationality : true;
    
    return matchesSearch && matchesStatus && matchesStage && matchesUniversity && matchesNationality;
  });

  const exportToPDF = () => {
    alert('Generating PDF report with student data...');
  };

  const exportToExcel = () => {
    alert('Exporting student data to Excel...');
  };

  const sendEmail = (studentId: string) => {
    alert(`Email reminder sent to student ${studentId}`);
  };

  const createTask = (studentId: string) => {
    alert(`Task created for student ${studentId}`);
  };

  const updateDocumentStatus = (studentId: string, docId: string, status: 'VERIFIED' | 'REJECTED' | 'NEEDS_REVISION') => {
    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        return {
          ...student,
          documents: student.documents.map(doc => 
            doc.id === docId ? {...doc, documentStatus: status, verifiedAt: status === 'VERIFIED' ? new Date().toISOString() : undefined} : doc
          )
        };
      }
      return student;
    }));
  };

  const updateApplicationStatus = (studentId: string, status: Student['applicationStatus']) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId ? {...student, applicationStatus: status} : student
    ));
  };

  // ==================== COMPONENT BLOCKS ====================
  const MetricsBar = () => (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
      <MetricCard title="Total Students" value={metrics.totalStudents} icon={<Users className="w-5 h-5" />} color="blue" />
      <MetricCard title="Active Applications" value={metrics.activeApplications} icon={<FileText className="w-5 h-5" />} color="green" />
      <MetricCard title="Pending Documents" value={metrics.pendingDocuments} icon={<AlertTriangle className="w-5 h-5" />} color="yellow" />
      <MetricCard title="Upcoming Interviews" value={metrics.upcomingInterviews} icon={<Calendar className="w-5 h-5" />} color="purple" />
      <MetricCard title="Accepted" value={metrics.acceptedStudents} icon={<CheckCircle className="w-5 h-5" />} color="green" />
      <MetricCard title="Rejected" value={metrics.rejectedStudents} icon={<AlertCircle className="w-5 h-5" />} color="red" />
    </div>
  );

  const MetricCard = ({ title, value, icon, color }: { 
    title: string; 
    value: number; 
    icon: React.ReactNode;
    color: string;
  }) => (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-600 mb-1">{title}</p>
          <p className="text-xl font-semibold">{value}</p>
        </div>
        <div className={`text-${color}-500`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const StudentCard = ({ student }: { student: Student }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {student.firstName} {student.lastName}
            </h3>
            <p className="text-sm text-gray-600">{student.email}</p>
            <div className="flex items-center space-x-4 mt-1">
              {student.phone && (
                <div className="flex items-center text-xs text-gray-500">
                  <Phone className="w-3 h-3 mr-1" />
                  {student.phone}
                </div>
              )}
              <div className="flex items-center text-xs text-gray-500">
                <Globe className="w-3 h-3 mr-1" />
                {student.nationality}
              </div>
            </div>
          </div>
        </div>
        <button 
          onClick={() => {
            setSelectedStudent(student);
            setShowModal(true);
          }}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">University:</span>
            <span className="font-medium text-right max-w-xs truncate">{student.universityName}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Program:</span>
            <span className="font-medium text-right max-w-xs truncate">{student.programName}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Intake:</span>
            <span className="font-medium">{student.intakeName}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status:</span>
          <ApplicationStatusBadge status={student.applicationStatus} />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Stage:</span>
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
            {student.currentStage.replace('_', ' ')}
          </span>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-medium">{student.completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${student.completionPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-gray-500">
            Last activity: {new Date(student.lastActivityAt).toLocaleDateString()}
          </span>
          <div className="flex space-x-2">
            <button 
              onClick={() => sendEmail(student.id)}
              className="text-blue-600 hover:text-blue-800 p-1"
              title="Send Email"
            >
              <Mail className="w-4 h-4" />
            </button>
            <button 
              onClick={() => createTask(student.id)}
              className="text-green-600 hover:text-green-800 p-1"
              title="Create Task"
            >
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ApplicationStatusBadge = ({ status }: { status: string }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'ACCEPTED': return 'bg-green-100 text-green-800';
        case 'REJECTED': return 'bg-red-100 text-red-800';
        case 'WAITLISTED': return 'bg-yellow-100 text-yellow-800';
        case 'UNDER_REVIEW': return 'bg-blue-100 text-blue-800';
        case 'INTERVIEW_SCHEDULED': return 'bg-purple-100 text-purple-800';
        case 'DOCUMENTS_PENDING': return 'bg-orange-100 text-orange-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const StudentModal = ({ student, onClose }: { student: Student; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {student.firstName} {student.lastName}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PersonalInfoSection student={student} />
          <AcademicInfoSection student={student} />
          <ApplicationInfoSection student={student} updateStatus={updateApplicationStatus} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <DocumentsSection student={student} updateStatus={updateDocumentStatus} />
          <ApplicationProgressSection student={student} />
        </div>

        {student.interviews.length > 0 && (
          <div className="mt-6">
            <InterviewsSection student={student} />
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          <button 
            onClick={() => sendEmail(student.id)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Mail className="w-4 h-4 mr-2" /> Send Email
          </button>
          <button 
            onClick={() => createTask(student.id)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
          >
            <Bell className="w-4 h-4 mr-2" /> Create Task
          </button>
        </div>
      </div>
    </div>
  );

  const PersonalInfoSection = ({ student }: { student: Student }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium border-b pb-2">Personal Information</h3>
      <InfoRow label="Email" value={student.email} />
      <InfoRow label="Phone" value={student.phone || 'Not provided'} />
      <InfoRow label="Date of Birth" value={student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'Not provided'} />
      <InfoRow label="Nationality" value={student.nationality || 'Not provided'} />
      <InfoRow label="Work Experience" value={student.workExperienceMonths ? `${student.workExperienceMonths} months` : 'Not provided'} />
    </div>
  );

  const AcademicInfoSection = ({ student }: { student: Student }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium border-b pb-2">Academic Information</h3>
      <InfoRow label="GPA" value={student.currentGpa?.toString() || 'Not provided'} />
      <InfoRow label="GMAT Score" value={student.gmatScore?.toString() || 'Not provided'} />
      <InfoRow label="GRE Score" value={student.greScore?.toString() || 'Not provided'} />
      <InfoRow label="IELTS Score" value={student.ieltsScore?.toString() || 'Not provided'} />
      <InfoRow label="TOEFL Score" value={student.toeflScore?.toString() || 'Not provided'} />
    </div>
  );

  const ApplicationInfoSection = ({ student, updateStatus }: { 
    student: Student; 
    updateStatus: (studentId: string, status: Student['applicationStatus']) => void 
  }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium border-b pb-2">Application Information</h3>
      <InfoRow label="University" value={student.universityName} />
      <InfoRow label="Program" value={student.programName} />
      <InfoRow label="Intake" value={student.intakeName} />
      <InfoRow label="Submission Date" value={student.submissionDate ? new Date(student.submissionDate).toLocaleDateString() : 'Not submitted'} />
      <InfoRow label="Decision Date" value={student.decisionDate ? new Date(student.decisionDate).toLocaleDateString() : 'Pending'} />
      
      <div>
        <label className="text-sm text-gray-600 block mb-2">Application Status</label>
        <select
          value={student.applicationStatus}
          onChange={(e) => updateStatus(student.id, e.target.value as Student['applicationStatus'])}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          <option value="DRAFT">Draft</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DOCUMENTS_PENDING">Documents Pending</option>
          <option value="DOCUMENTS_COMPLETE">Documents Complete</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
          <option value="INTERVIEW_COMPLETED">Interview Completed</option>
          <option value="DECISION_PENDING">Decision Pending</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REJECTED">Rejected</option>
          <option value="WAITLISTED">Waitlisted</option>
          <option value="DEFERRED">Deferred</option>
        </select>
      </div>
    </div>
  );

  const DocumentsSection = ({ student, updateStatus }: { 
    student: Student; 
    updateStatus: (studentId: string, docId: string, status: 'VERIFIED' | 'REJECTED' | 'NEEDS_REVISION') => void 
  }) => (
    <div>
      <h3 className="text-lg font-medium mb-4 border-b pb-2">Documents ({student.documents.length})</h3>
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {student.documents.map(doc => (
          <div key={doc.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-sm">{doc.documentTitle}</p>
              <p className="text-xs text-gray-600">{doc.documentType}</p>
              <p className="text-xs text-gray-500">Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</p>
              {doc.verificationNotes && (
                <p className="text-xs text-red-600 mt-1">{doc.verificationNotes}</p>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <DocumentStatusBadge status={doc.documentStatus} />
              {doc.documentStatus !== 'VERIFIED' && (
                <div className="flex space-x-1">
                  <button 
                    onClick={() => updateStatus(student.id, doc.id, 'VERIFIED')}
                    className="p-1 text-green-600 hover:bg-green-100 rounded text-xs"
                    title="Verify"
                  >
                    <CheckCircle className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => updateStatus(student.id, doc.id, 'REJECTED')}
                    className="p-1 text-red-600 hover:bg-red-100 rounded text-xs"
                    title="Reject"
                  >
                    <AlertCircle className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => updateStatus(student.id, doc.id, 'NEEDS_REVISION')}
                    className="p-1 text-yellow-600 hover:bg-yellow-100 rounded text-xs"
                    title="Needs Revision"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const DocumentStatusBadge = ({ status }: { status: string }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'VERIFIED': return 'bg-green-100 text-green-800';
        case 'REJECTED': return 'bg-red-100 text-red-800';
        case 'NEEDS_REVISION': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(status)}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const ApplicationProgressSection = ({ student }: { student: Student }) => (
  <div>
    <h3 className="text-lg font-medium mb-4 border-b pb-2">Application Progress</h3>
    <div className="space-y-3">
      {student.progress.map((stage) => (
        <div key={stage.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{stage.stageName.replace(/_/g, ' ')}</p>
            <div className="flex items-center text-xs text-gray-600 mt-1">
              {stage.startedAt && (
                <span className="flex items-center mr-3">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(stage.startedAt).toLocaleDateString()}
                </span>
              )}
              {stage.completedAt && (
                <span className="flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                  {new Date(stage.completedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          <div className="ml-2">
            <StageStatusBadge status={stage.stageStatus} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const StageStatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'SKIPPED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor()}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

const InterviewsSection = ({ student }: { student: Student }) => (
  <div>
    <h3 className="text-lg font-medium mb-4 border-b pb-2">Interviews</h3>
    <div className="space-y-4">
      {student.interviews.map(interview => (
        <div key={interview.id} className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{interview.interviewType.replace('_', ' ')} Interview</p>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <Calendar className="w-4 h-4 mr-1" />
                {interview.scheduledDate 
                  ? new Date(interview.scheduledDate).toLocaleString() 
                  : 'Not scheduled'}
              </div>
            </div>
            <InterviewStatusBadge status={interview.interviewStatus} />
          </div>
          
          {interview.interviewFeedback && (
            <div className="mt-3 p-3 bg-white border rounded text-sm">
              <p className="font-medium text-gray-700 mb-1">Feedback:</p>
              <p>{interview.interviewFeedback}</p>
            </div>
          )}
          
          {interview.interviewScore !== undefined && (
            <div className="flex items-center mt-3 text-sm">
              <TrendingUp className="w-4 h-4 mr-1 text-blue-500" />
              <span>Score: {interview.interviewScore}/5</span>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

const InterviewStatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      case 'NO_SHOW': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor()}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-600">{label}:</span>
    <span className="font-medium text-right max-w-xs truncate">{value}</span>
  </div>
);

// ==================== MAIN RENDER ====================
return (
  <div className="min-h-screen bg-gray-50 p-4 md:p-8">
    <header className="mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Student Application Management</h1>
      <p className="text-gray-600 mt-2">
        Track and manage student applications through the admission process
      </p>
    </header>

    <MetricsBar />

    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <select
            value={filters.applicationStatus}
            onChange={(e) => setFilters({...filters, applicationStatus: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DOCUMENTS_PENDING">Documents Pending</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
          </select>
          
          <select
            value={filters.currentStage}
            onChange={(e) => setFilters({...filters, currentStage: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Stages</option>
            <option value="DOCUMENT_COLLECTION">Document Collection</option>
            <option value="DOCUMENT_REVIEW">Document Review</option>
            <option value="INTERVIEW">Interview</option>
            <option value="FINAL_REVIEW">Final Review</option>
            <option value="DECISION">Decision</option>
          </select>
          
          <div className="flex space-x-2">
            <button
              onClick={exportToPDF}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center"
            >
              <Download className="w-4 h-4 mr-1" /> PDF
            </button>
            <button
              onClick={exportToExcel}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center"
            >
              <Download className="w-4 h-4 mr-1" /> Excel
            </button>
          </div>
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="text-center py-12">
          <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No students found</h3>
          <p className="mt-1 text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map(student => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      )}
    </div>

    {showModal && selectedStudent && (
      <StudentModal 
        student={selectedStudent} 
        onClose={() => setShowModal(false)} 
      />
    )}
  </div>
);
};

export default StudentManagementSystem;