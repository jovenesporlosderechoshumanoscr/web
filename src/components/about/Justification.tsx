export const justificationContent = {
	eyebrow: 'Justificación',
	title: 'Por qué existe JPDH',
	quote: 'La justicia no es solo un derecho: es una condición para vivir con dignidad.',
	paragraphs: [
		'En los territorios donde trabajamos, el acceso a la justicia es desigual: la distancia, los costos y la falta de información cierran puertas a las personas que más lo necesitan. JPDH surge para abrir esas puertas.',
		'Nuestro trabajo responde a una necesidad real y sostenida: acompañar a quienes enfrentan vulneraciones de derechos y fortalecer a las comunidades para que puedan defenderse por sí mismas.',
	],
} as const

export default function Justification() {
	return (
		<section
			aria-labelledby="justification-title"
			id="justificacion"
			className="border-y bg-muted"
		>
			<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
				<div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
					<div>
						<p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
							{justificationContent.eyebrow}
						</p>
						<h2
							id="justification-title"
							className="mt-3 text-3xl font-bold tracking-tight uppercase sm:text-4xl"
						>
							{justificationContent.title}
						</h2>
						<blockquote className="mt-6 border-l-4 border-primary pl-4 text-lg font-medium italic text-foreground">
							{justificationContent.quote}
						</blockquote>
					</div>
					<div className="flex flex-col gap-4">
						{justificationContent.paragraphs.map((paragraph) => (
							<p key={paragraph.slice(0, 24)} className="text-muted-foreground">
								{paragraph}
							</p>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}
