import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/dashboard/profile')({
	component: RouteComponent,
})

function RouteComponent() {

	const {user} = Route.useRouteContext();

	const [isTotpEnabled, _] = useState<boolean>(false);
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
	// const [totpCode, setTotpCode] = useState<string>("");
	// const [qrCode, setQrCode] = useState<string>("");

	if(!user){
		return(
			<p>An error occured during authentication</p>
		)
	}


	return (
		<div className='flex flex-col items-center overflow-y-auto w-full'>
			<main className='p-8 max-w-3xl'>
				<div className='flex flex-col gap-5'>
					<div className='flex flex-col gap-2'>
						<div>
							<div className='flex items-center gap-3'>
								<p className='text-lg'>Security</p>
								<Separator className="flex-1"/>
							</div>
							<p className='text-xs text-zinc-600'>Setup security for your account to ensure only you have access.</p>
						</div>
						<Card className='m-1'>
							<CardContent className='flex flex-col gap-2'>
								<div className='flex items-center gap-2'>
									<p className='text-base'>2FA</p>
									<Switch className='ml-auto' checked={isTotpEnabled} onCheckedChange={(e) => {setIsDialogOpen(e)}} defaultChecked={user.settings.totpEnabled}/> 
								</div>
								<p className='text-xs text-zinc-600'>Enable 2FA on your account.</p>
							</CardContent>
						</Card>
					</div>
					<div>
                        <Separator />
                        <div className="flex items-center mt-5 gap-2">
                            <p className="text-xs text-zinc-600">Make sure to save the changes before leaving this page!</p>
                            <Button className="ml-auto" >Save changes</Button>
                        </div>
                    </div>
				</div>
			</main>

			<Dialog open={isDialogOpen}>
				<DialogContent showCloseButton={false}>
					<DialogHeader>
						<DialogTitle>Finish setting up your 2fa verification.</DialogTitle>
                        <DialogDescription>Scan this QR code with your authenticator app and input the code the app generates in the input field.</DialogDescription>
					</DialogHeader>
					<div className='flex flex-col items-center gap-10'>
						{/* {isDialogOpen && (
							<QRcode value={}/>
						)} */}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}
