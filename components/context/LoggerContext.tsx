"use client";

import { createContext, useContext } from "react";
import { toast } from "sonner";

const LoggerContext = createContext({})

export function LoggerProvider({children}: {children: React.ReactNode}){


    const log = (title: string, description: React.ReactNode | null) => {
        if(process.env.NODE_ENV == "development"){
            toast(title, {description, position: "top-left", duration: 10000, style: {width: "fit", margin: 0}})
        }
    }

    const values = {
        log
    }

    return (
        <LoggerContext.Provider value={values}>
            {children}
        </LoggerContext.Provider>

    )

}

export const useLogger = () => useContext(LoggerContext);
