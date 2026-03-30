import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import SettingsRow from '@/components/ui/settings-row'
import { Spinner } from '@/components/ui/spinner'
import { useDashboard } from '@/contexts/dashboard-context'
import { SETTINGS_DATA } from '@/lib/templates/static'
import { createFileRoute, useBlocker } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import { Fragment } from 'react/jsx-runtime'

export const Route = createFileRoute('/dashboard/settings')({
  component: RouteComponent,
})

function RouteComponent() {

  const [values, setValues] = useState<any>({});
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSaved, setSaved] = useState(false);
  const [isDirty, setDirty] = useState(false);

  const { settings, getPanelSettings, isLoading: isLoadingDashboard, savePanelSettings } = useDashboard();

  useBlocker({
    shouldBlockFn: () => {
      if(isDirty) return !confirm("Are you sure you want to leave? You have unsaved changes.");
      return false;
    },
  })

  const handleChange = useCallback((id: string, val: unknown) => {
    setValues((prev: any) => ({ ...prev, [id]: val }));
    setDirty(true);
    setSaved(false);
  }, []);

  const handleSave = useCallback(async () => {
    if (values == settings) return;

    setLoading(true);

    await savePanelSettings(values);

    setLoading(false);
    setDirty(false);
    setSaved(true);
  }, [values])

  useEffect(() => {
    getPanelSettings();
  }, [])

  useEffect(() => {
    setValues(settings);
  }, [settings])
  

  if (isLoadingDashboard || values == null) {
    return (
      <div>
        <Spinner />
      </div>
    )
  }

  return (
    <div className='w-full flex flex-col items-center overflow-y-auto'>
      <div className='max-w-3xl flex flex-col gap-5'>
        {SETTINGS_DATA.groups.map((element, idx) => (
          <div key={idx} className='flex flex-col gap-2'>
            <div>
              <div className='flex items-center gap-2'>
                <p className='text-xl'>{element.title}</p>
                <Separator className='flex-1' />
              </div>
              <p className='text-xs text-zinc-600'>{element.description}</p>
            </div>
            <Card className="m-1">
              {element.items.map((item, idx) => (
                <Fragment key={idx}>
                  <SettingsRow setting={item} value={values[item.id]} onChange={(e: any) => { handleChange(item.id, e) }} disabled={isLoading} />
                  {(idx < element.items.length - 1) && <Separator />}
                </Fragment>
              ))}
            </Card>
          </div>
        ))}
        <div>
          <Separator />
          <div className="flex items-center mt-5 px-2">
            <p className="text-xs text-zinc-600 dark:text-zinc-400">Make sure to save the changes before leaving this page!</p>
            <Button className="ml-auto" disabled={isLoading} onClick={handleSave}>{isLoading ? <Spinner /> : "Save"}</Button>
          </div>
        </div>
      </div>
      {(isDirty == true && isSaved == false) && (
        <Card className='absolute right-10 bottom-10 bg-amber-200 dark:bg-amber-600/50 animate-slide-in-right animate-duration-250'>
          <CardContent>You have unsaved changes, make sure to save before exiting this page.</CardContent>
        </Card>
      )}
    </div>
  )
}
