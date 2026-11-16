import { createFileRoute } from '@tanstack/react-router'
import Footer from '@/components/landing/Footer'
import Header from '@/components/landing/Header'
import ContactChannels from '@/components/contact/ContactChannels'

export const Route = createFileRoute('/contact')({
	head: () => ({
		meta: [
			{ title: 'Contacto — JPDH' },
			{
				name: 'description',
				content:
					'Ponte en contacto con Jóvenes por los Derechos Humanos Costa Rica. Escríbenos para solicitar charlas, talleres o colaborar con nuestra organización.',
			},
		],
	}),
	component: ContactPage,
})

function ContactPage() {
	return (
		<div className="min-h-svh bg-background text-foreground">
			<Header />
			<main>
				<ContactChannels />
			</main>
			<Footer />
		</div>
	)
}
