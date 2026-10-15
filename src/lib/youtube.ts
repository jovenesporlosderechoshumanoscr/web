/** Convierte una URL de YouTube (watch, youtu.be o embed) en URL de embed. */
export function youtubeEmbedUrl(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/,
  )
  return match ? `https://www.youtube.com/embed/${match[1]}` : url
}
