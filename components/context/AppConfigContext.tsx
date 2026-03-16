"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useLogger } from "./LoggerContext";
import Codeblock from "../ui/codeblock";
import axios from "axios";
import { Spinner } from "../ui/spinner";

interface AppConfigValue {
    features: {turnstileEnabled: boolean, turnstileSiteKey: string, signupEnabled: boolean } | null;
    isLoading: boolean;
    error: string | null;
}

const AppConfigContext = createContext<AppConfigValue | null>(null)

export function AppConfigProvider({ children }: { children: React.ReactNode }) {

    const [features, setFeatures] = useState<{turnstileEnabled: boolean, turnstileSiteKey: string, signupEnabled: boolean } | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { log } = useLogger("AppConfigContext");

    const fetchFeatures = useCallback(async () => {
        try {
            const response = await axios.get("/api/config/auth");
            setFeatures(response.data);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to fetch features";
            setError(message);
            log("Error fetching features", <Codeblock>{message}</Codeblock>);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFeatures();
    }, [fetchFeatures])

    const value: AppConfigValue = {
        features,
        isLoading,
        error
    }

    if (isLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
                <Spinner className="size-8" />
            </div>
        )
    }

    return (
        <AppConfigContext.Provider value={value}>
            {children}
        </AppConfigContext.Provider>
    )
}


export function useFeatures() {
    const context = useContext(AppConfigContext);
    if (!context) throw new Error("useFeatures must be used within a AppConfigProvider");
    return context;
}