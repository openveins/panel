import { Outlet, createRootRouteWithContext, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { AuthProvider } from '../contexts/auth-context'
import { api } from '@/api/client'
import { TooltipProvider } from '@/components/ui/tooltip'
import { HealthProvider } from '@/contexts/health-context'
import type { ApiResponse, User } from '@/types/Types'
import { DashboardProvider } from '@/contexts/dashboard-context'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'

interface RouteContext {
  user: User | null
}

let cachedUser: User | null = null;

export const refreshUser = async () => {
  const { data }: { data: ApiResponse<User> } = await api.get("/api/auth/me")
  if (!data.success) throw new Error()
  cachedUser = data.data
  return cachedUser
}

export const clearUser = () => {
  cachedUser = null
}

export const Route = createRootRouteWithContext<RouteContext>()({
  beforeLoad: async ({ location }) => {
    const isAuthRoute = location.pathname.startsWith("/auth")
    if (location.pathname === "/auth") return redirect({ to: "/auth/login" })
    if (isAuthRoute) return;

    try {
      if (!cachedUser) await refreshUser()
      return { user: cachedUser }
    } catch {
      throw redirect({ to: "/auth/login" })
    }
  },
  component: RootComponent,
})

function RootComponent() {

  const { user } = Route.useRouteContext()

  return (
    <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
      <TooltipProvider>
        <HealthProvider>
          <AuthProvider initialUser={user}>
            <DashboardProvider>
              <Outlet />
              <Toaster />
              <TanStackRouterDevtools position="bottom-right" />
            </DashboardProvider>
          </AuthProvider>
        </HealthProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}