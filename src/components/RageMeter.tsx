import { RAGE_BAR_MAX, rageLevel } from '../engine/rage'
import { useGame } from '../engine/store'

export function RageMeter() {
  const rage = useGame((s) => s.rage)
  const level = rageLevel(rage)
  const fill = Math.min(100, (rage / RAGE_BAR_MAX) * 100)

  return (
    <div
      className="flex items-center gap-2"
      role="img"
      aria-label={`Рівень гніву: ${level.label}, ${rage}`}
    >
      <span
        // Новий key на кожну зміну — смайлик смикається щоразу, коли гніву побільшало.
        key={rage}
        className={`text-2xl leading-none ${rage > 0 ? 'animate-shake' : ''}`}
        aria-hidden="true"
      >
        {level.emoji}
      </span>
      <div className="w-20 sm:w-36" aria-hidden="true">
        <div className="flex items-baseline justify-between text-[11px] font-semibold leading-tight">
          <span className="truncate">{level.label}</span>
          <span className="tabular-nums text-ink-soft">{rage}</span>
        </div>
        <div className="mt-0.5 h-2 overflow-hidden rounded-full bg-shell">
          <div
            className="h-full rounded-full bg-gradient-to-r from-yolk via-orange-500 to-red-600 transition-[width] duration-300"
            style={{ width: `${fill}%` }}
          />
        </div>
      </div>
    </div>
  )
}
