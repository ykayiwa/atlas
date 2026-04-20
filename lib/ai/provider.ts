import { createOpenAI } from "@ai-sdk/openai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

// Primary: DeepSeek direct API
const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY ?? "",
  baseURL: "https://api.deepseek.com",
});

// Backup: OpenRouter (supports 290+ models)
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY ?? "",
  headers: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "https://atlas.com",
    "X-Title": "Atlas AI",
  },
});

// Use OpenRouter as primary, fall back to DeepSeek direct if no OpenRouter key
export const llm = process.env.OPENROUTER_API_KEY
  ? openrouter(process.env.LLM_MODEL ?? "moonshotai/kimi-k2.5")
  : deepseek(process.env.LLM_MODEL ?? "deepseek-chat");
