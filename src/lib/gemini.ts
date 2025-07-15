import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

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

// Convert image file to base64
async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      resolve(base64String.split(',')[1]); // Remove data:image/jpeg;base64, prefix
    };
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
}

export async function analyzeImage(imageFile: File): Promise<NutritionData> {
  try {
    // Check if API key is available
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your environment variables.');
    }

    // Get the generative model (Gemini 2.0 Flash)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Convert image to the format required by Gemini
    const imagePart = await fileToGenerativePart(imageFile);    // Create a detailed prompt for nutrition analysis
    const prompt = `
      Analyze this food image and provide detailed nutritional information. 

      IMPORTANT: Respond with ONLY a valid JSON object, no markdown formatting, no code blocks, no additional text.

      Required JSON structure:
      {
        "meal_name": "Name of the dish/meal",
        "ingredients": ["ingredient1", "ingredient2", "ingredient3"],
        "calories": estimated_calories_number,
        "macronutrients": {
          "protein": "X grams",
          "carbs": "X grams", 
          "fat": "X grams",
          "fiber": "X grams"
        },
        "micronutrients": {
          "vitamin_c": "X mg",
          "calcium": "X mg",
          "iron": "X mg",
          "potassium": "X mg"
        },
        "serving_size": "approximate serving size description",
        "health_notes": ["health benefit 1", "health benefit 2", "dietary consideration"]
      }

      Provide realistic estimates based on what you can see in the image. If you cannot clearly identify the food, provide your best estimate and mention uncertainty in the health_notes.

      Return only the JSON object, nothing else.
    `;

    // Generate content with the image and prompt
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();    // Parse the JSON response
    try {
      let jsonText = text.trim();
      
      // Remove markdown code blocks if present
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      const nutritionData = JSON.parse(jsonText) as NutritionData;
      
      // Validate that required fields exist
      if (!nutritionData.meal_name || !nutritionData.calories) {
        throw new Error('Invalid response format from AI');
      }

      return nutritionData;
    } catch (error) {
      console.error('Failed to parse AI response:', text);
      throw new Error('Failed to parse nutrition analysis. Please try again.');
    }

  } catch (error) {
    console.error('Error analyzing image:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Failed to analyze the image. Please check your internet connection and try again.');
  }
}

// Function to validate image file
export function validateImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    throw new Error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
  }

  if (file.size > maxSize) {
    throw new Error('Image file size must be less than 10MB');
  }

  return true;
}
