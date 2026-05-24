import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for AI Pharmacist consultation
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, context } = req.body;
      
      const systemInstruction = `أنت صيدلي خبير تعمل في صيدليات البنداري (El-Bendary Pharmacy) في مصر (منذ عام 1980). مهمتك هي الرد على استفسارات المرضى والعملاء حول الأدوية، الاستخدامات، الآثار الجانبية، ونصائح الرعاية الصحية.
تحدث بطريقة ودية، احترافية، ومطمئنة باللغة العربية.
إذا سأل المستخدم عن منتج في سياقه، قم بتوجيهه بناءً على السياق الآتي إن وجد: ${context ? JSON.stringify(context) : 'لا يوجد سياق'}
تنبيه هام: اذكر دائما أن هذه النصائح لا تغني عن استشارة الطبيب في الحالات الطارئة أو المرضية.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: message }]}],
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ reply: response.text });
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ error: "حدث خطأ أثناء معالجة طلبك" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
