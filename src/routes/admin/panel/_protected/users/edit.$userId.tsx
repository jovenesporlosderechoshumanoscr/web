import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { UserForm } from "@/components/users/UserForm";
import { useUpdateUser, useUser } from "@/functions/user-client";

export const Route = createFileRoute(
  "/admin/panel/_protected/users/edit/$userId",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { userId } = Route.useParams();
  const navigate = useNavigate();
  const userQuery = useUser(userId);
  const updateUser = useUpdateUser();

  if (userQuery.isPending) {
    return <p className="p-4 text-sm">Cargando usuario…</p>;
  }

  if (userQuery.isError) {
    return <p className="p-4 text-sm text-destructive">Usuario no encontrado.</p>;
  }

  const user = userQuery.data;

  return (
    <div className="p-4">
      <UserForm
        mode="edit"
        initialValues={{
          name: user.name,
          email: user.email,
          role: user.role,
          banned: user.banned,
          banReason: user.banReason,
          banExpires: user.banExpires,
        }}
        isSubmitting={updateUser.isPending}
        serverError={
          updateUser.isError ? updateUser.error.message : null
        }
        onSubmit={(values) => {
          updateUser.mutate(
            { id: userId, ...values },
            {
              onSuccess: () => {
                navigate({ to: "/admin/panel/users" });
              },
            },
          );
        }}
        onCancel={() => navigate({ to: "/admin/panel/users" })}
      />
    </div>
  );
}
