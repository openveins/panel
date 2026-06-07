type SettingControl =
    | {
        type: "input",
        default: string,
        placeholder: string,
        inputType: "text" | "email" | "password",
    } | {
        type: "switch"
        default: boolean
    }

interface Setting {
    id: string,
    title: string,
    description: string
    badge: string | null,
    control: SettingControl
}

interface SettingsPageProps {
    groups: { title: string, description: string, items: Setting[] }[]
}

type ApiResponse<T> =
    | { success: true, message: string, data: T }
    | { success: false, message: string }

interface User {
    id: string,
    username: string,
    email: string,
    settings: {
        otpEnabled: boolean,
        timezone: string
    }
}

interface LocationResponse {
    id: string,
    name: string,
    description: string,
    createdAt: Date,
    updatedAt: Date
}

interface TOTPToggleResponse {
    state: string,
    message: string
    qr: string
}

interface TOTPVerifyResponse {
    state: string,
    message: string
}


export { type ApiResponse, type User, type SettingControl, type Setting, type SettingsPageProps, type LocationResponse, type TOTPToggleResponse, type TOTPVerifyResponse }