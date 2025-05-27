'use client';

import { useState } from 'react';
import { analyzeImage, validateImageFile } from '@/lib/gemini';

interface NutritionData {
  meal_name: string;
  ingredients: string[];
  calories: number;
  macronutrients: {
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
  };
  micronutrients: {
    vitamin_c: string;
    calcium: string;
    iron: string;
    potassium: string;
  };
  serving_size: string;
  health_notes: string[];
}

const ImageAnalyzer = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        validateImageFile(file);
        setSelectedImage(file);
        setError(null);
        setNutritionData(null);
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Invalid file selected');
        setSelectedImage(null);
        setImagePreview(null);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeImage(selectedImage);
      setNutritionData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setNutritionData(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="text-center">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-lg text-gray-600 mb-2">
                Click to upload a food image
              </p>
              <p className="text-sm text-gray-500">
                PNG, JPG, GIF up to 10MB
              </p>
            </label>
          </div>
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mt-6 text-center">
            <img
              src={imagePreview}
              alt="Selected food"
              className="max-w-sm mx-auto rounded-lg shadow-md"
            />
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Nutrition'}
              </button>
              <button
                onClick={resetAnalysis}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Results Section */}
      {nutritionData && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Nutrition Analysis Results
          </h2>

          {/* Meal Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {nutritionData.meal_name}
            </h3>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Serving Size:</span> {nutritionData.serving_size}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Ingredients:</span> {nutritionData.ingredients.join(', ')}
            </p>
          </div>

          {/* Calories */}
          <div className="mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-blue-900 mb-2">Calories</h4>
              <p className="text-3xl font-bold text-blue-700">{nutritionData.calories}</p>
            </div>
          </div>

          {/* Macronutrients */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Macronutrients</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <p className="font-medium text-green-800">Protein</p>
                <p className="text-xl font-bold text-green-700">{nutritionData.macronutrients.protein}</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="font-medium text-yellow-800">Carbs</p>
                <p className="text-xl font-bold text-yellow-700">{nutritionData.macronutrients.carbs}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="font-medium text-red-800">Fat</p>
                <p className="text-xl font-bold text-red-700">{nutritionData.macronutrients.fat}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="font-medium text-purple-800">Fiber</p>
                <p className="text-xl font-bold text-purple-700">{nutritionData.macronutrients.fiber}</p>
              </div>
            </div>
          </div>

          {/* Micronutrients */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Key Micronutrients</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="font-medium text-orange-800">Vitamin C</p>
                <p className="text-lg font-bold text-orange-700">{nutritionData.micronutrients.vitamin_c}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-gray-800">Calcium</p>
                <p className="text-lg font-bold text-gray-700">{nutritionData.micronutrients.calcium}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="font-medium text-red-800">Iron</p>
                <p className="text-lg font-bold text-red-700">{nutritionData.micronutrients.iron}</p>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4">
                <p className="font-medium text-indigo-800">Potassium</p>
                <p className="text-lg font-bold text-indigo-700">{nutritionData.micronutrients.potassium}</p>
              </div>
            </div>
          </div>

          {/* Health Notes */}
          {nutritionData.health_notes.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Health Notes</h4>
              <ul className="bg-green-50 rounded-lg p-4 space-y-2">
                {nutritionData.health_notes.map((note, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span className="text-green-800">{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageAnalyzer;
