"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import axios, { AxiosError } from "axios"
import { usePathname, useRouter } from "next/navigation";
import { Spinner } from "../ui/spinner";

interface User {
    username: string;
    email: string;
    id: string;
    settings: {}
}

interface AuthContextValue {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string, captcha: string | null) => Promise<void>;
    register: (username: string, email: string, password: string, captcha: string | null) => Promise<void>;
    logout: () => void;
    setupTOTP: (enabled: boolean) => Promise<{ state: string, message: string, qr: string | undefined }>;
    verifyTOTP: (code: string) => Promise<{
        status: undefined; state: string, message: string
    }>;
    loginTOTP: (code: string) => Promise<{ state: string, message: string }>;
    me: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);


export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setLoading] = useState<boolean>(true);

    const router = useRouter();
    const pathname = usePathname();

    const me = useCallback(async () => {
        if (pathname.includes("/auth")) return setLoading(false);
        try {
            const response = await axios.get("/api/auth/me", { withCredentials: true });
            const { id, username, email, settings } = response.data;
            setUser({ id, username, email, settings })
            if (!pathname.includes("dashboard"))
                router.push("/dashboard")
        } catch (e) {
            router.push('/auth/login')
            if (axios.isAxiosError(e)) {
                const error = e as AxiosError;
                console.error(error);
                return;
            } else {
                return console.error(e);
            }
        } finally {
            setLoading(false);
        }
    }, [setUser, setLoading])

    useEffect(() => {
        me()
    }, [me])

    const logout = useCallback(async () => {
        setLoading(true)
        try {
            await axios.get("/api/auth/logout");
            router.push("/auth/login")
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const error = e as AxiosError;
                console.error(error);
                return;
            } else {
                return console.error(e);
            }
        } finally {
            setUser(null);
            setLoading(false)
        }
    }, [setLoading])

    const login = useCallback(async (email: string, password: string, captcha: string | null) => {
        setLoading(true);
        try {
            const response = await axios.post("/api/auth/login", { email, password, captcha })
            const { totpRequired } = response.data;
            if (totpRequired) {
                return router.push("/auth/login/2fa")
            }
            me();
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const error = e as AxiosError;
                console.error(error);
                return;
            } else {
                return console.error(e);
            }
        } finally {
            setLoading(false);
        }
    }, [setLoading, me])

    const register = useCallback(async (username: string, email: string, password: string, captcha: string | null) => {
        try {
            await axios.post("/api/auth/register", { username, email, password, captcha })
            me();
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const error = e as AxiosError;
                console.error(error);
                return;
            } else {
                return console.error(e);
            }
        }
    }, [me])


    const setupTOTP = useCallback(async (enable: boolean) => {
        try {
            const response = await axios.patch("/api/profile/2fa", { enable }, { withCredentials: true })
            me();
            return response.data;
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const error = e as AxiosError;
                return { state: "error", message: (error.response?.data as { message: string })?.message ?? "An unexpected error occurred." };
            } else {
                console.error(e);
                return { state: "error", message: "An internal server error occured." }
            }
        }
    }, [])

    const verifyTOTP = useCallback(async (code: string) => {
        try {
            const response = await axios.post("/api/profile/2fa/verify", { code }, { withCredentials: true })
            me();
            return response.data;
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const error = e as AxiosError;
                return { state: "error", message: (error.response?.data as { message: string })?.message ?? "An unexpected error occured." }
            } else {
                console.error(e);
                return { state: "error", message: "Unknown error" }
            }
        }
    }, [])

    const loginTOTP = useCallback(async (code: string) => {
        try {
            const response = await axios.post("/api/auth/login/2fa", { code }, { withCredentials: true })
            const { message } = response.data;
            router.replace("/dashboard")
            me();
            return { state: "success", message }
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const error = e as AxiosError;
                return { state: "error", message: (error.response?.data as { message: string })?.message }
            } else {
                console.error(e);
                return { state: "error", message: "Internal server error" }
            }
        }
    }, [])


    const value = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        setupTOTP,
        verifyTOTP,
        loginTOTP,
        me
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