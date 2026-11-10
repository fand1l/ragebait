import { useEffect } from 'react'
import { useGame } from './store'

export const ESC_PRESSES = 5
const WINDOW_MS = 3000

/** Аварійний вихід: Esc п'ять разів поспіль вмикає режим спокою. */
export function useEmergencyExit() {
  useEffect(() => {
    let presses: number[] = []

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      const now = Date.now()
      presses = [...presses.filter((t) => now - t < WINDOW_MS), now]
      if (presses.length >= ESC_PRESSES) {
        presses = []
        useGame.getState().setCalm(true)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
