import { useAuth } from "@/contexts/auth-context"
import { SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import Avatar from "boring-avatars"
import { ChevronsUpDown, LogOut, UserRoundPen } from "lucide-react";
import { Link } from "@tanstack/react-router";

export default function UserSidebarFooter() {

    const { user, logout } = useAuth();
    const { open } = useSidebar();
    const isMobile = useIsMobile();


    if (user) {
        return (
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton size={open ? "lg" : "sm"}>
                                    <Avatar name={user.username} colors={["#beed80", "#59d999", "#31ada1", "#51647a", "#453c5c"]} variant="marble" square size={64}/>
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
                                    <DropdownMenuItem asChild>
                                        <Link to={"/dashboard/profile"}>
                                            <UserRoundPen /> Profile settings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem variant={"destructive"} onClick={() => { logout() }}>
                                        <LogOut /> Log out
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        )
    }
}