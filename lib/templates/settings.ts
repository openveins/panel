import { Archive, Clock3, Diamond, FolderTree, HardDrive, LayoutDashboard, LayoutTemplate, Settings, Shield, SquareChevronRight, Users } from "lucide-react";

interface ConfigInterface {
    sectionTitle: string;
    sectionDescription: string;
    fields: ConfigFieldInterface[];
}

type ConfigFieldInterface = | {
    fieldTitle: string;
    fieldDescription: string;
    controlType: "switch"
    type: "boolean"
    configKey: string;
    configValue: boolean;
    badge: string;
} | {
    fieldTitle: string;
    fieldDescription: string;
    controlType: "input"
    type: "string"
    configKey: string;
    configValue: string;
    badge: string;
    inputPlaceholder: string;
}

const CONFIG_SECTION: ConfigInterface[] = [
    {
        sectionTitle: "Security",
        sectionDescription: "Protect from bots and control the access to the panel.",
        fields: [
            {
                fieldTitle: "Cloudflare Turnstile",
                fieldDescription: "Require Turnstile CAPTCHA verification on the login and registration pages. Protects against automated attacks and credential stuffing.",
                controlType: "switch",
                type: "boolean",
                configKey: "cloudflare_turnstile_enabled",
                configValue: false,
                badge: "test"
            },
            {
                fieldTitle: "Cloudflare Turnstile Sitekey",
                fieldDescription: "Your Turnstile site key from the Cloudflare dashboard. Found under Turnstile → your widget → Site Key.",
                controlType: "input",
                type: "string",
                configKey: "cloudflare_turnstile_siteKey",
                configValue: "",
                badge: "required",
                inputPlaceholder: "1x00000000000000000000AA"
            },
            {
                fieldTitle: "Sign up",
                fieldDescription: "Allow new users to create accounts via the registration page.",
                controlType: "switch",
                type: "boolean",
                configKey: "signup_enabled",
                configValue: false,
                badge: ""
            }
        ]
    },
    {
        sectionTitle: "Telemetry",
        sectionDescription: "Usage data that helps the developement team.",
        fields: [
            {
                fieldTitle: "Anonymous Telemetery",
                fieldDescription: "Send anonymized usage telemetry to the developement team to help improve the product for all users. We do not collect any PII and all information is anonymized.",
                controlType: "switch",
                type: "boolean",
                configKey: "telemetry_enabled",
                configValue: false,
                badge: ""
            },
        ]
    }
]


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
                { "label": "Nodes", "href": "/dashboard/nodes", "icon": Diamond, "badge": { "value": "3", "className": "bg-emerald-200" } },
                { "label": "Servers", "href": "/dashboard/servers", "icon": HardDrive },
                { "label": "Templates", "href": "/dashboard/templates", "icon": LayoutTemplate }
            ]
        },
        {
            "label": "Management",
            "items": [
                { "label": "Users", "href": "/dashboard/users", "icon": Users, "badge": { "value": "24", "className": "bg-foreground/20" } },
                { "label": "File Manager", "href": "/dashboard/filemanager", "icon": FolderTree },
                { "label": "Console", "href": "/dashboard/console", "icon": SquareChevronRight },
                { "label": "Schedules", "href": "/dashboard/schedules", "icon": Clock3 },
                { "label": "Backups", "href": "/dashboard/backups", "icon": Archive }
            ]
        },
        {
            "label": "System",
            "items": [
                { "label": "Audit Log", "href": "/dashboard/auditlog", "icon": Shield, "badge": { "value": "!", "className": "bg-red-300" } },
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

export { CONFIG_SECTION, SIDEBAR_DATA }
export type { ConfigFieldInterface, ConfigInterface }