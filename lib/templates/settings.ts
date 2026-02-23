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

export { CONFIG_SECTION }
export type { ConfigFieldInterface, ConfigInterface }