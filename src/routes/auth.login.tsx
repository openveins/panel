import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router'
import * as z from "zod"
import { useForm, useStore } from "@tanstack/react-form"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Turnstile } from "@marsidev/react-turnstile"
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/contexts/auth-context';

export const Route = createFileRoute('/auth/login')({
	component: RouteComponent,
})

const formSchema = z.object({
	email: z.email("Email is required"),
	password: z.string("Password is required").min(16).max(128),
	captcha: z.string()
})

function RouteComponent() {

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [captchaError, setCaptchaError] = useState<boolean>(false);

	const { config } = useLoaderData({ from: "/auth" })
	const { login } = useAuth();

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			captcha: ""
		},
		validators: {
			onSubmit: formSchema
		},
		onSubmit: async ({ value }) => {
			setIsLoading(true);
			await login(value.email, value.password, value.captcha);
			setIsLoading(false);
		}
	})
	if (config == null) {
		return (
			<div>
				An error occured while fetching features.
			</div>
		)
	}

	const isCaptchaSet = useStore(form.store, (state) => state.values.captcha);

	return (
		<div className='min-h-screen w-full flex items-center justify-center'>
			<Card className='w-96'>
				<CardHeader className='text-lg text-center'>
					<CardTitle>Welcome to OpenVeins!</CardTitle>
				</CardHeader>
				<CardContent>
					<form className='flex flex-col justify-center w-full gap-2'
						onSubmit={(e) => {
							e.preventDefault()
							form.handleSubmit()
						}}>
						<FieldGroup>
							<form.Field
								name="email"
								children={(field) => {
									const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Email</FieldLabel>
											<Input
												name={field.name}
												id={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder="me@acme.com"
												type="email"
												disabled={isLoading}
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
									const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Password</FieldLabel>
											<Input
												name={field.name}
												id={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												type="password"
												disabled={isLoading}

											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									)
								}}
							/>
							{(config.turnstileEnabled) &&
								<form.Field name="captcha"
									children={(field) => {
										const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
										return (
											<Turnstile
												id={field.name}
												onBlur={field.handleBlur}
												aria-invalid={isInvalid}
												siteKey={config.turnstileSiteKey}
												options={{ size: "flexible" }}
												onSuccess={(e) => { field.setValue(e) }}
												onError={() => { setCaptchaError(true) }}
											/>
										)
									}}
								/>
							}
						</FieldGroup>
						{captchaError && <p className="text-xs text-red-700">It seems like the captcha failed or had some other problem. Please refresh the page.</p>}
						<Button type='submit' disabled={(isCaptchaSet == "" && config.turnstileEnabled) || isLoading}>{(config.turnstileEnabled && isCaptchaSet == "") || isLoading ? <Spinner /> : "Login"}</Button>
					</form>
				</CardContent>
				{config.signupEnabled &&
					<CardFooter>
						<Link to={"/auth/register"} className="underline duration-200 text-primary hover:text-primary/80">Register?</Link>
					</CardFooter>
				}
			</Card>
		</div>
	)
}
