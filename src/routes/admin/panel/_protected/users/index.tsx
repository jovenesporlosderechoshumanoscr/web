import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDeleteUser, useUsers } from "@/functions/user-client";
import { getRoleLabel } from "@/lib/roles";
import type { UserRole } from "@/lib/roles";

export const Route = createFileRoute("/admin/panel/_protected/users/")({
  component: RouteComponent,
});

type BannedFilter = "all" | "true" | "false";

function RouteComponent() {
  const [nameInput, setNameInput] = useState("");
  const [roleInput, setRoleInput] = useState<"" | UserRole>("");
  const [bannedInput, setBannedInput] = useState<BannedFilter>("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [applied, setApplied] = useState<{
    name?: string;
    role?: UserRole;
    banned?: boolean;
  }>({});

  const query = useUsers({
    name: applied.name,
    role: applied.role,
    banned: applied.banned,
    page,
    limit,
  });
  const deleteUser = useDeleteUser();

  function handleSearch() {
    setPage(1);
    setApplied({
      name: nameInput.trim() ? nameInput.trim() : undefined,
      role: roleInput ? roleInput : undefined,
      banned:
        bannedInput === "all" ? undefined : bannedInput === "true" ? true : false,
    });
  }

  function handleClear() {
    setNameInput("");
    setRoleInput("");
    setBannedInput("all");
    setPage(1);
    setApplied({});
  }

  function handleDelete(id: string, name: string) {
    if (!window.confirm(`¿Eliminar al usuario "${name}"?`)) return;
    deleteUser.mutate({ id });
  }

  const items = query.data?.items ?? [];
  const total = query.data?.total ?? 0;
  const totalPages = query.data?.totalPages ?? 1;

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Usuarios</h1>
        <Link to="/admin/panel/users/create" className={buttonVariants()}>
          Crear usuario
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4 md:items-end">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="search-name">Nombre</Label>
              <Input
                id="search-name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Buscar por nombre"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="search-role">Rol</Label>
              <select
                id="search-role"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value as "" | UserRole)}
                className="h-8 rounded-2xl border border-transparent bg-input/50 px-2.5 text-sm outline-none focus-visible:border-ring"
              >
                <option value="">Todos</option>
                <option value="admin">Administrador</option>
                <option value="editor">Editor</option>
                <option value="student">Estudiante</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="search-banned">Estado baneado</Label>
              <select
                id="search-banned"
                value={bannedInput}
                onChange={(e) => setBannedInput(e.target.value as BannedFilter)}
                className="h-8 rounded-2xl border border-transparent bg-input/50 px-2.5 text-sm outline-none focus-visible:border-ring"
              >
                <option value="all">Todos</option>
                <option value="true">Baneado</option>
                <option value="false">No baneado</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button type="button" onClick={handleSearch}>
                Buscar
              </Button>
              <Button type="button" variant="outline" onClick={handleClear}>
                Limpiar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {query.isPending && <p className="py-6 text-sm">Cargando…</p>}
          {query.isError && (
            <p className="py-6 text-sm text-destructive">
              Error al cargar usuarios.
            </p>
          )}
          {query.isSuccess && items.length === 0 && (
            <p className="py-6 text-sm text-muted-foreground">
              Sin resultados.
            </p>
          )}
          {deleteUser.isError && (
            <p className="py-2 text-sm text-destructive">
              {deleteUser.error.message}
            </p>
          )}
          {query.isSuccess && items.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="py-2 pr-4 font-medium">Nombre</th>
                    <th className="py-2 pr-4 font-medium">Email</th>
                    <th className="py-2 pr-4 font-medium">Rol</th>
                    <th className="py-2 pr-4 font-medium">Baneado</th>
                    <th className="py-2 pr-4 font-medium">Creado</th>
                    <th className="py-2 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((u) => (
                    <tr key={u.id} className="border-b last:border-0">
                      <td className="py-2 pr-4">{u.name}</td>
                      <td className="py-2 pr-4">{u.email}</td>
                      <td className="py-2 pr-4">{getRoleLabel(u.role)}</td>
                      <td className="py-2 pr-4">{u.banned ? "Sí" : "No"}</td>
                      <td className="py-2 pr-4">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="flex gap-2 py-2">
                        <Link
                          to="/admin/panel/users/edit/$userId"
                          params={{ userId: u.id }}
                          className={buttonVariants({
                            size: "sm",
                            variant: "outline",
                          })}
                        >
                          Editar
                        </Link>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={deleteUser.isPending}
                          onClick={() => handleDelete(u.id, u.name)}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-muted-foreground">
              Página {page} de {totalPages} · {total} usuarios
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1 || query.isPending}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Anterior
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= totalPages || query.isPending}
                onClick={() => setPage((p) => p + 1)}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
