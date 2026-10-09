import { ResetPasswordForm } from '@/components/reset-password-form'
import { createFileRoute, Link } from '@tanstack/react-router'
import * as z from 'zod'

import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FieldDescription, FieldGroup } from "@/components/ui/field"

const resetPasswordSearchSchema = z.object({
	token: z.string().optional(),
	error: z.string().optional(),
})

export const Route = createFileRoute('/reset-password')({
	validateSearch: resetPasswordSearchSchema,
	component: RouteComponent,
})

const ERROR_MESSAGES: Record<string, string | undefined> = {
	INVALID_TOKEN: 'El enlace no es válido.',
	TOKEN_EXPIRED: 'El enlace ha caducado. Solicita uno nuevo.',
}

function RouteComponent() {
	const { token, error } = Route.useSearch()

	if (!token) {
		return (
			<div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
				<Card className="w-full max-w-sm p-0">
					<CardContent className="p-6">
						<FieldGroup>
							<div className="flex flex-col items-center gap-2 text-center">
								<h1 className="text-2xl font-bold">Enlace no válido</h1>
								<p className="text-balance text-muted-foreground">
									{(error && ERROR_MESSAGES[error]) ??
										'Falta el token de recuperación. Revisa el enlace de tu correo o solicita uno nuevo.'}
								</p>
							</div>
							<Link to="/forgot-password" className={buttonVariants()}>
								Solicitar nuevo enlace
							</Link>
						</FieldGroup>
					</CardContent>
				</Card>
				<FieldDescription className="px-6 text-center">
					<>¿Recordaste tu contraseña? <Link to="/login" className="underline underline-offset-2 hover:underline">Inicia sesión</Link></>
				</FieldDescription>
			</div>
		)
	}

	return (
		<div>
			<ResetPasswordForm token={token} />
		</div>
	)
}
