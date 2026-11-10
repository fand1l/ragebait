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
      className={`pointer-events-auto relative h-[26vh] min-h-36 w-full border-t-4 border-dashed border-red-600 bg-gradient-to-r font-comic shadow-[0_-8px_24px_rgba(0,0,0,0.25)] ${ad.background}`}
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
        className={`flex h-full w-full items-center justify-center gap-4 px-6 text-left text-ink ${
          shaking ? 'animate-shake' : ''
        }`}
      >
        <span className="animate-wiggle text-5xl sm:text-7xl" aria-hidden="true">
          {ad.emoji}
        </span>
        <span className="min-w-0 max-w-xl">
          <span className="block text-xl font-extrabold uppercase sm:text-3xl">
            {ad.title}
          </span>
          <span className="block text-sm sm:text-lg">{ad.text}</span>
          <span className="mt-2 inline-block animate-throb rounded-full bg-red-600 px-4 py-1.5 text-sm font-extrabold uppercase text-white shadow-lg sm:text-base">
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
        className="absolute right-1 top-1 h-3.5 w-3.5 text-[8px] leading-none text-ink/50 hover:text-ink"
      >
        ✕
      </button>
    </motion.aside>
  )
}
