import { api } from '@/api/client';
import { DataTable } from '@/components/tables/table';
import { createFileRoute } from '@tanstack/react-router'
import { columns, type Location } from "@/components/tables/locations-table"
import type { ApiResponse } from '@/types/Types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import * as z from "zod"
import { useForm } from '@tanstack/react-form';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useDashboard } from '@/contexts/dashboard-context';

export const Route = createFileRoute('/dashboard/locations/')({
    loader: async ({}) => {
        try {
            const { data }: { data: ApiResponse<Location[]> } = await api.get("/api/locations")
            if (!data.success) throw new Error();
            return { locations: data.data }
        } catch {
            throw { locations: null }
        }
    },
    component: RouteComponent,
})

const formScheme = z.object({
    name: z.string().min(3, "Short code must be atleast 3 characters long").max(16, "Short code must be atmost 16 characters long").regex(/^[a-zA-Z0-9_.-]*$/, "Short code must be a-z, A-Z, 0-9, _.-"),
    description: z.string().optional().or(z.literal(""))
})

function RouteComponent() {

    const {createLocation} = useDashboard();

    const form = useForm({
        defaultValues: {
            name: "",
            description: ""
        },
        validators: {
            //@ts-expect-error
            onSubmit: formScheme
        },
        onSubmit: async ({ value }) => {
            console.log(value);
            await createLocation(value);
        }
    })


    const { locations } = Route.useLoaderData();

    return (
        <div>
            <Dialog>
                <div className='w-full bg-secondary p-2 flex items-center gap-2'>
                    <p>Locations</p>
                    <p className='text-xs text-zinc-600'>used for organizing nodes</p>
                    <DialogTrigger asChild>
                        <Button className='ml-auto'>Create new</Button>
                    </DialogTrigger>
                </div>
                <DataTable columns={columns} data={locations} />

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New location</DialogTitle>
                        <DialogDescription>Create a new location when provisioning new hardware.</DialogDescription>
                    </DialogHeader>
                    <div>
                        <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }} id="locations-create" className='flex flex-col gap-5'>
                            <FieldGroup>
                                <form.Field
                                    name='name'
                                    children={(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                            <Field>
                                                <FieldLabel htmlFor={field.name}>Location short name</FieldLabel>
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => { field.handleChange(e.target.value) }}
                                                    aria-invalid={isInvalid}
                                                    placeholder="us.east.2"
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
                                    name='description'
                                    children={(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                            <Field>
                                                <FieldLabel htmlFor={field.name}>Location description</FieldLabel>
                                                <Textarea
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => { field.handleChange(e.target.value) }}
                                                    aria-invalid={isInvalid}
                                                    placeholder="IP - xxx.xxx.xxx.xxx, LOCATION - US"
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
