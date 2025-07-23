import React from 'react';
import { BarChart3 } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <div className="header-container">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
          <BarChart3 className="w-8 h-8 text-white" />
        </div>
        <div className="header-text">
          <h1 className="text-4xl font-bold text-blue-700 mb-2">
            ابزار بهینه‌سازی داده‌های جیرا
          </h1>
          <p className="text-xl text-gray-600">
            طراحی شده برای واحد PMO شرکت بهسا
          </p>
        </div>
      </div>
    </div>
  );
};