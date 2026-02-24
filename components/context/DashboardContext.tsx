"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useLogger } from "./LoggerContext";
import axios from "axios";
import Codeblock from "../ui/codeblock";
import { useAuth } from "./AuthContext";

interface DashboardContextValue {
    settings: Record<string, string> | null;
    isLoading: boolean;
    patchResponse: Record<string, any> | null;
    patchSettings: (patches: Record<string, string | boolean>) => Promise<void>;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);


export function DashboardProvider({ children }: { children: React.ReactNode }) {

    const { log } = useLogger("DashboardProvider");
    const { token } = useAuth();

    const [settings, setSettings] = useState<Record<string, string> | null>(null);
    const [patchResponse, setPatchResponse] = useState<Record<string, object | string> | null>(null);
    const [isLoading, setLoading] = useState<boolean>(true);


    const getSettings = useCallback(async () => {
        try {
            const response = await axios.get("/api/config", {headers: {"Authorization": `Bearer ${token}`}})
            let data = Object.fromEntries(response.data.configList.map((item: { Id: string, configName: string, configValue: string }) => [item.configName, item.configValue]))
            setSettings(data);
            setLoading(false)
        } catch (e) {
            if (axios.isAxiosError(e)) {
                log(e.response?.data)
            }
            console.warn(e);
        }
    }, [])

    const patchSettings = useCallback(async (patches: Record<string, string | boolean>) => {
        setLoading(true);
        setPatchResponse(null);
        try {
            const response = await axios.patch("/api/config", { updates: patches }, {headers: {"Authorization": `Bearer ${token}`}})
            setPatchResponse(response.data);
            getSettings();
        } catch (e) {
            if (axios.isAxiosError(e)) {
                log(e.response?.data)
            }
            console.warn(e);
        }
        setLoading(false);
    }, [])

    useEffect(() => {
        if (settings == null || token != null)
            getSettings();

    }, [getSettings, isLoading])

    const value: DashboardContextValue = {
        settings,
        isLoading,
        patchSettings,
        patchResponse
    }

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    )
}

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (!context) throw new Error("useDashboard must be used within a DashboardProvider");
    return context;
}