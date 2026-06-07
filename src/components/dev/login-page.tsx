import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const DEV_USERS = [
    {
        label: "Login as User (No OTP)",
        email: "nototp@rynav.xyz",
        password: import.meta.env.VITE_NOTOTP_USER_PASS
    },
    {
        label: "Login as User (OTP Enabled)",
        email: "totp@rynav.xyz",
        password: import.meta.env.VITE_TOTP_USER_PASS
    },
    {
        label: "Login as Admin",
        email: "admin@rynav.xyz",
        password: import.meta.env.VITE_ADMINTOTP_USER_PASS
    }
]

export default function LoginPageDev({onSelect}: {onSelect: (email: string, password: string) => void}) {
    if(import.meta.env.DEV) {
        return (
            <Card className=''>
                    <CardHeader>
                        <CardTitle>Dev login buttons</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        {DEV_USERS.map((user) => (
                            <Button key={user.email} variant={"outline"} onClick={() => onSelect(user.email, user.password)}>
                                {user.label}
                            </Button>
                        ))}
                    </CardContent>
            </Card>
        )
    }

}