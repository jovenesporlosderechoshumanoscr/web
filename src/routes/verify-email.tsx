import { createFileRoute, Link } from '@tanstack/react-router'
import * as z from 'zod'

import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FieldDescription, FieldGroup } from "@/components/ui/field"

const verifyEmailSearchSchema = z.object({
	error: z.string().optional(),
})

export const Route = createFileRoute('/verify-email')({
	validateSearch: verifyEmailSearchSchema,
	component: RouteComponent,
})

const ERROR_MESSAGES: Record<string, string | undefined> = {
	TOKEN_EXPIRED: 'El enlace ha caducado. Solicita uno nuevo.',
	INVALID_TOKEN: 'El enlace no es válido.',
	USER_NOT_FOUND: 'No se encontró el usuario asociado a este enlace.',
	INVALID_USER: 'Este enlace no corresponde a tu sesión actual.',
}

function RouteComponent() {
	const { error } = Route.useSearch()
	const success = !error

	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
			<Card className="w-full max-w-sm p-0">
				<CardContent className="p-6">
					<FieldGroup>
						<div className="flex flex-col items-center gap-2 text-center">
							<h1 className="text-2xl font-bold">
								{success ? 'Correo verificado' : 'No se pudo verificar'}
							</h1>
							<p className="text-balance text-muted-foreground">
								{success
									? 'Tu correo electrónico ha sido confirmado. Ya puedes iniciar sesión.'
									: (error && ERROR_MESSAGES[error]) ??
									'El enlace de verificación no es válido o ha caducado.'}
							</p>
						</div>
						{success ? (
							<Link to="/login" className={buttonVariants()}>
								Ir al login
							</Link>
						) : (
							<Link to="/resend-verification" className={buttonVariants()}>
								Solicitar nuevo enlace
							</Link>
						)}
					</FieldGroup>
				</CardContent>
			</Card>
			<FieldDescription className="px-6 text-center">
				{success ? (
					<>¿Ya tienes cuenta? <Link to="/login" className="underline underline-offset-2 hover:underline">Inicia sesión</Link></>
				) : (
					<>¿Necesitas ayuda? <Link to="/login" className="underline underline-offset-2 hover:underline">Volver al login</Link></>
				)}
			</FieldDescription>
		</div>
	)
}
