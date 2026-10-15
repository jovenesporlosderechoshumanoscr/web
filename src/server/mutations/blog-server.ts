import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { eq, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/server/db";
import { post } from "@/server/db/schema";
import {
  createPostSchema,
  deletePostSchema,
  updatePostSchema,
} from "@/server/validation/blog";

async function ensureEditor() {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });
  if (
    !session ||
    (session.user.role !== "admin" && session.user.role !== "editor")
  ) {
    throw new Error("Unauthorized");
  }
  return session;
}

const createPost = createServerFn({ method: "POST" })
  .validator(createPostSchema)
  .handler(async ({ data }) => {
    const session = await ensureEditor();

    const [item] = await db
      .insert(post)
      .values({
        id: crypto.randomUUID(),
        title: data.title,
        slug: data.slug,
        status: data.status,
        blocks: data.blocks,
        excerpt: data.excerpt,
        coverImage: data.coverImage,
        authorId: session.user.id,
        publishedAt: data.status === "published" ? new Date() : null,
      })
      .returning();

    return item;
  });

const updatePost = createServerFn({ method: "POST" })
  .validator(updatePostSchema)
  .handler(async ({ data }) => {
    await ensureEditor();

    const { id, ...fields } = data;
    const updateData: Record<string, unknown> = {};
    if (fields.title !== undefined) updateData.title = fields.title;
    if (fields.slug !== undefined) updateData.slug = fields.slug;
    if (fields.blocks !== undefined) updateData.blocks = fields.blocks;
    if (fields.excerpt !== undefined) updateData.excerpt = fields.excerpt;
    if (fields.coverImage !== undefined) updateData.coverImage = fields.coverImage;
    if (fields.status !== undefined) {
      updateData.status = fields.status;
      updateData.publishedAt =
        fields.status === "published"
          ? sql`COALESCE((SELECT published_at FROM post WHERE id = ${id}), unixepoch('subsecond') * 1000)`
          : null;
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error("Sin cambios para guardar");
    }

    const [item] = await db
      .update(post)
      .set(updateData)
      .where(eq(post.id, id))
      .returning();

    return item;
  });

const deletePost = createServerFn({ method: "POST" })
  .validator(deletePostSchema)
  .handler(async ({ data }) => {
    await ensureEditor();

    await db.delete(post).where(eq(post.id, data.id));
    return { id: data.id };
  });

export const blogMutations = {
  createPost,
  updatePost,
  deletePost,
};
