"use client"

import { useAuth } from "@/components/context/AuthContext";

export default function DashboardPage(){

    //@ts-expect-error
    const {token} = useAuth();

    return(
        <div className="m-2 overflow-auto">
            {token}
        </div>
    )
}