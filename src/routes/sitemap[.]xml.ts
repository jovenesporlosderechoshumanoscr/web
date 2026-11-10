import { blogQueries } from '@/server/queries/blog-server'
import { createFileRoute } from '@tanstack/react-router'

const SITE_URL = 'https://jovenesporlosderechoshumanoscr.org'

/**
 * Rutas públicas estáticas indexables. No incluir rutas protegidas
 * (student, admin), utilitarias de auth (forgot/reset/verify) ni /media.
 */
const STATIC_ROUTES: Array<{ path: string; changefreq: string; priority: string }> = [
	{ path: '/', changefreq: 'daily', priority: '1.0' },
	{ path: '/signup', changefreq: 'daily', priority: '1.0' },
	{ path: '/login', changefreq: 'daily', priority: '1.0' },
	{ path: '/about', changefreq: 'daily', priority: '1.0' },
	{ path: '/purpose', changefreq: 'monthly', priority: '0.8' },
	{ path: '/what-we-do', changefreq: 'monthly', priority: '0.8' },
	{ path: '/ley-10030', changefreq: 'monthly', priority: '0.8' },
	{ path: '/contact', changefreq: 'daily', priority: '1.0' },
	{ path: '/blog', changefreq: 'daily', priority: '1.0' },
	{ path: '/actividad', changefreq: 'monthly', priority: '0.8' },
	{ path: '/privacy', changefreq: 'daily', priority: '1.0' },
	{ path: '/terms', changefreq: 'daily', priority: '1.0' },
]

export const Route = createFileRoute('/sitemap.xml')({
	server: {
		handlers: {
			GET: async () => {
				const posts = await blogQueries.getAllPosts()

				const staticUrls = STATIC_ROUTES.map(
					(route) => `
  <url>
    <loc>${SITE_URL}${route.path === '/' ? '/' : route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
				).join('')

				const blogUrls = posts
					.map(
						(post) => `
  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt}</lastmod>
    <changefreq>weekly</changefreq>
  </url>`,
					)
					.join('')

				const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticUrls}${blogUrls}
</urlset>`

				return new Response(sitemap, {
					headers: {
						'Content-Type': 'application/xml',
					},
				})
			},
		},
	},
})
