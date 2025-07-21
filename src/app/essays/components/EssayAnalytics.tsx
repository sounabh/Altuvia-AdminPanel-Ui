import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface EssayPrompt {
  id: string;
  promptTitle: string;
  _count: {
    submissions: number;
  };
}

interface EssaySubmission {
  id: string;
  status: "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED";
  internalRating?: number | null;

}

interface EssayAnalyticsProps {
  prompts: EssayPrompt[];
  submissions: EssaySubmission[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const EssayAnalytics: React.FC<EssayAnalyticsProps> = ({ prompts, submissions }) => {
  // Prepare data for charts
  const promptData = prompts.map(prompt => ({
    name: prompt.promptTitle,
    submissions: prompt._count.submissions
  }));

  const statusCounts = submissions.reduce((acc, submission) => {
    acc[submission.status] = (acc[submission.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value
  }));

  const ratings = submissions
    .filter(s => s.internalRating !== null)
    .map(s => s.internalRating as number);
  
  const avgRating = ratings.length 
    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
    : 'N/A';

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Essay Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-medium text-gray-700 mb-4">Submissions by Prompt</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={promptData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="submissions" name="Submissions" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-700 mb-4">Submission Status Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">Total Prompts</h3>
          <p className="text-3xl font-bold">{prompts.length}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">Total Submissions</h3>
          <p className="text-3xl font-bold">{submissions.length}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">Average Rating</h3>
          <p className="text-3xl font-bold">{avgRating}</p>
        </div>
      </div>
    </div>
  );
};

export default EssayAnalytics;