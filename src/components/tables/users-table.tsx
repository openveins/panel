import { type ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/button"
import { Link } from "@tanstack/react-router"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Ellipsis } from "lucide-react"
import { useDashboard } from "@/contexts/dashboard-context"
import { Checkbox } from "../ui/checkbox"

export type User = {
    id: string,
    username: string,
    email: string,
    isOtpEnabled: boolean,
    createdAt: string,
    updatedAt: string,
}


export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "username",
        header: "Username",
        cell: ({ row }) => {
            const id = row.original.id
            const username = row.original.username

            return (
                <Button variant={"link"} asChild>
                    <Link to={`/dashboard/users/$userId`} params={{ userId: id }}>{username}</Link>
                </Button>
            )
        }
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "isOtpEnabled",
        header: "OTP enabled",
        cell: ({ row }) => {
            const isOtpEnabled = row.original.isOtpEnabled
            return (
                <Checkbox checked={isOtpEnabled} disabled />
            )
        }
    },
    {
        id: "timezone",
        header: "Timezone",
        "cell": ({ row }) => {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
            return (
                <span>{timezone}</span>
            )
        }
    },
    {
        id: "action",
        cell: ({row}) => {
            // const {deleteUser} = useDashboard();
            // onClick={async () => {await deleteUser(row.original.id)}}
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button>
                            <Ellipsis />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant={"destructive"} >Delete user</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]


