import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { UserForm } from "@/components/users/UserForm";
import { useCreateUser } from "@/functions/user-client";

export const Route = createFileRoute("/admin/panel/_protected/users/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const createUser = useCreateUser();

  return (
    <div className="p-4">
      <UserForm
        mode="create"
        isSubmitting={createUser.isPending}
        serverError={
          createUser.isError ? createUser.error.message : null
        }
        onSubmit={(values) => {
          if (!values.password) return;
          createUser.mutate(
            { ...values, password: values.password },
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
