import { useEffect, useRef } from 'react'
import { AnnoyanceSlot } from '../annoyances/AnnoyanceLayer'
import { ESC_PRESSES } from '../engine/useEmergencyExit'
import { useGame } from '../engine/store'
import { RageMeter } from './RageMeter'

export function SiteHeader() {
  const calm = useGame((s) => s.calm)
  const setCalm = useGame((s) => s.setCalm)

  // Висота липкої шапки змінюється (банер то є, то немає, на телефоні він
  // у кілька рядків) — передаємо її в CSS, щоб якорі не ховались під шапкою.
  const stickyRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const sticky = stickyRef.current
    if (!sticky) return
    const update = () =>
      document.documentElement.style.setProperty(
        '--sticky-top',
        `${sticky.offsetHeight}px`,
      )
    update()
    const observer = new ResizeObserver(update)
    observer.observe(sticky)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={stickyRef} className="sticky top-0 z-30">
      {calm && (
        <div
          role="status"
          className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-emerald-700 px-4 py-2 text-center text-sm text-white"
        >
          <span>😮‍💨 Режим спокою: увесь хаос вимкнено.</span>
          <button
            type="button"
            onClick={() => setCalm(false)}
            className="rounded-full border border-white/60 px-3 py-0.5 text-xs font-semibold hover:bg-white/15"
          >
            Повернути хаос
          </button>
        </div>
      )}
      <AnnoyanceSlot slot="top" />
      <header className="border-b border-shell bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-2 short:py-1">
          <a href="#top" className="flex items-baseline gap-2 no-underline">
            <span className="whitespace-nowrap font-serif text-xl font-bold text-ink sm:text-2xl">
              🥚 Жовток
            </span>
            <span className="hidden text-xs text-ink-soft sm:inline">
              кулінарний блог №1*
            </span>
          </a>
          <div className="flex items-center gap-2 sm:gap-3">
            <RageMeter />
            {!calm && (
              <button
                type="button"
                onClick={() => setCalm(true)}
                title={`Режим спокою — вимкнути весь хаос (або Esc × ${ESC_PRESSES})`}
                aria-label="Режим спокою: вимкнути весь хаос"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-shell bg-white text-base leading-none opacity-60 hover:opacity-100"
              >
                😮‍💨
              </button>
            )}
          </div>
        </div>
      </header>
    </div>
  )
}
