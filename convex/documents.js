import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const documents = await ctx.db.query("documents").collect();

    return documents;
  },
});

export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const documents = await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.eq(q.field("parentDocument"), args.parentDocument))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .collect();

    return documents;
  },
});
// Create a new task with the given text
export const create = mutation({
  args: {
    title: v.optional(v.string() || "Untitled"),
    userId: v.string(),
    isArchived: v.boolean(),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.insert("documents", {
      title: args.title,
      userId: args.userId,
      isArchived: args.isArchived,
      isPublished: args.isPublished,
      isCompleted: args.isCompleted,
    });
    return document;
  },
});

export const remove = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.delete(args.id);
    return document;
  },
});


export const archive = mutation({
  args:{
    id: v.id("documents"),
  }
  ,handler: async (ctx, args) => {
    const document = await ctx.db.patch(args.id, {isArchived: true});
    return document;
  }
})

export const getArchived = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const documents = await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.eq(q.field("parentDocument"), args.parentDocument))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .collect();

    return documents;
  },
});