import { api } from '@/api/client';
import { DataTable } from '@/components/tables/table';
import type { ApiResponse } from '@/types/Types';
import { columns, type User } from "@/components/tables/users-table"
import { createFileRoute } from '@tanstack/react-router'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/dashboard/users/')({
    loader: async ({ }) => {
        try {
            const { data }: { data: ApiResponse<User[]> } = await api.get("/api/users")
            if (!data.success) throw new Error();
            return { users: data.data }
        } catch {
            throw { users: null }
        }
    },
    component: RouteComponent,
})

function RouteComponent() {

    const { users } = Route.useLoaderData();
    return (
        <div>
            <Dialog>
                <div className='w-full bg-secondary p-2 flex items-center gap-2'>
                    <p>Users</p>
                    <p className='text-xs text-zinc-600'>used for managing user accounts and their access.</p>
                    <DialogTrigger asChild>
                        <Button className='ml-auto'>Create new</Button>
                    </DialogTrigger>
                </div>
                <DataTable columns={columns} data={users} />

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create new user</DialogTitle>
                        <DialogDescription>Create an invite link for the new user.</DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}
