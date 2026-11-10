import { useState } from 'react'
import { Modal } from '../components/Modal'
import { STICKY_ADS } from '../content/ads'
import { useGame } from '../engine/store'

/**
 * «Сайт рекламодавця», на який закидає клік по рекламі або фальшивому
 * хрестику. Нікуди насправді не переходимо: це вікно на весь екран.
 */
export function AdLandingPage({ adIndex }: { adIndex: number }) {
  const ad = STICKY_ADS[adIndex]
  const closeAdPage = useGame((s) => s.closeAdPage)
  const [ordered, setOrdered] = useState(false)

  const order = () => {
    if (!ordered) useGame.getState().misclick(2)
    setOrdered(true)
  }

  return (
    <Modal
      label={`Сайт рекламодавця: ${ad.title}`}
      onClose={closeAdPage}
      placement="full"
      className="flex h-dvh flex-col overflow-y-auto overscroll-contain bg-white font-comic"
    >
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-gray-200 bg-gray-100 px-2 py-1.5 font-sans">
        <button
          type="button"
          onClick={closeAdPage}
          className="shrink-0 whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-sm font-semibold shadow-sm hover:bg-gray-50"
        >
          ← Назад до рецепта
        </button>
        <span
          className="min-w-0 flex-1 truncate rounded-full bg-white px-3 py-1.5 text-xs text-gray-500"
          aria-hidden="true"
        >
          🔒 {ad.landing.url}?utm_source=zhovtok&utm_medium=fake_close
        </span>
      </div>

      <div
        className={`flex flex-1 flex-col items-center justify-center gap-3 bg-gradient-to-br px-5 py-8 text-center text-ink short:gap-2 short:py-4 ${ad.background}`}
      >
        <p className="rounded-full bg-white/80 px-3 py-1 font-sans text-xs font-semibold">
          Дякуємо за інтерес до нашої реклами! 🎯
        </p>
        <div
          className="animate-wiggle text-7xl sm:text-8xl short:text-5xl"
          aria-hidden="true"
        >
          {ad.emoji}
        </div>
        <h2 className="text-3xl font-extrabold uppercase leading-tight sm:text-5xl short:text-2xl">
          {ad.title}
        </h2>
        <p className="max-w-md text-base sm:text-xl">{ad.landing.tagline}</p>
        <ul className="space-y-1 text-left text-sm sm:text-base">
          {ad.landing.features.map((feature) => (
            <li key={feature}>✅ {feature}</li>
          ))}
        </ul>
        <p className="text-lg font-extrabold">{ad.landing.price}</p>
        <button
          type="button"
          onClick={order}
          className="animate-throb rounded-full bg-red-600 px-6 py-3 text-lg font-extrabold uppercase text-white shadow-xl hover:bg-red-500"
        >
          {ad.cta} →
        </button>
        <p role="status" className="min-h-5 font-sans text-sm font-semibold">
          {ordered && 'Цього не існує. Як і вашого терпіння. (Промах +1)'}
        </p>
        <p className="font-sans text-[11px] text-ink/70">
          Сторінка несправжня: тут нічого не продається і нікуди не веде.
        </p>
      </div>
    </Modal>
  )
}
