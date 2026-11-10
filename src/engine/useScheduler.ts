import { useEffect } from 'react'
import { ANNOYANCES } from './configs'
import { pickToOpen, scrollPercent } from './scheduler'
import { useGame } from './store'

const TICK_MS = 250

/** Раз на тік питає планувальник, кого випустити на користувача. */
export function useScheduler() {
  // Поки користувач «на сайті рекламодавця», нових вікон не відкриваємо.
  const enabled = useGame(
    (s) => !s.calm && s.screen === 'article' && s.adPage === null,
  )

  useEffect(() => {
    if (!enabled) return
    let maxScroll = 0

    const tick = () => {
      const game = useGame.getState()
      const now = Date.now()
      maxScroll = Math.max(
        maxScroll,
        scrollPercent(
          window.scrollY,
          document.documentElement.scrollHeight,
          window.innerHeight,
        ),
      )
      const ids = pickToOpen(ANNOYANCES, game.runtimes, {
        now,
        elapsedMs: now - game.startedAt,
        maxScrollPercent: maxScroll,
        lastModalClosedAt: game.lastModalClosedAt,
      })
      for (const id of ids) game.open(id)
    }

    const timer = window.setInterval(tick, TICK_MS)
    return () => window.clearInterval(timer)
  }, [enabled])
}
