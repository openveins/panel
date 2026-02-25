import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";

export default function SettingsPageSkeleton() {
    return (
        <div className="flex flex-col items-center overflow-y-auto w-full">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 w-full">
                <SidebarTrigger />
                <Separator orientation="vertical" className="ml-2" />
                <Breadcrumb className="ml-2">
                    <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="/dashboard" className="text-base">dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-base">settings</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>

            <main className="p-8 max-w-3xl">
                <div className="flex flex-col gap-5 w-full">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-1/3 h-4" />
                                <Separator className="flex-1" />
                            </div>
                            <Skeleton className="w-full h-4" />
                        </div>
                        <Card>
                            <CardContent className="flex flex-col gap-2">
                                <Skeleton className="w-full h-6" />
                                <Skeleton className="w-full h-4" />
                                <Skeleton className="w-1/4 h-4" />
                            </CardContent>
                            <Separator />
                            <CardContent className="flex flex-col gap-2">
                                <Skeleton className="w-full h-6" />
                                <Skeleton className="w-full h-4" />
                                <Skeleton className="w-1/4 h-4" />
                            </CardContent>
                            <Separator />
                            <CardContent className="flex flex-col gap-2">
                                <Skeleton className="w-full h-6" />
                                <Skeleton className="w-full h-4" />
                                <Skeleton className="w-1/4 h-4" />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-1/5 h-4" />
                                <Separator className="flex-1" />
                            </div>
                            <Skeleton className="w-3/4 h-4" />
                        </div>
                        <Card>
                            <CardContent className="flex flex-col gap-2">
                                <Skeleton className="w-full h-6" />
                                <Skeleton className="w-full h-4" />
                                <Skeleton className="w-1/4 h-4" />
                            </CardContent>
                            <Separator />
                            <CardContent className="flex flex-col gap-2">
                                <Skeleton className="w-full h-6" />
                                <Skeleton className="w-full h-4" />
                                <Skeleton className="w-1/4 h-4" />
                            </CardContent>
                            <Separator />
                            <CardContent className="flex flex-col gap-2">
                                <Skeleton className="w-full h-6" />
                                <Skeleton className="w-full h-4" />
                                <Skeleton className="w-1/4 h-4" />
                            </CardContent>
                        </Card>
                    </div>
                    <div>
                        <Separator />
                        <div className="flex items-center mt-5">
                            <p className="text-xs text-zinc-600">Make sure to save the changes before leaving this page!</p>
                            <Button className="ml-auto" disabled={true}>Save changes</Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}