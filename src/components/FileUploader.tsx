import React, { useCallback } from 'react';
import { Upload, FileText } from 'lucide-react';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  isProcessing: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload, isProcessing }) => {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.name.toLowerCase().endsWith('.csv'));
    
    if (csvFile) {
      onFileUpload(csvFile);
    }
  }, [onFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  return (
    <div className="card">
      <div className="flex items-center gap-6 mb-6">
        <div className="flex-shrink-0">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <FileText className="w-12 h-12 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">۱. بارگذاری فایل</h2>
          <p className="text-gray-600">فایل CSV استخراج شده از جیرا را بارگذاری کنید</p>
        </div>
      </div>

      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          isProcessing 
            ? 'border-gray-300 bg-gray-50' 
            : 'border-blue-400 bg-blue-50 hover:border-blue-500 hover:bg-blue-100'
        }`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Upload className={`w-12 h-12 mx-auto mb-4 ${isProcessing ? 'text-gray-400' : 'text-blue-500'}`} />
        <p className={`text-lg font-medium mb-2 ${isProcessing ? 'text-gray-500' : 'text-blue-700'}`}>
          {isProcessing ? 'در حال پردازش...' : 'فایل را اینجا بکشید یا کلیک کنید'}
        </p>
        <p className={`text-sm ${isProcessing ? 'text-gray-400' : 'text-gray-600'}`}>
          فقط فایل‌های CSV پذیرفته می‌شوند
        </p>
        
        <input
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          disabled={isProcessing}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className={`inline-block mt-4 px-6 py-3 rounded-lg font-medium transition-all duration-300 cursor-pointer ${
            isProcessing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5'
          }`}
        >
          انتخاب فایل
        </label>
      </div>
    </div>
  );
};