/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// components/SyllabusUpload.tsx
import React, { useState, useRef } from 'react';
import { Upload, FileText, X, Download, Loader2, Eye } from 'lucide-react';

interface SyllabusUploadProps {
  programId: string;
  existingSyllabus?: {
    id: string;
    fileUrl: string;
    uploadedAt: string | Date;
  } | null;
  onUploadSuccess?: (syllabus: any) => void;
  onDeleteSuccess?: () => void;
  className?: string;
}

const SyllabusUpload: React.FC<SyllabusUploadProps> = ({
  programId,
  existingSyllabus,
  onUploadSuccess,
  onDeleteSuccess,
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type === 'application/pdf') {
      uploadSyllabus(file);
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const uploadSyllabus = async (file: File) => {
    if (!programId) {
      alert('Program ID is required');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('programId', programId);

      // Simulate upload progress (since we can't track actual progress with FormData)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/upload/syllabus', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      // Call success callback
      if (onUploadSuccess) {
        onUploadSuccess(result.syllabus);
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      alert(`Syllabus uploaded successfully for ${result.programInfo.name}`);

    } catch (error) {
      console.error('Error uploading syllabus:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload syllabus');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteSyllabus = async () => {
    if (!programId) return;
    
    if (!confirm('Are you sure you want to delete this syllabus?')) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(`/api/upload/syllabus?programId=${programId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Delete failed');
      }

      // Call success callback
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }

      alert('Syllabus deleted successfully');

    } catch (error) {
      console.error('Error deleting syllabus:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete syllabus');
    } finally {
      setDeleting(false);
    }
  };

  const getFileName = (url: string) => {
    // Extract filename from Cloudinary URL
    const urlParts = url.split('/');
    const lastPart = urlParts[urlParts.length - 1];
    const fileNameWithoutQuery = lastPart.split('?')[0];
    
    // If it doesn't have .pdf extension, add it
    if (!fileNameWithoutQuery.endsWith('.pdf')) {
      return fileNameWithoutQuery + '.pdf';
    }
    
    return fileNameWithoutQuery;
  };

  // Create a proper download URL that forces download
  const getDownloadUrl = (url: string) => {
    // For Cloudinary URLs, add fl_attachment flag to force download
    if (url.includes('cloudinary.com')) {
      // Insert fl_attachment before the version number or filename
      return url.replace('/upload/', '/upload/fl_attachment/');
    }
    return url;
  };

  // Create a proper view URL for inline viewing
 const getViewUrl = (url: string) => {
  if (url.includes('/raw/')) {
    // For raw uploads (like PDFs), just return the original URL
    return url;
  }

  // For image/auto resource_type, apply inline view transformation
  return url
    .replace('/upload/fl_attachment/', '/upload/')
    .replace('/upload/', '/upload/fl_inline/');
};


  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Program Syllabus</h3>
        {existingSyllabus && (
          <div className="flex items-center space-x-2">
            <a
              href={getViewUrl(existingSyllabus.fileUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
              title="View PDF in browser"
            >
              <Eye className="h-3 w-3 mr-1" />
              View PDF
            </a>
            <a
              href={getDownloadUrl(existingSyllabus.fileUrl)}
              download={getFileName(existingSyllabus.fileUrl)}
              className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
              title="Download PDF"
            >
              <Download className="h-3 w-3 mr-1" />
              Download
            </a>
            <button
              onClick={deleteSyllabus}
              disabled={deleting}
              className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 disabled:opacity-50"
            >
              {deleting ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <X className="h-3 w-3 mr-1" />
              )}
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>

      {existingSyllabus ? (
        <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-md">
          <FileText className="h-5 w-5 text-green-600 mr-3" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-green-900">
              {getFileName(existingSyllabus.fileUrl)}
            </p>
            <p className="text-xs text-green-700">
              Uploaded on {new Date(existingSyllabus.uploadedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
            dragOver
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
        >
          <div className="text-center">
            {uploading ? (
              <div className="space-y-3">
                <Loader2 className="mx-auto h-8 w-8 text-blue-600 animate-spin" />
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Uploading syllabus...</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">{uploadProgress}%</p>
                </div>
              </div>
            ) : (
              <>
                <FileText className="mx-auto h-8 w-8 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="syllabus-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Drop your PDF here, or{' '}
                      <span className="text-blue-600 hover:text-blue-500">browse</span>
                    </span>
                    <input
                      ref={fileInputRef}
                      id="syllabus-upload"
                      name="syllabus-upload"
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleFileInputChange}
                      disabled={uploading}
                    />
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    PDF files up to 10MB
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Upload button for existing syllabus replacement */}
      {existingSyllabus && (
        <div className="flex justify-center">
          <label
            htmlFor="syllabus-replace"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
          >
            <Upload className="h-4 w-4 mr-2" />
            Replace Syllabus
            <input
              ref={fileInputRef}
              id="syllabus-replace"
              name="syllabus-replace"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileInputChange}
              disabled={uploading}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default SyllabusUpload;