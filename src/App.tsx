import { MotionConfig } from 'motion/react'
import { useEffect } from 'react'
import { AnnoyanceOverlays } from './annoyances/AnnoyanceLayer'
import { SiteHeader } from './components/SiteHeader'
import { useGame } from './engine/store'
import { ESC_PRESSES, useEmergencyExit } from './engine/useEmergencyExit'
import { useScheduler } from './engine/useScheduler'
import { Article } from './pages/Article'
import { Victory } from './pages/Victory'

export default function App() {
  const screen = useGame((s) => s.screen)

  useScheduler()
  useEmergencyExit()

  useEffect(() => {
    if (screen === 'victory') window.scrollTo({ top: 0, behavior: 'instant' })
  }, [screen])

  return (
    <MotionConfig reducedMotion="user">
      <div id="top" className="flex min-h-dvh flex-col">
        <SiteHeader />
        <div className="flex-1">
          {screen === 'article' ? <Article /> : <Victory />}
        </div>
        <footer className="border-t border-shell bg-shell/40 px-4 py-6 text-center text-xs text-ink-soft">
          <p>
            *За версією блогу «Жовток». © 2026 Жовток — сайт-пародія на все,
            що бісить в інтернеті.
          </p>
          <p className="mt-1">
            Тут немає справжніх платежів, cookie, розсилок і трекерів: усі
            форми та «покупки» несправжні й нічого нікуди не відправляють.
          </p>
          <p className="mt-1">
            Втомилися? Натисніть 😮‍💨 у шапці або Esc {ESC_PRESSES} разів — і
            хаос зникне.
          </p>
        </footer>
      </div>
      <AnnoyanceOverlays />
    </MotionConfig>
  )
}
