import {
	IconBook,
	IconBooks,
	IconBuilding,
	IconHeartHandshake,
	IconHistory,
	IconMan,
} from '@tabler/icons-react'

export const statsContent = {
	title: 'Nuestro impacto',
	intro: '15 años apoyando y colaborando con docentes, estudiantes e instituciones que han sido parte de nuestra mision',
	items: [
		{
			value: '15',
			label: 'años de trabajo en Costa Rica',
			Icon: IconHistory,
		},
		{
			value: '+3.056.612',
			label: 'personas alcanzadas',
			Icon: IconHeartHandshake,
		},
		{
			value: '+1.229',
			label: 'Seminarios y talleres impartidos',
			Icon: IconBuilding,
		},
		{
			value: '+35.694',
			label: 'Personas educadas en derechos humanos',
			Icon: IconBook,
		},
		{
			value: '+1.745',
			label: 'Docentes capacitados',
			Icon: IconMan,
		},
		{
			value: '+66.261',
			label: 'Material educativo distribuido',
			Icon: IconBooks,
		}
	],
} as const

export default function Stats() {
	return (
		<section aria-label="Nuestro impacto" className="border-y ">
			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
				<h2 className="text-2xl font-bold tracking-tight uppercase sm:text-3xl">
					{statsContent.title}
				</h2>
				<p className="mt-2 max-w-xl text-muted-foreground">
					{statsContent.intro}
				</p>
				<ul className="mt-8 grid grid-cols-1 sm:grid-cols-3">
					{statsContent.items.map(({ value, label, Icon }) => (
						<li
							key={label}
							className="flex flex-col items-center gap-2 px-6 py-6 text-center sm:border-l sm:border-border sm:[&:nth-child(3n+1)]:border-l-0"
						>
							<Icon aria-hidden="true" className="size-6 text-muted-foreground" />
							<p className="text-4xl font-bold tracking-tight sm:text-5xl">{value}</p>
							<p className="text-sm font-medium text-muted-foreground uppercase">{label}</p>
						</li>
					))}
				</ul>
			</div>
		</section>
	)
}
