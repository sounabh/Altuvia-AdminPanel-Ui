"use client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createContext } from 'react';

// Your context code here
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  Users, 
  Building2, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Plus,
  Download,
  RefreshCw
} from "lucide-react";

// Mock data for analytics
const applicationTrends = [
  { month: 'Jan', applications: 245, acceptances: 89 },
  { month: 'Feb', applications: 312, acceptances: 125 },
  { month: 'Mar', applications: 428, acceptances: 167 },
  { month: 'Apr', applications: 389, acceptances: 143 },
  { month: 'May', applications: 467, acceptances: 189 },
  { month: 'Jun', applications: 523, acceptances: 201 },
];

const universityPopularity = [
  { name: 'Stanford University', applications: 1245 },
  { name: 'MIT', applications: 1123 },
  { name: 'Harvard University', applications: 998 },
  { name: 'UC Berkeley', applications: 876 },
  { name: 'Carnegie Mellon', applications: 754 },
];

const applicationStatus = [
  { name: 'Submitted', value: 2156, color: '#3B82F6' },
  { name: 'Under Review', value: 1432, color: '#F59E0B' },
  { name: 'Accepted', value: 876, color: '#10B981' },
  { name: 'Rejected', value: 234, color: '#EF4444' },
];

const revenueData = [
  { month: 'Jan', revenue: 15420 },
  { month: 'Feb', revenue: 18750 },
  { month: 'Mar', revenue: 22140 },
  { month: 'Apr', revenue: 19850 },
  { month: 'May', revenue: 26780 },
  { month: 'Jun', revenue: 31250 },
];

const StatCard = ({ title, value, change, changeType, icon: Icon }: {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ElementType;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      <Icon className="h-4 w-4 text-gray-400" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className={`flex items-center text-xs ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
        {changeType === 'increase' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
        {change} from last month
      </div>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Overview of your college application platform</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add University
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value="12,345"
          change="+12.5%"
          changeType="increase"
          icon={Users}
        />
        <StatCard
          title="Universities"
          value="234"
          change="+8.3%"
          changeType="increase"
          icon={Building2}
        />
        <StatCard
          title="Applications"
          value="5,678"
          change="+15.2%"
          changeType="increase"
          icon={FileText}
        />
        <StatCard
          title="Revenue"
          value="$156,789"
          change="+22.1%"
          changeType="increase"
          icon={DollarSign}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Application Trends</CardTitle>
            <CardDescription>Monthly applications and acceptance rates</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={applicationTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="applications" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="acceptances" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Application Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
            <CardDescription>Current distribution of application statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={applicationStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {applicationStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* More Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* University Popularity */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Universities</CardTitle>
            <CardDescription>Universities with most applications</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={universityPopularity} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="applications" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Monthly subscription revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest platform activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
              <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New application submitted</p>
                <p className="text-xs text-gray-500">John Doe applied to Stanford University - 2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
              <div className="h-2 w-2 bg-green-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Application accepted</p>
                <p className="text-xs text-gray-500">Sarah Johnson accepted to MIT - 15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg">
              <div className="h-2 w-2 bg-yellow-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New university added</p>
                <p className="text-xs text-gray-500">University of Cambridge added to the platform - 1 hour ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
