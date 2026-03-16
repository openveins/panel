import { TooltipProvider } from "../ui/tooltip";
import { AuthProvider } from "./AuthContext";
import { HealthCheckProvider } from "./HealthCheckContext";
import { LoggerProvider } from "./LoggerContext";
import { ThemeProvider } from "./ThemeContext";

export function ContextManager({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute={"class"}
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <TooltipProvider>
                <LoggerProvider>
                    <HealthCheckProvider>
                        <AuthProvider>
                            {children}
                        </AuthProvider>
                    </HealthCheckProvider>
                </LoggerProvider>
            </TooltipProvider>
        </ThemeProvider>
    )
}