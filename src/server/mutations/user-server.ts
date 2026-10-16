import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth";
import {
  changeEmailSchema,
  changePasswordSchema,
  createUserSchema,
  deleteUserSchema,
  updateProfileSchema,
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

/** Roles que pueden editar su propio perfil (nombre, correo, contraseña). */
const PROFILE_ALLOWED_ROLES = ["admin", "editor", "student"];

/**
 * Verifica sesión para operaciones sobre la PROPIA cuenta (perfil). No exige
 * rol admin: cualquier usuario autenticado con rol (admin, editor o student)
 * edita sus datos.
 */
async function ensureProfileSession() {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });
  if (
    !session ||
    !session.user.role ||
    !PROFILE_ALLOWED_ROLES.includes(session.user.role)
  ) {
    throw new Error("Unauthorized");
  }
  return headers;
}

type AuthApiError = {
  status?: number;
  statusCode?: number;
  body?: { code?: string; message?: string };
};

/**
 * better-auth lanza APIError con mensajes en inglés. Traducimos los casos
 * relevantes del perfil y dejamos el mensaje original como respaldo.
 */
function toProfileError(error: unknown, fallback: string): Error {
  const { status, statusCode, body } = (error ?? {}) as AuthApiError;
  const code = body?.code;
  const message =
    body?.message ?? (error instanceof Error ? error.message : "");

  if (code === "INVALID_PASSWORD") {
    return new Error("La contraseña actual es incorrecta");
  }
  if (code === "CREDENTIAL_ACCOUNT_NOT_FOUND") {
    return new Error("Tu cuenta no tiene una contraseña configurada");
  }
  if (code === "CHANGE_EMAIL_DISABLED") {
    return new Error("El cambio de correo no está habilitado");
  }
  if (code === "UNAUTHORIZED" || status === 401 || statusCode === 401) {
    return new Error("Tu sesión ha expirado. Vuelve a iniciar sesión");
  }
  if (message.includes("Email is the same")) {
    return new Error("El nuevo correo debe ser distinto al actual");
  }
  if (status === 429 || statusCode === 429) {
    return new Error("Demasiados intentos. Vuelve a intentarlo más tarde");
  }
  return new Error(message || fallback);
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
          banned: data.banned,
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

/** Actualiza el nombre del usuario autenticado (refresca la cookie de sesión). */
const updateProfile = createServerFn({ method: "POST" })
  .validator(updateProfileSchema)
  .handler(async ({ data }) => {
    const headers = await ensureProfileSession();

    try {
      return await auth.api.updateUser({
        headers,
        body: { name: data.name },
      });
    } catch (error) {
      throw toProfileError(error, "No se pudo actualizar el perfil");
    }
  });

/**
 * Inicia el cambio de correo del usuario autenticado. better-auth envía un
 * enlace de verificación al NUEVO correo; el cambio se aplica al hacer clic.
 * El enlace vuelve a la página de perfil indicada (`callbackPath`, validada
 * contra una lista cerrada). Por anti-enumeración responde igual aunque el
 * correo ya esté en uso.
 */
const changeEmail = createServerFn({ method: "POST" })
  .validator(changeEmailSchema)
  .handler(async ({ data }) => {
    const headers = await ensureProfileSession();

    try {
      return await auth.api.changeEmail({
        headers,
        body: {
          newEmail: data.newEmail,
          callbackURL: `${data.callbackPath}?emailChanged=1`,
        },
      });
    } catch (error) {
      throw toProfileError(error, "No se pudo iniciar el cambio de correo");
    }
  });

/** Cambia la contraseña del usuario autenticado (better-auth exige la actual). */
const changePassword = createServerFn({ method: "POST" })
  .validator(changePasswordSchema)
  .handler(async ({ data }) => {
    const headers = await ensureProfileSession();

    try {
      return await auth.api.changePassword({
        headers,
        body: {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
      });
    } catch (error) {
      throw toProfileError(error, "No se pudo cambiar la contraseña");
    }
  });

export const userMutations = {
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
  changeEmail,
  changePassword,
};
