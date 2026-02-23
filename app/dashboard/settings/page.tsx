"use client"

import { useDashboard } from "@/components/context/DashboardContext";
import SettingsPageSkeleton from "@/components/skeletons/SettingsPageSkeleton";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Codeblock from "@/components/ui/codeblock";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { CONFIG_SECTION } from "@/lib/templates/settings";
import { TriangleAlert } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { toast } from "sonner";

export default function DashboardSettingsPage() {


    const [changes, setChanges] = useState<Record<string, string | boolean>>({});
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const { settings, isLoading, patchSettings, patchResponse } = useDashboard();

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
        setChanges(prev => ({ ...prev, [field]: e }));
    }

    const handleInputChange = (field: string) => (e: ChangeEvent<any>) => {
        setChanges(prev => ({ ...prev, [field]: e.target.value }));
    }

    if (isLoading && !settings) {
        return (
            <SettingsPageSkeleton />
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
    else if (settings) {
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
