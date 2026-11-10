import { useState, type FormEvent } from 'react'
import { Modal } from '../components/Modal'
import { useGame } from '../engine/store'
import type { AnnoyanceProps } from './types'

const VARIANTS = [
  {
    title: 'Не пропустіть жодного яйця! 🥚',
    text: 'Підпишіться на розсилку й отримайте PDF «101 спосіб подивитися на яйце» абсолютно безкоштовно*.',
    decline: 'Ні, дякую, я не люблю смачну їжу',
  },
  {
    title: 'Ви забули підписатися! 😢',
    text: 'Ми певні, що минулого разу ви закрили це вікно випадково. З ким не буває.',
    decline: 'Ні, мені подобається жити в невіданні',
  },
  {
    title: 'ОСТАННІЙ ШАНС! (ні)',
    text: 'Знижка 0% на безкоштовну розсилку, якщо підпишетеся просто зараз.',
    decline: 'Ні, я черства людина без серця',
  },
  {
    title: 'Гаразд, ми не ображаємось 🙂',
    text: '(Ображаємось.) Але двері завжди відчинені. Як і це вікно.',
    decline: 'Ні, і мені навіть не соромно',
  },
]

export function NewsletterPopup({ dismiss, showIndex }: AnnoyanceProps) {
  const [subscribed, setSubscribed] = useState(false)
  const variant = VARIANTS[(showIndex - 1) % VARIANTS.length]

  const subscribe = (event: FormEvent) => {
    // Форма нічого нікуди не відправляє й не зберігає.
    event.preventDefault()
    useGame.getState().bumpStat('fakeSubscriptions')
    setSubscribed(true)
  }

  return (
    <Modal
      label="Підписка на розсилку"
      onClose={() => dismiss()}
      className="relative overflow-hidden rounded-2xl bg-white shadow-2xl"
    >
      <button
        type="button"
        onClick={() => dismiss()}
        aria-label="Закрити"
        className="tap-area absolute right-1.5 top-1.5 z-10 px-1 text-[10px] leading-none text-white/50 hover:text-white"
      >
        ✕
      </button>
      <div className="bg-gradient-to-br from-fuchsia-600 to-purple-700 p-6 text-center text-white short:p-3">
        <div className="animate-wiggle text-6xl short:hidden" aria-hidden="true">
          💌
        </div>
        <h2 className="mt-2 font-comic text-2xl font-bold short:mt-0 short:text-xl">
          {subscribed ? 'Дякуємо! 🎉' : variant.title}
        </h2>
      </div>

      {subscribed ? (
        <div className="space-y-4 p-6 text-center">
          <p className="text-sm text-ink-soft">
            Насправді ми нічого не відправили й не зберегли вашу адресу. Це
            пародія, розсилки не існує.
          </p>
          <button
            type="button"
            onClick={() => dismiss()}
            className="rounded-lg bg-purple-700 px-5 py-2 font-bold text-white hover:bg-purple-600"
          >
            Закрити
          </button>
        </div>
      ) : (
        <form onSubmit={subscribe} className="space-y-3 p-6 short:space-y-2 short:p-4">
          <p className="text-center text-sm text-ink-soft">{variant.text}</p>
          <input
            type="email"
            required
            autoComplete="off"
            placeholder="ваш@email.com"
            aria-label="Електронна пошта"
            className="w-full rounded-lg border-2 border-purple-300 px-3 py-2 text-base outline-none focus:border-purple-600"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-yellow-400 py-3 font-comic text-lg font-extrabold uppercase text-purple-900 shadow hover:bg-yellow-300 short:py-2"
          >
            Підписатися!!!
          </button>
          <button
            type="button"
            onClick={() => dismiss()}
            className="tap-area relative mx-auto block text-[11px] text-gray-500 underline"
          >
            {variant.decline}
          </button>
          <p className="text-center text-[10px] text-gray-500">
            *Форма несправжня: адресу ніхто не побачить і не збереже.
          </p>
        </form>
      )}
    </Modal>
  )
}
