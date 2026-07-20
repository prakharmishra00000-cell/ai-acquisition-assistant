import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'fake-key');

app.post('/api/analyze', async (req, res) => {
  try {
    const { url, targetPrice } = req.body;
    console.log(`Analyzing: ${url} with target price: ${targetPrice}`);

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ success: false, error: 'GEMINI_API_KEY is missing from server environment.' });
    }

    let techStack = ['React', 'Node.js', 'Express']; // Default fallback if BuiltWith fails or is missing
    
    // 1. Fetch Tech Stack from BuiltWith
    if (process.env.BUILTWITH_API_KEY && process.env.BUILTWITH_API_KEY !== 'bw-key-demo') {
      try {
        const domain = new URL(url).hostname;
        const bwRes = await axios.get(`https://api.builtwith.com/free1/api.json?KEY=${process.env.BUILTWITH_API_KEY}&LOOKUP=${domain}`);
        if (bwRes.data && bwRes.data.groups && bwRes.data.groups.length > 0) {
           techStack = bwRes.data.groups[0].categories.map(c => c.name).slice(0, 8);
        }
      } catch (bwError) {
        console.warn('BuiltWith fetch failed, proceeding with fallback tech stack.', bwError.message);
      }
    }

    // 2. Generate Valuation, Pitch, and Buyers with Gemini
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `You are an expert M&A Advisor. 
      I am selling a website: ${url}. 
      My target asking price is: ${targetPrice}. 
      The tech stack detected is: ${techStack.join(', ')}.
      
      Generate a JSON response with exactly four fields:
      1. "exactValuation": Calculate an EXACT, singular dollar amount (e.g. "$245,500") based on the asking price and tech stack complexity. Do not give a range.
      2. "salesSummary": A compelling 3-sentence sales pitch highlighting the specific tech stack and why it's a great acquisition target.
      3. "confidenceScore": A number between 70 and 99 representing the confidence of this valuation.
      4. "buyers": An array of exactly 3 highly targeted buyer profiles. Each profile must have these fields: "name" (String), "type" (String like "Private Equity Firm", "Strategic Buyer", "Individual Investor"), "matchScore" (Number between 75 and 99), "budget" (String like "$200k - $500k"), "techPrefs" (String), and "focus" (Array of 3 Strings).
      
      Output ONLY valid JSON. Do not include markdown formatting or backticks around the JSON.`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(responseText);
      } catch (jsonErr) {
        throw new Error("Gemini returned malformed JSON: " + responseText);
      }

      res.json({
        success: true,
        data: {
          valuation: parsedResponse.exactValuation,
          techStack: techStack,
          salesSummary: parsedResponse.salesSummary,
          confidenceScore: parsedResponse.confidenceScore,
          buyers: parsedResponse.buyers
        }
      });
    } catch (geminiError) {
      console.error('Gemini API Error:', geminiError);
      return res.status(500).json({ success: false, error: 'Gemini API Error: ' + geminiError.message });
    }
  } catch (error) {
    console.error('Error in analysis:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error: ' + error.message });
  }
});

// Serve the Static Frontend (The Vite React App)
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all route to serve index.html for React Router
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    next();
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
