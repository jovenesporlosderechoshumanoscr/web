/**
 * Plantilla HTML del boletín.
 *
 * El admin escribe texto plano; esta función lo inserta escapado dentro
 * de un correo con diseño (tablas + CSS inline, compatible con
 * Gmail/Outlook). `renderNewsletterHtml` es una función pura y también se
 * usa en la vista previa del panel, así que lo que se ve ahí es exactamente
 * el correo que llega.
 */

const SUBJECT_MAX_LENGTH = 150
const CONTENT_MAX_LENGTH = 20_000

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

/** Convierte dobles saltos de línea en párrafos y simples en <br>. */
function textToParagraphs(text: string): string {
  return escapeHtml(text.trim())
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${paragraph.replaceAll('\n', '<br />')}</p>`)
    .join('\n')
}

export interface NewsletterRenderInput {
  /** Cuerpo en texto plano escrito por el admin. */
  content: string
  /** Preheader (texto de vista previa en la bandeja). */
  previewText: string
}

export function validateNewsletterInput(
  input: NewsletterRenderInput,
): string | null {
  if (input.content.trim().length === 0) {
    return 'El cuerpo del boletín no puede estar vacío.'
  }
  if (input.content.length > CONTENT_MAX_LENGTH) {
    return `El cuerpo supera el máximo de ${CONTENT_MAX_LENGTH} caracteres.`
  }
  if (input.previewText.length > SUBJECT_MAX_LENGTH) {
    return `El pretexto supera ${SUBJECT_MAX_LENGTH} caracteres.`
  }
  return null
}

export function renderNewsletterHtml(input: NewsletterRenderInput): string {
  const paragraphs = textToParagraphs(input.content)
  const year = new Date().getFullYear()

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Boletín JPDH</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f5;">
  <!-- Preheader -->
  <div style="display:none; max-height:0; overflow:hidden;">
    ${escapeHtml(input.previewText)}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:8px; overflow:hidden;">
          <!-- Cabecera -->
          <tr>
            <td style="background-color:#111827; padding:24px 32px;">
              <span style="color:#ffffff; font-family:Arial, sans-serif; font-size:20px; font-weight:bold; letter-spacing:1px;">JPDH</span>
              <span style="color:#9ca3af; font-family:Arial, sans-serif; font-size:13px; display:block; margin-top:4px;">Boletín informativo</span>
            </td>
          </tr>

          <!-- Cuerpo -->
          <tr>
            <td style="padding:32px; font-family:Arial, sans-serif; font-size:15px; line-height:1.6; color:#1f2937;">
              ${paragraphs}
            </td>
          </tr>

          <!-- Pie -->
          <tr>
            <td style="padding:24px 32px; background-color:#f9fafb; border-top:1px solid #e5e7eb;">
              <p style="margin:0 0 8px; font-family:Arial, sans-serif; font-size:12px; color:#6b7280;">
                Recibes este correo porque te suscribiste al boletín de JPDH.
              </p>
              <p style="margin:0; font-family:Arial, sans-serif; font-size:12px; color:#6b7280;">
                <a href="{{ unsubscribe }}" style="color:#6b7280; text-decoration:underline;">Darse de baja</a>
                &nbsp;·&nbsp;
                <a href="{{ update_profile }}" style="color:#6b7280; text-decoration:underline;">Actualizar preferencias</a>
              </p>
              <p style="margin:12px 0 0; font-family:Arial, sans-serif; font-size:12px; color:#9ca3af;">
                © ${year} JPDH. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export const NEWSLETTER_LIMITS = {
  subject: SUBJECT_MAX_LENGTH,
  content: CONTENT_MAX_LENGTH,
  previewText: SUBJECT_MAX_LENGTH,
} as const
