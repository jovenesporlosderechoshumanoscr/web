import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { and, count, desc, eq, sql } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/server/db";
import { post } from "@/server/db/schema";
import {
  getPostByIdSchema,
  getPostBySlugSchema,
  getPostsSchema,
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

const getPosts = createServerFn({ method: "GET" })
  .validator(getPostsSchema)
  .handler(async ({ data }) => {
    await ensureEditor();

    const { title, status, page, limit } = data;
    const offset = (page - 1) * limit;

    const filters: SQL[] = [];
    if (title) {
      filters.push(sql`lower(${post.title}) like lower(${"%" + title + "%"})`);
    }
    if (status) {
      filters.push(eq(post.status, status));
    }
    const where = filters.length > 0 ? and(...filters) : undefined;

    const [{ value: total }] = await db
      .select({ value: count() })
      .from(post)
      .where(where);

    const items = await db
      .select()
      .from(post)
      .where(where)
      .orderBy(desc(post.updatedAt))
      .limit(limit)
      .offset(offset);


    const totalPages = total === 0 ? 1 : Math.ceil(total / limit);

    return { items, total, page, limit, totalPages };
  });

const getPostById = createServerFn({ method: "GET" })
  .validator(getPostByIdSchema)
  .handler(async ({ data }) => {
    await ensureEditor();

    const rows = await db.select().from(post).where(eq(post.id, data.id));
    return rows.at(0) ?? null;
  });

export const blogQueries = {
  getPosts,
  getPostById,
};

/** Queries públicas (sin sesión): leen solo posts publicados. */
const getPublicPosts = createServerFn({ method: "GET" })
  .validator(getPostsSchema)
  .handler(async ({ data }) => {
    const { title, page, limit } = data;
    const offset = (page - 1) * limit;

    const filters: SQL[] = [eq(post.status, "published")];
    if (title) {
      filters.push(sql`lower(${post.title}) like lower(${"%" + title + "%"})`);
    }
    const where = and(...filters);

    const [{ value: total }] = await db
      .select({ value: count() })
      .from(post)
      .where(where);

    const items = await db
      .select()
      .from(post)
      .where(where)
      .orderBy(desc(post.publishedAt))
      .limit(limit)
      .offset(offset);

    const totalPages = total === 0 ? 1 : Math.ceil(total / limit);

    return { items, total, page, limit, totalPages };
  });

const getPublicPostBySlug = createServerFn({ method: "GET" })
  .validator(getPostBySlugSchema)
  .handler(async ({ data }) => {
    const rows = await db
      .select()
      .from(post)
      .where(and(eq(post.slug, data.slug), eq(post.status, "published")));
    return rows.at(0) ?? null;
  });

export const blogPublicQueries = {
  getPublicPosts,
  getPublicPostBySlug,
};
