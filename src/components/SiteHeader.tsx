import { AnnoyanceSlot } from '../annoyances/AnnoyanceLayer'
import { ESC_PRESSES } from '../engine/useEmergencyExit'
import { useGame } from '../engine/store'
import { RageMeter } from './RageMeter'

export function SiteHeader() {
  const calm = useGame((s) => s.calm)
  const setCalm = useGame((s) => s.setCalm)

  return (
    <div className="sticky top-0 z-30">
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
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-2">
          <a href="#top" className="flex items-baseline gap-2 no-underline">
            <span className="font-serif text-2xl font-bold text-ink">
              🥚 Жовток
            </span>
            <span className="hidden text-xs text-ink-soft sm:inline">
              кулінарний блог №1*
            </span>
          </a>
          <div className="flex items-center gap-3">
            <RageMeter />
            {!calm && (
              <button
                type="button"
                onClick={() => setCalm(true)}
                title={`Режим спокою — вимкнути весь хаос (або Esc × ${ESC_PRESSES})`}
                aria-label="Режим спокою: вимкнути весь хаос"
                className="rounded-full border border-shell bg-white px-2 py-1 text-base leading-none opacity-60 hover:opacity-100"
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
