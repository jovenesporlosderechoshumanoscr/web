import { createFileRoute } from '@tanstack/react-router'
import Footer from '@/components/landing/Footer'
import Header from '@/components/landing/Header'
import ContactChannels from '@/components/contact/ContactChannels'

export const Route = createFileRoute('/contact')({
	head: () => ({
		meta: [{ title: 'Contacto — JPDH' }],
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
