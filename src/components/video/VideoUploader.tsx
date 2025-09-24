'use client';

import { useState, useRef } from 'react';
import { videoService } from '@/lib/videoService';
import { 
  CloudArrowUpIcon, 
  XMarkIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface VideoUploaderProps {
  lessonId: string;
  onUploadComplete?: (videoKey: string) => void;
  onUploadError?: (error: string) => void;
}

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export function VideoUploader({ lessonId, onUploadComplete, onUploadError }: VideoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>('idle');
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleFileSelect = (file: File) => {
    // Validate file type
    const validTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid video file (MP4, AVI, MOV, WMV, WebM)');
      return;
    }

    // Validate file size (max 2GB)
    const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
    if (file.size > maxSize) {
      setError('File size must be less than 2GB');
      return;
    }

    setError(null);
    setUploadedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;

    try {
      setIsUploading(true);
      setError(null);
      setProcessingStatus('uploading');

      // Upload file with progress tracking
      const videoKey = await videoService.uploadVideoFile(uploadedFile, lessonId, (progress) => {
        setUploadProgress({
          loaded: progress,
          total: 100,
          percentage: progress
        });
      });
      
      setProcessingStatus('processing');
      setUploadProgress(null);
      
      // Monitor processing status
      monitorProcessingStatus();
      
      onUploadComplete?.(videoKey);
      
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      onUploadError?.(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const monitorProcessingStatus = () => {
    progressIntervalRef.current = setInterval(async () => {
      try {
        const status = await videoService.getProcessingStatus(lessonId);
        setProcessingStatus(status);
        
        if (status === 'COMPLETED' || status === 'FAILED') {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
          }
        }
      } catch (error) {
        console.error('Error monitoring processing status:', error);
      }
    }, 5000); // Check every 5 seconds
  };

  const removeFile = () => {
    setUploadedFile(null);
    setError(null);
    setProcessingStatus('idle');
    setUploadProgress(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = () => {
    switch (processingStatus) {
      case 'uploading':
        return <CloudArrowUpIcon className="h-8 w-8 text-blue-500 animate-pulse" />;
      case 'processing':
        return <ClockIcon className="h-8 w-8 text-yellow-500 animate-spin" />;
      case 'COMPLETED':
        return <CheckCircleIcon className="h-8 w-8 text-green-500" />;
      case 'FAILED':
        return <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />;
      default:
        return <CloudArrowUpIcon className="h-8 w-8 text-gray-400" />;
    }
  };

  const getStatusMessage = () => {
    switch (processingStatus) {
      case 'uploading':
        return 'Uploading video...';
      case 'processing':
        return 'Processing video for streaming...';
      case 'COMPLETED':
        return 'Video processing completed!';
      case 'FAILED':
        return 'Video processing failed. Please try again.';
      default:
        return 'Ready to upload';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      {!uploadedFile && (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Upload Video File
          </h3>
          <p className="text-gray-600 mb-4">
            Drag and drop your video file here, or click to browse
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Choose File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <p className="text-sm text-gray-500 mt-4">
            Supported formats: MP4, AVI, MOV, WMV, WebM (max 2GB)
          </p>
        </div>
      )}

      {/* File Selected */}
      {uploadedFile && (
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getStatusIcon()}
              <div>
                <h4 className="font-medium text-gray-900">{uploadedFile.name}</h4>
                <p className="text-sm text-gray-600">{formatFileSize(uploadedFile.size)}</p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Status Message */}
          <div className="mb-4">
            <p className="text-sm text-gray-700">{getStatusMessage()}</p>
          </div>

          {/* Upload Progress */}
          {uploadProgress && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Upload Progress</span>
                <span>{uploadProgress.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress.percentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          {processingStatus === 'idle' && (
            <div className="flex space-x-3">
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading...' : 'Upload Video'}
              </button>
              <button
                onClick={removeFile}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Processing Status */}
          {processingStatus === 'processing' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-5 w-5 text-yellow-600 animate-spin" />
                <p className="text-sm text-yellow-800">
                  Video is being processed for streaming. This may take several minutes.
                </p>
              </div>
            </div>
          )}

          {/* Success Status */}
          {processingStatus === 'COMPLETED' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
                <p className="text-sm text-green-800">
                  Video processing completed successfully! The video is now ready for streaming.
                </p>
              </div>
            </div>
          )}

          {/* Error Status */}
          {processingStatus === 'FAILED' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                <p className="text-sm text-red-800">
                  Video processing failed. Please try uploading again.
                </p>
              </div>
              <button
                onClick={removeFile}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* Upload Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Upload Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use MP4 format for best compatibility</li>
          <li>• Keep file size under 2GB for faster uploads</li>
          <li>• Ensure good audio quality for better learning experience</li>
          <li>• Video will be automatically converted to multiple quality levels</li>
          <li>• Processing typically takes 5-15 minutes depending on video length</li>
        </ul>
      </div>
    </div>
  );
}
