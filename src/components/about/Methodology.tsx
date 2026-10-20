import {
	IconEar,
	IconHeartHandshake,
	IconSchool,
	IconUsersGroup,
} from '@tabler/icons-react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

export const methodologyContent = {
	eyebrow: 'Cómo desarrollamos nuestro trabajo',
	title: 'Nuestro proceso',
	steps: [
		{
			number: '01',
			title: 'Escucha y diagnóstico',
			description:
				'Partimos de la realidad del territorio: identificamos necesidades, actores y posibilidades.',
			Icon: IconEar,
		},
		{
			number: '02',
			title: 'Formación',
			description:
				'Diseñamos capacitaciones prácticas para fortalecer liderazgos y conocimientos.',
			Icon: IconSchool,
		},
		{
			number: '03',
			title: 'Acción colectiva',
			description:
				'Acompañamos procesos de defensa, incidencia y organización comunitaria.',
			Icon: IconUsersGroup,
		},
		{
			number: '04',
			title: 'Seguimiento y memoria',
			description:
				'Damos continuidad, evaluamos resultados y documentamos aprendizajes.',
			Icon: IconHeartHandshake,
		},
	],
} as const

export default function Methodology() {
	return (
		<section
			aria-labelledby="methodology-title"
			id="metodologia"
			className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24"
		>
			<div className="mx-auto max-w-2xl text-center">
				<p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
					{methodologyContent.eyebrow}
				</p>
				<h2
					id="methodology-title"
					className="mt-3 text-3xl font-bold tracking-tight uppercase sm:text-4xl"
				>
					{methodologyContent.title}
				</h2>
			</div>
			<div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{methodologyContent.steps.map(({ number, title, description, Icon }) => (
					<Card key={number}>
						<CardHeader>
							<div className="flex items-center gap-3">
								<span className="text-3xl font-bold tracking-tight text-primary">
									{number}
								</span>
								<span className="flex size-10 items-center justify-center rounded-xl bg-muted">
									<Icon aria-hidden="true" className="size-5" />
								</span>
							</div>
							<CardTitle>{title}</CardTitle>
							<CardDescription>{description}</CardDescription>
						</CardHeader>
						<CardContent />
					</Card>
				))}
			</div>
		</section>
	)
}
