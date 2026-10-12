import { useCallback, useEffect, useRef, useState } from 'react'
import { getOrchids } from '../api/orchidService'
export default function useOrchids() {
  const [state, setState] = useState({
    orchids: [],
    loading: true,
    error: '',
    source: '',
  })
  const request = useRef(null)
  const load = useCallback(async (force = false) => {
    request.current?.abort()
    const controller = new AbortController()
    request.current = controller
    setState((previous) => ({ ...previous, loading: true, error: '' }))
    try {
      const result = await getOrchids({ force, signal: controller.signal })
      if (!controller.signal.aborted)
        setState({ ...result, loading: false, error: '' })
    } catch (error) {
      if (!controller.signal.aborted)
        setState({
          orchids: [],
          loading: false,
          error: error.message,
          source: '',
        })
    }
  }, [])
  useEffect(() => {
    load()
    return () => request.current?.abort()
  }, [load])
  return { ...state, reload: () => load(true), loadCached: () => load(false) }
}
