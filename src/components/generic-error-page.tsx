import { Link, type ErrorComponentProps } from '@tanstack/react-router'

import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FieldDescription, FieldGroup } from '@/components/ui/field'

/**
 * Página genérica para errores no capturados.
 * Se muestra vía `errorComponent` en el root route.
 */
export function GenericErrorPage({ reset }: ErrorComponentProps) {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
			<Card className="w-full max-w-sm p-0">
				<CardContent className="p-6">
					<FieldGroup>
						<div className="flex flex-col items-center gap-2 text-center">
							<p className="text-5xl font-bold text-muted-foreground">500</p>
							<h1 className="text-2xl font-bold">Algo salió mal</h1>
							<p className="text-balance text-muted-foreground">
								Ocurrió un error inesperado. Intenta de nuevo o vuelve al inicio.
							</p>
						</div>
						<div className="flex flex-col gap-2">
							<Button onClick={reset}>Reintentar</Button>
							<Link to="/" className={buttonVariants({ variant: 'outline' })}>
								Volver al inicio
							</Link>
						</div>
					</FieldGroup>
				</CardContent>
			</Card>
			<FieldDescription className="px-6 text-center">
				Si el problema persiste, <Link to="/contact" className="underline underline-offset-2 hover:underline">contáctanos</Link>.
			</FieldDescription>
		</div>
	)
}
