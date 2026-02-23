import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

export default function SettingsPageSkeleton() {
    return (
        <div className="flex-1 overflow-y-auto p-8 max-w-3xl mx-auto w-full gap-2">
            <div className="mb-5">
                <h1>Settings</h1>
                <p className="text-xs text-zinc-700">Global panel configuration.</p>
            </div>

            <div className="flex flex-col gap-5">
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

        </div>
    )
}