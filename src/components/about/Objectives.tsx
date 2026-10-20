import {
	IconBook,
	IconBriefcase,
	IconGavel,
	IconHeartHandshake,
	IconNetwork,
	IconShieldCheck,
} from '@tabler/icons-react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

export const objectivesContent = {
	eyebrow: 'Nuestros objetivos',
	title: 'Lo que nos mueve',
	items: [
		{
			title: 'Formar liderazgos locales',
			description:
				'Capacitamos a personas y organizaciones para que puedan defender sus derechos por sí mismas.',
			Icon: IconBook,
		},
		{
			title: 'Defender derechos',
			description:
				'Acompañamos casos y procesos legales para hacer efectiva la justicia.',
			Icon: IconGavel,
		},
		{
			title: 'Tejer redes',
			description:
				'Conectamos comunidades, instituciones y aliados para fortalecer la acción colectiva.',
			Icon: IconNetwork,
		},
		{
			title: 'Proteger a víctimas',
			description:
				'Brindamos apoyo integral a quienes han sufrido vulneraciones de derechos.',
			Icon: IconShieldCheck,
		},
		{
			title: 'Generar memoria',
			description:
				'Documentamos historias y aprendizajes para sostener la lucha en el tiempo.',
			Icon: IconBriefcase,
		},
		{
			title: 'Cuidar lo comunitario',
			description:
				'Promovemos el autocuidado y la salud colectiva en cada proceso que acompañamos.',
			Icon: IconHeartHandshake,
		},
	],
} as const

export default function Objectives() {
	return (
		<section
			aria-labelledby="objectives-title"
			id="objetivos"
			className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24"
		>
			<div className="mx-auto max-w-2xl text-center">
				<p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
					{objectivesContent.eyebrow}
				</p>
				<h2
					id="objectives-title"
					className="mt-3 text-3xl font-bold tracking-tight uppercase sm:text-4xl"
				>
					{objectivesContent.title}
				</h2>
			</div>
			<div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{objectivesContent.items.map(({ title, description, Icon }) => (
					<Card key={title}>
						<CardHeader>
							<span className="flex size-10 items-center justify-center rounded-xl bg-muted">
								<Icon aria-hidden="true" className="size-5" />
							</span>
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
