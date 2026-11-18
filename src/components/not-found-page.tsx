import { Link } from '@tanstack/react-router'

import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FieldDescription, FieldGroup } from '@/components/ui/field'

/**
 * Página genérica para rutas no encontradas (404).
 * Se muestra vía `notFoundComponent` en el root route.
 */
export function NotFoundPage() {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
			<Card className="w-full max-w-sm p-0">
				<CardContent className="p-6">
					<FieldGroup>
						<div className="flex flex-col items-center gap-2 text-center">
							<p className="text-5xl font-bold text-muted-foreground">404</p>
							<h1 className="text-2xl font-bold">Página no encontrada</h1>
							<p className="text-balance text-muted-foreground">
								La página que buscas no existe o fue movida.
							</p>
						</div>
						<Link to="/" className={buttonVariants()}>
							Volver al inicio
						</Link>
					</FieldGroup>
				</CardContent>
			</Card>
			<FieldDescription className="px-6 text-center">
				¿Necesitas ayuda? <Link to="/contact" className="underline underline-offset-2 hover:underline">Contáctanos</Link>
			</FieldDescription>
		</div>
	)
}
