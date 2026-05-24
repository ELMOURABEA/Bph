import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    res.status(200).json({ reply: response.text });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "حدث خطأ أثناء معالجة طلبك" });
  }
}
