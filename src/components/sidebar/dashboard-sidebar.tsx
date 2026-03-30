import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { SIDEBAR_DATA } from "@/lib/templates/static";
import { Link, useLocation } from "@tanstack/react-router";
import UserSidebarFooter from "./user-footer";
import { Card, CardContent } from "../ui/card";
import UsageBars from "../ui/usage-bars";

export default function DashboardSidebar(){
    const path = useLocation();

    return(
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
                                        <SidebarMenuButton asChild data-selected={path.pathname == item.href} className={"data-[selected=true]:text-white data-[selected=true]:bg-primary"} tooltip={item.label}>
                                            <Link to={item.href}>
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
                <Card className="m-2 group-data-[collapsible='icon']:hidden">
                    <CardContent className="flex flex-col gap-2">
                        {SIDEBAR_DATA.nodesHealth.map((node, idx) => (
                            <UsageBars title={node.name} usage={node.value} key={idx}/>
                        ))}
                    </CardContent>
                </Card>
            </SidebarContent>
            <UserSidebarFooter/>
        </Sidebar>
    )
}