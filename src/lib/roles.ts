/** Roles de usuario definidos en `src/lib/permission.ts` (better-auth admin plugin). */
export const USER_ROLES = ["admin", "editor", "student"] as const;

export type UserRole = (typeof USER_ROLES)[number];

/** Etiquetas en español para mostrar en la UI. El valor guardado sigue siendo en inglés. */
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrador",
  editor: "Editor",
  student: "Estudiante",
};

export function getRoleLabel(role: string | null | undefined): string {
  if (!role) return "Sin rol";
  const label = (USER_ROLE_LABELS as Record<string, string>)[role];
  return label ?? role;
}
