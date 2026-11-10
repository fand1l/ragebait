import { motion } from 'motion/react'
import { useState } from 'react'
import { STICKY_ADS } from '../content/ads'
import { useGame } from '../engine/store'
import type { AnnoyanceProps } from './types'

export function StickyAd({ dismiss, showIndex }: AnnoyanceProps) {
  const ad = STICKY_ADS[(showIndex - 1) % STICKY_ADS.length]
  const [clicks, setClicks] = useState(0)
  const [shaking, setShaking] = useState(false)

  const adClicked = () => {
    // Нікуди не веде: реклама несправжня. Але промах зараховано.
    useGame.getState().misclick(3)
    setClicks((count) => count + 1)
    setShaking(true)
  }

  return (
    <motion.aside
      aria-label="Реклама"
      className={`pointer-events-auto relative h-[26dvh] min-h-32 w-full border-t-4 short:h-24 short:min-h-0 border-dashed border-red-600 bg-gradient-to-r font-comic shadow-[0_-8px_24px_rgba(0,0,0,0.25)] ${ad.background}`}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
    >
      <button
        type="button"
        onClick={adClicked}
        onAnimationEnd={(event) => {
          // Усередині є нескінченні анімації — реагуємо лише на власну тряску.
          if (event.target === event.currentTarget) setShaking(false)
        }}
        className={`flex h-full w-full items-center justify-center gap-3 px-4 text-left text-ink sm:gap-4 sm:px-6 ${
          shaking ? 'animate-shake' : ''
        }`}
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
            {clicks > 0
              ? `Дякуємо за інтерес! 🎯 Промахів: ${clicks}`
              : `${ad.cta} →`}
          </span>
        </span>
      </button>
      <span className="absolute left-2 top-1 text-[10px] uppercase tracking-wider text-ink/70">
        Реклама
      </span>
      <button
        type="button"
        onClick={() => dismiss()}
        aria-label="Закрити рекламу"
        className="tap-area absolute right-1 top-1 h-3.5 w-3.5 text-[8px] leading-none text-ink/50 hover:text-ink"
      >
        ✕
      </button>
    </motion.aside>
  )
}
