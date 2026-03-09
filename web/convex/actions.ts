import { action } from "./_generated/server";
import { v } from "convex/values";

// Stub for AI Action
export const processWithAI = action({
  args: { input: v.string() },
  handler: async (ctx, args) => {
    // Implement AI call here using standard VLM / LLM
    return { success: true, result: "AI processing stub" };
  },
});
