import DashboardSidebar from '@/components/sidebar/dashboard-sidebar'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { createFileRoute, Link, Outlet, useLocation } from '@tanstack/react-router'
import { Fragment } from 'react/jsx-runtime'

export const Route = createFileRoute('/dashboard')({
    component: RouteComponent,
})

function RouteComponent() {
    const pathname = useLocation();
    return (
        <SidebarProvider>
            <DashboardSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 w-full">
                    <SidebarTrigger />
                    <Separator orientation="vertical" className="ml-2" />
                    <Breadcrumb className="ml-2">
                        <BreadcrumbList>
                            {pathname.pathname.substring(1).split("/").map((location, idx) => (
                                <Fragment key={idx}>
                                    {(idx == 0) && (
                                        <BreadcrumbItem className="hidden md:block">
                                            <Link to="/dashboard" className="text-base">{location}</Link>
                                        </BreadcrumbItem>
                                    )}
                                    {(idx != 0) && (
                                        <>
                                        <BreadcrumbSeparator className="hidden md:block" />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage className="text-base">
                                                {location}
                                            </BreadcrumbPage>
                                        </BreadcrumbItem>
                                        </>
                                    )}
                                </Fragment>

                            ))}
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
