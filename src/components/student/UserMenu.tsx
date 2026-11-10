import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ThemeModeIcon, useThemeMode } from '@/components/ThemeToggle'
import { authClient } from '@/lib/auth-client'
import {
  IconLogout,
  IconRosetteDiscountCheck,
  IconSelector,
} from '@tabler/icons-react'
import { Link, useNavigate } from '@tanstack/react-router'

/**
 * Dropdown de usuario de la plataforma de estudiantes (perfil, tema,
 * cerrar sesión). Extraído del antiguo sidebar para poder vivir en el
 * header de la plataforma.
 */
export function UserMenu({
  user,
}: {
  user: {
    name: string
    email: string
  }
}) {
  const navigate = useNavigate()
  const { mode, toggleMode } = useThemeMode()

  const handleLogout = async () => {
    await authClient.signOut()
    navigate({ to: '/login' })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2 rounded-2xl border border-border bg-card py-1.5 pr-2.5 pl-1.5 text-left shadow-sm transition-colors hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
            aria-label="Menú de usuario"
          >
            <Avatar className="size-8 rounded-lg">
              <AvatarFallback className="rounded-lg">
                {user.name.trim().charAt(0).toUpperCase() || 'E'}
              </AvatarFallback>
            </Avatar>
            <span className="hidden max-w-32 truncate text-sm font-medium sm:block">
              {user.name}
            </span>
            <IconSelector className="size-4 text-muted-foreground" />
          </button>
        }
      />
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-60 rounded-xl"
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm">
            <Avatar className="size-9 rounded-lg">
              <AvatarFallback className="rounded-lg">
                {user.name.trim().charAt(0).toUpperCase() || 'E'}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link to="/student/profile" />}>
            <IconRosetteDiscountCheck />
            Mi cuenta
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={toggleMode} closeOnClick={false}>
            <ThemeModeIcon mode={mode} />
            Tema:{' '}
            {mode === 'auto'
              ? 'Automático'
              : mode === 'dark'
                ? 'Oscuro'
                : 'Claro'}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleLogout}>
            <IconLogout />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
