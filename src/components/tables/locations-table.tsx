import { type ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/button"
import { Link } from "@tanstack/react-router"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Ellipsis } from "lucide-react"
import { useDashboard } from "@/contexts/dashboard-context"

export type Location = {
    id: string,
    name: string,
    description: string,
    createdAt: string,
    updatedAt: string,
}


export const columns: ColumnDef<Location>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            const id = row.original.id
            const name = row.original.name

            return (
                <Button variant={"link"} asChild>
                    <Link to={`/dashboard/locations/$locationId`} params={{ locationId: id }}>{name}</Link>
                </Button>
            )
        }
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        id: "action",
        cell: ({row}) => {
            const {deleteLocation} = useDashboard();
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild >
                        <Button>
                            <Ellipsis />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant={"destructive"} onClick={async () => {await deleteLocation(row.original.id)}}>Delete location</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]


