import { TooltipProvider } from "../ui/tooltip";
import { AuthProvider } from "./AuthContext";
import { HealthCheckProvider } from "./HealthCheckContext";
import { LoggerProvider } from "./LoggerContext";

export function ContextManager({children}: {children: React.ReactNode}) {
    return(
        <TooltipProvider>
            <LoggerProvider>
                <HealthCheckProvider>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </HealthCheckProvider>
            </LoggerProvider>
        </TooltipProvider>
    )
}