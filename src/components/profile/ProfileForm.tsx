import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
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
import { Separator } from "@/components/ui/separator";
import { useChangeEmail, useUpdateProfile } from "@/functions/user-client";

type ProfileFormProps = {
  name: string;
  email: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Datos personales del usuario autenticado. El nombre se guarda al instante;
 * el correo se cambia con un enlace de verificación enviado al nuevo correo
 * (el cambio se aplica al hacer clic, no antes).
 */
export function ProfileForm({ name, email }: ProfileFormProps) {
  const router = useRouter();
  const updateProfile = useUpdateProfile();
  const changeEmail = useChangeEmail();

  const [nameValue, setNameValue] = useState(name);
  const [nameError, setNameError] = useState<string | null>(null);

  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    setNameValue(name);
  }, [name]);

  function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNameError(null);

    const trimmed = nameValue.trim();
    if (!trimmed) {
      setNameError("El nombre es requerido");
      return;
    }
    if (trimmed === name) {
      setNameError("El nombre es el mismo");
      return;
    }

    updateProfile.mutate(
      { name: trimmed },
      {
        onSuccess: () => {
          toast.success("Nombre actualizado");
          // Re-ejecuta el beforeLoad de _protected para refrescar el sidebar.
          void router.invalidate();
        },
        onError: (error) => setNameError(error.message),
      },
    );
  }

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailError(null);

    const trimmed = newEmail.trim();
    if (!trimmed) {
      setEmailError("El nuevo correo es requerido");
      return;
    }
    if (!EMAIL_PATTERN.test(trimmed)) {
      setEmailError("Email inválido");
      return;
    }
    if (trimmed.toLowerCase() === email.toLowerCase()) {
      setEmailError("El nuevo correo debe ser distinto al actual");
      return;
    }

    changeEmail.mutate(
      { newEmail: trimmed },
      {
        onSuccess: () => {
          toast.success(
            `Si la dirección es válida, recibirás un enlace de confirmación en ${trimmed}. El cambio se aplica al hacer clic en el enlace.`,
          );
          setNewEmail("");
        },
        onError: (error) => setEmailError(error.message),
      },
    );
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Datos personales</CardTitle>
        <CardDescription>
          Actualiza tu nombre y la dirección de correo de tu cuenta.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <form onSubmit={handleNameSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-name">Nombre</Label>
            <Input
              id="profile-name"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              placeholder="Tu nombre"
            />
          </div>

          {nameError && (
            <p className="text-sm text-destructive">{nameError}</p>
          )}

          <div>
            <Button type="submit" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? "Guardando…" : "Guardar cambios"}
            </Button>
          </div>
        </form>

        <Separator />

        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-current-email">Correo actual</Label>
            <Input
              id="profile-current-email"
              value={email}
              readOnly
              disabled
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-new-email">Nuevo correo</Label>
            <Input
              id="profile-new-email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="nuevo@ejemplo.com"
              autoComplete="email"
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Enviaremos un enlace de confirmación al nuevo correo. El cambio se
            aplica cuando confirmes desde esa dirección.
          </p>

          {emailError && (
            <p className="text-sm text-destructive">{emailError}</p>
          )}

          <div>
            <Button
              type="submit"
              variant="outline"
              disabled={changeEmail.isPending}
            >
              {changeEmail.isPending
                ? "Enviando…"
                : "Enviar enlace de verificación"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
