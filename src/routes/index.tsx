import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
    beforeLoad: ({context}) => {
        if(context.user) throw redirect({to: "/dashboard"});
        throw redirect({to: "/auth/login"})
    },
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/"!</div>
}
