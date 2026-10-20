export const purposeContent = {
	eyebrow: 'Nuestro propósito',
	title: 'Acompañar la dignidad donde la justicia no llega',
	text: 'Es así que, impulsados por tan ilustre visita,  nace la “Asociación Jóvenes por los Derechos Humanos Costa Rica”, organización sin ánimo de lucro que trabaja en cooperación con la fundación Youth for Human Rights International con el propósito de enseñar derechos humanos, específicamente la Declaración Universal de los Derechos Humanos de la ONU, a todos los habitantes de nuestro país, pero especialmente a los niños y jóvenes, e inspirarlos a que se conviertan en promotores de la tolerancia y la paz. Nuestro propósito se basa en la firme convicción de que la educación es la mejor herramienta para la prevención de la violencia y  la educación en derechos humanos promueve una cultura de respeto y de dignidad para todas las personas. Jóvenes por los Derechos Humanos Costa Rica promueve la diseminación de la Declaración Universal de los Derechos Humanos de la ONU en municipalidades, escuelas, colegios y cualesquiera otras organizaciones públicas y privadas, a través de alianzas estratégicas como la establecida con el Instituto de Fomento y Asesoría Municipal (IFAM), el Colegio de Profesionales en Orientación, Centros Cívicos por la Paz, la Red Costarricense de Mujeres Municipalista – RECOMM, la Asamblea Nacional de la Persona Joven, el Sistema Nacional de Educación Musical, el Patronato Nacional de la Infancia, centros educativos públicos y privados entre otros, y  la Federación Costarricense de Futbol con la que, gracias a la generosa participación de los jugadores de la Selección Nacional de Fútbol Masculina y Femenina, preparamos una edición especial única en el mundo del libro “¿Qué son los Derechos Humanos?”, el cual se repartió en el Estadio Nacional y en centros educativos a lo largo y ancho de nuestro país, alcanzado a más de 130 000 personas.'
} as const

export default function Purpose() {
	return (
		<section
			aria-labelledby="purpose-title"
			id="proposito"
			className="border-y bg-muted"
		>
			<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
				<div className="mx-auto max-w-3xl text-center">
					<p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
						{purposeContent.eyebrow}
					</p>
					<h2
						id="purpose-title"
						className="mt-3 text-3xl font-bold tracking-tight uppercase sm:text-4xl"
					>
						{purposeContent.title}
					</h2>
					<p className="mt-6 text-lg text-muted-foreground">
						{purposeContent.text}
					</p>
				</div>
			</div>
		</section>
	)
}
