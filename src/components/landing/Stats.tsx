import {
	IconBuilding,
	IconHeartHandshake,
	IconHistory,
} from '@tabler/icons-react'

export const statsContent = {
	title: 'Nuestro impacto',
	intro:
		'Estadísticas, fotografías, reconocimientos y testimonios que muestran cómo la educación en derechos humanos llega a comunidades de Costa Rica.',
	link: { label: 'Conoce nuestro impacto', href: '/impacto' },
	items: [
		{
			value: '15',
			label: 'años de trabajo en Costa Rica',
			Icon: IconHistory,
		},
		{
			value: '[dato pendiente]',
			label: 'personas alcanzadas',
			Icon: IconHeartHandshake,
		},
		{
			value: '[dato pendiente]',
			label: 'instituciones y centros educativos',
			Icon: IconBuilding,
		},
	],
} as const

export default function Stats() {
	return (
		<section aria-label="Nuestro impacto" className="border-y bg-muted">
			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
				<h2 className="text-2xl font-bold tracking-tight uppercase sm:text-3xl">
					{statsContent.title}
				</h2>
				<p className="mt-2 max-w-xl text-muted-foreground">
					{statsContent.intro}
				</p>
				<ul className="mt-8 grid grid-cols-1 sm:grid-cols-3 sm:divide-x sm:divide-border">
					{statsContent.items.map(({ value, label, Icon }) => (
						<li
							key={label}
							className="flex flex-col items-center gap-2 px-6 py-6 text-center sm:py-2"
						>
							<Icon
								aria-hidden="true"
								className="size-6 text-muted-foreground"
							/>
							<p className="text-4xl font-bold tracking-tight sm:text-5xl">
								{value}
							</p>
							<p className="text-sm font-medium text-muted-foreground uppercase">
								{label}
							</p>
						</li>
					))}
				</ul>
			</div>
		</section>
	)
}
