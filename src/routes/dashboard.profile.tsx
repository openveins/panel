import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useDashboard } from '@/contexts/dashboard-context'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { toast } from "sonner";
import { QRCode } from "react-qr-code"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { REGEXP_ONLY_DIGITS } from 'input-otp'

export const Route = createFileRoute('/dashboard/profile')({
	component: RouteComponent,
})

function RouteComponent() {

	const { user } = Route.useRouteContext();

	const [isTotpEnabled, setIsTotpEnabled] = useState<boolean>(false);
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

	const { toggleTOTP, verifyTOTP, error, isLoading } = useDashboard();

	const [totpCode, setTotpCode] = useState<string>("");
	const [qrCode, setQrCode] = useState<string>("");

	if (!user) {
		return (
			<p>An error occured during authentication</p>
		)
	}

	useEffect(() => {
		setIsTotpEnabled(user.settings.otpEnabled);
	}, [user]);

	async function handleToggle() {
		if (isTotpEnabled == (user != null && user.settings.otpEnabled))
			return;

		setTotpCode("");

		const response = await toggleTOTP(isTotpEnabled);
		console.log(response);
		if (response?.success && response.data.state == "verify") {
			setQrCode(response.data.qr);
			setIsDialogOpen(true);
			return;
		}
		if (error) {
			toast.error(error);
		}
	}

	async function handleVerify() {
		const response = await verifyTOTP(totpCode);
		if (response?.success) {
			toast.success("2FA has been enabled on your account!");
			setIsDialogOpen(false);
			return;
		}
		if (error) {
			toast.error(error);
		}
	}


	return (
		<div className='flex flex-col items-center overflow-y-auto w-full'>
			<main className='p-8 max-w-3xl'>
				<div className='flex flex-col gap-5'>
					<div className='flex flex-col gap-2'>
						<div>
							<div className='flex items-center gap-3'>
								<p className='text-lg'>Security</p>
								<Separator className="flex-1" />
							</div>
							<p className='text-xs text-zinc-600'>Setup security for your account to ensure only you have access.</p>
						</div>
						<Card className='m-1'>
							<CardContent className='flex flex-col gap-2'>
								<div className='flex items-center gap-2'>
									<p className='text-base'>2FA</p>
									<Switch className='ml-auto' checked={isTotpEnabled} onCheckedChange={(e) => { setIsTotpEnabled(e); }} />
								</div>
								<p className='text-xs text-zinc-600'>Enable 2FA on your account.</p>
							</CardContent>
						</Card>
					</div>
					<div>
						<Separator />
						<div className="flex items-center mt-5 gap-2">
							<p className="text-xs text-zinc-600">Make sure to save the changes before leaving this page!</p>
							<Button className="ml-auto" onClick={handleToggle} >Save changes</Button>
						</div>
					</div>
				</div>
			</main>

			<Dialog open={isDialogOpen}>
				<DialogContent showCloseButton={false} className='flex flex-col items-center gap-3'>
					<DialogHeader>
						<DialogTitle>Finish setting up your 2fa verification.</DialogTitle>
						<DialogDescription>Scan this QR code with your authenticator app and input the code the app generates in the input field.</DialogDescription>
					</DialogHeader>
					<div className='flex flex-col items-center gap-10'>
						{isDialogOpen && (
							<QRCode value={atob(qrCode)} />
						)}
					</div>
					<div className='flex flex-col items-center gap-5 mt-10'>
						<InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} onChange={(e) => setTotpCode(e)}>
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
						<Button disabled={isLoading || totpCode.length < 6} onClick={handleVerify}>
							Verify
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}
