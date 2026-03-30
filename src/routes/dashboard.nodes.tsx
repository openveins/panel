import { api } from '@/api/client';
import type { ApiResponse } from '@/types/Types';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/nodes')({
    // loader: async ({ }) => {
    //     try {
    //         const { data }: { data: ApiResponse<Location[]> } = await api.get("/api/nodes")
    //         if (!data.success) throw new Error();
    //         return { locations: data.data }
    //     } catch {
    //         throw { locations: null }
    //     }
    // },
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/dashboard/nodes"!</div>
}
