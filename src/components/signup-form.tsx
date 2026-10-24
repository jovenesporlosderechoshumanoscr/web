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

const formSchema = z
	.object({
		name: z
			.string()
			.trim()
			.min(1, "El nombre es requerido")
			.max(100),
		email: z
			.email("Ingresa un correo válido."),
		password: z
			.string()
			.min(8, "La contraseña debe tener al menos 8 caracteres.")
			.max(128, "La contraseña debe tener como máximo 128 caracteres."),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Las contraseñas no coinciden.",
		path: ["confirmPassword"],
	})

export function SignupForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const navigate = useNavigate()

	const form = useForm({
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
		validators: {
			onSubmit: formSchema,
			onBlur: formSchema,
		},

		onSubmit: async ({ value }) => {
			try {
				await authClient.signUp.email(
					{
						name: value.name.trim(),
						email: value.email,
						password: value.password,
						callbackURL: '/student',
					},
					{
						onSuccess: () => {
							toast.success('Cuenta creada. Revisa tu correo para verificarla.')
							navigate({ to: '/login' })
						},
						onError: (ctx) => {
							if (ctx.error.status === 422) {
								toast.error('Ese correo ya está registrado')
								return
							}
							toast.error('No se pudo crear la cuenta')
						},
					}
				)
			} catch (error) {
				toast.error('Error del sistema')
			}
		},
	})

	return (

		<div className={cn("flex w-full flex-col gap-6", className)} {...props}>
			<Card className="overflow-hidden p-0">
				<CardContent className="grid p-0 md:grid-cols-2">
					<FieldGroup className="p-6 md:p-8">
						<div className="flex flex-col items-center gap-2 text-center">
							<h1 className="text-2xl font-bold">Crear cuenta</h1>
							<p className="text-balance text-muted-foreground">
								Regístrate para acceder a la zona de estudiantes
							</p>
						</div>
						<form
							id="signup-form"
							onSubmit={(e) => {
								e.preventDefault()
								form.handleSubmit()
							}}
						>
							<form.Field
								name="name"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor="name">Nombre</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Tu nombre"
												className=""
												aria-invalid={isInvalid}
												type="text"
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
							<form.Field
								name="password"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid
									return (

										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor="password">Contraseña</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Mínimo 8 caracteres"
												className=""
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
											<FieldLabel htmlFor="confirmPassword">Confirmar contraseña</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Repite tu contraseña"
												className=""
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
								<Button className="mt-4" type="submit">Crear cuenta</Button>
							</Field>
							<FieldDescription className="text-center">
								¿Ya tienes cuenta? <Link to="/login" className="underline underline-offset-2 hover:underline">Inicia sesión</Link>
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
				By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
				and <a href="#">Privacy Policy</a>.
			</FieldDescription>
		</div >
	)
}
