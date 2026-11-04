import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { USER_ROLES, USER_ROLE_LABELS  } from "@/lib/roles";
import type {UserRole} from "@/lib/roles";

export type UserFormValues = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

type UserFormProps = {
  mode: "create" | "edit";
  initialValues?: Partial<{
    name: string | null;
    email: string;
    role: string | null;
  }>;
  isSubmitting?: boolean;
  serverError?: string | null;
  onSubmit: (values: {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
  }) => void;
  onCancel?: () => void;
};

export function UserForm({
  mode,
  initialValues,
  isSubmitting,
  serverError,
  onSubmit,
  onCancel,
}: UserFormProps) {
  const [values, setValues] = useState<UserFormValues>({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialValues) {
      setValues({
        name: initialValues.name ?? "",
        email: initialValues.email ?? "",
        password: "",
        role: (initialValues.role ?? "student") as UserRole,
      });
    }
  }, [initialValues?.name, initialValues?.email, initialValues?.role]);

  function set<TKey extends keyof UserFormValues>(
    key: TKey,
    value: UserFormValues[TKey],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!values.name.trim()) {
      setError("El nombre es requerido");
      return;
    }
    if (!values.email.trim()) {
      setError("El email es requerido");
      return;
    }
    if (mode === "create" && values.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    onSubmit({
      name: values.name.trim(),
      email: values.email.trim(),
      ...(mode === "create" ? { password: values.password } : {}),
      role: values.role,
    });
  }

  return (
    <Card className="mx-auto max-w-xl w-full">
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Crear usuario" : "Editar usuario"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Nombre del usuario"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="usuario@ejemplo.com"
            />
          </div>

          {mode === "create" && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={values.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="role">Rol</Label>
            <select
              id="role"
              value={values.role}
              onChange={(e) => set("role", e.target.value as UserRole)}
              className="h-8 rounded-2xl border border-transparent bg-input/50 px-2.5 text-sm outline-none focus-visible:border-ring"
            >
              {USER_ROLES.map((role) => (
                <option key={role} value={role}>
                  {USER_ROLE_LABELS[role]}
                </option>
              ))}
            </select>
          </div>

          {(error || serverError) && (
            <p className="text-sm text-destructive">{error ?? serverError}</p>
          )}

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Guardando…"
                : mode === "create"
                  ? "Crear"
                  : "Guardar cambios"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
