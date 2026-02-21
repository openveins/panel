"use client"

import { useAuth } from "@/components/context/AuthContext";

export default function DashboardPage(){

    const {token} = useAuth();

    return(
        <div className="m-2 overflow-auto">
            {token ? token : "not logged in"}
        </div>
    )
}