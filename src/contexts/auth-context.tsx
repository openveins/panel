import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { api } from "@/api/client"
import { useNavigate } from '@tanstack/react-router'
import type { ApiResponse, User } from '@/types/Types'


interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string, captcha: string) => Promise<void>;
  register: (username: string, email: string, password: string, captcha: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  isLoading: boolean;
  loginOTP: (code: string) => Promise<void>;
}

interface LoginResponse {
  totpRequired: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children, initialUser }: { children: React.ReactNode, initialUser: User | null }) {
  const [user, setUser] = useState<User | null>(initialUser)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const clearError = useCallback(() => setError(null), [])
  const navigate = useNavigate();

  useEffect(() => {
    setUser(initialUser)
    setIsLoading(false);
  }, [initialUser])

  const login = async (email: string, password: string, captcha: string) => {
    setError(null)
    try {
      const { data }: { data: ApiResponse<LoginResponse> } = await api.post('/api/auth/login', { email, password, captcha })
      if (data.success) {
        if (data.data.totpRequired)
          navigate({ to: "/auth/login/2fa", reloadDocument: true })
        else
          navigate({ to: "/dashboard" })
      }
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message ?? 'Login failed')
      } else {
        setError('An unexpected error occurred')
      }
      throw err
    }
  }

  const register = async (username: string, email: string, password: string, captcha: string) => {
    setError(null)
    try {
      const { data }: { data: ApiResponse<null> } = await api.post('/api/auth/register', { username, email, password, captcha })
      if (data.success)
        navigate({ to: "/dashboard", reloadDocument: true })
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message ?? 'Registration failed')
      } else {
        setError('An unexpected error occurred')
      }
      throw err
    }
  }

  const logout = async () => {
    setError(null)
    try {
      const { data }: { data: { status: string } } = await api.get('/api/auth/logout')
      if (data.status == "OK")
        navigate({ to: "/", reloadDocument: true })
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message ?? 'Logout failed')
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setUser(null)
    }
  }

  const loginOTP = async (code: string) => {
    try {
      setIsLoading(true);
      const { data }: { data: ApiResponse<null> } = await api.post("/api/auth/login/2fa", { code })
      if (data.success) {
        navigate({ to: "/dashboard", reloadDocument: true })
      }
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message ?? 'Logout failed')
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setIsLoading(false);
    }

  }

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    error,
    login,
    register,
    logout,
    clearError,
    isLoading,
    loginOTP
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
