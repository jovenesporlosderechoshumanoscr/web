import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth";
import {
  createUserSchema,
  deleteUserSchema,
  updateUserSchema,
} from "@/server/validation/user";

async function ensureAdmin() {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return headers;
}

const createUser = createServerFn({ method: "POST" })
  .validator(createUserSchema)
  .handler(async ({ data }) => {
    const headers = await ensureAdmin();

    const result = await auth.api.createUser({
      headers,
      body: {
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
        data: {
          emailVerified: true,
          banned: data.banned ?? false,
          banReason: data.banReason ?? null,
          banExpires: data.banExpires,
        },
      },
    });

    return result;
  });

const updateUser = createServerFn({ method: "POST" })
  .validator(updateUserSchema)
  .handler(async ({ data }) => {
    const headers = await ensureAdmin();

    const { id, ...fields } = data;
    const updateData: Record<string, unknown> = {};
    if (fields.name !== undefined) updateData.name = fields.name;
    if (fields.email !== undefined) updateData.email = fields.email;
    if (fields.role !== undefined) updateData.role = fields.role;
    if (fields.banned !== undefined) updateData.banned = fields.banned;
    if (fields.banReason !== undefined) updateData.banReason = fields.banReason;
    if (fields.banExpires !== undefined) updateData.banExpires = fields.banExpires;

    if (Object.keys(updateData).length === 0) {
      throw new Error("Sin cambios para guardar");
    }

    const result = await auth.api.adminUpdateUser({
      headers,
      body: { userId: id, data: updateData },
    });

    return result;
  });

const deleteUser = createServerFn({ method: "POST" })
  .validator(deleteUserSchema)
  .handler(async ({ data }) => {
    const headers = await ensureAdmin();

    await auth.api.removeUser({
      headers,
      body: { userId: data.id },
    });

    return { id: data.id };
  });

export const userMutations = {
  createUser,
  updateUser,
  deleteUser,
};
