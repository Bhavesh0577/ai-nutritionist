# AI Food Nutrition Analyzer

A Next.js application that uses Google's Gemini 2.0 Flash model to analyze food images and provide detailed nutritional information.

## Features

- 🍎 Upload food images for analysis
- 🧠 AI-powered nutrition analysis using Gemini 2.0 Flash
- 📊 Detailed breakdown of calories, macronutrients, and micronutrients
- 💡 Health notes and dietary considerations
- 📱 Responsive design with beautiful UI

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Google AI API key (Gemini)

### Setup Instructions

1. **Navigate to the project directory:**
   ```bash
   cd newproj
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Get your Gemini API key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the API key

4. **Configure environment variables:**
   - Add your Gemini API key to `.env.local`:
     ```
     NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
     ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Upload a food image and get detailed nutrition analysis!

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
