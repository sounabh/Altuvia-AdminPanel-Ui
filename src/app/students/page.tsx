/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useState, useEffect } from 'react';
import { 
  Users, GraduationCap, FileText, Mail, Calendar, 
  Download, TrendingUp, Clock, CheckCircle, AlertCircle,
  Search, Filter, MoreHorizontal, Bell, ChevronDown
} from 'lucide-react';

// ==================== TYPE DEFINITIONS ====================
interface TestScores {
  gmat?: number;
  gre?: number;
  ielts?: number;
  toefl?: number;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  gpa: number;
  applications: number;
  acceptances: number;
  status: 'Active' | 'Inactive' | 'Pending';
  progressPercentage: number;
  lastActivity: string;
  university: string;
  program: string;
  programSlug: string;
  intake: string;
  applicationStatus: 'Under Review' | 'Accepted' | 'Documents Pending' | 'Rejected' | 'Waitlisted';
  country: string;
  studyLevel: 'Masters' | 'Bachelors' | 'PhD';
  testScores: TestScores;
  scholarshipApplications: ScholarshipApplication[];
  financialAidApplications: FinancialAidApplication[];
  essaySubmissions: EssaySubmission[];
  documents: ApplicationDocument[];
}

interface ScholarshipApplication {
  id: string;
  scholarshipName: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  amount?: number;
  appliedDate: string;
  decisionDate?: string;
}

interface FinancialAidApplication {
  id: string;
  aidName: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  amount?: number;
  appliedDate: string;
  decisionDate?: string;
}

interface EssaySubmission {
  id: string;
  promptTitle: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Accepted' | 'Rejected';
  wordCount: number;
  submittedDate?: string;
}

interface ApplicationDocument {
  id: string;
  documentType: string;
  documentTitle: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  uploadedDate: string;
}

interface Analytics {
  totalStudents: number;
  activeApplications: number;
  acceptanceRate: number;
  averageGPA: number;
  monthlyGrowth: number;
  pendingTasks: number;
  upcomingDeadlines: number;
  documentsToReview: number;
  scholarshipAppsPending: number;
  financialAidAppsPending: number;
  essaySubmissionsPending: number;
}

