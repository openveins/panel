import { api } from "@/api/client";
import type { ApiResponse, LocationResponse } from "@/types/Types";
import { useNavigate } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { createContext, useContext, useState } from "react";

interface Settings {
    cloudflare_turnstile_enabled: boolean,
    cloudflare_turnstile_siteKey: string,
    signup_enabled: boolean,
    onboarding_complete: boolean
}

interface DashboardContextValue {
    settings: Settings | null,
    error: string | null,
    isLoading: boolean,
    getPanelSettings: () => Promise<void>,
    savePanelSettings: (settings: Settings) => Promise<void>,
    createLocation: (location: {name: string, description: string}) => Promise<void>,
    getLocation: (locationId: string) => Promise<ApiResponse<LocationResponse> | null>;
    updateLocation: (locationId: string, data: {name: string, description: string}) => Promise<ApiResponse<LocationResponse> | null>;
    deleteLocation: (locationId: string) => Promise<boolean>;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);


export function DashboardProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<Settings | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const navigate = useNavigate();

    const getPanelSettings = async () => {
        setError(null);
        setIsLoading(true);
        try {
            const { data }: { data: ApiResponse<Settings> } = await api.get("/api/config")
            if (data.success) {
                setSettings(data.data);
            }
        } catch (err) {
            if (isAxiosError(err)) {
                setError(err.response?.data?.message ?? 'Getting config failed.')
            } else {
                setError('An unexpected error occurred')
            }
        } finally {
            setIsLoading(false);
        }
    }

    const savePanelSettings = async (settings: Settings) => {
        setError(null);
        try {
            await api.patch("/api/config", { updates: settings })
        } catch (err) {
            if (isAxiosError(err)) {
                setError(err.response?.data?.message ?? 'Getting config failed.')
            } else {
                setError('An unexpected error occurred')
            }
        } finally {
            setIsLoading(false);
        }
    }


    // LOCATIONS

    const createLocation = async (location: {name: string, description: string}) => {
        setError(null);
        try {
            const {data} : {data: ApiResponse<LocationResponse>} = await api.post("/api/locations", {name: location.name, description: location.description})
            if(data.success){
                navigate({to: "/dashboard/locations/$locationId", params: {locationId: data.data.id}})
            }
        
        }catch (err) {
            if (isAxiosError(err)) {
                setError(err.response?.data?.message ?? 'Creating location failed.')
            } else {
                setError('An unexpected error occurred')
            }
        } finally {
            setIsLoading(false);
        }
    }

    const getLocation = async (locationId: string): Promise<ApiResponse<LocationResponse> | null> => {
        setError(null);
        try {
            const {data} : {data: ApiResponse<LocationResponse>} = await api.get(`/api/locations/${locationId}`)
            if(data.success){
                return data;
            }
            setError(data.message);
            return null
        }catch (err) {
            if (isAxiosError(err)) {
                setError(err.response?.data?.message ?? 'Getting location data failed.')
            } else {
                setError('An unexpected error occurred')
            }
            return null;
        } finally {
            setIsLoading(false);
        }
    }

    const updateLocation = async (locationId: string, location: {name: string, description: string}): Promise<ApiResponse<LocationResponse> | null> => {
        setError(null);
        try {
            const {data} : {data: ApiResponse<LocationResponse>} = await api.patch(`/api/locations/${locationId}`, {name: location.name, description: location.description})
            if(data.success){
                return data;
            }
            setError(data.message);
            return null;
        }catch (err) {
            if (isAxiosError(err)) {
                setError(err.response?.data?.message ?? 'Updating location failed.')
            } else {
                setError('An unexpected error occurred')
            }
            return null;
        }
    }

    const deleteLocation = async (locationId: string): Promise<boolean> => {
        setError(null);
        try {
            const {data} : {data: ApiResponse<null>} = await api.delete(`/api/locations/${locationId}`)
            if(data.success){
                return true;
            }
            setError(data.message);
            return false;
        }catch (err) {
            if (isAxiosError(err)) {
                setError(err.response?.data?.message ?? 'Deleting location failed.')
            } else {
                setError('An unexpected error occurred')
            }
            return false;
        }
    }



    const value: DashboardContextValue = {
        settings,
        error,
        isLoading,
        getPanelSettings,
        savePanelSettings,
        createLocation,
        getLocation,
        updateLocation,
        deleteLocation
    }

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    )
}

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error("useDashboard must be used within a DashboardProvider");
    }
    return context;
}