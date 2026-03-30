import type { SettingsPageProps } from "@/types/Types"
import { LayoutDashboard, Globe, Diamond, HardDrive, LayoutTemplate, Users, FolderTree, SquareChevronRight, Clock3, Archive, Shield, Settings } from "lucide-react"

const SIDEBAR_DATA = {
    "groups": [
        {
            "label": "Overview",
            "items": [
                { "label": "Dashboard", "href": "/dashboard", "icon": LayoutDashboard }
            ]
        },
        {
            "label": "Infra",
            "items": [
                { "label": "Locations", "href": "/dashboard/locations", "icon": Globe },
                { "label": "Nodes", "href": "/dashboard/nodes", "icon": Diamond, "badge": { "value": "3", "className": "bg-emerald-200 dark:bg-emerald-400 dark:text-black" } },
                { "label": "Servers", "href": "/dashboard/servers", "icon": HardDrive },
                { "label": "Templates", "href": "/dashboard/templates", "icon": LayoutTemplate }
            ]
        },
        {
            "label": "Management",
            "items": [
                { "label": "Users", "href": "/dashboard/users", "icon": Users, "badge": { "value": "24", "className": "bg-foreground/20 dark:bg-foreground/80 dark:text-white" } },
                { "label": "File Manager", "href": "/dashboard/filemanager", "icon": FolderTree },
                { "label": "Console", "href": "/dashboard/console", "icon": SquareChevronRight },
                { "label": "Schedules", "href": "/dashboard/schedules", "icon": Clock3 },
                { "label": "Backups", "href": "/dashboard/backups", "icon": Archive }
            ]
        },
        {
            "label": "System",
            "items": [
                { "label": "Audit Log", "href": "/dashboard/auditlog", "icon": Shield, "badge": { "value": "!", "className": "bg-red-300 dark:bg-red-400" } },
                { "label": "Settings", "href": "/dashboard/settings", "icon": Settings }
            ]
        }
    ],
    "nodesHealth": [
        { "name": "eu-east-1", "value": 40 },
        { "name": "eu-east-2", "value": 80 },
        { "name": "na-west-1", "value": 100 }
    ]
}


const SETTINGS_DATA: SettingsPageProps = {
    groups: [
        {
            title: "Security",
            description: "Protect from bots and control the access to the panel.",
            items: [
                {
                    id: "cloudflare_turnstile_enabled",
                    title: "Cloudflare Turnstile",
                    description: "Require Turnstile CAPTCHA verification on the login and registration pages. Protects against automated attacks and credential stuffing.",
                    control: { type: "switch", default: false },
                    badge: null
                },
                {
                    id: "cloudflare_turnstile_siteKey",
                    title: "Cloudflare Turnstile Sitekey",
                    description: "Your Turnstile site key from the Cloudflare dashboard. Found under Turnstile → your widget → Site Key.",
                    control: { type: "input", placeholder: "1x00000000000000000000AA", default: "", inputType: "password" },
                    badge: "required"
                },
                {
                    id: "signup_enabled",
                    title: "Sign Up",
                    description: "Allow new users to create accounts via the registration page.",
                    control: { type: "switch", default: false },
                    badge: null
                },
            ]
        },
        {
            title: "Telemetry",
            description: "Usage data that helps the developement team.",
            items: [
                {
                    id: "onboarding_complete",
                    title: "Anonymous Telemetery",
                    description: "Send anonymized usage telemetry to the developement team to help improve the product for all users. We do not collect any PII and all information is anonymized.",
                    control: { type: "switch", default: false },
                    badge: null
                },
            ]
        }
    ]
}

export { SIDEBAR_DATA, SETTINGS_DATA }