"use client";

import { useState, useRef } from "react";
import { Upload, FileText, X, AlertCircle } from "lucide-react";
import { Button, Alert } from "../ui";

export const DocumentUpload = ({
  onFileSelect,
  maxFileSize = 5, // MB
  acceptedFormats = ['JPG', 'PNG', 'PDF'],
  multiple = false,
  className = ""
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file) => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`;
    }

    // Check file format
    const fileExtension = file.name.split('.').pop().toUpperCase();
    if (!acceptedFormats.includes(fileExtension)) {
      return `Only ${acceptedFormats.join(', ')} files are allowed`;
    }

    return null;
  };

  const handleFiles = (files) => {
    setError("");
    const fileArray = Array.from(files);
    
    if (!multiple && fileArray.length > 1) {
      setError("Please select only one file");
      return;
    }

    const validFiles = [];
    const errors = [];

    fileArray.forEach(file => {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }

    if (multiple) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
    } else {
      setUploadedFiles(validFiles);
    }

    if (onFileSelect) {
      onFileSelect(multiple ? validFiles : validFiles[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    if (onFileSelect) {
      onFileSelect(multiple ? newFiles : null);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">
          Upload Your Document
        </h2>

        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 lg:p-12 text-center transition-all duration-200 cursor-pointer ${
            dragActive
              ? "border-[#5C88D7] bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-300 dark:border-gray-600 hover:border-[#5C88D7] hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept={acceptedFormats.map(format => `.${format.toLowerCase()}`).join(',')}
            onChange={handleInputChange}
            className="hidden"
          />

          {/* Upload Icon */}
          <div className="mb-4 sm:mb-6">
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#00188F] to-[#5C88D7] rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>

          {/* Upload Text */}
          <div className="mb-4 sm:mb-6">
            <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Supported formats: {acceptedFormats.join(', ')}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Maximum file size: {maxFileSize}MB
            </p>
          </div>

          {dragActive && (
            <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-2 border-dashed border-[#5C88D7] flex items-center justify-center">
              <p className="text-[#5C88D7] font-medium text-lg">Drop files here</p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4">
            <Alert type="error" message={error} onClose={() => setError("")} />
          </div>
        )}

        {/* Important Notice */}
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <span className="font-bold">IMPORTANT:</span> All documents must be accurate and original. 
              These documents are necessary for verification purposes. If documents are found to be 
              non-original or fraudulent, NO REFUND will be provided. By uploading, you confirm the 
              authenticity of these documents.
            </div>
          </div>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Uploaded Files ({uploadedFiles.length})
            </h3>
            <div className="space-y-3">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-buttons-gradient rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="flex-shrink-0 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Button */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Button
              onClick={() => {
                // Handle final upload logic here
                console.log("Uploading files:", uploadedFiles);
              }}
              className="w-full sm:w-auto px-8 py-3 text-base font-semibold"
            >
              Upload Documents
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Default export for easy importing
export default DocumentUpload;
