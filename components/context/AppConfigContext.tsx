"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { useLogger } from "./LoggerContext";
import Codeblock from "../ui/codeblock";

const AppConfigContext = createContext(null)

export function AppConfigProvider({ children }: { children: React.ReactNode }) {

    const [features, setFeatures] = useState(null);
    const { log } = useLogger("AppConfigContext");

    useEffect(() => {
        fetch("/api/config/auth").then((data) => data.json()).then((res) => { setFeatures(res); log("", <Codeblock>{JSON.stringify(res, null, 2)}</Codeblock>) })
    }, [])

    if (!features) return <></>

    return (
        <AppConfigContext.Provider value={features}>
            {children}
        </AppConfigContext.Provider>
    )
}


export function useFeatures() {
    const context = useContext(AppConfigContext);
    if (!context) throw new Error("useFeatures must be used within a AppConfigProvider");
    return context;
}