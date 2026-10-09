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
import { Link, useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"

const formSchema = z.object({
	password: z
		.string()
		.min(8, "La contraseña debe tener al menos 8 caracteres.")
		.max(128, "La contraseña debe tener como máximo 128 caracteres."),
	confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Las contraseñas no coinciden.",
	path: ["confirmPassword"],
})

export function ResetPasswordForm({
	className,
	token,
	...props
}: React.ComponentProps<"div"> & { token: string }) {
	const navigate = useNavigate()

	const form = useForm({
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
		validators: {
			onSubmit: formSchema,
		},

		onSubmit: async ({ value }) => {
			try {
				await authClient.resetPassword(
					{
						newPassword: value.password,
						token,
					},
					{
						onSuccess: () => {
							toast.success('Contraseña actualizada')
							navigate({ to: '/login' })
						},
						onError: (ctx) => {
							toast.error(ctx.error.message ?? 'El enlace no es válido o ha caducado')
						},
					}
				)
			} catch {
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
							<h1 className="text-2xl font-bold">Nueva contraseña</h1>
							<p className="text-balance text-muted-foreground">
								Elige una contraseña segura para tu cuenta
							</p>
						</div>
						<form
							id="reset-password-form"
							onSubmit={(e) => {
								e.preventDefault()
								form.handleSubmit()
							}}
						>
							<form.Field
								name="password"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor="password">Nueva contraseña</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="••••••••"
												aria-invalid={isInvalid}
												type="password"
												required
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									)
								}}
							/>
							<form.Field
								name="confirmPassword"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor="confirmPassword">Confirma la contraseña</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="••••••••"
												aria-invalid={isInvalid}
												type="password"
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
								<Button type="submit">Cambiar contraseña</Button>
							</Field>
							<FieldDescription className="text-center">
								¿No recibiste el enlace? <Link to="/forgot-password" className="underline underline-offset-2 hover:underline">Solicita uno nuevo</Link>
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
				¿Ya tienes cuenta? <Link to="/login" className="underline underline-offset-2 hover:underline">Inicia sesión</Link>
			</FieldDescription>
		</div >
	)
}
