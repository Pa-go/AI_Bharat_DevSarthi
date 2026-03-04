import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { bedrockClient } from "@/lib/bedrock-client";

// Locale to language name mapping
const LOCALE_TO_LANGUAGE = {
  'en': 'English',
  'hi': 'Hindi',
  'ta': 'Tamil',
  'te': 'Telugu',
  'bn': 'Bengali',
  'mr': 'Marathi'
}

export async function POST(req) {
  try {
    const { messages, language = "English", locale } = await req.json();
    
    // If locale is provided, use it to determine language
    const responseLanguage = locale ? (LOCALE_TO_LANGUAGE[locale] || 'English') : language;

    const SYSTEM_PROMPT = `You are DevSathi, an AI tutor for BSc IT students.
    
    STRICT RULES FOR RESPONSES:
    1. ANSWER FIRST: Give the direct answer/solution in the very first sentence.
    2. BREVITY: Use small paragraphs (max 2-3 sentences).
    3. LANGUAGE: Respond ONLY in ${responseLanguage}.
    4. TONE: Professional but simple. No long intros like "I hope this helps" or "Here is your answer."
    5. FORMATTING: Use bold text for key terms and bullet points if explaining more than two items.
    
    If a student asks a coding question, provide the code block immediately with minimal explanation.`;

    const command = new ConverseCommand({
      modelId: "us.amazon.nova-2-lite-v1:0", 
      messages: messages,
      system: [{ text: SYSTEM_PROMPT }], 
      inferenceConfig: { 
        maxTokens: 500, // Reduced tokens to force the AI to be concise
        temperature: 0.5 // Lower temperature for more direct, less "chatty" answers
      }
    });

    const response = await bedrockClient.send(command);
    const replyText = response.output?.message?.content?.[0]?.text;

    return new Response(JSON.stringify({ text: replyText }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("❌ BACKEND ERROR:", error.message);
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}