import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import * as z from "zod"
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { useForm } from "@tanstack/react-form"
import { Link } from "@tanstack/react-router"
import { toast } from "sonner"

const formSchema = z.object({
	email: z
		.email("Introduce un correo electrónico válido."),
})

export function ResendVerificationForm({
	className,
	defaultEmail = '',
	...props
}: React.ComponentProps<"div"> & { defaultEmail?: string }) {

	const form = useForm({
		defaultValues: {
			email: defaultEmail,
		},
		validators: {
			onSubmit: formSchema,
		},

		onSubmit: async ({ value }) => {

			try {
				await authClient.sendVerificationEmail(
					{
						email: value.email,
						callbackURL: '/verify-email',
					},
					{
						onSuccess: () => {
							toast.success('Correo de verificación enviado')
						},
						onError: () => {
							toast.error('No se pudo enviar el correo')
						},
					}
				)
			} catch (error) {
				toast.error('Error del sistema')
			}
		},
	})

	return (

		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card className="overflow-hidden p-0">
				<CardContent className="grid p-0 md:grid-cols-2">
					<FieldGroup>
						<div className="flex flex-col items-center gap-2 text-center">
							<h1 className="text-2xl font-bold">Verifica tu correo</h1>
							<p className="text-balance text-muted-foreground">
								Te enviaremos un enlace para confirmar tu cuenta
							</p>
						</div>
						<form
							id="resend-verification-form"
							onSubmit={(e) => {
								e.preventDefault()
								form.handleSubmit()
							}}
						>
							<form.Field
								name="email"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor="email">Email</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="m@example.com"
												className=""
												aria-invalid={isInvalid}
												type="email"
												required
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									)
								}}
							/>

							<Field>
								<Button type="submit">Enviar enlace</Button>
							</Field>
							<FieldDescription className="text-center">
								¿Ya verificaste tu correo? <Link to="/login" className="underline underline-offset-2 hover:underline">Inicia sesión</Link>
							</FieldDescription>
						</form>
					</FieldGroup>
					<div className="relative hidden bg-muted md:block">
						<img
							src="/placeholder.svg"
							alt="Image"
							className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
						/>
					</div>
				</CardContent>
			</Card >
			<FieldDescription className="px-6 text-center">
				El enlace de verificación caduca en 1 hora.
			</FieldDescription>
		</div >
	)
}
