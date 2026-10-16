/**
 * Mock de los módulos del curso para el sidebar de la zona de estudiantes.
 * Solo navegación visual: los ítems no enlazan a contenido (el curso no es
 * funcional por ahora).
 */
export type CourseItem = {
  id: string
  title: string
}

export type CourseModule = {
  id: string
  title: string
  items: CourseItem[]
}

export const courseModules: CourseModule[] = [
  {
    id: "modulo-1",
    title: "Módulo 1 · Fundamentos",
    items: [
      { id: "m1-que-son", title: "¿Qué son los derechos humanos?" },
      { id: "m1-historia", title: "Historia y Declaración Universal" },
      { id: "m1-principios", title: "Principios fundamentales" },
    ],
  },
  {
    id: "modulo-2",
    title: "Módulo 2 · Derechos y deberes",
    items: [
      { id: "m2-civiles", title: "Derechos civiles y políticos" },
      { id: "m2-sociales", title: "Derechos económicos y sociales" },
      { id: "m2-deberes", title: "Deberes ciudadanos" },
    ],
  },
  {
    id: "modulo-3",
    title: "Módulo 3 · Jóvenes en acción",
    items: [
      { id: "m3-defender", title: "Cómo defender tus derechos" },
      { id: "m3-organizaciones", title: "Organizaciones y recursos" },
    ],
  },
]
