import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Diamond, Save, Trash2, CircleCheck, CircleX, Copy, Check } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { api } from '@/api/client'
import type { ApiResponse, LocationResponse } from '@/types/Types'
import UsageBars from '@/components/ui/usage-bars'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

type ConnectionScheme = "ip" | "domain" | "domain-ssl"

interface NodeDetail {
  id: string
  name: string
  location: string
  scheme: ConnectionScheme
  fqdn: string
  port: number
  behindProxy: boolean
  memory: number
  disk: number
  memoryUsed: number
  diskUsed: number
  cpuUsed: number
  status: "online" | "offline"
  createdAt: string
  updatedAt: string
}

const SAMPLE_NODES: Record<string, NodeDetail> = {
  "1": { id: "1", name: "eu-east-1", location: "Frankfurt", scheme: "domain-ssl", fqdn: "eu-east-1.openveins.io", port: 443, behindProxy: false, memory: 32768, disk: 512000, memoryUsed: 18000, diskUsed: 153600, cpuUsed: 40, status: "online", createdAt: "2025-01-15T10:00:00Z", updatedAt: "2026-06-01T08:30:00Z" },
  "2": { id: "2", name: "eu-east-2", location: "London", scheme: "domain", fqdn: "eu-east-2.openveins.io", port: 8080, behindProxy: true, memory: 16384, disk: 256000, memoryUsed: 10240, diskUsed: 115200, cpuUsed: 78, status: "online", createdAt: "2025-03-20T14:00:00Z", updatedAt: "2026-05-28T12:15:00Z" },
  "3": { id: "3", name: "na-west-1", location: "San Francisco", scheme: "ip", fqdn: "203.0.113.50", port: 8080, behindProxy: false, memory: 65536, disk: 1024000, memoryUsed: 0, diskUsed: 0, cpuUsed: 0, status: "offline", createdAt: "2025-06-10T09:00:00Z", updatedAt: "2026-04-15T16:45:00Z" },
}

