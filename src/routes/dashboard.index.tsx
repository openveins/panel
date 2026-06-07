import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import UsageBars from '@/components/ui/usage-bars'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Server, Users, Globe, Diamond, CircleCheck, CircleX } from 'lucide-react'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
})

const STATS = [
  { label: 'Servers', value: '12', icon: Server, badge: { label: '8 Online', variant: 'default' as const } },
  { label: 'Users', value: '24', icon: Users, badge: { label: '3 New', variant: 'secondary' as const } },
  { label: 'Locations', value: '4', icon: Globe, badge: { label: '2 Countries', variant: 'outline' as const } },
  { label: 'Nodes', value: '3', icon: Diamond, badge: { label: 'All Healthy', variant: 'default' as const } },
]

const NODE_USAGE = [
  { name: 'eu-east-1', cpu: 40, ram: 55, disk: 30 },
  { name: 'eu-east-2', cpu: 78, ram: 62, disk: 45 },
  { name: 'na-west-1', cpu: 92, ram: 88, disk: 70 },
]

const RECENT_SERVERS = [
  { name: 'My Minecraft Server', node: 'eu-east-1', owner: 'admin@rynav.xyz', status: 'running' as const, cpu: 12, ram: 2048 },
  { name: 'Valheim World', node: 'eu-east-2', owner: 'totp@rynav.xyz', status: 'running' as const, cpu: 45, ram: 4096 },
  { name: 'Test Server', node: 'na-west-1', owner: 'nototp@rynav.xyz', status: 'stopped' as const, cpu: 0, ram: 1024 },
  { name: 'CS2 Match', node: 'eu-east-1', owner: 'admin@rynav.xyz', status: 'running' as const, cpu: 67, ram: 6144 },
]

function RouteComponent() {
  return (
    <div className="flex flex-col gap-4">
      <div className="w-full bg-secondary p-2 flex items-center gap-2">
        <p>Dashboard</p>
        <p className="text-xs text-zinc-600">overview of your panel and nodes.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {STATS.map((stat) => (
          <Card key={stat.label} size="sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <stat.icon className="size-4" />
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold">{stat.value}</span>
                <Badge variant={stat.badge.variant}>{stat.badge.label}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Node Resource Usage</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {NODE_USAGE.map((node) => (
              <div key={node.name} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Diamond className="size-3" />
                  <span className="text-xs font-medium">{node.name}</span>
                </div>
                <UsageBars title="CPU" usage={node.cpu} />
                <UsageBars title="RAM" usage={node.ram} />
                <UsageBars title="Disk" usage={node.disk} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Servers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Server</TableHead>
                  <TableHead>Node</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>CPU</TableHead>
                  <TableHead className="text-right">RAM</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {RECENT_SERVERS.map((server) => (
                  <TableRow key={server.name}>
                    <TableCell className="font-medium">{server.name}</TableCell>
                    <TableCell className="text-muted-foreground">{server.node}</TableCell>
                    <TableCell>
                      {server.status === 'running' ? (
                        <Badge variant="default" className="gap-1">
                          <CircleCheck className="size-3" />
                          Running
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <CircleX className="size-3" />
                          Stopped
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{server.cpu}%</TableCell>
                    <TableCell className="text-right">{(server.ram / 1024).toFixed(1)} GB</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
