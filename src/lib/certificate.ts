import { env } from 'cloudflare:workers'
import type { PDFFont, PDFPage } from 'pdf-lib'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

// Coordenadas sobre la plantilla (Carta horizontal 792 x 612 pt, origen abajo-izquierda)
const CAMPOS = {
  nombre: { centerX: 396, y: 365, size: 20, maxWidth: 600 },
  curso: { centerX: 475, y: 338, size: 12, maxWidth: 235 },
  horas: { centerX: 264, y: 318, size: 12, maxWidth: 25 },
  dia: { centerX: 283, y: 271, size: 12, maxWidth: 55 },
  mes: { centerX: 400, y: 271, size: 12, maxWidth: 155 },
  anio: { centerX: 580, y: 271, size: 12, maxWidth: 80 },
} as const

type Campo = keyof typeof CAMPOS

function dibujarEnCampo(
  page: PDFPage,
  campo: Campo,
  texto: string,
  font: PDFFont,
  color = rgb(0, 0, 0),
) {
  const { centerX, y, maxWidth } = CAMPOS[campo]
  let size: number = CAMPOS[campo].size

  // Reduce la fuente si el texto no cabe en la línea (mínimo 7 pt)
  while (size > 7 && font.widthOfTextAtSize(texto, size) > maxWidth) {
    size -= 0.5
  }

  const x = centerX - font.widthOfTextAtSize(texto, size) / 2
  page.drawText(texto, { x, y, size, font, color })
}

export async function generarCertificado(
  nombreCompleto: string,
  curso: string,
  horas: number,
  fecha: Date = new Date(),
): Promise<Uint8Array> {
  // Plantilla desde R2 (binding PLANTILLAS)
  const obj = await env.PLANTILLAS.get('plantilla.pdf')
  if (!obj) {
    throw new Error('No se encontró la plantilla del certificado')
  }
  const pdf = await PDFDocument.load(await obj.arrayBuffer())

  const page = pdf.getPage(0)
  const bold = await pdf.embedFont(StandardFonts.TimesRomanBold)
  const normal = await pdf.embedFont(StandardFonts.TimesRoman)

  dibujarEnCampo(page, 'nombre', nombreCompleto, bold)
  dibujarEnCampo(page, 'curso', curso, normal)
  dibujarEnCampo(page, 'horas', String(horas), normal)
  dibujarEnCampo(page, 'dia', String(fecha.getDate()), normal)
  dibujarEnCampo(page, 'mes', MESES[fecha.getMonth()], normal)
  dibujarEnCampo(page, 'anio', String(fecha.getFullYear()), normal)

  return await pdf.save()
}
