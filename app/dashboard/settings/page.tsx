"use client"
import { useDashboard } from "@/components/context/DashboardContext";
import { useLogger } from "@/components/context/LoggerContext";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Codeblock from "@/components/ui/codeblock";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { TriangleAlert } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { toast } from "sonner";


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

export default function DashboardSettingsPage() {


    const [settingsOnLoad, setSettingsOnLoad] = useState<Record<string, string> | null>(null);
    const [changes, setChanges] = useState<Record<string, string | boolean>>({});
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const { settings, isLoading, patchSettings, patchResponse } = useDashboard();
    const { log } = useLogger();

    useEffect(() => {
        setSettingsOnLoad(settings);
    }, [settings])


    useEffect(() => {
    }, [changes])

    const handleSave = async () => {
        setIsSaving(true);
        await patchSettings(changes);
        setChanges({});
        if (patchResponse && patchResponse.warnings.length > 0) {
            toast("Some warnings occured:", { description: <Codeblock>{JSON.stringify(patchResponse.warnings, null, 2)}</Codeblock> })
        }

        setIsSaving(false);
    }

    const handleSwitchChange = (field: string) => (e: boolean) => {
        //log("Event passed", <Codeblock>{field}: {JSON.stringify(e)}</Codeblock>)
        setChanges(prev => ({ ...prev, [field]: e }));

    }

    const handleInputChange = (field: string) => (e: ChangeEvent<any>) => {
        //log("Event passed", <Codeblock>{field}: {JSON.stringify(e.target.value)}</Codeblock>)
        setChanges(prev => ({ ...prev, [field]: e.target.value }));
    }

    if (isLoading && !settings) {
        return (
            <div className="flex-1 overflow-y-auto p-8 max-w-3xl mx-auto w-full gap-2">
                <div className="mb-5">
                    <h1>Settings</h1>
                    <p className="text-xs text-zinc-700">Global panel configuration.</p>
                </div>

                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-1/3 h-4" />
                                <Separator className="flex-1" />
                            </div>
                            <Skeleton className="w-full h-4" />
                        </div>
                        <Card>
                            <CardContent className="flex flex-col gap-2">
                                <Skeleton className="w-full h-6" />
                                <Skeleton className="w-full h-4" />
                                <Skeleton className="w-1/4 h-4" />
                            </CardContent>
                            <Separator />
                            <CardContent className="flex flex-col gap-2">
                                <Skeleton className="w-full h-6" />
                                <Skeleton className="w-full h-4" />
                                <Skeleton className="w-1/4 h-4" />
                            </CardContent>
                            <Separator />
                            <CardContent className="flex flex-col gap-2">
                                <Skeleton className="w-full h-6" />
                                <Skeleton className="w-full h-4" />
                                <Skeleton className="w-1/4 h-4" />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-1/5 h-4" />
                                <Separator className="flex-1" />
                            </div>
                            <Skeleton className="w-3/4 h-4" />
                        </div>
                        <Card>
                            <CardContent className="flex flex-col gap-2">
                                <Skeleton className="w-full h-6" />
                                <Skeleton className="w-full h-4" />
                                <Skeleton className="w-1/4 h-4" />
                            </CardContent>
                            <Separator />
                            <CardContent className="flex flex-col gap-2">
                                <Skeleton className="w-full h-6" />
                                <Skeleton className="w-full h-4" />
                                <Skeleton className="w-1/4 h-4" />
                            </CardContent>
                            <Separator />
                            <CardContent className="flex flex-col gap-2">
                                <Skeleton className="w-full h-6" />
                                <Skeleton className="w-full h-4" />
                                <Skeleton className="w-1/4 h-4" />
                            </CardContent>
                        </Card>
                    </div>
                    <div>
                        <Separator />
                        <div className="flex items-center mt-5">
                            <p className="text-xs text-zinc-600">Make sure to save the changes before leaving this page!</p>
                            <Button className="ml-auto" disabled={true}>Save changes</Button>
                        </div>
                    </div>
                </div>

            </div>
        )
    } else if (isSaving && settings) {
        return (
            <div className="flex-1 overflow-y-auto p-8 max-w-3xl mx-auto w-full">
                <div className="mb-5">
                    <h1>Settings</h1>
                    <p className="text-xs text-zinc-700">Global panel configuration.</p>
                </div>

                {(Object.keys(changes).length != 0) &&
                    <Alert className="bg-amber-50 dark:bg-amber-950 absolute bottom-10 right-10 w-fit h-16 flex items-center p-5 animate-fade-in-up duration-400">
                        <TriangleAlert />
                        <AlertTitle className="text-base" >
                            You have unsaved changes!
                        </AlertTitle>
                    </Alert>
                }

                <div className="flex flex-col gap-5">

                    {CONFIG_SECTION.map((section, index) => (
                        <div className="flex flex-col gap-2" key={index}>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-lg">{section.sectionTitle}</h1>
                                    <Separator className="flex-1" />
                                </div>
                                <p className="text-xs text-zinc-700">{section.sectionDescription}</p>
                            </div>
                            <Card className="m-1">
                                {section.fields.map((field, idx) => (
                                    <Fragment key={idx}>
                                        <CardContent className="flex flex-col gap-2">
                                            {(field.controlType == "switch") && (
                                                <>
                                                    <div className="flex items-center gap-2">
                                                        <h1 className="text-base">{field.fieldTitle}</h1>
                                                        {(field.badge != "") && <Badge className="text-[7px]">{field.badge.toUpperCase()}</Badge>}
                                                        <Switch className="ml-auto" defaultChecked={settings[field.configKey] === "true"} onCheckedChange={handleSwitchChange(field.configKey)} disabled />
                                                    </div>
                                                    <p className="text-xs text-zinc-600">{field.fieldDescription}</p>
                                                </>
                                            )}
                                            {(field.controlType == "input") && (
                                                <>
                                                    <div className="flex items-center gap-2">
                                                        <h1 className="text-base">{field.fieldTitle}</h1>
                                                        {(field.badge != "") && <Badge className="text-[7px]">{field.badge.toUpperCase()}</Badge>}
                                                    </div>
                                                    <p className="text-xs text-zinc-600">{field.fieldDescription}</p>
                                                    <Input placeholder={field.inputPlaceholder} defaultValue={settings[field.configKey]} data-config-key={field.configKey} onChange={handleInputChange(field.configKey)} disabled />
                                                </>
                                            )}
                                        </CardContent>
                                        {(idx < section.fields.length - 1) && <Separator />}
                                    </Fragment>
                                ))}
                            </Card>
                        </div>
                    ))}

                    <div>
                        <Separator />
                        <div className="flex items-center mt-5">
                            <p className="text-xs text-zinc-600">Make sure to save the changes before leaving this page!</p>
                            <Button className="ml-auto" onClick={handleSave} disabled><Spinner /></Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    else if(settings) {
        return (
            <div className="flex-1 overflow-y-auto p-8 max-w-3xl mx-auto w-full">
                <div className="mb-5">
                    <h1>Settings</h1>
                    <p className="text-xs text-zinc-700">Global panel configuration.</p>
                </div>

                {(Object.keys(changes).length != 0) &&
                    <Alert className="bg-amber-50 dark:bg-amber-950 absolute bottom-10 right-10 w-fit h-16 flex items-center p-5 animate-fade-in-up duration-400">
                        <TriangleAlert />
                        <AlertTitle className="text-base" >
                            You have unsaved changes!
                        </AlertTitle>
                    </Alert>
                }

                <div className="flex flex-col gap-5">

                    {CONFIG_SECTION.map((section, index) => (
                        <div className="flex flex-col gap-2" key={index}>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-lg">{section.sectionTitle}</h1>
                                    <Separator className="flex-1" />
                                </div>
                                <p className="text-xs text-zinc-700">{section.sectionDescription}</p>
                            </div>
                            <Card className="m-1">
                                {section.fields.map((field, idx) => (
                                    <Fragment key={idx}>
                                        <CardContent className="flex flex-col gap-2">
                                            {(field.controlType == "switch") && (
                                                <>
                                                    <div className="flex items-center gap-2">
                                                        <h1 className="text-base">{field.fieldTitle}</h1>
                                                        {(field.badge != "") && <Badge className="text-[7px]">{field.badge.toUpperCase()}</Badge>}
                                                        <Switch className="ml-auto" defaultChecked={settings[field.configKey] === "true"} onCheckedChange={handleSwitchChange(field.configKey)} />
                                                    </div>
                                                    <p className="text-xs text-zinc-600">{field.fieldDescription}</p>
                                                </>
                                            )}
                                            {(field.controlType == "input") && (
                                                <>
                                                    <div className="flex items-center gap-2">
                                                        <h1 className="text-base">{field.fieldTitle}</h1>
                                                        {(field.badge != "") && <Badge className="text-[7px]">{field.badge.toUpperCase()}</Badge>}
                                                    </div>
                                                    <p className="text-xs text-zinc-600">{field.fieldDescription}</p>
                                                    <Input placeholder={field.inputPlaceholder} defaultValue={settings[field.configKey]} data-config-key={field.configKey} onChange={handleInputChange(field.configKey)} />
                                                </>
                                            )}
                                        </CardContent>
                                        {(idx < section.fields.length - 1) && <Separator />}
                                    </Fragment>
                                ))}
                            </Card>
                        </div>
                    ))}

                    <div>
                        <Separator />
                        <div className="flex items-center mt-5">
                            <p className="text-xs text-zinc-600">Make sure to save the changes before leaving this page!</p>
                            <Button className="ml-auto" onClick={handleSave}>Save changes</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
