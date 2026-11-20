// ────────────────────────────────────────────────────────────────────────────
// Videos de los 30 derechos de la Declaración Universal de Derechos Humanos
// ────────────────────────────────────────────────────────────────────────────
//
// Pega en cada variable el link de Google Drive del video correspondiente.
// Ejemplo:
//
//   'https://drive.google.com/file/d/TU_FILE_ID/view?usp=sharing'
//
// Si dejas la variable vacía (''), se muestra "Video próximamente" para ese
// derecho.
//
// ────────────────────────────────────────────────────────────────────────────

const videoDerecho1 = ''
const videoDerecho2 = ''
const videoDerecho3 = ''
const videoDerecho4 = ''
const videoDerecho5 = ''
const videoDerecho6 = ''
const videoDerecho7 = ''
const videoDerecho8 = ''
const videoDerecho9 = ''
const videoDerecho10 = ''
const videoDerecho11 = ''
const videoDerecho12 = ''
const videoDerecho13 = ''
const videoDerecho14 = ''
const videoDerecho15 = ''
const videoDerecho16 = ''
const videoDerecho17 = ''
const videoDerecho18 = ''
const videoDerecho19 = ''
const videoDerecho20 = ''
const videoDerecho21 = ''
const videoDerecho22 = ''
const videoDerecho23 = ''
const videoDerecho24 = ''
const videoDerecho25 = ''
const videoDerecho26 = ''
const videoDerecho27 = ''
const videoDerecho28 = ''
const videoDerecho29 = ''
const videoDerecho30 = ''

const videos: string[] = [
  videoDerecho1,
  videoDerecho2,
  videoDerecho3,
  videoDerecho4,
  videoDerecho5,
  videoDerecho6,
  videoDerecho7,
  videoDerecho8,
  videoDerecho9,
  videoDerecho10,
  videoDerecho11,
  videoDerecho12,
  videoDerecho13,
  videoDerecho14,
  videoDerecho15,
  videoDerecho16,
  videoDerecho17,
  videoDerecho18,
  videoDerecho19,
  videoDerecho20,
  videoDerecho21,
  videoDerecho22,
  videoDerecho23,
  videoDerecho24,
  videoDerecho25,
  videoDerecho26,
  videoDerecho27,
  videoDerecho28,
  videoDerecho29,
  videoDerecho30,
]

export type DerechoUniversal = {
  /** Número del artículo (1-30). */
  numero: number
  /** Nombre corto del derecho. */
  titulo: string
  /** Breve resumen del derecho. */
  resumen: string
  /** Link de Google Drive del video (cadena vacía si aún no hay video). */
  videoUrl: string
}

