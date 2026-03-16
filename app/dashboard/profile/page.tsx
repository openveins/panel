"use client";

import { useAuth } from "@/components/context/AuthContext";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState } from "react";
import QRCode from "react-qr-code";
import {toast} from "sonner";

interface TOTPResponse {
    state: string
    message: string;
    qr: string | undefined;
}

export default function ProfileSettingsPage() {
    const { user, setupTOTP, verifyTOTP } = useAuth();

    //@ts-expect-error
    const [totpEnabled, setTotpEnabled] = useState<boolean>(user != null && user.settings.otpEnabled);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [totpResponse, setTotpResponse] = useState<TOTPResponse | null>(null);
    const [totpCode, setTotpCode] = useState<string>("");

    const handleSubmit = async () => {
        //@ts-expect-error
        if(totpEnabled == (user != null && user.settings.otpEnabled))
            return;

        setTotpCode("")
        const response = await setupTOTP(totpEnabled);
        setTotpResponse(response);

        if(response.state === "verify")
            setIsDialogOpen(true);
        else if(response.state === "error")
            toast.error("An error occured!", {description: response.message});
        
    }

    const handleVerify = async (code: string) => {
        const response = await verifyTOTP(code);
        setTotpResponse({state: response.state, message: response.message, qr: totpResponse!.qr});

        if(response.state === "success") {
            setIsDialogOpen(false);
            setTotpResponse(null);
        } else {
            toast.error("An error occured!", {description: response.message});
        }
    }

    return (
        <div className="flex flex-col items-center overflow-y-auto w-full">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 w-full">
                <SidebarTrigger />
                <Separator orientation="vertical" className="ml-2" />
                <Breadcrumb className="ml-2">
                    <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="/dashboard" className="text-base">dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-base">profile settings</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>
            <main className="p-8 max-w-3xl">
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-lg">Security</h1>
                                <Separator className="flex-1" />
                            </div>
                            <p className="text-xs text-zinc-700">Setup security for your account to ensure only you have access.</p>
                        </div>
                        <Card className="m-1">
                            <CardContent className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <h1 className="text-base">2FA</h1>
                                    <Switch className="ml-auto" checked={totpEnabled} onCheckedChange={(e) => {setTotpEnabled(e)}}/>
                                </div>
                                <p className="text-xs text-zinc-600">Enable 2FA on your account.</p>
                            </CardContent>
                            {/* {(idx < section.fields.length - 1) && <Separator />} */}
                        </Card>
                    </div>

                    <div>
                        <Separator />
                        <div className="flex items-center mt-5 gap-2">
                            <p className="text-xs text-zinc-600">Make sure to save the changes before leaving this page!</p>
                            <Button className="ml-auto" onClick={handleSubmit} >Save changes</Button>
                        </div>
                    </div>
                </div>
            </main>


            <Dialog open={isDialogOpen} >
                <DialogContent showCloseButton={false}>
                    <DialogHeader>
                        <DialogTitle>Finish setting up your 2fa verification.</DialogTitle>
                        <DialogDescription>Scan this QR code with your authenticator app and input the code the app generates in the input field.</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-10">
                        {isDialogOpen && <QRCode value={atob(totpResponse?.qr!)} className="p-3 bg-white" />}

                        <InputOTP maxLength={6} value={totpCode} onChange={(value) => { setTotpCode(value); if(value.length == 6) { handleVerify(value) }}} pattern={REGEXP_ONLY_DIGITS}>
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                        <Button onClick={() => handleVerify(totpCode)} disabled={totpCode.length < 6}>Verify</Button>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    )
}