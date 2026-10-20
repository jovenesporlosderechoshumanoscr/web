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

## Logica de archivos servidor/cliente

- Servidor: lecturas en `src/server/queries/`, escrituras en `src/server/mutations/`.
- Todas las funciones server de solo lectura deben exponerse siempre desde `Queries` (`src/server/queries`) y updates, create, delete en `Mutations` (`src/server/mutations`). No crear exports paralelos; los barrels solo re-exportan desde esos objetos.
- Manten los schemas de zod en validation (src/server/validation/).
- Verificar sesión con el rol adecuado dentro de cada server function (`auth.api.getSession`), en `beforeLoad` solo en rutas tipo layout `/_protected/* por ejemplo`.
- Cliente: hooks en `src/functions` con TanStack Query (`useUsers`, `useUser`, `useCreateUser`, `useUpdateUser`, `useDeleteUser`). Invalidar `["users"]` tras mutar.
- Roles: valores `admin | editor | student` (definidos en `src/lib/permission.ts`). Display en español vía `src/lib/roles.ts` (`Administrador`, `Editor`, `Estudiante`). Rol por defecto: `student`.
- Listado: tabla sencilla con paginación (`page` 1-based, `limit` 10, `offset`, retorno `{ items, total, page, limit, totalPages }`), búsqueda por nombre (case-insensitive con `lower() like`), filtro por rol y por estado baneado (boolean; ausente = todos). La búsqueda se ejecuta con botón `Buscar` (más `Limpiar`), no en cada tecleo.
- Crear/editar comparten el mismo componente `src/components/users/UserForm.tsx`, pero viven en páginas separadas: `users/create.tsx` y `users/edit.$userId.tsx`. Tras guardar, redirigir al listado. Eliminar con un toast modal .
