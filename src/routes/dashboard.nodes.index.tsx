import { createFileRoute } from '@tanstack/react-router'
import { DataTable } from '@/components/tables/table'
import { columns, type Node } from "@/components/tables/nodes-table"
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import * as z from "zod"
import { useForm } from '@tanstack/react-form'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

const SAMPLE_NODES: Node[] = [
    { id: "1", name: "eu-east-1", location: "Frankfurt", fqdn: "eu-east-1.openveins.io", port: 8080, memory: 32768, disk: 512000, status: "online", createdAt: "2025-01-15T10:00:00Z", updatedAt: "2026-06-01T08:30:00Z" },
    { id: "2", name: "eu-east-2", location: "London", fqdn: "eu-east-2.openveins.io", port: 8080, memory: 16384, disk: 256000, status: "online", createdAt: "2025-03-20T14:00:00Z", updatedAt: "2026-05-28T12:15:00Z" },
    { id: "3", name: "na-west-1", location: "San Francisco", fqdn: "na-west-1.openveins.io", port: 8080, memory: 65536, disk: 1024000, status: "offline", createdAt: "2025-06-10T09:00:00Z", updatedAt: "2026-04-15T16:45:00Z" },
]

export const Route = createFileRoute('/dashboard/nodes/')({
    component: RouteComponent,
})

const formScheme = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(32, "Name must be at most 32 characters").regex(/^[a-zA-Z0-9_.-]*$/, "Name must be a-z, A-Z, 0-9, _.-"),
    fqdn: z.string().min(1, "FQDN is required"),
    port: z.coerce.number().int().min(1).max(65535),
    memory: z.coerce.number().int().min(1, "Memory must be at least 1 MB"),
    disk: z.coerce.number().int().min(1, "Disk must be at least 1 MB"),
})

function RouteComponent() {
    const form = useForm({
        defaultValues: {
            name: "",
            fqdn: "",
            port: 8080,
            memory: 0,
            disk: 0,
        },
        validators: {
            //@ts-expect-error
            onSubmit: formScheme
        },
        onSubmit: async ({ value }) => {
            console.log(value)
        }
    })

    return (
        <div>
            <Dialog>
                <div className='w-full bg-secondary p-2 flex items-center gap-2'>
                    <p>Nodes</p>
                    <p className='text-xs text-zinc-600'>used for managing server nodes.</p>
                    <DialogTrigger asChild>
                        <Button className='ml-auto'>Create new</Button>
                    </DialogTrigger>
                </div>
                <DataTable columns={columns} data={SAMPLE_NODES} />

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New node</DialogTitle>
                        <DialogDescription>Register a new node to host servers.</DialogDescription>
                    </DialogHeader>
                    <div>
                        <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }} id="nodes-create" className='flex flex-col gap-5'>
                            <FieldGroup>
                                <form.Field
                                    name='name'
                                    children={(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                            <Field>
                                                <FieldLabel htmlFor={field.name}>Node name</FieldLabel>
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => { field.handleChange(e.target.value) }}
                                                    aria-invalid={isInvalid}
                                                    placeholder="eu-east-3"
                                                    autoComplete="off"
                                                />
                                                {isInvalid && (
                                                    <FieldError errors={field.state.meta.errors} />
                                                )}
                                            </Field>
                                        )
                                    }}
                                />
                                <form.Field
                                    name='fqdn'
                                    children={(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                            <Field>
                                                <FieldLabel htmlFor={field.name}>FQDN</FieldLabel>
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => { field.handleChange(e.target.value) }}
                                                    aria-invalid={isInvalid}
                                                    placeholder="eu-east-3.openveins.io"
                                                    autoComplete="off"
                                                />
                                                {isInvalid && (
                                                    <FieldError errors={field.state.meta.errors} />
                                                )}
                                            </Field>
                                        )
                                    }}
                                />
                                <form.Field
                                    name='port'
                                    children={(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                            <Field>
                                                <FieldLabel htmlFor={field.name}>Port</FieldLabel>
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    type="number"
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => { field.handleChange(e.target.valueAsNumber) }}
                                                    aria-invalid={isInvalid}
                                                    placeholder="8080"
                                                    autoComplete="off"
                                                />
                                                {isInvalid && (
                                                    <FieldError errors={field.state.meta.errors} />
                                                )}
                                            </Field>
                                        )
                                    }}
                                />
                                <form.Field
                                    name='memory'
                                    children={(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                            <Field>
                                                <FieldLabel htmlFor={field.name}>Memory (MB)</FieldLabel>
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    type="number"
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => { field.handleChange(e.target.valueAsNumber) }}
                                                    aria-invalid={isInvalid}
                                                    placeholder="32768"
                                                    autoComplete="off"
                                                />
                                                {isInvalid && (
                                                    <FieldError errors={field.state.meta.errors} />
                                                )}
                                            </Field>
                                        )
                                    }}
                                />
                                <form.Field
                                    name='disk'
                                    children={(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                            <Field>
                                                <FieldLabel htmlFor={field.name}>Disk (MB)</FieldLabel>
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    type="number"
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => { field.handleChange(e.target.valueAsNumber) }}
                                                    aria-invalid={isInvalid}
                                                    placeholder="512000"
                                                    autoComplete="off"
                                                />
                                                {isInvalid && (
                                                    <FieldError errors={field.state.meta.errors} />
                                                )}
                                            </Field>
                                        )
                                    }}
                                />
                            </FieldGroup>
                            <Button type='submit'>Create</Button>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
