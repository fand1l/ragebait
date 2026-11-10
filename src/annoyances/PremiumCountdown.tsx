import { useEffect, useState } from 'react'
import { useGame } from '../engine/store'
import { formatClock, initialSeconds, tickCountdown } from './countdown'
import type { AnnoyanceProps } from './types'

export function PremiumCountdown({ dismiss, showIndex }: AnnoyanceProps) {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    initialSeconds(showIndex),
  )
  const [extended, setExtended] = useState(false)

  useEffect(() => {
    let current = initialSeconds(showIndex)
    const timer = window.setInterval(() => {
      const next = tickCountdown(current)
      current = next.secondsLeft
      setSecondsLeft(current)
      if (next.restarted) {
        setExtended(true)
        useGame.getState().bumpStat('timerRestarts')
      }
    }, 1000)
    return () => window.clearInterval(timer)
  }, [showIndex])

  const headline = extended
    ? '🎉 АКЦІЮ ПРОДОВЖЕНО — спеціально для вас!'
    : showIndex > 1
      ? '😱 Ви випадково закрили знижку — ми її повернули!'
      : '🔥 ТІЛЬКИ СЬОГОДНІ!'

  return (
    <div
      role="region"
      aria-label="Акція на Premium"
      className="relative bg-gradient-to-r from-red-700 via-red-600 to-orange-600 px-8 py-1.5 text-center font-comic text-white shadow-md sm:px-10 sm:py-2 short:py-1"
    >
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <span className="text-xs font-bold sm:text-base short:text-xs">
          {headline}{' '}
          <span className="whitespace-nowrap rounded bg-yellow-300 px-1.5 py-0.5 text-red-800">
            −90%
          </span>{' '}
          на <span className="hidden sm:inline">Жовток </span>Premium
        </span>
        <span className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="hidden sm:inline short:hidden">до кінця акції:</span>
          <span
            className="animate-throb rounded bg-black px-2 py-0.5 font-mono text-sm font-bold tabular-nums text-yellow-300 sm:text-base short:text-sm"
            role="timer"
            aria-label={`Залишилось ${formatClock(secondsLeft)}`}
          >
            {formatClock(secondsLeft)}
          </span>
        </span>
        <a
          href="#recipe"
          className="whitespace-nowrap rounded-full bg-yellow-300 px-3 py-1 text-[11px] font-extrabold uppercase text-red-800 shadow hover:bg-yellow-200 sm:text-xs"
        >
          Забрати знижку
        </a>
      </div>
      <button
        type="button"
        onClick={() => dismiss()}
        aria-label="Закрити акцію"
        className="tap-area absolute right-1.5 top-1/2 -translate-y-1/2 rounded px-1.5 py-0.5 text-sm text-white/70 hover:text-white"
      >
        ✕
      </button>
    </div>
  )
}
