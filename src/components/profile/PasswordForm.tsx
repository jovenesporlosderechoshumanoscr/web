import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChangePassword } from "@/functions/user-client";

const EMPTY_VALUES = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

/**
 * Formulario de contraseña, separado del resto del perfil. better-auth exige
 * la contraseña actual para poder cambiarla.
 */
export function PasswordForm() {
  const changePassword = useChangePassword();
  const [values, setValues] = useState(EMPTY_VALUES);
  const [error, setError] = useState<string | null>(null);

  function set<TKey extends keyof typeof EMPTY_VALUES>(
    key: TKey,
    value: string,
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!values.currentPassword) {
      setError("La contraseña actual es requerida");
      return;
    }
    if (values.newPassword.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (values.newPassword !== values.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    changePassword.mutate(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      },
      {
        onSuccess: () => {
          toast.success("Contraseña actualizada");
          setValues(EMPTY_VALUES);
        },
        onError: (mutationError) => setError(mutationError.message),
      },
    );
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Contraseña</CardTitle>
        <CardDescription>
          Necesitas tu contraseña actual para establecer una nueva.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="current-password">Contraseña actual</Label>
            <Input
              id="current-password"
              type="password"
              value={values.currentPassword}
              onChange={(e) => set("currentPassword", e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="new-password">Nueva contraseña</Label>
            <Input
              id="new-password"
              type="password"
              value={values.newPassword}
              onChange={(e) => set("newPassword", e.target.value)}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
            <Input
              id="confirm-password"
              type="password"
              value={values.confirmPassword}
              onChange={(e) => set("confirmPassword", e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div>
            <Button type="submit" disabled={changePassword.isPending}>
              {changePassword.isPending ? "Cambiando…" : "Cambiar contraseña"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
