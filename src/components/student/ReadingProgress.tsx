import { useEffect, useRef, useState } from 'react'

/**
 * Barra fina de progreso de lectura, fija sobre la topbar. Mide el avance
 * del artículo de la lección (marcado con `data-reading-target`) a través
 * del viewport.
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  const rafRef = useRef(0)

  useEffect(() => {
    function update() {
      const el = document.querySelector<HTMLElement>('[data-reading-target]')
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = Math.max(rect.height - window.innerHeight * 0.4, 1)
      const visible = Math.min(
        Math.max(-rect.top + window.innerHeight * 0.4, 0),
        total,
      )
      setProgress(Math.round((visible / total) * 100))
    }

    function onScroll() {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      className="absolute inset-x-0 bottom-0 h-0.5"
      role="progressbar"
      aria-label="Progreso de lectura"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-primary transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
