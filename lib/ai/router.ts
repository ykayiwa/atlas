import { llm } from "@/lib/ai/provider";
import { isHighStakes } from "@/lib/rag/pipeline";

export async function selectModel(category?: string) {
  // For now, use the same model for all categories
  // When ready to upgrade, check high_stakes from DB and route to a stronger model
  if (category) {
    const highStakes = await isHighStakes(category);
    if (highStakes) {
      // In the future, route to a stronger model here
      // e.g. return openrouter("anthropic/claude-sonnet-4-5")
      return llm;
    }
  }
  return llm;
}
