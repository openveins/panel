import type { Setting } from "@/types/Types";
import { Badge } from "./badge";
import { CardContent } from "./card";
import { Input } from "./input";
import { Switch } from "./switch";


export default function SettingsRow({ setting, value, onChange, disabled }: { setting: Setting, value: any, onChange: any, disabled: boolean }) {
    return (
        <CardContent className="flex flex-col gap-2">
            {(setting.control.type == "switch") && (
                <>
                    <div className="flex items-center gap-2">
                        <p className="text-base">{setting.title}</p>
                        {(setting.badge) && (<Badge className="text-[7px]">{setting.badge.toUpperCase()}</Badge>)}
                        <Switch className="ml-auto" defaultChecked={setting.control.default} checked={value} onCheckedChange={onChange} disabled={disabled} />
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">{setting.description}</p>
                </>
            )}

            {(setting.control.type == "input") && (
                <>
                    <div className="flex items-center gap-2">
                        <h1 className="text-base">{setting.title}</h1>
                        {(setting.badge) && <Badge className="text-[7px]">{setting.badge.toUpperCase()}</Badge>}
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">{setting.description}</p>
                    <Input type={setting.control.inputType} placeholder={setting.control.placeholder} defaultValue={value} value={value} onChange={(e) => {onChange(e.target.value)}} disabled={disabled} />
                </>
            )}
        </CardContent>
    )
}