import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
export const saveEvent = mutation({
  args: {
    eventType: v.string(), title: v.string(), guestCount: v.number(), budget: v.optional(v.string()), date: v.optional(v.string()), location: v.optional(v.string()), description: v.optional(v.string()),
    plan: v.object({ timeline: v.array(v.object({ time: v.string(), activity: v.string(), notes: v.string() })), checklist: v.array(v.object({ task: v.string(), category: v.string(), priority: v.string() })), venueIdeas: v.array(v.string()), cateringIdeas: v.array(v.string()), entertainmentIdeas: v.array(v.string()), budgetBreakdown: v.array(v.object({ item: v.string(), estimate: v.string() })), tips: v.array(v.string()) })
  },
  handler: async (ctx, args) => await ctx.db.insert("events", { ...args, createdAt: Date.now() }),
});
export const getRecent = query({ args: {}, handler: async (ctx) => await ctx.db.query("events").order("desc").take(20) });
export const getStatus = query({ args: {}, handler: async () => ({ status: "Online", timestamp: Date.now() }) });
