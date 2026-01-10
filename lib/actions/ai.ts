"use server";

import { groq } from "@/lib/groq";

export async function generateDescription(context: string, type: "product" | "store") {
  try {
    if (!process.env.GROQ_API_KEY) {
      return { error: "Groq API key is not configured" };
    }

    let prompt = "";

    if (type === "product") {
      prompt = `Write a compelling and SEO-friendly product description for a product named "${context}".
      Keep it between 50-100 words. Optimize for sales.
      Output ONLY the description text, no markdown formatting like **bold** or headings.`;
    } else {
      prompt = `Write a professional and welcoming store description for a store named "${context}".
      The store allows people to order via WhatsApp.
      Keep it between 50-100 words.
      Output ONLY the description text, no markdown formatting like **bold** or headings.`;
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-70b-8192",
    });

    const text = completion.choices[0]?.message?.content || "";

    return { description: text.trim() };
  } catch (error) {
    console.error("Groq generation error:", error);
    return { error: "Failed to generate description" };
  }
}