// ==================== MAIN COMPONENT ====================
const StudentManagementSystem = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students'>('dashboard');
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    program: '',
    intake: ''
  });

  // Mock data aligned with Prisma schema
  const mockStudents: Student[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '+1-555-0123',
      nationality: 'USA',
      gpa: 3.8,
      applications: 3,
      acceptances: 1,
      status: 'Active',
      progressPercentage: 75,
      lastActivity: '2024-01-15',
      university: 'MIT',
      program: 'Computer Science',
      programSlug: 'computer-science',
      intake: 'Fall 2024',
      applicationStatus: 'Under Review',
      country: 'United States',
      studyLevel: 'Masters',
      testScores: { gre: 325, ielts: 7.5 },
      scholarshipApplications: [
        {
          id: 's1',
          scholarshipName: 'STEM Excellence Scholarship',
          status: 'Under Review',
          appliedDate: '2024-01-10',
        }
      ],
      financialAidApplications: [
        {
          id: 'f1',
          aidName: 'International Student Grant',
          status: 'Approved',
          amount: 5000,
          appliedDate: '2023-12-15',
          decisionDate: '2024-01-05'
        }
      ],
      essaySubmissions: [
        {
          id: 'e1',
          promptTitle: 'Career Goals Statement',
          status: 'Submitted',
          wordCount: 750,
          submittedDate: '2024-01-12'
        }
      ],
      documents: [
        {
          id: 'd1',
          documentType: 'Transcript',
          documentTitle: 'Undergraduate Transcript',
          status: 'Verified',
          uploadedDate: '2024-01-05'
        },
        {
          id: 'd2',
          documentType: 'Recommendation',
          documentTitle: 'Professor Smith Recommendation',
          status: 'Pending',
          uploadedDate: '2024-01-14'
        }
      ]
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.j@email.com',
      phone: '+1-555-0124',
      nationality: 'Canada',
      gpa: 3.9,
      applications: 5,
      acceptances: 2,
      status: 'Active',
      progressPercentage: 90,
      lastActivity: '2024-01-16',
      university: 'Stanford',
      program: 'Data Science',
      programSlug: 'data-science',
      intake: 'Spring 2024',
      applicationStatus: 'Accepted',
      country: 'Canada',
      studyLevel: 'Masters',
      testScores: { gre: 330, toefl: 110 },
      scholarshipApplications: [
        {
          id: 's2',
          scholarshipName: 'Women in Tech Scholarship',
          status: 'Approved',
          amount: 10000,
          appliedDate: '2023-11-20',
          decisionDate: '2023-12-15'
        }
      ],
      financialAidApplications: [],
      essaySubmissions: [
        {
          id: 'e2',
          promptTitle: 'Personal Statement',
          status: 'Accepted',
          wordCount: 800,
          submittedDate: '2023-12-10'
        }
      ],
      documents: [
        {
          id: 'd3',
          documentType: 'Resume',
          documentTitle: 'Professional Resume',
          status: 'Verified',
          uploadedDate: '2023-12-01'
        }
      ]
    },
    {
      id: '3',
      firstName: 'Raj',
      lastName: 'Patel',
      email: 'raj.patel@email.com',
      phone: '+91-98765-43210',
      nationality: 'India',
      gpa: 3.6,
      applications: 4,
      acceptances: 1,
      status: 'Active',
      progressPercentage: 60,
      lastActivity: '2024-01-14',
      university: 'Harvard',
      program: 'MBA',
      programSlug: 'mba',
      intake: 'Fall 2024',
      applicationStatus: 'Documents Pending',
      country: 'India',
      studyLevel: 'Masters',
      testScores: { gmat: 720, ielts: 7.0 },
      scholarshipApplications: [],
      financialAidApplications: [
        {
          id: 'f3',
          aidName: 'Emerging Markets Scholarship',
          status: 'Draft',
          appliedDate: '2024-01-10',
        }
      ],
      essaySubmissions: [
        {
          id: 'e3',
          promptTitle: 'Leadership Experience',
          status: 'Draft',
          wordCount: 400,
        }
      ],
      documents: [
        {
          id: 'd4',
          documentType: 'Transcript',
          documentTitle: 'Graduate Transcript',
          status: 'Rejected',
          uploadedDate: '2024-01-03'
        }
      ]
    }
  ];

  const analytics: Analytics = {
    totalStudents: 156,
    activeApplications: 89,
    acceptanceRate: 68,
    averageGPA: 3.7,
    monthlyGrowth: 12,
    pendingTasks: 23,
    upcomingDeadlines: 8,
    documentsToReview: 15,
    scholarshipAppsPending: 42,
    financialAidAppsPending: 28,
    essaySubmissionsPending: 37
  };

  useEffect(() => {
    setStudents(mockStudents);
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status ? student.status === filters.status : true;
    const matchesProgram = filters.program ? student.programSlug === filters.program : true;
    const matchesIntake = filters.intake ? student.intake === filters.intake : true;
    
    return matchesSearch && matchesStatus && matchesProgram && matchesIntake;
  });

  const exportToPDF = () => {
    alert('PDF export functionality would be implemented here');
  };

  const exportToExcel = () => {
    alert('Excel export functionality would be implemented here');
  };

  const sendReminder = (studentId: string, type: string) => {
    alert(`${type} reminder sent to student ${studentId}`);
  };

  const updateDocumentStatus = (studentId: string, docId: string, status: 'Verified' | 'Rejected') => {
    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        return {
          ...student,
          documents: student.documents.map(doc => 
            doc.id === docId ? {...doc, status} : doc
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
  const StudentCard = ({ student }: { student: Student }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {student.firstName} {student.lastName}
          </h3>
          <p className="text-sm text-gray-600">{student.email}</p>
          <p className="text-sm text-gray-500">{student.nationality} | {student.studyLevel}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            student.status === 'Active' 
              ? 'bg-green-100 text-green-800' 
              : student.status === 'Pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
          }`}>
            {student.status}
          </span>
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
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Program</p>
          <p className="font-semibold truncate">{student.program}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Intake</p>
          <p className="font-semibold">{student.intake}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600">Application Progress</span>
          <span className="text-sm font-medium">{student.progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${student.progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Last active: {student.lastActivity}</span>
        <div className="flex space-x-2">
          <button 
            onClick={() => sendReminder(student.id, 'Email')}
            className="text-blue-600 hover:text-blue-800"
          >
            <Mail className="w-4 h-4" />
          </button>
          <button 
            onClick={() => sendReminder(student.id, 'Task')}
            className="text-green-600 hover:text-green-800"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const StudentModal = ({ student, onClose }: { student: Student; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {student.firstName} {student.lastName}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Personal Information</h3>
            <InfoRow label="Email" value={student.email} />
            <InfoRow label="Phone" value={student.phone} />
            <InfoRow label="Nationality" value={student.nationality} />
            <InfoRow label="Study Level" value={student.studyLevel} />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Academic Information</h3>
            <InfoRow label="GPA" value={student.gpa.toString()} />
            <InfoRow label="Test Scores" value={formatTestScores(student.testScores)} />
            <InfoRow label="University" value={student.university} />
            <InfoRow label="Program" value={student.program} />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4 border-b pb-2">Application Status</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {['Under Review', 'Accepted', 'Documents Pending', 'Rejected', 'Waitlisted'].map(status => (
              <button
                key={status}
                onClick={() => updateApplicationStatus(student.id, status as any)}
                className={`px-3 py-1 rounded-full text-sm ${
                  student.applicationStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Current Status: </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              student.applicationStatus === 'Accepted' 
                ? 'bg-green-100 text-green-800' 
                : student.applicationStatus === 'Rejected'
                  ? 'bg-red-100 text-red-800'
                  : student.applicationStatus === 'Documents Pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
            }`}>
              {student.applicationStatus}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <DocumentSection student={student} updateStatus={updateDocumentStatus} />
          <FinancialSection student={student} />
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button 
            onClick={() => sendReminder(student.id, 'Email')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Mail className="w-4 h-4 mr-2" /> Send Email
          </button>
          <button 
            onClick={() => sendReminder(student.id, 'Task')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
          >
            <Bell className="w-4 h-4 mr-2" /> Create Task
          </button>
        </div>
      </div>
    </div>
  );

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <p className="font-medium">{value}</p>
    </div>
  );

  const DocumentSection = ({ 
    student, 
    updateStatus 
  }: { 
    student: Student; 
    updateStatus: (studentId: string, docId: string, status: 'Verified' | 'Rejected') => void 
  }) => (
    <div>
      <h3 className="text-lg font-medium mb-4 border-b pb-2">Documents</h3>
      <div className="space-y-3">
        {student.documents.map(doc => (
          <div key={doc.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">{doc.documentTitle}</p>
              <p className="text-sm text-gray-600">{doc.documentType}</p>
            </div>
            <div className="flex space-x-2">
              <span className={`px-2 py-1 rounded text-xs ${
                doc.status === 'Verified' 
                  ? 'bg-green-100 text-green-800' 
                  : doc.status === 'Rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
              }`}>
                {doc.status}
              </span>
              {doc.status === 'Pending' && (
                <div className="flex space-x-1">
                  <button 
                    onClick={() => updateStatus(student.id, doc.id, 'Verified')}
                    className="p-1 text-green-600 hover:bg-green-100 rounded"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => updateStatus(student.id, doc.id, 'Rejected')}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <AlertCircle className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const FinancialSection = ({ student }: { student: Student }) => (
    <div>
      <h3 className="text-lg font-medium mb-4 border-b pb-2">Financial Applications</h3>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Scholarships</h4>
          <div className="space-y-2">
            {student.scholarshipApplications.length > 0 ? (
              student.scholarshipApplications.map(app => (
                <div key={app.id} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <div>
                    <p className="font-medium">{app.scholarshipName}</p>
                    <p className="text-sm text-gray-600">Applied: {app.appliedDate}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    app.status === 'Approved' 
                      ? 'bg-green-100 text-green-800' 
                      : app.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {app.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No scholarship applications</p>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-2">Financial Aid</h4>
          <div className="space-y-2">
            {student.financialAidApplications.length > 0 ? (
              student.financialAidApplications.map(app => (
                <div key={app.id} className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <div>
                    <p className="font-medium">{app.aidName}</p>
                    <p className="text-sm text-gray-600">Applied: {app.appliedDate}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    app.status === 'Approved' 
                      ? 'bg-green-100 text-green-800' 
                      : app.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {app.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No financial aid applications</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const Dashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticCard 
          title="Total Students" 
          value={analytics.totalStudents} 
          icon={<Users className="w-6 h-6 text-blue-500" />}
          change={analytics.monthlyGrowth}
        />
        <AnalyticCard 
          title="Active Applications" 
          value={analytics.activeApplications} 
          icon={<FileText className="w-6 h-6 text-green-500" />}
        />
        <AnalyticCard 
          title="Acceptance Rate" 
          value={`${analytics.acceptanceRate}%`} 
          icon={<TrendingUp className="w-6 h-6 text-purple-500" />}
        />
        <AnalyticCard 
          title="Average GPA" 
          value={analytics.averageGPA} 
          icon={<GraduationCap className="w-6 h-6 text-orange-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <QuickActions analytics={analytics} />
        <PendingReviews analytics={analytics} />
        <ExportOptions />
      </div>
    </div>
  );

  const AnalyticCard = ({ title, value, icon, change }: { 
    title: string; 
    value: string | number; 
    icon: React.ReactNode;
    change?: number;
  }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
          {change && (
            <p className="text-xs mt-1 flex items-center">
              <span className={`${change > 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                {change > 0 ? '↑' : '↓'} {Math.abs(change)}% this month
              </span>
            </p>
          )}
        </div>
        <div className="p-3 bg-gray-100 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );

  const QuickActions = ({ analytics }: { analytics: Analytics }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <ActionItem 
          icon={<Clock className="w-5 h-5 text-orange-500" />}
          title="Pending Tasks"
          value={analytics.pendingTasks}
          color="orange"
        />
        <ActionItem 
          icon={<Calendar className="w-5 h-5 text-red-500" />}
          title="Upcoming Deadlines"
          value={analytics.upcomingDeadlines}
          color="red"
        />
        <ActionItem 
          icon={<FileText className="w-5 h-5 text-blue-500" />}
          title="Documents to Review"
          value={analytics.documentsToReview}
          color="blue"
        />
      </div>
    </div>
  );

  const PendingReviews = ({ analytics }: { analytics: Analytics }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Pending Reviews</h3>
      <div className="space-y-3">
        <ReviewItem 
          icon={<FileText className="w-5 h-5 text-purple-500" />}
          title="Scholarship Applications"
          value={analytics.scholarshipAppsPending}
        />
        <ReviewItem 
          icon={<FileText className="w-5 h-5 text-green-500" />}
          title="Financial Aid Applications"
          value={analytics.financialAidAppsPending}
        />
        <ReviewItem 
          icon={<FileText className="w-5 h-5 text-blue-500" />}
          title="Essay Submissions"
          value={analytics.essaySubmissionsPending}
        />
      </div>
    </div>
  );

  const ActionItem = ({ icon, title, value, color }: { 
    icon: React.ReactNode; 
    title: string; 
    value: number;
    color: string;
  }) => (
    <div className={`flex items-center justify-between p-3 bg-${color}-50 rounded-lg border-l-4 border-${color}-500`}>
      <div className="flex items-center space-x-3">
        {icon}
        <span>{title}</span>
      </div>
      <span className="font-semibold">{value}</span>
    </div>
  );

  const ReviewItem = ({ icon, title, value }: { 
    icon: React.ReactNode; 
    title: string; 
    value: number;
  }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
      <div className="flex items-center space-x-3">
        {icon}
        <span>{title}</span>
      </div>
      <span className="font-semibold">{value}</span>
    </div>
  );

  const ExportOptions = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Export Options</h3>
      <div className="space-y-3">
        <ExportButton 
          onClick={exportToPDF}
          icon={<Download className="w-5 h-5" />}
          title="Export to PDF"
          color="red"
        />
        <ExportButton 
          onClick={exportToExcel}
          icon={<Download className="w-5 h-5" />}
          title="Export to Excel"
          color="green"
        />
      </div>
    </div>
  );

  const ExportButton = ({ onClick, icon, title, color }: { 
    onClick: () => void; 
    icon: React.ReactNode; 
    title: string;
    color: string;
  }) => (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-center space-x-2 p-3 bg-${color}-50 text-${color}-700 rounded-lg hover:bg-${color}-100 transition-colors`}
    >
      {icon}
      <span>{title}</span>
    </button>
  );

  const StudentList = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-xl font-semibold">Students ({filteredStudents.length})</h2>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search students..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <FilterDropdown 
            label="Status"
            options={['Active', 'Inactive', 'Pending']}
            value={filters.status}
            onChange={(value) => setFilters({...filters, status: value})}
          />
          
          <FilterDropdown 
            label="Program"
            options={Array.from(new Set(students.map(s => s.programSlug)))}
            value={filters.program}
            onChange={(value) => setFilters({...filters, program: value})}
            optionLabels={students.reduce((acc, s) => {
              acc[s.programSlug] = s.program;
              return acc;
            }, {} as Record<string, string>)}
          />
          
          <FilterDropdown 
            label="Intake"
            options={Array.from(new Set(students.map(s => s.intake)))}
            value={filters.intake}
            onChange={(value) => setFilters({...filters, intake: value})}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map(student => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>

      {showModal && selectedStudent && (
        <StudentModal 
          student={selectedStudent} 
          onClose={() => {
            setShowModal(false);
            setSelectedStudent(null);
          }} 
        />
      )}
    </div>
  );

  const FilterDropdown = ({ 
    label, 
    options, 
    value, 
    onChange,
    optionLabels
  }: { 
    label: string; 
    options: string[]; 
    value: string;
    onChange: (value: string) => void;
    optionLabels?: Record<string, string>;
  }) => (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full bg-white"
      >
        <option value="">{label}</option>
        {options.map(option => (
          <option key={option} value={option}>
            {optionLabels?.[option] || option}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
              <p className="text-gray-600">Manage student applications and track progress</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <nav className="flex space-x-8 border-b">
            {['dashboard', 'students'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'students' && <StudentList />}
      </div>
    </div>
  );
};

// ==================== HELPER FUNCTIONS ====================
function formatTestScores(scores: TestScores): string {
  return Object.entries(scores)
    .map(([test, score]) => `${test.toUpperCase()}: ${score}`)
    .join(', ');
}

export default StudentManagementSystem;