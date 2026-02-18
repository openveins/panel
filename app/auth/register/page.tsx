"use client"

import { useFeatures } from "@/components/context/AppConfigContext";
import { useAuth } from "@/components/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Turnstile } from "@marsidev/react-turnstile";
import { useForm } from "@tanstack/react-form";
import { Eye, EyeClosed, UserLock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod"

const passwordSchema =
    z.string()
        .min(16, "The password must be atleast 16 characters long.")
        .max(128, "The password must be atmost 128 characters long.")
        .refine((password) => /[A-Z]/.test(password), {
            error: "The password must have atleast one uppercase letter"
        })
        .refine((password) => /[a-z]/.test(password), {
            error: "The password must have atleast one lowercase letter"
        })
        .refine((password) => /[0-9]/.test(password), {
            error: "The password must have atleast one number"
        })
        .refine((password) => /[!@#$%^&*]/.test(password), {
            error: "The password must have atleast one special character."
        })

const schema: any = z.object({
    username: z.string().min(3, "The username must be atleast 3 characters long.").max(16, "The username must be atmost 16 characters long."),
    email: z.email("Email is required"),
    password: passwordSchema,
    confirmPassword: z.string(),
    captchaToken: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    error: "The passwords don't match!",
    path: ["confirmPassword"]
})

export default function RegisterPage() {

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [captchaError, setCaptchaError] = useState<boolean>(false);

    // TODO: Fix this nonesense.
    //@ts-expect-error
    const { turnstileEnabled, turnstileSiteKey, signupEnabled } = useFeatures();
    //@ts-expect-error
    const {register} = useAuth();

    if(!signupEnabled){
        return(
            <div className="w-full min-h-screen flex items-center justify-center">
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <UserLock />
                        </EmptyMedia>
                        <EmptyTitle>Sign ups</EmptyTitle>
                        <EmptyDescription>Sign ups are disabled by the instance administrator.</EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        If you already have an account
                        <Button asChild><Link href={"/auth/login"}>Login</Link></Button>
                    </EmptyContent>
                </Empty>
            </div>
        )
    }

    const form = useForm({
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            captchaToken: ""
        },
        validators: {
            onSubmit: schema,
        },
        onSubmit: async ({ value }) => {
            setLoading(true);
            // fetch("/api/auth/register", {method: "POST", body: JSON.stringify(value), headers: {"Content-Type": "application/json"}
            // }).then((res) => res.json()).then((data) => {
            //     setLoading(false);
            //     toast(data.message)
            // })

            await register(value.username, value.email, value.password, value.captchaToken);
            setLoading(false);

        }
    })

    return (
        <div className="min-h-screen w-full flex items-center justify-center">
            <Card className="w-96">
                <CardHeader className="text-lg text-center">
                    <CardTitle>Welcome to OpenVeins!</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="flex flex-col justify-center w-full gap-2" onSubmit={(e) => {
                        e.preventDefault()
                        form.handleSubmit()
                    }}>
                        <FieldGroup >
                            <form.Field
                                name="username"
                                children={(field) => {
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                                            <Input
                                                name={field.name}
                                                id={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                placeholder="User2135"
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
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    name={field.name}
                                                    id={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    aria-invalid={isInvalid}
                                                    type={showPassword ? "text" : "password"}
                                                />
                                                <Button type="button" onClick={() => {setShowPassword(!showPassword)}} variant={"ghost"}>{!showPassword ? <Eye/> : <EyeClosed/>}</Button>
                                            </div>
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
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                                            <Input
                                                name={field.name}
                                                id={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                type="password"
                                            />
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    )
                                }}
                            />
                            {turnstileEnabled &&
                                <form.Field name="captchaToken"
                                    children={(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                            <Turnstile 
                                                id={field.name} 
                                                onBlur={field.handleBlur} 
                                                aria-invalid={isInvalid} 
                                                siteKey={turnstileSiteKey} 
                                                options={{ size: "flexible" }} 
                                                onSuccess={(e) => { field.setValue(e) }}
                                                onError={() => {setCaptchaError(true)}} 
                                                />
                                        )
                                    }}
                                />
                            }
                        </FieldGroup>
                        {captchaError && <p className="text-xs text-red-700">It seems like the captcha failed or had some other problem. Please refresh the page.</p>}
                        <Button className="w-full" type="submit">{isLoading? <Spinner/> : "Register"}</Button>
                    </form>
                </CardContent>
                <CardFooter>
                    <Link href={"/auth/login"} className="underline duration-200 text-primary hover:text-primary/80">Login?</Link>
                </CardFooter>
            </Card>
        </div>
    )
}
