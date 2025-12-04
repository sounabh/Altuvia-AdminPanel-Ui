"use client"

import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, FileText, Calendar, TrendingUp, Award, Clock, DollarSign, Activity, BookOpen } from 'lucide-react';

interface DashboardData {
  overview: {
    totalUsers: number;
    newUsersLast30Days: number;
    newUsersLast7Days: number;
    totalUniversities: number;
    totalPrograms: number;
    totalApplications: number;
    activeApplications: number;
    successRate: number;
  };
  userActivity: {
    recentEssays: number;
    recentCVs: number;
    recentScholarshipApps: number;
  };
  subscriptions: {
    total: number;
    byPlan: Record<string, number>;
    byStatus: Record<string, number>;
  };
  essays: {
    total: number;
    completed: number;
    inProgress: number;
    draft: number;
  };
  cvs: {
    total: number;
    active: number;
    totalExports: number;
    recentlyCreated: number;
  };
  financial: {
    totalScholarships: number;
    activeScholarships: number;
    totalFinancialAids: number;
  };
  personalityProfiles: {
    total: number;
    completed: number;
    completionRate: string;
  };
  applicationStatusBreakdown: Record<string, number>;
  upcomingEvents: Array<{
    id: string;
    title: string;
    startDate: string;
    eventType: string;
    priority: string;
  }>;
  recentApplications: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    applicationStatus: string;
    completionPercentage: number;
    createdAt: string;
    submissionDate: string | null;
    university?: {
      universityName: string;
      country: string;
    };
    program?: {
      programName: string;
      degreeType: string;
    };
  }>;
  topUniversities: Array<{
    id: string;
    universityName: string;
    country: string;
    city: string;
    acceptanceRate: number | null;
    _count: {
      applications: number;
      programs: number;
    };
  }>;
}

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/upload/dashboard');
      const result = await response.json();
      
      if (result.success) {
        setDashboardData(result.data);
      } else {
        setError(result.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { overview, userActivity, subscriptions, essays, cvs, financial, personalityProfiles, applicationStatusBreakdown, upcomingEvents, recentApplications, topUniversities } = dashboardData;

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    trend, 
    color = "blue" 
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ElementType;
    trend?: string;
    color?: string;
  }) => {
    const colorClasses = {
      blue: { text: 'text-blue-600', bg: 'bg-blue-100' },
      purple: { text: 'text-purple-600', bg: 'bg-purple-100' },
      green: { text: 'text-green-600', bg: 'bg-green-100' },
      orange: { text: 'text-orange-600', bg: 'bg-orange-100' },
      pink: { text: 'text-pink-600', bg: 'bg-pink-100' },
      indigo: { text: 'text-indigo-600', bg: 'bg-indigo-100' },
    };

    const colors = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

    return (
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={`text-3xl font-bold mt-2 ${colors.text}`}>{value}</p>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 ${colors.bg} rounded-lg`}>
            <Icon className={`w-6 h-6 ${colors.text}`} />
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500">{trend}</span>
          </div>
        )}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'SUBMITTED': 'bg-blue-100 text-blue-800',
      'UNDER_REVIEW': 'bg-yellow-100 text-yellow-800',
      'ACCEPTED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'INTERVIEW_SCHEDULED': 'bg-purple-100 text-purple-800',
      'INTERVIEW_COMPLETED': 'bg-purple-200 text-purple-900',
      'DRAFT': 'bg-gray-100 text-gray-800',
      'WAITLISTED': 'bg-orange-100 text-orange-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'high': 'text-red-600',
      'critical': 'text-red-700 font-bold',
      'medium': 'text-yellow-600',
      'low': 'text-green-600',
    };
    return colors[priority] || 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>

        {/* Main Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={overview.totalUsers.toLocaleString()}
            subtitle={`+${overview.newUsersLast30Days} this month`}
            icon={Users}
            trend={`+${overview.newUsersLast7Days} this week`}
            color="blue"
          />
          <StatCard
            title="Universities"
            value={overview.totalUniversities}
            subtitle={`${overview.totalPrograms} active programs`}
            icon={GraduationCap}
            color="purple"
          />
          <StatCard
            title="Applications"
            value={overview.totalApplications}
            subtitle={`${overview.activeApplications} active`}
            icon={FileText}
            color="green"
          />
          <StatCard
            title="Success Rate"
            value={`${overview.successRate}%`}
            subtitle="Application acceptance"
            icon={Award}
            color="orange"
          />
        </div>

        {/* Recent Activity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity (7 days)</h3>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">New Essays</span>
                <span className="font-bold text-blue-600">{userActivity.recentEssays}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">New CVs</span>
                <span className="font-bold text-green-600">{userActivity.recentCVs}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Scholarship Apps</span>
                <span className="font-bold text-purple-600">{userActivity.recentScholarshipApps}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Subscriptions</h3>
              <DollarSign className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Active</span>
                <span className="font-bold text-gray-900">{subscriptions.total}</span>
              </div>
              {Object.entries(subscriptions.byPlan).map(([plan, count]) => (
                <div key={plan} className="flex justify-between items-center border-t pt-2">
                  <span className="text-gray-600 capitalize">{plan}</span>
                  <span className="font-semibold text-gray-700">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Financial Aid</h3>
              <DollarSign className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Scholarships</span>
                <span className="font-bold text-gray-900">{financial.activeScholarships}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Financial Aids</span>
                <span className="font-bold text-gray-900">{financial.totalFinancialAids}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Essay and CV Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Essay Progress</h3>
              <BookOpen className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-green-600">Completed</span>
                <span className="font-bold">{essays.completed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-600">In Progress</span>
                <span className="font-bold">{essays.inProgress}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Draft</span>
                <span className="font-bold">{essays.draft}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${essays.total > 0 ? (essays.completed / essays.total) * 100 : 0}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 text-center">
                {essays.total > 0 ? ((essays.completed / essays.total) * 100).toFixed(1) : 0}% Complete
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">CV Builder</h3>
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total CVs</span>
                <span className="font-bold text-gray-900">{cvs.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-600">Active CVs</span>
                <span className="font-bold">{cvs.active}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-600">Total Exports</span>
                <span className="font-bold">{cvs.totalExports}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-600">Recent (30d)</span>
                <span className="font-bold">{cvs.recentlyCreated}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Personality Profiles</h3>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Profiles</span>
                <span className="font-bold text-gray-900">{personalityProfiles.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-600">Completed</span>
                <span className="font-bold">{personalityProfiles.completed}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${personalityProfiles.completionRate}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 text-center">
                {personalityProfiles.completionRate}% Completion Rate
              </p>
            </div>
          </div>
        </div>

        {/* Application Status Breakdown */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Object.entries(applicationStatusBreakdown).map(([status, count]) => (
              <div key={status} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-xs text-gray-600 mt-1 uppercase">{status.replace(/_/g, ' ')}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Events (Next 7 Days)</h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Clock className={`w-5 h-5 mt-0.5 flex-shrink-0 ${getPriorityColor(event.priority)}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{event.title}</p>
                      <p className="text-sm text-gray-600">{formatDate(event.startDate)}</p>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded mt-1 inline-block">
                        {event.eventType}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No upcoming events</p>
              )}
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentApplications.length > 0 ? (
                recentApplications.map((app) => (
                  <div key={app.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">{app.firstName} {app.lastName}</p>
                        <p className="text-sm text-gray-600 truncate">{app.university?.universityName || 'N/A'}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {app.program?.programName || 'N/A'} {app.program?.degreeType && `(${app.program.degreeType})`}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${getStatusColor(app.applicationStatus)}`}>
                        {app.applicationStatus}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="w-2/3 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${app.completionPercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{app.completionPercentage.toFixed(0)}%</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No recent applications</p>
              )}
            </div>
          </div>
        </div>

        {/* Top Universities Table */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Universities by Applications</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Programs</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acceptance Rate</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topUniversities.map((university, index) => (
                  <tr key={university.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {university.universityName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {university.city}, {university.country}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {university._count.programs}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                      {university._count.applications}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {university.acceptanceRate ? `${university.acceptanceRate}%` : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;