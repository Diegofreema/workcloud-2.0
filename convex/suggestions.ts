import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const getSuggestions = query({
  args: {
    query: v.optional(v.string()),
  },
  handler: async (ctx, { query }) => {
    if (!query) return [];
    return await ctx.db
      .query("suggestions")
      .withSearchIndex("text", (q) => q.search("text", query))
      .collect();
  },
});

export const addToSuggestions = mutation({
  args: {
    suggestion: v.string(),
  },
  handler: async (ctx, { suggestion }) => {
    const suggestionIsInDb = await ctx.db
      .query("suggestions")
      .filter((q) => q.eq(q.field("text"), suggestion))
      .first();
    if (suggestionIsInDb) return;
    await ctx.db.insert("suggestions", {
      text: suggestion,
    });
  },
});
