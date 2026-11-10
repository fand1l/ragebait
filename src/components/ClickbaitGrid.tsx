import { useState } from 'react'
import { CLICKBAIT } from '../content/ads'
import { useGame } from '../engine/store'

interface Props {
  /** З якої картки починати — щоб блоки в статті не повторювались. */
  offset: number
}

export function ClickbaitGrid({ offset }: Props) {
  const cards = [0, 1, 2].map((i) => CLICKBAIT[(offset + i) % CLICKBAIT.length])
  const [opened, setOpened] = useState<ReadonlySet<number>>(new Set())

  const open = (index: number) => {
    if (opened.has(index)) return
    useGame.getState().misclick(2)
    setOpened((prev) => new Set(prev).add(index))
  }

  return (
    <aside
      aria-label="Партнерські матеріали"
      className="my-10 rounded-xl border border-shell bg-white p-4"
    >
      <div className="mb-3 flex items-baseline justify-between">
        <span className="text-sm font-bold uppercase tracking-wide">
          Вас також може зацікавити
        </span>
        <span className="text-[10px] uppercase tracking-wider text-ink-soft">
          Реклама
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {cards.map((card, index) => (
          <button
            key={card.title}
            type="button"
            onClick={() => open(index)}
            className="group overflow-hidden rounded-lg border border-shell text-left transition-transform hover:-translate-y-0.5"
          >
            <span
              className={`flex h-24 items-center justify-center bg-gradient-to-br text-5xl ${card.background}`}
              aria-hidden="true"
            >
              {card.emoji}
            </span>
            <span className="block p-2.5 text-sm font-semibold leading-snug group-hover:underline">
              {opened.has(index)
                ? 'Це реклама. Тут нічого немає. Як і завжди. (Промах +1)'
                : card.title}
            </span>
          </button>
        ))}
      </div>
    </aside>
  )
}
