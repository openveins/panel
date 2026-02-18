"use client"

import { useFeatures } from "@/components/context/AppConfigContext";
import { useLogger } from "@/components/context/LoggerContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Turnstile } from "@marsidev/react-turnstile";
import { useForm, useStore } from "@tanstack/react-form";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod"

const formScheme = z.object({
    email: z.email("Email is required"),
    password: z.string(),
    captcha: z.string()
})

export default function LoginPage() {

    const [isLoading, setLoading] = useState<boolean>(false);
    const [captchaError, setCaptchaError] = useState<boolean>(false);
    const [error, setError] = useState<string>("");


    // TODO: Fix this nonesense
    //@ts-ignore
    const {log} = useLogger();


    // TODO: Fix this nonesense
    //@ts-ignore
    const { turnstileEnabled, turnstileSiteKey, signupEnabled } = useFeatures();

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
            captcha: ""
        },
        validators: {
            onSubmit: formScheme,
        },
        onSubmit: async ({ value }) => {
            setLoading(true);

            // Developement only logs.
            log("Sent request",
                    <pre className="bg-foreground text-white w-full p-2">
                        <code>
                            {JSON.stringify(value, null, 2)}
                        </code>
                    </pre> 
                )

            fetch("/api/auth/login", {
                method: "POST", body: JSON.stringify(value), headers: { "Content-Type": "application/json" }
            }).then((res) => res.json()).then((data) => {
                setLoading(false);
                // Developement only logs.
                log("Got response",
                    <pre className="bg-foreground text-white p-2 overflow-auto">
                        <code>
                            {JSON.stringify(data, null, 2)}
                        </code>
                    </pre> 
                )
            })
            

        }
    })

    const isCaptchaSet = useStore(form.store, (state) => state.values.captcha);

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
                                <form.Field name="captcha"
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
                                                onError={(e) => {setCaptchaError(true)}} 
                                                />
                                        )
                                    }}
                                />
                            }
                        </FieldGroup>
                        {captchaError && <p className="text-xs text-red-700">It seems like the captcha failed or had some other problem. Please refresh the page.</p>}
                        <Button type="submit" disabled={isCaptchaSet == ""}>{isLoading ? <Spinner /> : "Login"}</Button>
                    </form>
                </CardContent>
                {signupEnabled && 
                    <CardFooter>
                        <Link href={"/auth/register"} className="underline duration-200 text-primary hover:text-primary/80">Register?</Link>
                    </CardFooter>
                }
            </Card>
        </div>
    )
}