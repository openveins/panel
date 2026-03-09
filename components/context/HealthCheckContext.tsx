"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import { TriangleAlert } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

interface HealthCheckInterface {
    healthy: boolean,
    error: string | null;
    lastCheck: number,
    isLoading: boolean,
    ping: () => Promise<void>;
}

const HealthCheckContext = createContext<HealthCheckInterface | null>(null);


export function HealthCheckProvider({ children }: { children: React.ReactNode }) {

    const [healthy, setHealthy] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [lastCheck, setLastCheck] = useState<number>(0);

    const router = useRouter();

    const ping = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            await axios.get("/api/health", { timeout: 5000 });
            setHealthy(true);
            setLastCheck(Date.now());
        } catch (err) {
            setHealthy(false);
            setError(err instanceof Error ? err.message : "Health check failed")
        }
        setIsLoading(false);
    }, [])

    useEffect(() => {
        ping();
    }, [])

    const value: HealthCheckInterface = {
        healthy,
        error,
        lastCheck,
        isLoading,
        ping,
    }

    if (!healthy && !isLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant={"icon"}>
                            <TriangleAlert />
                        </EmptyMedia>
                        <EmptyTitle>Backend service is unreachable!</EmptyTitle>
                        <EmptyDescription>Backend service failed the healthcheck meaning it's down. Please refer to the FAQ for common fixes.</EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent className="grid">
                        <Button onClick={ping} className="duration-200 hover:bg-primary/80 hover:cursor-pointer">
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
        <HealthCheckContext.Provider value={value}>
            {children}
        </HealthCheckContext.Provider>
    )
}


export function useHealthcheck() {
    const context = useContext(HealthCheckContext);
    if (!context) throw new Error("useHealthcheck must be used within a HealthCheckProvider");
    return context;
}