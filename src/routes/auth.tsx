import { api } from '@/api/client';
import type { ApiResponse } from '@/types/Types';
import { createFileRoute, Outlet } from '@tanstack/react-router'

interface ConfigResponse {
	message: string,
	signupEnabled: boolean,
	turnstileEnabled: boolean,
	turnstileSiteKey: string
}

export const Route = createFileRoute('/auth')({
    loader: async () => {
        try {
            const { data }: { data: ApiResponse<ConfigResponse> } = await api.get("/api/config/auth")
            if (!data.success) return { config: null };
            return { config: data.data }
        } catch (e) {
            throw e;
        }
    },
    component: AuthLayout,
})

function AuthLayout() {
    return (
        <div className='min-h-screen w-full flex items-center justify-center'>
            <Outlet/>
        </div>
    )
}
