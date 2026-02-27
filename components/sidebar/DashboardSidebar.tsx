"use client";
import Link from "next/link";

import { ChevronsUpDown, LogOut } from "lucide-react";

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";
import { Card, CardContent } from "../ui/card";
import { UsageBar } from "../ui/usage-bars";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import Avatar from "boring-avatars";

import { useAuth } from "../context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";
import { SIDEBAR_DATA } from "@/lib/templates/settings";


export function DashboardSidebar() {
    const { user, isLoading, logout } = useAuth();
    const isMobile = useIsMobile();

    const {open} = useSidebar();

    const pathname = usePathname()

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="text-center font-bold text-xl group-data-[collapsible=icon]:hidden">
                Openveins
            </SidebarHeader>
            <SidebarHeader className="text-center font-bold text-xl hidden group-data-[collapsible=icon]:block">
                O
            </SidebarHeader>
            <SidebarContent>
                {SIDEBAR_DATA.groups.map((group, idx) => (
                    <SidebarGroup key={idx}>
                        <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item, index) => (
                                    <SidebarMenuItem key={index}>
                                        <SidebarMenuButton asChild data-selected={pathname == item.href} className={"data-[selected=true]:text-white data-[selected=true]:bg-primary"} tooltip={item.label}>
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
                <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                    <SidebarGroupLabel>Nodes health</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <Card>
                            <CardContent className="flex flex-col gap-2">
                                {SIDEBAR_DATA.nodesHealth.map((node, index) => (
                                    <UsageBar title={node.name} usage={node.value} key={index} />
                                ))}
                            </CardContent>
                        </Card>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                {(!isLoading && user) &&
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton size={open ? "lg" : "sm"}>
                                        <Avatar name={user.username} colors={["#beed80", "#59d999", "#31ada1", "#51647a", "#453c5c"]} variant="marble" square />
                                        <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                                            <span className="truncate font-medium">{user.username}</span>
                                            <span className="truncate text-xs">{user.email}</span>
                                        </div>
                                        <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
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