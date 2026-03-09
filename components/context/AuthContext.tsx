"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import axios, { AxiosError } from "axios"
import { isTokenExpired, parseJWT } from "@/lib/jwt";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

interface User {
    username: string;
    email: string;
    role: string;
    otpEnabled: boolean;
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
    setupTOTP: (enabled: boolean) => Promise<{ status: "verify" | "error" | "success" | "no_change" | "enabled", success: boolean, message: string, qrURI: string | null }>;
    verifyTOTP: (code: string) => Promise<{ status: "verify" | "error" | "success" | "no_change" | "enabled", success: boolean, message: string, qrURI: string | null }>;
    otpToken: string | null;
    loginTOTP: (code: string) => Promise<{success: boolean, message: string}>;
    //me: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "auth_token"

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setLoading] = useState<boolean>(true);

    const [otpToken, setOtpToken] = useState<string | null>(null);

    const router = useRouter();

    const saveToken = useCallback((newToken: string) => {
        localStorage.setItem(TOKEN_KEY, newToken);
        setToken(newToken);

        const payload = parseJWT(newToken);
        if (payload) {
            setUser({ id: payload.sub, username: payload.username, email: payload.email, role: payload.role, otpEnabled: payload.otpEnabled })
        }

        setLoading(false);
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
            router.push("/auth/login")
            toast.error("You are unauthenticated!");
            setLoading(false);
        }
    }, [])

    const login = useCallback(async (email: string, password: string, captcha: string | null) => {
        try {
            const response = await axios.post("/api/auth/login", { email, password, captcha }, { headers: { "Content-Type": "application/json" } })
            const { token, otpRequired } = response.data;
            if (otpRequired) {
                setOtpToken(token);
                return router.push("/auth/login/2fa")
            }
            saveToken(token);
            router.push("/dashboard")
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const error = e as AxiosError;
                return;
            } else {
                return console.error(e);
            }
        }
    }, [saveToken])

    const register = useCallback(async (username: string, email: string, password: string, captcha: string | null) => {
        try {
            const response = await axios.post("/api/auth/register", { username, email, password, captcha }, { headers: { "Content-Type": "application/json" } })
            const { token } = response.data;
            saveToken(token);
            router.push("/dashboard")
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const error = e as AxiosError;
                return;
            } else {
                return console.error(e);
            }
        }
    }, [saveToken])

    const setupTOTP = useCallback(async (enable: boolean) => {
        try {
            const response = await axios.patch("/api/profile/2fa", { enable }, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` } })
            const { status, message, success, data } = response.data;
            return { status, message, success, data };
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const error = e as AxiosError;
                return { status: "error", success: false, message: error.response?.data, qrURI: "" }
            } else {
                console.error(e);
                return { status: "error", success: false, message: "Unknown error", qrURI: "" }
            }
        }
    }, [token])

    const verifyTOTP = useCallback(async (code: string) => {
        try {
            const response = await axios.post("/api/profile/2fa/verify", { code }, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` } })
            const { status, message, success, qrURI } = response.data;
            return { status, message, success, qrURI };
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const error = e as AxiosError;
                return { status: "error", success: false, message: error.response?.data, qrURI: "" }
            } else {
                console.error(e);
                return { status: "error", success: false, message: "Unknown error", qrURI: "" }
            }
        }
    }, [token])

    const loginTOTP = useCallback(async (code: string) => {
        try {
            const response = await axios.post("/api/auth/login/2fa", { code, token: otpToken }, { headers: { "Content-Type": "application/json" } })
            const { token } = response.data;
            setOtpToken(null);
            saveToken(token);
            router.push("/dashboard")
            return {success: true, message: response.data.message}
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const error = e as AxiosError;
                return {success: false, message: (error.response?.data as {message: string})?.message}
            } else {
                console.error(e);
                return {success: false, message: "Internal server error"}
            }
        }
    }, [otpToken])

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
        register,
        setupTOTP,
        verifyTOTP,
        otpToken,
        loginTOTP
    }

    if (isLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
                <Spinner className="size-8" />
            </div>
        )
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