import { IconBrandWhatsapp, IconMail, IconMapPin, IconPhone } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

export const contactContent = {
	eyebrow: 'Contacto',
	title: 'Hablemos',
	intro:
		'Estamos disponibles para acompañarte, resolver dudas y construir alianzas. Escríbenos por cualquiera de estos medios.',
	channels: [
		{
			title: 'Correo electrónico',
			value: 'contacto@jpdh.org',
			description: 'Para consultas generales e información.',
			href: 'mailto:contacto@jpdh.org',
			Icon: IconMail,
		},
		{
			title: 'Dirección',
			value: 'Calle 21, entre Avenidas 2 y 6 San José. 10104 COSTA RICA',
			description: 'Visítanos en nuestra sede principal.',
			href: null,
			Icon: IconMapPin,
		},
		{
			title: 'Teléfono',
			value: '+506 2221-8965',
			description: 'Llámanos en horario de oficina.',
			href: 'tel:50622218965',
			Icon: IconPhone,
		},
		{
			title: 'WhatsApp',
			value: '+506 8358-9052',
			description: 'Escríbenos por WhatsApp.',
			href: 'https://wa.me/50683589052',
			Icon: IconBrandWhatsapp,
		},
	],
	whatsappCta: {
		label: 'Escríbenos por WhatsApp',
		href: 'https://wa.me/50683589052',
	},
} as const

export default function ContactChannels() {
	return (
		<section
			aria-labelledby="contact-title"
			id="contacto"
			className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24"
		>
			<div className="mx-auto max-w-2xl text-center">
				<p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
					{contactContent.eyebrow}
				</p>
				<h2
					id="contact-title"
					className="mt-3 text-3xl font-bold tracking-tight uppercase sm:text-4xl"
				>
					{contactContent.title}
				</h2>
				<p className="mt-4 text-muted-foreground">{contactContent.intro}</p>
				<div className="mt-8">
					<a href={contactContent.whatsappCta.href} target="_blank" rel="noreferrer">
						<Button size="lg">
							<IconBrandWhatsapp aria-hidden="true" />
							{contactContent.whatsappCta.label}
						</Button>
					</a>
				</div>
			</div>
			<div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
				{contactContent.channels.map(({ title, value, description, href, Icon }) => (
					<Card key={title}>
						<CardHeader>
							<span className="flex size-10 items-center justify-center rounded-xl bg-muted">
								<Icon aria-hidden="true" className="size-5" />
							</span>
							<CardTitle>{title}</CardTitle>
							<CardDescription>{description}</CardDescription>
						</CardHeader>
						<CardContent>
							{href ? (
								<a
									href={href}
									target={href.startsWith('http') ? '_blank' : undefined}
									rel={href.startsWith('http') ? 'noreferrer' : undefined}
									className="text-base font-semibold underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
								>
									{value}
								</a>
							) : (
								<span className="text-base font-semibold">{value}</span>
							)}
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	)
}
