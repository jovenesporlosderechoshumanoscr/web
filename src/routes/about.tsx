import { createFileRoute } from '@tanstack/react-router'
import Footer from '@/components/landing/Footer'
import Header from '@/components/landing/Header'
import History from '@/components/about/History'
import Justification from '@/components/about/Justification'
import Methodology from '@/components/about/Methodology'
import Objectives from '@/components/about/Objectives'
import Purpose from '@/components/about/Purpose'

export const Route = createFileRoute('/about')({
	head: () => ({
		meta: [{ title: 'Sobre nosotros — JPDH' }],
	}),
	component: AboutPage,
})

function AboutPage() {
	return (
		<div className="min-h-svh bg-background text-foreground">
			<Header />
			<main>
				<section
					aria-labelledby="about-page-title"
					className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24"
				>
					<p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
						Sobre nosotros
					</p>
					<h1
						id="about-page-title"
						className="mt-3 text-4xl leading-tight font-light tracking-tight uppercase sm:text-5xl lg:text-6xl"
					>
						Una comunidad que defiende la{' '}
						<strong className="font-bold">dignidad</strong>
					</h1>
					<p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
						Conoce la historia, el propósito y el trabajo de JPDH.
					</p>
				</section>
				<History />
				<Purpose />
				<Objectives />
				<Justification />
				<Methodology />
				<section
					aria-labelledby="about-cta-title"
					className="border-t bg-muted"
				>
					<div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-24">
						<h2
							id="about-cta-title"
							className="text-2xl font-bold tracking-tight uppercase sm:text-3xl"
						>
							¿Quieres colaborar o saber más?
						</h2>
						<p className="mt-3 text-muted-foreground">
							Escríbenos y construyamos juntos.
						</p>
						<a
							href="/contact"
							className="mt-6 inline-flex h-11 items-center justify-center gap-1.5 rounded-2xl bg-primary px-6 text-sm font-medium text-primary-foreground"
						>
							Contacto
						</a>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	)
}
