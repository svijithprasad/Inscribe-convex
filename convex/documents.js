import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const documents = await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .collect();

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
    title: v.optional(v.string()),
    userId: v.string(),
    isArchived: v.boolean(),
    isPublished: v.boolean(),
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    // Check if args.title is unset or falsy, and assign "Untitled" if so
    const title = args.title || "Untitled";

    const document = await ctx.db.insert("documents", {
      title: title,
      userId: args.userId,
      isArchived: args.isArchived,
      isPublished: args.isPublished,
      isCompleted: args.isCompleted,
      parentDocument: args.parentDocument,
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
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.patch(args.id, { isArchived: true });
    return document;
  },
});

export const getArchived = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const documents = await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .collect();

    return documents;
  },
});

export const saveEditor = mutation({
  args: {
    id: v.id("documents"),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.patch(args.id, {
      content: args.content,
    });
    return document;
  },
});

export const getEditor = query({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .collect();
    return document;
  },
});

export const renameTitle = mutation({
  args: {
    id: v.id("documents"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const title = args.title || "Untitled";
    const document = await ctx.db.patch(args.id, {
      title: title,
    });
    return document;
  },
});

export const restore = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.patch(args.id, { isArchived: false });
    return document;
  },
});

export const setCover = mutation({
  args: {
    id: v.id("documents"),
    coverImage: v.string(),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.patch(args.id, {
      coverImage: args.coverImage,
    });
    return document;
  },
});


export const searchDocs = query({
  args:{
    userId: v.string(),
    searchValue: v.string(),
  },
  handler: async (ctx, args) => {
    const documents = await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.eq(q.field("title"), args.searchValue))
      .collect();
    return documents;
  }
})


export const getChildrens = query({
  args: {
    parentDocument: v.id("documents"),
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
})