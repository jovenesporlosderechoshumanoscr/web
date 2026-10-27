import { env } from 'cloudflare:workers'
import type { PDFPage} from 'pdf-lib';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

function textoCentrado(
  page: PDFPage,
  texto: string,
  y: number,
  font: any,
  size: number,
  color = rgb(0, 0, 0),
) {
  const { width } = page.getSize()
  const x = (width - font.widthOfTextAtSize(texto, size)) / 2
  page.drawText(texto, { x, y, size, font, color })
}

export async function generarCertificado(
  nombreCompleto: string,
  curso: string,
): Promise<Uint8Array> {
  const fecha = new Date().toLocaleDateString('es-ES')

  // Plantilla desde R2 (binding PLANTILLAS)
  const obj = await env.PLANTILLAS.get('plantilla.pdf')
  if (!obj) {
    throw new Error('No se encontró la plantilla del certificado')
  }
  const pdf = await PDFDocument.load(await obj.arrayBuffer())

  const page = pdf.getPage(0)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const normal = await pdf.embedFont(StandardFonts.Helvetica)

  // El origen (0,0) es la esquina inferior izquierda
  textoCentrado(page, nombreCompleto, 300, bold, 36)
  textoCentrado(page, curso, 240, normal, 22)
  textoCentrado(page, fecha, 120, normal, 14, rgb(0.3, 0.3, 0.3))

  return await pdf.save()
}
