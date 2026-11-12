import Footer from '@/components/landing/Footer'
import Header from '@/components/landing/Header'
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FieldDescription, FieldGroup } from "@/components/ui/field"
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import * as z from 'zod'

/**
 * Página de aterrizaje del doble opt-in del boletín. Brevo redirige aquí tras
 * la confirmación (`BREVO_DOI_REDIRECT_URL`); el estado viaja en el query
 * param `status`.
 */
const newsletterSearchSchema = z.object({
	status: z.enum(['ok', 'error']).optional(),
})

export const Route = createFileRoute('/newsletter')({
	validateSearch: newsletterSearchSchema,
	head: () => ({
		meta: [{ title: 'Boletín — JPDH' }],
	}),
	beforeLoad: async ({ search }) => {
		// Sin estado de confirmación no hay nada que mostrar aquí.
		if (!search.status) {
			throw redirect({ to: '/' })
		}
	},
	component: RouteComponent,
})

function RouteComponent() {
	const { status } = Route.useSearch()
	const success = status === 'ok'

	return (
		<div className="flex min-h-svh flex-col bg-background text-foreground">
			<Header />
			<main className="flex flex-1 flex-col items-center justify-center gap-6 p-6 md:p-10">
				<Card className="w-full max-w-sm p-0">
					<CardContent className="p-6">
						<FieldGroup>
							<div className="flex flex-col items-center gap-2 text-center">
								<h1 className="text-2xl font-bold">
									{success ? 'Suscripción confirmada' : 'No se pudo confirmar'}
								</h1>
								<p className="text-balance text-muted-foreground">
									{success
										? 'Tu suscripción al boletín fue confirmada. Recibirás las próximas novedades en tu correo.'
										: 'No se pudo confirmar tu suscripción al boletín. Inténtalo de nuevo desde el formulario de la página principal.'}
								</p>
							</div>
							<Link to="/" className={buttonVariants()}>
								Volver al inicio
							</Link>
						</FieldGroup>
					</CardContent>
				</Card>
				<FieldDescription className="px-6 text-center">
					¿Ya no quieres recibirla? Puedes darte de baja desde el enlace
					&quot;Cancelar suscripción&quot; al final de cada boletín.
				</FieldDescription>
			</main>
			<Footer />
		</div>
	)
}
