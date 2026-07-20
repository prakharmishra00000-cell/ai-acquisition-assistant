import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import nodemailer from 'nodemailer';

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
      // Dynamically fetch available models to prevent 404 errors on specific API keys
      let selectedModelName = "gemini-1.5-flash"; // Fallback
      try {
        const modelsRes = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        if (modelsRes.data && modelsRes.data.models) {
          const validModel = modelsRes.data.models.find(m => 
            m.supportedGenerationMethods && 
            m.supportedGenerationMethods.includes('generateContent') && 
            m.name.includes('gemini-1.5')
          ) || modelsRes.data.models.find(m => 
            m.supportedGenerationMethods && 
            m.supportedGenerationMethods.includes('generateContent') && 
            m.name.includes('gemini')
          );
          
          if (validModel) {
            selectedModelName = validModel.name.replace('models/', '');
            console.log("Dynamically selected model:", selectedModelName);
          }
        }
      } catch (modelFetchErr) {
        console.warn("Failed to dynamically fetch models, using fallback.", modelFetchErr.message);
      }

      const model = genAI.getGenerativeModel({ model: selectedModelName });
      const prompt = `You are an expert M&A Advisor based in India. 
      I am selling a website: ${url}. 
      My target asking price is: ₹${targetPrice} (Indian Rupees). 
      The tech stack detected is: ${techStack.join(', ')}.
      
      Generate a JSON response with exactly four fields:
      1. "exactValuation": Calculate an EXACT, singular rupee amount (e.g. "₹2,45,50,000") based on the asking price and tech stack complexity. Do not give a range.
      2. "salesSummary": A compelling 3-sentence sales pitch highlighting the specific tech stack and why it's a great acquisition target for the Indian market.
      3. "confidenceScore": A number between 70 and 99 representing the confidence of this valuation.
      4. "buyers": An array of exactly 3 highly targeted, **REAL-WORLD Indian Venture Capital or Private Equity firms**. You must output real firms (e.g. Sequoia India/Peak XV, Nexus Venture Partners, Blume Ventures, etc). Each profile must have these fields: "name" (String, real firm name), "email" (String, guess their public contact email like pitch@firmname.com or info@firmname.in), "type" (String like "Private Equity Firm", "Strategic Buyer"), "matchScore" (Number between 75 and 99), "budget" (String like "₹2Cr - ₹5Cr"), "techPrefs" (String), and "focus" (Array of 3 Strings).
      
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

// Helper function to get valid model
async function getValidModelName() {
  let selectedModelName = "gemini-1.5-flash"; // Fallback
  try {
    const modelsRes = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    if (modelsRes.data && modelsRes.data.models) {
      const validModel = modelsRes.data.models.find(m => 
        m.supportedGenerationMethods && 
        m.supportedGenerationMethods.includes('generateContent') && 
        m.name.includes('gemini-1.5')
      ) || modelsRes.data.models.find(m => 
        m.supportedGenerationMethods && 
        m.supportedGenerationMethods.includes('generateContent') && 
        m.name.includes('gemini')
      );
      
      if (validModel) {
        selectedModelName = validModel.name.replace('models/', '');
      }
    }
  } catch (modelFetchErr) {
    console.warn("Failed to dynamically fetch models, using fallback.", modelFetchErr.message);
  }
  return selectedModelName;
}

// Live Email API: Actually sends an email to the generated buyer using the user's Gmail
app.post('/api/chat/send-email', async (req, res) => {
  try {
    const { buyerProfile, subject, message } = req.body;
    
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASSWORD) {
      return res.status(500).json({ success: false, error: "GMAIL_USER and GMAIL_PASSWORD environment variables are missing." });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: buyerProfile.email || 'pitch@nexuscapital.com',
      subject: subject || 'Acquisition Opportunity',
      text: message
    };

    await transporter.sendMail(mailOptions);
    
    res.json({ success: true, reply: "Message sent! Since this is a real email, their reply will go directly to your Gmail inbox." });
  } catch (error) {
    console.error('Email Send Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Live AI Negotiator API: Gemini drafts a response for the Seller
app.post('/api/chat/negotiator', async (req, res) => {
  try {
    const { chatHistory, rules } = req.body;
    const modelName = await getValidModelName();
    const model = genAI.getGenerativeModel({ model: modelName });
    
    let historyStr = chatHistory.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
    
    const prompt = `You are the AI M&A Negotiator advising the seller.
    The seller's Negotiation Rules:
    - Target Price: ₹${rules.targetPrice}
    - Minimum Acceptable Price: ₹${rules.minPrice}
    - Acceptable Terms: ${rules.terms.join(', ')}
    
    Here is the conversation history:
    ${historyStr}
    
    Draft the perfect reply for the seller to send to the buyer. Defend their valuation, strictly adhere to their minimum price and terms, and try to close the deal. 
    Keep it brief (1-3 sentences) and professional. Output ONLY the drafted text.`;

    const result = await model.generateContent(prompt);
    const suggestionText = result.response.text().trim();
    
    res.json({ success: true, suggestion: suggestionText });
  } catch (error) {
    console.error('Negotiator Error:', error);
    res.status(500).json({ success: false, error: error.message });
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
