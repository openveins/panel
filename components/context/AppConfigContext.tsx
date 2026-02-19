"use client"

import { createContext, useContext, useEffect, useState } from "react";

const AppConfigContext = createContext(null)

export function AppConfigProvider({children}: {children: React.ReactNode}){
    
    const [features, setFeatures] = useState(null);

    useEffect(() => {
        fetch("/api/config/auth").then((data) => data.json()).then((res) => {setFeatures(res); console.log(res)})
    }, [])

    if(!features) return <></>

    return(
        <AppConfigContext.Provider value={features}>
            {children}
        </AppConfigContext.Provider>
    )
}

export const useFeatures = () => useContext(AppConfigContext);