export const Route = createFileRoute('/dashboard/nodes/$nodeId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { nodeId } = Route.useParams()
  const navigate = useNavigate()

  const [node, setNode] = useState<NodeDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<"overview" | "config">("overview")
  const [copied, setCopied] = useState(false)

  const [locations, setLocations] = useState<LocationResponse[]>([])
  const [locationId, setLocationId] = useState("")

  const [scheme, setScheme] = useState<ConnectionScheme>("domain-ssl")
  const [fqdn, setFqdn] = useState("")
  const [port, setPort] = useState(443)
  const [behindProxy, setBehindProxy] = useState(false)

  useEffect(() => {
    api.get<ApiResponse<LocationResponse[]>>("/api/locations").then(({ data }) => {
      if (data.success) setLocations(data.data)
    })
  }, [])

  useEffect(() => {
    setLoading(true)
    const found = SAMPLE_NODES[nodeId]
    if (found) {
      setNode(found)
      setLocationId(found.location)
      setScheme(found.scheme)
      setFqdn(found.fqdn)
      setPort(found.port)
      setBehindProxy(found.behindProxy)
    } else {
      setNode(null)
    }
    setLoading(false)
  }, [nodeId])

  const handleCopy = async () => {
    const config = generateConfig(node!)
    await navigator.clipboard.writeText(config)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-7 w-40" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-56 mt-1" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!node) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-destructive">Node not found.</p>
        </CardContent>
      </Card>
    )
  }

  const memoryPercent = Math.round((node.memoryUsed / node.memory) * 100)
  const diskPercent = Math.round((node.diskUsed / node.disk) * 100)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Diamond className="h-7 w-7 text-amber-500" />
        <h1 className="text-2xl font-bold">{node.name}</h1>
        <Badge variant="outline" className="text-muted-foreground">
          {node.id}
        </Badge>
        {node.status === "online" ? (
          <Badge variant="default" className="gap-1 ml-auto">
            <CircleCheck className="size-3" />
            Online
          </Badge>
        ) : (
          <Badge variant="secondary" className="gap-1 ml-auto">
            <CircleX className="size-3" />
            Offline
          </Badge>
        )}
      </div>

      <div className="flex gap-1 border-b">
        <button
          onClick={() => setTab("overview")}
          data-active={tab === "overview"}
          className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[active=true]:border-foreground data-[active=true]:text-foreground text-muted-foreground hover:text-foreground transition-colors"
        >
          Overview
        </button>
        <button
          onClick={() => setTab("config")}
          data-active={tab === "config"}
          className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[active=true]:border-foreground data-[active=true]:text-foreground text-muted-foreground hover:text-foreground transition-colors"
        >
          Configuration
        </button>
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Node Details</CardTitle>
              <CardDescription>Edit the node connection information.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Select value={locationId} onValueChange={setLocationId}>
                    <SelectTrigger id="location" className="w-full">
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc.id} value={loc.name}>{loc.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="scheme">Connection Type</Label>
                  <Select value={scheme} onValueChange={(v: ConnectionScheme) => {
                    setScheme(v)
                    if (v === "ip") setPort(8080)
                    else if (v === "domain-ssl") setPort(443)
                  }}>
                    <SelectTrigger id="scheme" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ip">IP (no SSL)</SelectItem>
                      <SelectItem value="domain">Domain (no SSL)</SelectItem>
                      <SelectItem value="domain-ssl">Domain (SSL)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="fqdn">{scheme === "ip" ? "IP Address" : "FQDN"}</Label>
                  <Input
                    id="fqdn"
                    value={fqdn}
                    onChange={(e) => setFqdn(e.target.value)}
                    placeholder={scheme === "ip" ? "203.0.113.50" : "node.example.com"}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="port">Port</Label>
                  <Input
                    id="port"
                    type="number"
                    value={port}
                    onChange={(e) => setPort(e.target.valueAsNumber)}
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <Label htmlFor="proxy">Behind Proxy</Label>
                    <p className="text-xs text-muted-foreground">Enable if a reverse proxy handles SSL termination.</p>
                  </div>
                  <Switch id="proxy" checked={behindProxy} onCheckedChange={setBehindProxy} />
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-2">
                <Button>
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete node</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete <span className="font-medium text-foreground">{node.name}</span>? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction variant="destructive" onClick={() => navigate({ to: '/dashboard/nodes' })}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resource Usage</CardTitle>
              <CardDescription>Current utilization of the node.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <UsageBars title="CPU" usage={node.cpuUsed} />
              <UsageBars title="Memory" usage={memoryPercent} />
              <UsageBars title="Disk" usage={diskPercent} />
            </CardContent>
          </Card>
        </div>
      )}

      {tab === "config" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Node Configuration</CardTitle>
                <CardDescription>Copy this configuration file to the node to connect it to the panel.</CardDescription>
              </div>
              <Button variant="outline" onClick={handleCopy}>
                {copied ? <Check className="size-4 mr-1" /> : <Copy className="size-4 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <pre className="overflow-x-auto bg-muted p-4 text-xs leading-relaxed">
              <code>{generateConfig(node)}</code>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function generateConfig(node: NodeDetail): string {
  const useSsl = node.scheme === "domain-ssl"
  const scheme = useSsl ? "https" : "http"
  const sslBlock = useSsl ? `  ssl:
    enabled: true
    cert: /etc/openveins/certs/cert.pem
    key: /etc/openveins/certs/key.pem` : `  ssl:
    enabled: false`

  return `# OpenVeins Node Configuration
# Generated for ${node.name}

server:
  scheme: ${scheme}
  host: ${node.fqdn}
  port: ${node.port}
  behind_proxy: ${node.behindProxy}
${sslBlock}

panel:
  endpoint: https://panel.openveins.io
  token: <insert-node-token-here>

resources:
  memory: ${node.memory}
  disk: ${node.disk}
  cpu: 100

allowed_egress:
  - 0.0.0.0/0

allowed_ingress:
  - 0.0.0.0/0

debug: false
`
}
