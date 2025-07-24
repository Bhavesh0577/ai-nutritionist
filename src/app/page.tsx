'use client';

import ImageAnalyzer from '@/components/ImageAnalyzer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-6 lg:py-12 px-2 sm:px-4 lg:px-8">
      <div className="max-w-sm sm:max-w-2xl lg:max-w-4xl mx-auto">
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4 px-2">
            AI Food Nutrition Analyzer
          </h1>
          <p className="text-sm sm:text-base lg:text-xl text-gray-600 mb-4 sm:mb-6 lg:mb-8 px-2 sm:px-4">
            Upload a food image and get detailed nutritional information
          </p>
        </div>
        
        <ImageAnalyzer />
      </div>
    </div>
  );
}
