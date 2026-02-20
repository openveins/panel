"use client";
import Link from "next/link";

import { Archive, ChevronsUpDown, Clock3, Diamond, FolderTree, HardDrive, LayoutDashboard, LayoutTemplate, LogOut, Settings, Shield, SquareChevronRight, Users } from "lucide-react";

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { Card, CardContent } from "../ui/card";
import { UsageBar } from "../ui/usage-bars";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import Avatar from "boring-avatars";

import { useAuth } from "../context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

let data = {
    "groups": [
        {
            "label": "Overview",
            "items": [
                { "label": "Dashboard", "href": "/dashboard", "icon": LayoutDashboard }
            ]
        },
        {
            "label": "Infra",
            "items": [
                { "label": "Nodes", "href": "/dashboard", "icon": Diamond, "badge": { "value": "3", "className": "bg-emerald-200" } },
                { "label": "Servers", "href": "/dashboard", "icon": HardDrive },
                { "label": "Templates", "href": "/dashboard", "icon": LayoutTemplate }
            ]
        },
        {
            "label": "Management",
            "items": [
                { "label": "Users", "href": "/dashboard", "icon": Users, "badge": { "value": "24", "className": "bg-foreground/20" } },
                { "label": "File Manager", "href": "/dashboard", "icon": FolderTree },
                { "label": "Console", "href": "/dashboard", "icon": SquareChevronRight },
                { "label": "Schedules", "href": "/dashboard", "icon": Clock3 },
                { "label": "Backups", "href": "/dashboard", "icon": Archive }
            ]
        },
        {
            "label": "System",
            "items": [
                { "label": "Audit Log", "href": "/dashboard", "icon": Shield, "badge": { "value": "!", "className": "bg-red-300" } },
                { "label": "Settings", "href": "/dashboard", "icon": Settings }
            ]
        }
    ],
    "nodesHealth": [
        { "name": "eu-east-1", "value": 40 },
        { "name": "eu-east-2", "value": 80 },
        { "name": "na-west-1", "value": 100 }
    ]
}


export function DashboardSidebar() {
    //@ts-expect-error
    const { user, isLoading, logout, isAuthenticated } = useAuth();
    const isMobile = useIsMobile();
    return (
        <Sidebar>
            <SidebarHeader className="text-center font-bold text-xl">
                Openveins
            </SidebarHeader>
            <SidebarContent>
                {data.groups.map((group, index) => (
                    <SidebarGroup key={index}>
                        <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item, index) => (
                                    <SidebarMenuItem key={index}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.href}>
                                                <item.icon />
                                                {item.label}
                                            </Link>
                                        </SidebarMenuButton>
                                        {item.badge != null && <SidebarMenuBadge className={item.badge.className}>{item.badge.value}</SidebarMenuBadge>}
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
                <SidebarGroup>
                    <SidebarGroupLabel>Nodes health</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <Card>
                            <CardContent className="flex flex-col gap-2">
                                {data.nodesHealth.map((node, index) => (
                                    <UsageBar title={node.name} usage={node.value} key={index} />
                                ))}
                            </CardContent>
                        </Card>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                {(!isLoading && isAuthenticated) &&
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton size={"lg"}>
                                        <Avatar name={user.username} colors={["#beed80", "#59d999", "#31ada1", "#51647a", "#453c5c"]} variant="marble" square className="size-16" />
                                        <div className="flex flex-col">
                                            <span className="truncate font-medium">{user.username}</span>
                                            <span className="truncate text-xs">{user.email}</span>
                                        </div>
                                        <ChevronsUpDown className="ml-auto size-4" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    side={isMobile ? "bottom" : "right"}
                                    align="end"
                                    sideOffset={4}
                                >
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem variant={"destructive"} onClick={() => { logout() }}>
                                            <LogOut /> Log out
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>

                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                }
            </SidebarFooter>
        </Sidebar>
    )
}