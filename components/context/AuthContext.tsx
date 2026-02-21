"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import axios, { AxiosError } from "axios"
import { useLogger } from "./LoggerContext";
import { isTokenExpired, parseJWT } from "@/lib/jwt";
import { useRouter } from "next/navigation";
import Codeblock from "../ui/codeblock";

interface User {
    username: string;
    email: string;
    role: string;
    id: string;
}

interface AuthContextValue {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string, captcha: string | null) => Promise<void>;
    register: (username: string, email: string, password: string, captcha: string | null) => Promise<void>;
    logout: () => void;
    //me: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "auth_token"

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setLoading] = useState<boolean>(true);

    const router = useRouter();

    const { log } = useLogger("AuthContext");


    const saveToken = useCallback((newToken: string) => {
        localStorage.setItem(TOKEN_KEY, newToken);
        setToken(newToken);

        const payload = parseJWT(newToken);
        if (payload) {
            setUser({ id: payload.sub, username: payload.username, email: payload.email, role: payload.role })
        }

        log("User logged in:", <Codeblock>{JSON.stringify(payload, null, 2)}</Codeblock>)

    }, []);

    const clearToken = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY)
        setUser(null);
        setToken(null);
    }, []);

    useEffect(() => {
        const stored = localStorage.getItem(TOKEN_KEY)
        if (stored && !isTokenExpired(stored)) {
            saveToken(stored);
        } else {
            clearToken();
        }

        setLoading(false);

    }, [saveToken, clearToken])

    const login = useCallback(async (email: string, password: string, captcha: string | null) => {
        try {
            log("Login request...");
            const response = await axios.post("/api/auth/login", { headers: { "Content-Type": "application/json" }, email, password, captcha })
            const { token } = response.data;
            saveToken(token);
            log("Success!", <p>Token - {token}</p>)
            router.push("/dashboard")
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const error = e as AxiosError;
                log("Error occured", <Codeblock>{JSON.stringify(error.response?.data, null, 2)}</Codeblock>)
                return;
            } else {
                return console.error(e);
            }
        }
    }, [saveToken])

    const register = useCallback(async (username: string, email: string, password: string, captcha: string | null) => {
        try {
            log("Register request...");
            const response = await axios.post("/api/auth/register", { headers: { "Content-Type": "application/json" }, username, email, password, captcha })
            const { token } = response.data;
            saveToken(token);
            log("Success!", <p>Token - {token}</p>)
            router.push("/dashboard")
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const error = e as AxiosError;
                log("Error occured", <Codeblock>{JSON.stringify(error.response?.data, null, 2)}</Codeblock>)
                return;
            } else {
                return console.error(e);
            }
        }
    }, [saveToken])

    const logout = useCallback(() => {
        setLoading(true);
        clearToken();
        router.push("/auth/login")
        setLoading(false);
    }, [clearToken]);

    const value = {
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        register
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )

}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within a AuthProvider");
    return context;
}