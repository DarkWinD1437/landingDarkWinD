import { useState, useEffect, useCallback } from 'react'

type CameraPermission = 'idle' | 'granted' | 'denied'

export function useCameraPermission() {
  const [permission, setPermission] = useState<CameraPermission>('idle')

  useEffect(() => {
    if (!navigator.permissions) return
    navigator.permissions
      .query({ name: 'camera' as PermissionName })
      .then(status => {
        if (status.state === 'granted') setPermission('granted')
        if (status.state === 'denied')  setPermission('denied')
        status.onchange = () => {
          if (status.state === 'granted') setPermission('granted')
          if (status.state === 'denied')  setPermission('denied')
        }
      })
      .catch(() => {})
  }, [])

  const onWebcamReady  = useCallback(() => setPermission('granted'), [])
  const onWebcamError  = useCallback(() => setPermission('denied'),  [])

  return { permission, onWebcamReady, onWebcamError }
}
