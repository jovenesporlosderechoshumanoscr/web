export type Articulo = {
  id: number
  titulo: string
  texto: string
  pregunta: string
  opciones: string[]
  /** Índice (0-based) de la opción correcta dentro de `opciones`. */
  correcta: number
  explicacion: string
}

export const REFLEXION =
  '¿Cómo puedes poner en práctica este derecho en tu vida cotidiana?'

export const articulos: Articulo[] = [
  {
    id: 1,
    titulo: 'Todos nacemos libres e iguales',
    texto: 'Todas las personas nacen libres e iguales en dignidad y derechos.',
    pregunta: '¿Quiénes tienen la misma dignidad y derechos?',
    opciones: ['Solo los ciudadanos', 'Todas las personas', 'Solo los adultos'],
    correcta: 1,
    explicacion:
      'La dignidad y los derechos corresponden a todas las personas: no importan la edad, la nacionalidad ni ninguna otra condición. Nadie nace con más derechos que otra persona.',
  },
  // BORRADOR: pendiente de revisión del cliente
  {
    id: 2,
    titulo: 'No a la discriminación',
    texto:
      'Todas las personas tienen los mismos derechos, sin distinción de raza, color, sexo, idioma, religión, opinión política u origen.',
    pregunta: '¿Quiénes están protegidos contra la discriminación?',
    opciones: [
      'Solo las personas del mismo país',
      'Todas las personas, sin distinción',
      'Solo quienes comparten la misma religión',
    ],
    correcta: 1,
    explicacion:
      'Nadie puede ser tratado peor por cómo es, qué cree o de dónde viene. Los derechos pertenecen a todas las personas por igual.',
  },
  // BORRADOR: pendiente de revisión del cliente
  {
    id: 3,
    titulo: 'Derecho a la vida y a la libertad',
    texto:
      'Toda persona tiene derecho a la vida, a la libertad y a la seguridad de su persona.',
    pregunta: '¿Qué protege este artículo?',
    opciones: [
      'La vida, la libertad y la seguridad',
      'Solo la libertad de expresión',
      'El derecho a trabajar y estudiar',
    ],
    correcta: 0,
    explicacion:
      'Este artículo protege tres cosas esenciales: que tu vida sea respetada, que seas libre y que estés seguro.',
  },
]
