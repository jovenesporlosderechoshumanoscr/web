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
import { toast } from "sonner"

const formSchema = z.object({
	email: z
		.email(),
	password: z
		.string()
		.min(5, "Password must be at least 5 characters.")
		.max(32, "Password must be at most 32 characters."),
})

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {



	const form = useForm({
		defaultValues: {
			email: '',
			password: '',
		},
		validators: {
			onSubmit: formSchema,
		},

		onSubmit: async ({ value }) => {

			try {
				await authClient.signIn.email(
					{
						email: value.email,
						password: value.password,
						callbackURL: '/admin/panel',
					},
					{
						onSuccess: () => {
							toast.success('Acceso autorizado')
						},
						onError: (ctx) => {
							if (ctx.error.status === 403) {
								toast.error('Verificación de correo requerida')
								return
							}
							toast.error('Credenciales inválidas')
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
							<h1 className="text-2xl font-bold">Welcome back</h1>
							<p className="text-balance text-muted-foreground">
								Login to your Acme Inc account
							</p>
						</div>
						<form
							id="login-form"
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
							<form.Field
								name="password"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid
									return (

										<Field data-invalid={isInvalid}>
											<div className="flex items-center">
												<FieldLabel htmlFor="password">Password</FieldLabel>
												<a
													href="#"
													className="ml-auto text-sm underline-offset-2 hover:underline"
												>
													Forgot your password?
												</a>
											</div>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="enter secure password please..."
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
								<Button type="submit">Login</Button>
							</Field>
							<FieldDescription className="text-center">
								Don&apos;t have an account? <a href="#">Sign up</a>
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
