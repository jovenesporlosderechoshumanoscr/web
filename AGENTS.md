<!-- intent-skills:start -->
## Skill Loading

Use the repository’s installed Intent. If it is unavailable, report the missing dependency instead of downloading a replacement.
Before editing files for a substantial task:
- Run `pnpm exec intent list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `pnpm exec intent load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

## CRUD de usuarios

- Servidor: lecturas en `src/server/queries/`, escrituras en `src/server/mutations/`.
- Todas las funciones server de usuarios deben exponerse siempre desde `userQueries` (`src/server/queries/user-server.ts`) y `userMutations` (`src/server/mutations/user-server.ts`). No crear exports paralelos; los barrels solo re-exportan desde esos objetos.
- Usar `createServerFn` con validador Zod (`src/server/validation/user.ts`). Queries con `method: "GET"`, mutations con `method: "POST"`.
- Verificar sesión admin dentro de cada server function (`auth.api.getSession`), no solo en `beforeLoad` de la ruta.
- Mutations y `getUserById` delegan en la API admin de better-auth (`auth.api.createUser`, `auth.api.adminUpdateUser`, `auth.api.removeUser`, `auth.api.getUser`) pasando los headers de la sesión admin. No usar `db.insert/update/delete` directo en usuarios (la contraseña vive en `account`, solo better-auth la gestiona).
- Crear marca `emailVerified: true` en `data` y exige `password` (min 8). No hay edición de contraseña en el CRUD.
- `banExpires` tipado `Date | null` (acepta ISO string por el transporte JSON y transforma a `Date`). Si falla, el error se propaga y se muestra, sin fallbacks.
- `getUsers` (listado con 3 filtros combinados) sigue con Drizzle porque `listUsers` de better-auth solo admite 1 búsqueda + 1 filtro.
- Cliente: hooks en `src/functions/user-client.ts` con TanStack Query (`useUsers`, `useUser`, `useCreateUser`, `useUpdateUser`, `useDeleteUser`). Invalidar `["users"]` tras mutar.
- Roles: valores `admin | editor | student` (definidos en `src/lib/permission.ts`). Display en español vía `src/lib/roles.ts` (`Administrador`, `Editor`, `Estudiante`). Rol por defecto: `student`.
- Listado (`src/routes/admin/panel/_protected/users/index.tsx`): tabla sencilla con paginación (`page` 1-based, `limit` 10, `offset`, retorno `{ items, total, page, limit, totalPages }`), búsqueda por nombre (case-insensitive con `lower() like`), filtro por rol y por estado baneado (boolean; ausente = todos). La búsqueda se ejecuta con botón `Buscar` (más `Limpiar`), no en cada tecleo.
- Crear/editar comparten el mismo componente `src/components/users/UserForm.tsx`, pero viven en páginas separadas: `users/create.tsx` y `users/edit.$userId.tsx`. Tras guardar, redirigir al listado. Eliminar con confirmación mínima e invalidación.
