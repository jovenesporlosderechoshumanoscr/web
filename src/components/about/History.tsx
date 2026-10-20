
export const historyContent = {
	eyebrow: 'Nuestra historia',
	title: 'De un grupo de jóvenes a una red de justicia',
	paragraphs: [
		'En el año 2011, nuestro país recibe la visita de la educadora Dra. Mary Shuttleworth, Fundadora y Presidenta de Youth for Human Rights International (YHRI); en su octava gira educativa mundial, con la cual dio la vuelta al mundo, mantuvo aquí diversas reuniones en diferentes centros de enseñanza y en especial con abogados, representantes de la policía, ONG’s, líderes religiosos, educadores y estudiantes, en la sede central del Colegio de Abogados en San José para discutir temas, programas y colaboraciones locales de derechos humanos. Las reuniones con los miembros del Congreso y la comisión de derechos humanos fueron seguidas de entrevistas por televisión en las que se destacó la necesidad de educación en derechos humanos.',
		'En 2015 nos constituimos formalmente como organización y abrimos nuestra primera sede. Desde entonces hemos crecido junto a las comunidades que servimos, manteniendo la escucha y la memoria como centro de nuestro trabajo.',
	],
	image: {
		src: 'https://placehold.co/800x1000',
		alt: 'Integrantes de JPDH reunidos en asamblea comunitaria',
	},
} as const

export default function History() {
	return (
		<section
			aria-labelledby="history-title"
			id="historia"
			className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24"
		>
			<div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14">
				<div>
					<p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
						{historyContent.eyebrow}
					</p>
					<h2
						id="history-title"
						className="mt-3 text-3xl font-bold tracking-tight uppercase sm:text-4xl"
					>
						{historyContent.title}
					</h2>
					{historyContent.paragraphs.map((paragraph) => (
						<p key={paragraph.slice(0, 24)} className="mt-5 text-muted-foreground">
							{paragraph}
						</p>
					))}
									</div>
				<div>
					<img
						src={historyContent.image.src}
						alt={historyContent.image.alt}
						loading="lazy"
						className="aspect-[4/5] w-full rounded-2xl object-cover"
					/>
				</div>
			</div>
		</section>
	)
}
