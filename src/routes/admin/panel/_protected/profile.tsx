import { useEffect, useRef } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as z from "zod";
import { toast } from "sonner";
import { PasswordForm } from "@/components/profile/PasswordForm";
import { ProfileForm } from "@/components/profile/ProfileForm";

const profileSearchSchema = z.object({
  /** Código de error devuelto por better-auth al fallar la verificación. */
  error: z.string().optional(),
  /** Marca que el correo se confirmó y el callback volvió al perfil. */
  emailChanged: z.string().optional(),
})

export const Route = createFileRoute("/admin/panel/_protected/profile")({
  validateSearch: profileSearchSchema,
  component: RouteComponent,
});

const EMAIL_ERROR_MESSAGES: Record<string, string> = {
  INVALID_TOKEN: "El enlace de confirmación no es válido o ha caducado.",
  TOKEN_EXPIRED: "El enlace de confirmación ha caducado. Solicita uno nuevo.",
  USER_NOT_FOUND: "No se encontró el usuario asociado al enlace.",
  INVALID_USER: "El enlace no corresponde a tu sesión actual.",
};

function RouteComponent() {
  const { user } = Route.useRouteContext();
  const { error, emailChanged } = Route.useSearch();
  const navigate = useNavigate();
  const notified = useRef(false);

  // El flujo de verificación de correo vuelve aquí con parámetros en la URL.
  // Los mostramos una sola vez y limpiamos la query.
  useEffect(() => {
    if (notified.current) return;
    if (error) {
      notified.current = true;
      toast.error(
        EMAIL_ERROR_MESSAGES[error] ?? "No se pudo confirmar el nuevo correo.",
      );
      void navigate({ to: "/admin/panel/profile", search: {}, replace: true });
    } else if (emailChanged) {
      notified.current = true;
      toast.success("Correo actualizado correctamente");
      void navigate({ to: "/admin/panel/profile", search: {}, replace: true });
    }
  }, [error, emailChanged, navigate]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <h1 className="text-xl font-semibold">Mi perfil</h1>
        <p className="text-sm text-muted-foreground">
          Gestiona tus datos personales y tu contraseña.
        </p>
      </div>

      <ProfileForm name={user.name} email={user.email} />
      <PasswordForm />
    </div>
  );
}
