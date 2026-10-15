import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userQueries } from "@/server/queries/user-server";
import { userMutations } from "@/server/mutations/user-server";
import type {
  ChangeEmailInput,
  ChangePasswordInput,
  CreateUserInput,
  DeleteUserInput,
  GetUsersInput,
  UpdateProfileInput,
  UpdateUserInput,
} from "@/server/validation/user";

export const USERS_QUERY_KEY = "users";
export const USER_QUERY_KEY = "user";

export function useUsers(filters: GetUsersInput) {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, filters],
    queryFn: () => userQueries.getUsers({ data: filters }),
  });
}

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: [USER_QUERY_KEY, id],
    queryFn: () => userQueries.getUserById({ data: { id: id! } }),
    enabled: Boolean(id),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateUserInput) =>
      userMutations.createUser({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateUserInput) =>
      userMutations.updateUser({ data: input }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY, data.id] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: DeleteUserInput) =>
      userMutations.deleteUser({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
  });
}

/** Actualiza el nombre del usuario autenticado. */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProfileInput) =>
      userMutations.updateProfile({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
    },
  });
}

/** Solicita el cambio de correo: se verifica desde el nuevo email. */
export function useChangeEmail() {
  return useMutation({
    mutationFn: (input: ChangeEmailInput) =>
      userMutations.changeEmail({ data: input }),
  });
}

/** Cambia la contraseña del usuario autenticado. */
export function useChangePassword() {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) =>
      userMutations.changePassword({ data: input }),
  });
}
