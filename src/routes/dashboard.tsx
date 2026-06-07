import DashboardSidebar from '@/components/sidebar/dashboard-sidebar'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { createFileRoute, Link, Outlet, useLocation } from '@tanstack/react-router'
import { Fragment } from 'react/jsx-runtime'

export const Route = createFileRoute('/dashboard')({
    component: RouteComponent,
})

function RouteComponent() {
    const { pathname } = useLocation();
    const segments = pathname.substring(1).split("/").filter(Boolean)

    return (
        <SidebarProvider>
            <DashboardSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 w-full">
                    <SidebarTrigger />
                    <Separator orientation="vertical" className="ml-2" />
                    <Breadcrumb className="ml-2">
                        <BreadcrumbList>
                            {segments.map((segment, idx) => {
                                const path = "/" + segments.slice(0, idx + 1).join("/")
                                const isLast = idx === segments.length - 1
                                return (
                                    <Fragment key={path}>
                                        {idx > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                                        <BreadcrumbItem className="hidden md:block">
                                            {isLast ? (
                                                <BreadcrumbPage className="text-base capitalize">
                                                    {segment}
                                                </BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink asChild className="text-base capitalize">
                                                    <Link to={path}>{segment}</Link>
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                    </Fragment>
                                )
                            })}
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <main className='flex-1 overflow-auto p-4'>
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
