import { z } from "zod";
import { USER_ROLES } from "@/lib/roles";

export const userRoleSchema = z.enum(USER_ROLES);

export type UserRoleInput = z.infer<typeof userRoleSchema>;

/** Filtros de búsqueda + paginación para el listado. Ausente = sin filtro. */
export const getUsersSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  role: userRoleSchema.optional(),
  banned: z.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type GetUsersInput = z.infer<typeof getUsersSchema>;

export const getUserByIdSchema = z.object({
  id: z.string().min(1),
});

export type GetUserByIdInput = z.infer<typeof getUserByIdSchema>;

/**
 * Acepta lo que puede llegar por el cable (Date o string ISO) y produce
 * siempre `Date | null`, el tipo que esperan better-auth y Drizzle
 * (`timestamp_ms`). Si la fecha es inválida, solo falla la validación y el
 * error se muestra al usuario, sin fallbacks.
 */
export const banExpiresSchema = z
  .union([z.date(), z.iso.date().transform((s) => new Date(s))])
  .nullish()
  .transform((v) => v ?? null);

export const createUserSchema = z.object({
  name: z.string().trim().min(1, "El nombre es requerido").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(128),
  role: userRoleSchema.default("student"),
  banned: z.boolean().default(false),
  banReason: z.string().trim().max(500).nullish(),
  banExpires: banExpiresSchema,
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema
  .omit({ password: true })
  .partial()
  .extend({
    id: z.string().min(1),
  });

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const deleteUserSchema = z.object({
  id: z.string().min(1),
});

export type DeleteUserInput = z.infer<typeof deleteUserSchema>;

/**
 * Actualización del perfil propio: solo nombre. El correo NO se actualiza
 * aquí (better-auth rechaza `email` en /update-user); usar changeEmailSchema.
 */
export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "El nombre es requerido").max(100),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

/**
 * Rutas de perfil a las que puede volver el enlace de verificación de
 * cambio de correo. Lista cerrada para que el cliente no pueda redirigir
 * a destinos arbitrarios.
 */
export const profileCallbackPaths = [
  "/admin/panel/profile",
  "/student/profile",
] as const;

export type ProfileCallbackPath = (typeof profileCallbackPaths)[number];

/**
 * Solicitud de cambio de correo propio: better-auth envía un enlace de
 * verificación al nuevo correo y el cambio se aplica al hacer clic.
 */
export const changeEmailSchema = z.object({
  newEmail: z.string().trim().email("Email inválido").max(255),
  callbackPath: z.enum(profileCallbackPaths).default("/admin/panel/profile"),
});

export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;

/**
 * Cambio de contraseña del usuario actual. better-auth exige la contraseña
 * actual; `confirmPassword` solo se valida (igualdad) y no viaja al server.
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "La contraseña actual es requerida"),
    newPassword: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(128),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
