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
        totpEnabled: boolean
    }
}

interface LocationResponse {
    id: string,
    name: string,
    description: string,
    createdAt: Date,
    updatedAt: Date
}


export { type ApiResponse, type User, type SettingControl, type Setting, type SettingsPageProps, type LocationResponse }