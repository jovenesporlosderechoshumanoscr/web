import { Link, createFileRoute } from '@tanstack/react-router'
import { IconArrowRight, IconExternalLink } from '@tabler/icons-react'
import { buttonVariants } from '@/components/ui/button'
import About from '@/components/landing/About'
import Footer from '@/components/landing/Footer'
import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import Law from '@/components/landing/Law'
import NewsSummary from '@/components/landing/NewsSummary'
import Newsletter from '@/components/landing/Newsletter'
import Purpose from '@/components/landing/Purpose'
import Stats from '@/components/landing/Stats'
import WhatWeDo from '@/components/landing/WhatWeDo'
import { Rights } from '@/components/landing/Rights'

export const Route = createFileRoute('/')({
	head: () => ({
		meta: [
			{ title: 'Jóvenes por los Derechos Humanos Costa Rica' },
			{
				name: 'description',
				content:
					'Jóvenes por los Derechos Humanos Costa Rica: educación en los 30 derechos de la Declaración Universal, cursos, blog y actividades interactivas. Impulsores de la Ley N.° 10030.',
			},
		],
	}),
	component: LandingPage,
})

function LandingPage() {
	return (
		<div className="min-h-svh bg-background text-foreground">
			<Header />
			<main>
				<Hero />
				<Stats />

				<section
					aria-labelledby="course-title"
					className="border-y bg-primary/10"
				>
					<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
						<div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
							<Law />
							<div>
								<p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
									Curso en línea
								</p>
								<h2
									id="course-title"
									className="mt-3 text-3xl font-bold tracking-tight uppercase sm:text-4xl"
								>
									Aprende derechos humanos a{' '}
									<strong className="font-bold">tu ritmo</strong>
								</h2>
								<p className="mt-5 text-muted-foreground">
									Cursos gratuitos en línea sobre los 30 derechos de la
									Declaración Universal de Derechos Humanos, con lecciones
									claras y actividades para aplicar lo aprendido en tu vida
									diaria. Crea tu cuenta y comienza hoy mismo.
								</p>
								<Link
									to="/login"
									className={buttonVariants({ size: 'lg', className: 'mt-8' })}
								>
									Entrar al curso
									<IconArrowRight data-icon="inline-end" />
								</Link>
							</div>
						</div>
					</div>
				</section>
				<section
					aria-labelledby="yhri-title"
					className=""
				>
					<div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-16">
						<img
							src="/yhri-educators-kit_en.png"
							alt="Paquete gratuito para docentes de Youth for Human Rights: materiales educativos sobre los 30 derechos de la Declaración Universal"
							loading="lazy"
							className="mx-auto w-52 rounded-2xl bg-background p-4 shadow-lg sm:w-60"
						/>
						<p className="mt-6 text-sm font-semibold tracking-widest text-muted-foreground uppercase">
							Paquete gratuito para docentes
						</p>
						<h2
							id="yhri-title"
							className="mt-3 text-2xl font-bold tracking-tight uppercase sm:text-3xl"
						>
							Recursos de Youth for Human Rights
						</h2>
						<p className="mt-5 text-muted-foreground">
							Youth for Human Rights International ofrece un paquete gratuito
							para docentes con materiales educativos para enseñar los 30
							derechos de la Declaración Universal en el aula.
						</p>
						<a
							href="https://www.youthforhumanrights.org/request-info/educators-kit.html"
							target="_blank"
							rel="noreferrer"
							className={buttonVariants({
								variant: 'default',
								size: 'lg',
								className: 'mt-8',
							})}
						>
							Conseguir el paquete gratuito
							<IconExternalLink data-icon="inline-end" />
						</a>
					</div>
				</section>
				<NewsSummary />
				<About />
				<Purpose />
				<WhatWeDo />
				<Rights />
				<Newsletter />
			</main>
			<Footer />
		</div>
	)
}
