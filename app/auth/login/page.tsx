"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod"

const formScheme = z.object({
    email: z.email("Email is required"),
    password: z.string()
})

export default function LoginPage() {

    const [isLoading, setLoading] = useState<boolean>(false);

    const form = useForm({
        defaultValues: {
            email: "",
            password: ""
        },
        validators: {
            onSubmit: formScheme,
        },
        onSubmit: async ({ value }) => {
            setLoading(true);
            console.log(value);
            toast("You submitted the following values:", {
                description: (
                    <pre className="bg-foreground text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
                        <code>{JSON.stringify(value, null, 2)}</code>
                    </pre>
                ),
                position: "bottom-right",
                classNames: {
                    content: "flex flex-col gap-2",
                },
                style: {
                    "--border-radius": "calc(var(--radius)  + 4px)",
                } as React.CSSProperties,
            })
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
                        </FieldGroup>
                        <Button type="submit">{isLoading ? <Spinner/> : "Login" }</Button>
                    </form>
                </CardContent>
                                <CardFooter>
                    <Link href={"/auth/register"} className="underline duration-200 text-primary hover:text-primary/80">Register?</Link>
                </CardFooter>
            </Card>
        </div>
    )
}