import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { STICKY_ADS } from '../content/ads'
import { useGame } from '../engine/store'
import type { AnnoyanceProps } from './types'

/** Стільки секунд справжнього хрестика просто не існує. */
export const REAL_CLOSE_DELAY_S = 10

export function StickyAd({ dismiss, showIndex }: AnnoyanceProps) {
  const adIndex = (showIndex - 1) % STICKY_ADS.length
  const ad = STICKY_ADS[adIndex]
  const openAdPage = useGame((s) => s.openAdPage)

  const [secondsLeft, setSecondsLeft] = useState(REAL_CLOSE_DELAY_S)
  const canClose = secondsLeft === 0

  useEffect(() => {
    if (canClose) return
    const timer = window.setInterval(
      () => setSecondsLeft((seconds) => Math.max(0, seconds - 1)),
      1000,
    )
    return () => window.clearInterval(timer)
  }, [canClose])

  return (
    <motion.aside
      aria-label="Реклама"
      className={`pointer-events-auto relative h-[26dvh] min-h-32 w-full border-t-4 border-dashed border-red-600 bg-gradient-to-r font-comic shadow-[0_-8px_24px_rgba(0,0,0,0.25)] short:h-24 short:min-h-0 ${ad.background}`}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
    >
      {/* Уся реклама — одна велика кнопка, що веде «на сайт рекламодавця». */}
      <button
        type="button"
        onClick={() => openAdPage(adIndex, 'ad')}
        className="flex h-full w-full items-center justify-center gap-3 px-4 text-left text-ink sm:gap-4 sm:px-6"
      >
        <span
          className="animate-wiggle text-4xl sm:text-7xl short:text-4xl"
          aria-hidden="true"
        >
          {ad.emoji}
        </span>
        <span className="min-w-0 max-w-xl">
          <span className="block text-lg font-extrabold uppercase leading-tight sm:text-3xl short:text-lg">
            {ad.title}
          </span>
          <span className="block text-xs sm:text-lg short:hidden">{ad.text}</span>
          <span className="mt-1.5 inline-block animate-throb rounded-full bg-red-600 px-3 py-1 text-xs font-extrabold uppercase text-white shadow-lg sm:mt-2 sm:px-4 sm:py-1.5 sm:text-base short:mt-1">
            {ad.cta} →
          </span>
        </span>
      </button>

      {/*
        Фальшивий хрестик: великий, на звичному місці й видно його одразу.
        Нічого не закриває — це частина реклами.
      */}
      <button
        type="button"
        onClick={() => openAdPage(adIndex, 'fake-close')}
        aria-label="Хрестик у кутку реклами"
        className="tap-area absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-xs leading-none text-white shadow hover:bg-black"
      >
        ✕
      </button>

      {/* Справжній хрестик: крихітний, блідий, в іншому кутку і з запізненням. */}
      <div className="pointer-events-none absolute left-1.5 top-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-ink/70">
        {canClose && (
          <button
            type="button"
            onClick={() => dismiss()}
            aria-label="Закрити рекламу"
            className="tap-area pointer-events-auto relative h-3.5 w-3.5 text-[8px] leading-none text-ink/50 hover:text-ink"
          >
            ✕
          </button>
        )}
        <span>
          Реклама
          {!canClose && (
            <span className="normal-case tracking-normal text-ink/60">
              {' '}
              · закрити можна через {secondsLeft} с
            </span>
          )}
        </span>
      </div>
    </motion.aside>
  )
}
