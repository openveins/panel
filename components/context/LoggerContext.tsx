"use client";

import { createContext, useContext } from "react";
import { toast } from "sonner";

const LoggerContext = createContext({})

export function LoggerProvider({children}: {children: React.ReactNode}){


    const log = (title: string | React.ReactNode, description: React.ReactNode | null) => {
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

export function useLogger(prefix?: string) {
    const {log} = useContext(LoggerContext) as {log: (title: string | React.ReactNode, description: React.ReactNode | null) => void};
    return {
        log: (title: string | React.ReactNode, description: React.ReactNode | null = null) =>
            log(prefix ? (<span><span className="text-emerald-400 font-bold">[{prefix}]</span> {title}</span>) : title, description)
    }
}
