/* eslint-disable @typescript-eslint/no-explicit-any */
// app/program-management/components/ProgramDetail.tsx
import React, { useState } from 'react';
import { 
  X, GraduationCap, FileText, Award, 
  Users, DollarSign, Globe, Calendar, BookOpen, 
  Edit, Download, Trash2, Plus 
} from 'lucide-react';
import type { 
  ProgramWithFullRelations,
  CreateSyllabusInput,
  CreateProgramRankingInput,
  UpdateProgramRankingInput,
  CreateExternalLinkInput,
  UpdateExternalLinkInput
} from '../types/programs';

interface ProgramDetailProps {
  program: ProgramWithFullRelations;
  onEdit: () => void;
  onClose: () => void;
  onSyllabusUpload: (data: CreateSyllabusInput) => void;
  onSyllabusDelete: (programId: string) => void;
  onRankingAction: (
    action: 'create' | 'update' | 'delete',
    data: CreateProgramRankingInput | UpdateProgramRankingInput,
    id?: string
  ) => void;
  onLinkAction: (
    action: 'create' | 'update' | 'delete',
    data: CreateExternalLinkInput | UpdateExternalLinkInput,
    id?: string
  ) => void;
}

const ProgramDetail: React.FC<ProgramDetailProps> = ({
  program,
  onEdit,
  onClose,
  onSyllabusUpload,
  onSyllabusDelete,
  onRankingAction,
  onLinkAction
}) => {
  const [showSyllabusForm, setShowSyllabusForm] = useState(false);
  const [showRankingForm, setShowRankingForm] = useState(false);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [selectedRanking, setSelectedRanking] = useState<any>(null);
  const [selectedLink, setSelectedLink] = useState<any>(null);
  const [syllabusFile, setSyllabusFile] = useState<File | null>(null);

  const handleSyllabusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (syllabusFile) {
      // In a real app, you would upload the file and get a URL
      const fakeFileUrl = URL.createObjectURL(syllabusFile);
      onSyllabusUpload({
        programId: program.id,
        fileUrl: fakeFileUrl
      });
      setShowSyllabusForm(false);
      setSyllabusFile(null);
    }
  };

  const handleRankingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      programId: program.id,
      year: parseInt(formData.get('year') as string),
      rank: parseInt(formData.get('rank') as string),
      source: formData.get('source') as string
    };
    
    if (selectedRanking) {
      onRankingAction('update', data, selectedRanking.id);
    } else {
      onRankingAction('create', data);
    }
    setShowRankingForm(false);
    setSelectedRanking(null);
  };

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      programId: program.id,
      title: formData.get('title') as string,
      url: formData.get('url') as string
    };
    
    if (selectedLink) {
      onLinkAction('update', data, selectedLink.id);
    } else {
      onLinkAction('create', data);
    }
    setShowLinkForm(false);
    setSelectedLink(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
        <div className="flex items-center">
          <GraduationCap className="h-6 w-6 text-green-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">{program.programName}</h2>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <Edit className="h-4 w-4 mr-1" /> Edit
          </button>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Program Overview */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Degree Type</p>
                <p className="font-medium">{program.degreeType || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">{program.programLength ? `${program.programLength} years` : 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Tuition Fees</p>
                <p className="font-medium">
                  {program.programTuitionFees ? `$${program.programTuitionFees.toLocaleString()}` : 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Students</p>
                <p className="font-medium">{program._count?.admissions || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">Description</p>
            <p className="text-gray-700">
              {program.programDescription || 'No description available'}
            </p>
          </div>
        </div>

        {/* Syllabus Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Syllabus</h3>
            {program.syllabus ? (
              <div className="flex space-x-2">
                <a 
                  href={program.syllabus.fileUrl} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <Download className="h-4 w-4 mr-1" /> Download
                </a>
                <button
                  onClick={() => onSyllabusDelete(program.id)}
                  className="text-red-600 hover:text-red-800 flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Remove
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSyllabusForm(true)}
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" /> Upload Syllabus
              </button>
            )}
          </div>

          {showSyllabusForm && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <form onSubmit={handleSyllabusSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Syllabus File
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setSyllabusFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowSyllabusForm(false)}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  >
                    Upload
                  </button>
                </div>
              </form>
            </div>
          )}

          {!program.syllabus && !showSyllabusForm && (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No syllabus uploaded</h3>
              <p className="mt-1 text-sm text-gray-500">Upload a syllabus to provide curriculum information</p>
            </div>
          )}
        </div>

        {/* Rankings Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Rankings</h3>
            <button
              onClick={() => {
                setSelectedRanking(null);
                setShowRankingForm(true);
              }}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Ranking
            </button>
          </div>

          {showRankingForm && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <form onSubmit={handleRankingSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </label>
                    <input
                      type="number"
                      name="year"
                      defaultValue={selectedRanking?.year}
                      min="2000"
                      max={new Date().getFullYear()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rank
                    </label>
                    <input
                      type="number"
                      name="rank"
                      defaultValue={selectedRanking?.rank}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Source
                    </label>
                    <input
                      type="text"
                      name="source"
                      defaultValue={selectedRanking?.source || ''}
                      placeholder="QS, Times, etc."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRankingForm(false);
                      setSelectedRanking(null);
                    }}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  >
                    {selectedRanking ? 'Update' : 'Add'} Ranking
                  </button>
                </div>
              </form>
            </div>
          )}

          {program.rankings.length === 0 && !showRankingForm ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <Award className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No rankings added</h3>
              <p className="mt-1 text-sm text-gray-500">Add rankings to showcase program achievements</p>
            </div>
          ) : (
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {program.rankings.map((ranking) => (
                    <tr key={ranking.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {ranking.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{ranking.rank}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {ranking.source || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => {
                            setSelectedRanking(ranking);
                            setShowRankingForm(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onRankingAction('delete', {} , ranking.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* External Links Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">External Links</h3>
            <button
              onClick={() => {
                setSelectedLink(null);
                setShowLinkForm(true);
              }}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Link
            </button>
          </div>

          {showLinkForm && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <form onSubmit={handleLinkSubmit}>
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={selectedLink?.title}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL
                    </label>
                    <input
                      type="url"
                      name="url"
                      defaultValue={selectedLink?.url}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="https://example.com"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLinkForm(false);
                      setSelectedLink(null);
                    }}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  >
                    {selectedLink ? 'Update' : 'Add'} Link
                  </button>
                </div>
              </form>
            </div>
          )}

          {program.externalLinks.length === 0 && !showLinkForm ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <Globe className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No external links added</h3>
              <p className="mt-1 text-sm text-gray-500">Add links to official program pages or resources</p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden rounded-md">
              <ul className="divide-y divide-gray-200">
                {program.externalLinks.map((link) => (
                  <li key={link.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{link.title}</div>
                        <a 
                          href={link.url} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm truncate max-w-xs block"
                        >
                          {link.url}
                        </a>
                      </div>
                      <div>
                        <button
                          onClick={() => {
                            setSelectedLink(link);
                            setShowLinkForm(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onLinkAction('delete', {} , link.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;