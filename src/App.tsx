import React, { useState } from 'react';
import { Header } from './components/Header';
import { FileUploader } from './components/FileUploader';
import { DataProcessor } from './components/DataProcessor';
import { Footer } from './components/Footer';
import { Info } from 'lucide-react';

function App() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setIsProcessing(true);
  };

  const handleProcessingComplete = () => {
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Header />
        
        <div className="space-y-8">
          <FileUploader 
            onFileUpload={handleFileUpload} 
            isProcessing={isProcessing}
          />
          
          {uploadedFile ? (
            <DataProcessor 
              file={uploadedFile} 
              onProcessingComplete={handleProcessingComplete}
            />
          ) : (
            <div className="card">
              <div className="flex items-center gap-4 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <Info className="w-8 h-8 text-blue-500 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-1">راهنمای استفاده</h3>
                  <p className="text-blue-700">
                    برای شروع، لطفاً فایل CSV استخراج شده از جیرا را از قسمت بالا بارگذاری کنید.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <Footer />
      </div>
    </div>
  );
}

export default App;