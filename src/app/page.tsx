'use client';

import ImageAnalyzer from '@/components/ImageAnalyzer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Food Nutrition Analyzer
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Upload a food image and get detailed nutritional information
          </p>
        </div>
        
        <ImageAnalyzer />
      </div>
    </div>
  );
}
