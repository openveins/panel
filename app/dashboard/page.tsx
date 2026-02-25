"use client"

import { useAuth } from "@/components/context/AuthContext";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardPage(){

    const {token} = useAuth();

    return(
        <div className="overflow-auto">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 w-full">
                <SidebarTrigger />
                <Separator orientation="vertical" className="ml-2" />
                <Breadcrumb className="ml-2">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-base">dashboard</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>
            <main className="m-2">
                {token ? token : "not logged in"}
            </main>
        </div>
    )
}