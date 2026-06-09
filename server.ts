import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is not configured. Please add it in the Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. API: Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 2. API: Generate Funnel Detail Helper using Gemini 3.5 Flash
app.post("/api/generate-funnel-helper", async (req, res) => {
  try {
    const { 
      clientName, 
      clientIndustry, 
      funnelType, 
      stepName, 
      projectDescription 
    } = req.body;

    if (!stepName) {
      return res.status(400).json({ error: "stepName is required." });
    }

    const ai = getGeminiClient();

    const systemPrompt = `You are an elite UTAGE Funnel marketing architect and high-converting copywriter.
Based on the input project details, design an optimized layout, high-converting copywriting (headline, sub-headline, bullet points, CTA), and a follow-up autoresponder email draft.
Output the answer using strict JSON format as requested in the schema. Do not include markdown wraps other than raw JSON.
All response fields MUST be written in Japanese.`;

    const userPrompt = `
=== CLIENT INFO ===
Client Name: ${clientName || "未設定"}
Industry: ${clientIndustry || "Webマーケティング"}
Funnel Target Scenario: ${funnelType || "個別相談獲得ファネル"}
Project Description: ${projectDescription || "高コンバージョンを目指すプロジェクト"}

=== CURRENT FUNNEL STEP ===
Step Name: ${stepName}

Generate high-performance marketing copy, email follow-up sequence draft, and recommended UTAGE landing page section configuration for this specific step.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headlineCopy: {
              type: Type.STRING,
              description: "The primary hook / visual headline or page title copy (キャッチコピー)."
            },
            subHeadline: {
              type: Type.STRING,
              description: "Sub-headlines or benefits statement (サブキャッチコピー/説明文)."
            },
            ctaText: {
              type: Type.STRING,
              description: "Call to Action button text (ボタン文字, e.g., '無料で動画を見る', '個別面談を予約する')."
            },
            keyFeatures: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 highly compelling bullet points/appeal items (訴求ポイント3選)."
            },
            emailSubject: {
              type: Type.STRING,
              description: "Optimal subject line for the automated response e-mail linked to this step (自動配信メール件名)."
            },
            emailBody: {
              type: Type.STRING,
              description: "E-mail body draft designed to build trust and drive clicks (自動配信メール本文)."
            },
            layoutRecomendations: {
              type: Type.STRING,
              description: "Styling recommendations, colors, fonts, and UTAGE blocks list (おすすめ配色・フォント、UTAGE要素の配置順などの推薦レイアウト)."
            }
          },
          required: [
            "headlineCopy", 
            "subHeadline", 
            "ctaText", 
            "keyFeatures", 
            "emailSubject", 
            "emailBody", 
            "layoutRecomendations"
          ]
        }
      }
    });

    const resultText = response.text || "{}";
    const data = JSON.parse(resultText);
    res.json(data);

  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    res.status(500).json({ 
      error: error.message || "Internal server error during copywriting generation." 
    });
  }
});

// Setup Vite Dev Server / Static Asset Flow
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    // Dynamically import Vite only in development
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express and Vite development server running on http://0.0.0.0:${PORT}`);
  });
}

initServer();
