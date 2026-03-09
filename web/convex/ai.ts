import { action } from "./_generated/server";
import { v } from "convex/values";

const EVENT_PROMPTS: Record<string, string> = {
    private: "This is an intimate private gathering. Focus on personal touches, cozy ambiance, and meaningful activities.",
    business: "This is a professional business event. Focus on networking opportunities, keynote logistics, and corporate branding.",
    party: "This is a fun party! Focus on entertainment, music, food, drinks, and creating an exciting atmosphere.",
    wedding: "This is a wedding celebration. Focus on ceremony details, reception flow, decorations, photography, and romantic touches.",
    conference: "This is a professional conference. Focus on speaker schedules, breakout sessions, AV setup, and attendee engagement.",
    birthday: "This is a birthday celebration. Focus on theme, cake, decorations, games/activities, and making the birthday person feel special.",
    corporate: "This is a corporate event. Focus on team building, catering, presentations, and professional atmosphere.",
    fundraiser: "This is a fundraiser event. Focus on auction items, donation processing, cause awareness, and donor engagement.",
};

export const generatePlan = action({
    args: { eventType: v.string(), title: v.string(), guestCount: v.number(), budget: v.optional(v.string()), date: v.optional(v.string()), location: v.optional(v.string()), description: v.optional(v.string()) },
    handler: async (_ctx, args) => {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) throw new Error("OPENAI_API_KEY not configured");
        const typePrompt = EVENT_PROMPTS[args.eventType] || EVENT_PROMPTS.party;
        const r = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: "gpt-4o", messages: [
                    {
                        role: "system", content: `You are EventPlanner, an expert event coordinator. ${typePrompt}
Generate a comprehensive event plan. Output JSON:
{"plan":{"timeline":[{"time":"HH:MM","activity":"","notes":""}],"checklist":[{"task":"","category":"Venue|Catering|Decor|Entertainment|Logistics|Communication","priority":"high|medium|low"}],"venueIdeas":[""],"cateringIdeas":[""],"entertainmentIdeas":[""],"budgetBreakdown":[{"item":"","estimate":"$X"}],"tips":[""]}}` },
                    { role: "user", content: `Event: ${args.title}\nType: ${args.eventType}\nGuests: ${args.guestCount}${args.budget ? `\nBudget: ${args.budget}` : ''}${args.date ? `\nDate: ${args.date}` : ''}${args.location ? `\nLocation: ${args.location}` : ''}${args.description ? `\nDetails: ${args.description}` : ''}` },
                ], temperature: 0.6, max_tokens: 4000, response_format: { type: "json_object" }
            }),
        });
        if (!r.ok) throw new Error(`API error: ${await r.text()}`);
        const parsed = JSON.parse((await r.json() as any).choices?.[0]?.message?.content ?? "{}");
        return parsed.plan || parsed;
    },
});
