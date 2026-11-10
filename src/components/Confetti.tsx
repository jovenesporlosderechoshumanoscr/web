import { useMemo } from 'react'

const COLORES = [
  '#7ab6ff', // primary
  '#ff3d3d', // secondary
  '#624dea', // accent
  '#fbbf24',
  '#22c55e',
]

type PiezaConfetti = {
  id: number
  left: number
  delay: number
  duracion: number
  drift: number
  rotacion: number
  color: string
  ancho: number
  alto: number
}

/**
 * Animación de confeti con CSS puro (sin dependencias). Las piezas caen una
 * sola vez y quedan invisibles al terminar (opacity 0 en el último frame).
 */
export default function Confetti({ cantidad = 70 }: { cantidad?: number }) {
  const piezas = useMemo<PiezaConfetti[]>(
    () =>
      Array.from({ length: cantidad }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        duracion: 2.4 + Math.random() * 1.8,
        drift: Math.round((Math.random() - 0.5) * 160),
        rotacion: Math.round(360 + Math.random() * 720),
        color: COLORES[i % COLORES.length]!,
        ancho: 8 + Math.random() * 6,
        alto: 10 + Math.random() * 8,
      })),
    [cantidad],
  )

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      {piezas.map((pieza) => (
        <span
          key={pieza.id}
          className="absolute block"
          style={
            {
              left: `${pieza.left}%`,
              top: '-24px',
              width: `${pieza.ancho}px`,
              height: `${pieza.alto}px`,
              backgroundColor: pieza.color,
              borderRadius: '2px',
              animation: `confetti-fall ${pieza.duracion}s cubic-bezier(0.2, 0.6, 0.4, 1) ${pieza.delay}s forwards`,
              '--confetti-drift': `${pieza.drift}px`,
              '--confetti-rotation': `${pieza.rotacion}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
