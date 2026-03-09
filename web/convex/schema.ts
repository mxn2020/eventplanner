import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
export default defineSchema({
  ...authTables,
  events: defineTable({
    eventType: v.string(), // "private", "business", "party", "wedding", "conference", "birthday", "corporate", "fundraiser"
    title: v.string(), guestCount: v.number(), budget: v.optional(v.string()), date: v.optional(v.string()), location: v.optional(v.string()),
    description: v.optional(v.string()),
    plan: v.object({
      timeline: v.array(v.object({ time: v.string(), activity: v.string(), notes: v.string() })),
      checklist: v.array(v.object({ task: v.string(), category: v.string(), priority: v.string() })),
      venueIdeas: v.array(v.string()),
      cateringIdeas: v.array(v.string()),
      entertainmentIdeas: v.array(v.string()),
      budgetBreakdown: v.array(v.object({ item: v.string(), estimate: v.string() })),
      tips: v.array(v.string()),
    }),
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]).index("by_type", ["eventType"]),
});
