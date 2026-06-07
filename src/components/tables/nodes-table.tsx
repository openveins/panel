import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/button"
import { Link } from "@tanstack/react-router"
import { Badge } from "../ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Ellipsis, CircleCheck, CircleX } from "lucide-react"

export type Node = {
    id: string,
    name: string,
    location: string,
    fqdn: string,
    port: number,
    memory: number,
    disk: number,
    status: "online" | "offline",
    createdAt: string,
    updatedAt: string,
}

export const columns: ColumnDef<Node>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            const id = row.original.id
            const name = row.original.name

            return (
                <Button variant="link" asChild>
                    <Link to="/dashboard/nodes/$nodeId" params={{ nodeId: id }}>{name}</Link>
                </Button>
            )
        }
    },
    {
        accessorKey: "fqdn",
        header: "FQDN",
    },
    {
        accessorKey: "location",
        header: "Location",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status
            return status === "online" ? (
                <Badge variant="default" className="gap-1">
                    <CircleCheck className="size-3" />
                    Online
                </Badge>
            ) : (
                <Badge variant="secondary" className="gap-1">
                    <CircleX className="size-3" />
                    Offline
                </Badge>
            )
        }
    },
    {
        accessorKey: "memory",
        header: "Memory",
        cell: ({ row }) => {
            const gb = (row.original.memory / 1024).toFixed(1)
            return <span>{gb} GB</span>
        }
    },
    {
        accessorKey: "disk",
        header: "Disk",
        cell: ({ row }) => {
            const gb = (row.original.disk / 1024).toFixed(1)
            return <span>{gb} GB</span>
        }
    },
    {
        id: "action",
        cell: () => {
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
                        <DropdownMenuItem variant="destructive">Delete node</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]
