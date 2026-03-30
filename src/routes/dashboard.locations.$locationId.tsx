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
import { useDashboard } from '@/contexts/dashboard-context'
import type { ApiResponse, LocationResponse } from '@/types/Types'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Globe, Save, Trash2 } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

export const Route = createFileRoute('/dashboard/locations/$locationId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { getLocation, updateLocation, deleteLocation, error } = useDashboard()
  const { locationId } = Route.useParams()
  const navigate = useNavigate()

  const [location, setLocation] = useState<LocationResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    const getData = async () => {
      setLoading(true)
      try {
        const response: ApiResponse<LocationResponse> | null = await getLocation(locationId)
        if (response?.success) {
          setLocation(response.data)
          setName(response.data.name)
          setDescription(response.data.description)
        } else {
          setLocation(null)
        }
      } catch {
        setLocation(null)
      } finally {
        setLoading(false)
      }
    }
    getData()
  }, [locationId])

  const handleSave = async () => {
    if (!location) return
    setSaving(true)
    try {
      const response = await updateLocation(locationId, { name, description })
      if (response?.success) {
        setLocation(response.data)
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const success = await deleteLocation(locationId)
      if (success) {
        navigate({ to: '/dashboard/locations' })
      }
    } finally {
      setDeleting(false)
    }
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

  if (error || !location) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-destructive">{error ?? 'Location not found.'}</p>
        </CardContent>
      </Card>
    )
  }

  const hasChanges = name !== location.name || description !== location.description

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Globe className="h-7 w-7 text-amber-500" />
        <h1 className="text-2xl font-bold">{location.name}</h1>
        <Badge variant="outline" className="text-muted-foreground">
          {location.id}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Location Details</CardTitle>
          <CardDescription>Edit the location name and description.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Location name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Location description"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleSave} disabled={!hasChanges || saving}>
              <Save className="h-4 w-4 mr-1" />
              {saving ? 'Saving...' : 'Save'}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={deleting}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete location</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete <span className="font-medium text-foreground">{location.name}</span>? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" onClick={handleDelete}>
                    {deleting ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
