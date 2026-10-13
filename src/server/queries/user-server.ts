import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { and, count, desc, eq, sql } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/server/db";
import { user } from "@/server/db/schema";
import { getUserByIdSchema, getUsersSchema } from "@/server/validation/user";

async function ensureAdmin() {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}

const getUsers = createServerFn({ method: "GET" })
  .validator(getUsersSchema)
  .handler(async ({ data }) => {
    await ensureAdmin();

    const { name, role, banned, page, limit } = data;
    const offset = (page - 1) * limit;

    const filters: SQL[] = [];
    if (name) {
      filters.push(sql`lower(${user.name}) like lower(${"%" + name + "%"})`);
    }
    if (role) {
      filters.push(eq(user.role, role));
    }
    if (typeof banned === "boolean") {
      filters.push(eq(user.banned, banned));
    }
    const where = filters.length > 0 ? and(...filters) : undefined;

    const [totalRow] = await db
      .select({ value: count() })
      .from(user)
      .where(where);
    const total = totalRow?.value ?? 0;

    const items = await db
      .select()
      .from(user)
      .where(where)
      .orderBy(desc(user.createdAt))
      .limit(limit)
      .offset(offset);

    const totalPages = total === 0 ? 1 : Math.ceil(total / limit);

    return { items, total, page, limit, totalPages };
  });

const getUserById = createServerFn({ method: "GET" })
  .validator(getUserByIdSchema)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });
    if (!session || session.user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const result = await auth.api.getUser({
      headers,
      query: { id: data.id },
    });

    return result ?? null;
  });

export const userQueries = {
  getUsers,
  getUserById,
};
