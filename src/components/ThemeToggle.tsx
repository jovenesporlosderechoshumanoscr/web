import { useEffect, useState } from 'react'
import {
  IconDeviceDesktop,
  IconMoonStars,
  IconSun,
} from '@tabler/icons-react'

type ThemeMode = 'light' | 'dark' | 'auto'

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'auto'
  }

  const stored = window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark' || stored === 'auto') {
    return stored
  }

  return 'auto'
}

function applyThemeMode(mode: ThemeMode) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const resolved = mode === 'auto' ? (prefersDark ? 'dark' : 'light') : mode

  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(resolved)

  if (mode === 'auto') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', mode)
  }

  document.documentElement.style.colorScheme = resolved
}

/** Lógica compartida del tema: modo actual + ciclo light → dark → auto. */
export function useThemeMode() {
  const [mode, setMode] = useState<ThemeMode>('auto')

  useEffect(() => {
    const initialMode = getInitialMode()
    setMode(initialMode)
    applyThemeMode(initialMode)
  }, [])

  useEffect(() => {
    if (mode !== 'auto') {
      return
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyThemeMode('auto')

    media.addEventListener('change', onChange)
    return () => {
      media.removeEventListener('change', onChange)
    }
  }, [mode])

  function toggleMode() {
    const nextMode: ThemeMode =
      mode === 'light' ? 'dark' : mode === 'dark' ? 'auto' : 'light'
    setMode(nextMode)
    applyThemeMode(nextMode)
    window.localStorage.setItem('theme', nextMode)
  }

  return { mode, toggleMode }
}

const MODE_ICONS = {
  light: IconSun,
  dark: IconMoonStars,
  auto: IconDeviceDesktop,
} as const

const MODE_LABELS: Record<ThemeMode, string> = {
  light: 'Claro',
  dark: 'Oscuro',
  auto: 'Automático',
}

/** Icono del modo actual, para reutilizar en menús. */
export function ThemeModeIcon({ mode }: { mode: ThemeMode }) {
  const Icon = MODE_ICONS[mode]
  return <Icon aria-hidden="true" />
}

/** Botón circular (píldora) para usar fuera de menús, p. ej. en el footer. */
export default function ThemeToggle() {
  const { mode, toggleMode } = useThemeMode()
  const label = `Tema: ${MODE_LABELS[mode]}. Haz clic para cambiar.`

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={label}
      title={label}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
    >
      <ThemeModeIcon mode={mode} />
      {MODE_LABELS[mode]}
    </button>
  )
}
