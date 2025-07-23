import React, { useState, useEffect } from 'react';
import { CheckCircle, Download, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface ProcessedData {
  data: any[];
  originalData: any[];
  fileName: string;
}

interface DataProcessorProps {
  file: File;
  onProcessingComplete: () => void;
}

export const DataProcessor: React.FC<DataProcessorProps> = ({ file, onProcessingComplete }) => {
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [showOriginalData, setShowOriginalData] = useState(false);

  useEffect(() => {
    processFile();
  }, [file]);

  const processFile = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('فایل باید حداقل یک سطر هدر و یک سطر داده داشته باشد');
      }

      // Parse CSV
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const rows = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });

      // Check required columns
      const requiredColumns = ['Custom field (Parent Key)', 'Issue key'];
      const missingColumns = requiredColumns.filter(col => !headers.includes(col));
      
      if (missingColumns.length > 0) {
        throw new Error(`ستون‌های مورد نیاز در فایل پیدا نشدند: ${missingColumns.join(', ')}`);
      }

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Process data
      const processedRows = rows.map(row => ({
        ...row,
        'آیا Parent Key برابر Issue key بود؟': row['Custom field (Parent Key)'] === row['Issue key'] ? 'خیر' : 'بله',
        'Custom field (Parent Key)': row['Issue key']
      }));

      setProcessedData({
        data: processedRows,
        originalData: rows,
        fileName: file.name
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در پردازش فایل');
    } finally {
      setIsProcessing(false);
      onProcessingComplete();
    }
  };

  const downloadCSV = () => {
    if (!processedData) return;

    const headers = Object.keys(processedData.data[0]);
    const csvContent = [
      headers.join(','),
      ...processedData.data.map(row => 
        headers.map(header => `"${row[header] || ''}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'processed_jira_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isProcessing) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">در حال پردازش فایل...</h3>
            <p className="text-gray-600">لطفاً صبر کنید</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="flex items-center gap-4 p-6 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-red-800 mb-1">خطا در پردازش فایل</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!processedData) return null;

  return (
    <div className="card">
      <div className="flex items-center gap-4 mb-6">
        <CheckCircle className="w-8 h-8 text-green-500" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">۲. نتایج پردازش</h2>
          <p className="text-green-600 font-medium">عملیات با موفقیت انجام شد! فایل شما آماده دانلود است.</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">پیش‌نمایش داده‌های نهایی:</h3>
        <div className="overflow-x-auto bg-gray-50 rounded-lg border">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Issue key</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Custom field (Parent Key)</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">آیا Parent Key برابر Issue key بود؟</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {processedData.data.slice(0, 5).map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{row['Issue key']}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{row['Custom field (Parent Key)']}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      row['آیا Parent Key برابر Issue key بود؟'] === 'بله' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {row['آیا Parent Key برابر Issue key بود؟']}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {processedData.data.length > 5 && (
          <p className="text-sm text-gray-600 mt-2">
            و {processedData.data.length - 5} سطر دیگر...
          </p>
        )}
      </div>

      <button
        onClick={downloadCSV}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-3"
      >
        <Download className="w-5 h-5" />
        دانلود فایل نهایی (CSV)
      </button>

      <div className="mt-6 border-t pt-6">
        <button
          onClick={() => setShowOriginalData(!showOriginalData)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          {showOriginalData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showOriginalData ? 'مخفی کردن' : 'مشاهده'} داده‌های خام اولیه
        </button>
        
        {showOriginalData && (
          <div className="mt-4 overflow-x-auto bg-gray-50 rounded-lg border">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  {Object.keys(processedData.originalData[0] || {}).map(header => (
                    <th key={header} className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {processedData.originalData.slice(0, 5).map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {Object.values(row).map((value: any, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-3 text-sm text-gray-900">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};