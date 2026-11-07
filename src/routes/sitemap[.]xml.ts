import { blogQueries } from '@/server/queries/blog-server'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sitemap.xml')({
	server: {
		handlers: {
			GET: async () => {
				const posts = await blogQueries.getAllPosts()

				const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://jovenesporlosderechoshumanoscr.org/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://jovenesporlosderechoshumanoscr.org/signup</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://jovenesporlosderechoshumanoscr.org/login</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://jovenesporlosderechoshumanoscr.org/about</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://jovenesporlosderechoshumanoscr.org/purpose</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://jovenesporlosderechoshumanoscr.org/what-we-do</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://jovenesporlosderechoshumanoscr.org/ley-10030</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://jovenesporlosderechoshumanoscr.org/contact</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://jovenesporlosderechoshumanoscr.org/student</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://jovenesporlosderechoshumanoscr.org/privacy</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://jovenesporlosderechoshumanoscr.org/terms</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${posts
						.map(
							(post) => `
  <url>
    <loc>https://jovenesporlosderechoshumanoscr.org/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt}</lastmod>
    <changefreq>weekly</changefreq>
  </url>`,
						)
						.join('')}
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
