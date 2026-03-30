import { api } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { TriangleAlert, Link } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react"

interface HealthContextValue {
    isHealthy: boolean,
    lastRefresh: Date | null,
    backendVersion: string | null,
    refresh: () => Promise<void>
}

const HealthContext = createContext<HealthContextValue | null>(null);


export function HealthProvider({ children }: { children: React.ReactNode }) {


    const [isHealthy, setIsHealty] = useState<boolean>(false);
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
    const [backendVersion, setBackendVersion] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const navigate = useNavigate();

    const health = async () => {
        try {
            const response = await api.get("/api/health")
            if (response.status == 200) {
                setIsHealty(true);
                setBackendVersion(response.data.version)

            }
        } catch (err) {
            if (isAxiosError(err)) {
                setError(err.response?.data?.message ?? 'Registration failed')
            } else {
                setError('An unexpected error occurred')
            }
            throw err
        } finally {
            setLastRefresh(new Date())
            setIsLoading(false);
        }
    }


    const refresh = async () => {
        health();
    }

    useEffect(() => {
        refresh()
    }, [])

    const value: HealthContextValue = {
        isHealthy,
        lastRefresh,
        backendVersion,
        refresh
    }
    if(isLoading){
        return(
            <div className="flex items-center justify-center w-full min-h-screen">
                <Spinner/>
            </div>
        )
    }

    if (!isHealthy && error) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant={"icon"}>
                            <TriangleAlert />
                        </EmptyMedia>
                        <EmptyTitle>Backend service is unreachable!</EmptyTitle>
                        <EmptyDescription>Backend service failed the healthcheck meaning it's down. Please refer to the FAQ for common fixes.</EmptyDescription>
                        <EmptyDescription>Error: <span className="bg-foreground/80 text-red-300 p-2" >{error}</span></EmptyDescription>

                    </EmptyHeader>
                    <EmptyContent className="grid">
                        <Button onClick={() => navigate({reloadDocument: true})} className="duration-200 hover:bg-primary/80 hover:cursor-pointer">
                            Refresh
                        </Button>
                        <Button asChild variant={"link"}>
                            <Link href={"#"}>
                                Visit FAQ
                            </Link>
                        </Button>
                    </EmptyContent>
                </Empty>
            </div>
        )
    }

    return (
        <HealthContext.Provider value={value}>
            {children}
        </HealthContext.Provider>
    )
}

export function useHealth() {
    const context = useContext(HealthContext)
    if (!context) {
        throw new Error('useHealth must be used within an HealthContext')
    }
    return context
}