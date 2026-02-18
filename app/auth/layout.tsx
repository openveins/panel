import { AppConfigProvider } from "@/components/context/AppConfigContext";

export default function AuthPageLayout({children}: {children: React.ReactNode}) {

    return(
        <AppConfigProvider>
            {children}
        </AppConfigProvider>
    )

}