const derechos: DerechoUniversal[] = [
  {
    numero: 1,
    titulo: 'Igualdad y dignidad',
    resumen:
      'Todos los seres humanos nacen libres e iguales en dignidad y derechos.',
    videoUrl:
      'https://drive.google.com/file/d/1Ov-KJmGOnGts0BCsa5QD39Q2YiFDc2_Q/view?usp=drive_link',
  },
  {
    numero: 2,
    titulo: 'No discriminación',
    resumen:
      'Nadie puede ser discriminado por razones de raza, sexo, idioma, religión, opinión o cualquier otra condición.',
    videoUrl: 'https://drive.google.com/file/d/1jefZfSXU8jnTSouCUf--zEeruozWtm6O/view?usp=drive_link',
  },
  {
    numero: 3,
    titulo: 'Vida, libertad y seguridad',
    resumen:
      'Todo ser humano tiene derecho a la vida, a la libertad y a su seguridad personal.',
    videoUrl: 'https://drive.google.com/file/d/1AzE_el89RWtlam1cbEGEnQH3xXcY_TyK/view?usp=drive_link',
  },
  {
    numero: 4,
    titulo: 'Prohibición de la esclavitud',
    resumen:
      'Nadie estará sometido a esclavitud ni a servidumbre; la trata de esclavos queda prohibida.',
    videoUrl: 'https://drive.google.com/file/d/1oSryE5CcpT8_7T1PmqjslNvUS3bEshXZ/view?usp=drive_link',
  },
  {
    numero: 5,
    titulo: 'Prohibición de la tortura',
    resumen:
      'Nadie será sometido a torturas ni a tratos crueles, inhumanos o degradantes.',
    videoUrl: 'https://drive.google.com/file/d/1uLoqCuqnyhXHDlXUUT9Ubdoj3zIMxJan/view?usp=drive_link',
  },
  {
    numero: 6,
    titulo: 'Reconocimiento como persona',
    resumen:
      'Todo ser humano tiene derecho al reconocimiento de su personalidad jurídica en todas partes.',
    videoUrl: 'https://drive.google.com/file/d/1CETpNQGSGLR1AWUvhZujJwj-iPoC2chs/view?usp=drive_link',
  },
  {
    numero: 7,
    titulo: 'Igualdad ante la ley',
    resumen:
      'Todos somos iguales ante la ley y tenemos derecho a la misma protección de la ley.',
    videoUrl: 'https://drive.google.com/file/d/1PiRgr4kxbqk2j9R1usM3tnDOtB71Vq0l/view?usp=drive_link',
  },
  {
    numero: 8,
    titulo: 'Recurso judicial efectivo',
    resumen:
      'Toda persona tiene derecho a un recurso efectivo ante los tribunales cuando sus derechos sean violados.',
    videoUrl: 'https://drive.google.com/file/d/11qqumVQsMjeypcabp31sLRG3iyPttdKL/view?usp=drive_link',
  },
  {
    numero: 9,
    titulo: 'Prohibición de la detención arbitraria',
    resumen: 'Nadie podrá ser detenido, preso ni desterrado arbitrariamente.',
    videoUrl: 'https://drive.google.com/file/d/1y-Emg37YC6iyelFMOZfj4fglZ_GtKW9L/view?usp=drive_link',
  },
  {
    numero: 10,
    titulo: 'Juicio justo',
    resumen:
      'Toda persona tiene derecho a ser oída públicamente y con garantías dentro de un proceso equitativo.',
    videoUrl: 'https://drive.google.com/file/d/1kxAKkdvHaAUeF2aQT9cEvI1ZDt4KRkvg/view?usp=drive_link',
  },
  {
    numero: 11,
    titulo: 'Presunción de inocencia',
    resumen:
      'Toda persona se presume inocente hasta que se pruebe su culpabilidad en un juicio público.',
    videoUrl: 'https://drive.google.com/file/d/1E9IW1Qe_9IWKxyOvbTembXXnIRLEiUQr/view?usp=drive_link',
  },
  {
    numero: 12,
    titulo: 'Derecho a la privacidad',
    resumen:
      'Nadie será objeto de injerencias arbitrarias en su vida privada, su familia, su domicilio o su correspondencia.',
    videoUrl: 'https://drive.google.com/file/d/1Ix1ChZO-bLBTRGpkLWu3KX_oYhqb9Bfe/view?usp=drive_link',
  },
  {
    numero: 13,
    titulo: 'Libertad de movimiento',
    resumen:
      'Toda persona puede circular libremente y elegir su residencia dentro de su país.',
    videoUrl: 'https://drive.google.com/file/d/1Id_EyKgDs4lG8wmgE7WNmtlA1Wy4SYac/view?usp=drive_link',
  },
  {
    numero: 14,
    titulo: 'Derecho al asilo',
    resumen:
      'Toda persona perseguida tiene derecho a buscar asilo en otro país y disfrutar de él.',
    videoUrl: 'https://drive.google.com/file/d/1At0qAv3P2-cWKGGtOh2Yrsb5mjem83dV/view?usp=drive_link',
  },
  {
    numero: 15,
    titulo: 'Derecho a la nacionalidad',
    resumen:
      'Toda persona tiene derecho a una nacionalidad y a cambiar de nacionalidad si lo desea.',
    videoUrl: 'https://drive.google.com/file/d/1RRriX3u5Wgv0iSZs1a2RlTFFBL8_CFfN/view?usp=drive_link',
  },
  {
    numero: 16,
    titulo: 'Matrimonio y familia',
    resumen:
      'Hombres y mujeres pueden casarse y formar una familia libremente, con igualdad de derechos.',
    videoUrl: 'https://drive.google.com/file/d/1D1vwzI20qpAmmWYUQduFp0_uuHHFdjLt/view?usp=drive_link',
  },
  {
    numero: 17,
    titulo: 'Derecho a la propiedad',
    resumen:
      'Toda persona tiene derecho a la propiedad, individual y colectiva, y nadie será privado de ella arbitrariamente.',
    videoUrl: 'https://drive.google.com/file/d/1G8R6O3NoyAN4N-0jD8jAmnXr-8nNBVgb/view?usp=drive_link',
  },
  {
    numero: 18,
    titulo: 'Libertad de pensamiento y religión',
    resumen:
      'Toda persona tiene libertad de pensamiento, de conciencia y de religión, y de practicar su culto.',
    videoUrl: 'https://drive.google.com/file/d/1v7wYoLlCUlHGaO0Z9ecqdi39JaiNCqy9/view?usp=drive_link',
  },
  {
    numero: 19,
    titulo: 'Libertad de opinión y expresión',
    resumen:
      'Toda persona tiene derecho a opinar y expresarse libremente, y a buscar y difundir información.',
    videoUrl: 'https://drive.google.com/file/d/13yznio8WM_y3__ncFWGOlqFT0bHeZiYc/view?usp=drive_link',
  },
  {
    numero: 20,
    titulo: 'Libertad de reunión y asociación',
    resumen:
      'Toda persona tiene derecho a reunirse y asociarse pacíficamente, y nadie puede ser obligado a pertenecer a una asociación.',
    videoUrl: 'https://drive.google.com/file/d/1PYLb_swGp-cw6hf1qF9By1ap_iotrZYK/view?usp=drive_link',
  },
  {
    numero: 21,
    titulo: 'Participación en el gobierno',
    resumen:
      'Toda persona tiene derecho a participar en el gobierno de su país, directamente o por representantes elegidos.',
    videoUrl: 'https://drive.google.com/file/d/1ZVBkQaiRNwL1qxe4cypNqJDgd4zmYI6D/view?usp=drive_link',
  },
  {
    numero: 22,
    titulo: 'Derecho a la seguridad social',
    resumen:
      'Toda persona tiene derecho a la seguridad social y a la satisfacción de sus derechos económicos, sociales y culturales.',
    videoUrl: 'https://drive.google.com/file/d/1jBzhwnq6-iVKUfzbaDQynaBMR4-xGzMt/view?usp=drive_link',
  },
  {
    numero: 23,
    titulo: 'Derecho al trabajo',
    resumen:
      'Toda persona tiene derecho al trabajo, a la libre elección y a condiciones equitativas y un salario justo.',
    videoUrl: 'https://drive.google.com/file/d/1wpISVDDQkthXUX2_zYGZ_5e4D6spl9Ry/view?usp=drive_link',
  },
  {
    numero: 24,
    titulo: 'Descanso y tiempo libre',
    resumen:
      'Toda persona tiene derecho al descanso, a la limitación razonable de las horas de trabajo y al ocio.',
    videoUrl: 'https://drive.google.com/file/d/1bOdlyqcey-JMItSp3_CG51zSlMjQHGOx/view?usp=drive_link',
  },
  {
    numero: 25,
    titulo: 'Nivel de vida adecuado',
    resumen:
      'Toda persona tiene derecho a la salud, la alimentación, la vivienda, el vestido y la atención médica.',
    videoUrl: 'https://drive.google.com/file/d/11bUumRshWjPyLBLjzTkYQvHhr4b-XFSO/view?usp=drive_link',
  },
  {
    numero: 26,
    titulo: 'Derecho a la educación',
    resumen:
      'Toda persona tiene derecho a la educación, que debe ser gratuita al menos en sus etapas básicas.',
    videoUrl: 'https://drive.google.com/file/d/1vpwmny5OjQGpuZB1amseZ2Q3GATIXXfZ/view?usp=drive_link',
  },
  {
    numero: 27,
    titulo: 'Participación en la vida cultural',
    resumen:
      'Toda persona tiene derecho a participar en la vida cultural, científica y artística de su comunidad.',
    videoUrl: 'https://drive.google.com/file/d/1sghBz70BoRDwygCMbTPwuZZKu5QvRjWr/view?usp=drive_link',
  },
  {
    numero: 28,
    titulo: 'Orden social justo',
    resumen:
      'El orden social y político debe garantizar plenamente estos derechos y libertades para todas las personas.',
    videoUrl: 'https://drive.google.com/file/d/1TbjHFAA0oIGObyOcuM3Lnzlfc1HeyFla/view?usp=drive_link',
  },
  {
    numero: 29,
    titulo: 'Deberes ante la comunidad',
    resumen:
      'Toda persona tiene deberes hacia la comunidad, y sus derechos pueden limitarse solo según la ley y el respeto a los demás.',
    videoUrl: 'https://drive.google.com/file/d/1ZHssYVpasdVS-pdJgVLNfHd02VfGspDd/view?usp=drive_link',
  },
  {
    numero: 30,
    titulo: 'Ninguna privación de derechos',
    resumen:
      'Ningún Estado, grupo ni persona puede destruir ninguno de los derechos y libertades de esta Declaración.',
    videoUrl: 'https://drive.google.com/file/d/1hc_4tgXGhM0a9JryD1hUugv26BpZ5YO3/view?usp=drive_link',
  },
]

/** Los 30 derechos con su video de Google Drive. */
export const derechosUniversales: DerechoUniversal[] = derechos.map(
  (derecho, index) => ({
    ...derecho,
    videoUrl: derecho.videoUrl || videos[index] || '',
  }),
)
