import { useState } from 'react'
import { Modal } from '../components/Modal'
import { PARTNERS, PARTNER_COUNT } from '../content/cookiePartners'
import { useGame } from '../engine/store'
import type { AnnoyanceProps } from './types'

export function CookieBanner({ dismiss, showIndex }: AnnoyanceProps) {
  const [view, setView] = useState<'main' | 'settings'>('main')
  const [enabled, setEnabled] = useState<boolean[]>(() =>
    Array.from({ length: PARTNER_COUNT }, () => true),
  )
  /** Кнопка «Вимкнути всі» спрацьовує рівно раз — і не так, як хотілося б. */
  const [rejectAllState, setRejectAllState] = useState<
    'ready' | 'just-failed' | 'unavailable'
  >('ready')

  const enabledCount = enabled.filter(Boolean).length
  const returning = showIndex > 1

  const acceptAll = () => {
    useGame.getState().patchStats({ cookieChoice: 'accepted-all' })
    dismiss()
  }

  const save = () => {
    useGame.getState().patchStats({
      cookieChoice: enabledCount === 0 ? 'rejected-all' : 'partial',
    })
    dismiss()
  }

  const toggle = (index: number) => {
    setEnabled((prev) => prev.map((on, i) => (i === index ? !on : on)))
    useGame.getState().bumpStat('cookieToggles')
    if (rejectAllState === 'just-failed') setRejectAllState('unavailable')
  }

  const rejectAll = () => {
    setEnabled((prev) => prev.map(() => true))
    setRejectAllState('just-failed')
    useGame.getState().addRage(4)
  }

  return (
    <Modal
      label="Налаштування cookie"
      // Закрили вікно — значить, погодились. Так це зазвичай і працює.
      onClose={acceptAll}
      placement="bottom"
      className="flex max-h-[85dvh] min-h-[50dvh] flex-col rounded-t-2xl bg-white shadow-2xl short:max-h-[94dvh]"
    >
      {view === 'main' ? (
        <div className="mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-5 sm:p-8 short:gap-2 short:p-4">
          {/* Автовідступи замість justify-center: якщо вміст не вміщається, його можна прокрутити від початку. */}
          <div className="mt-auto" />
          <h2 className="font-serif text-2xl font-bold sm:text-3xl">
            {returning
              ? '🍪 Ми оновили політику cookie'
              : '🍪 Ми цінуємо вашу приватність*'}
          </h2>
          <p className="text-sm leading-relaxed text-ink-soft sm:text-base">
            {returning
              ? 'Ваш попередній вибір, на жаль, не зберігся. Так буває. '
              : ''}
            Ми та наші <strong>{PARTNER_COUNT} партнерів</strong>{' '}
            використовуємо cookie, щоб покращувати ваш досвід, тобто до кінця
            життя показувати вам рекламу каструль. Натискаючи «Прийняти все»,
            ви робите нас дуже щасливими.
          </p>
          <p className="text-xs text-ink-soft">
            *І ваші дані. Особливо дані. Закриття цього вікна означає згоду на
            все.
          </p>
          <button
            type="button"
            onClick={acceptAll}
            className="rounded-xl bg-green-600 px-6 py-4 text-lg font-extrabold uppercase tracking-wide text-white shadow-lg hover:bg-green-500 short:py-2.5"
          >
            Прийняти все 🍪
          </button>
          <button
            type="button"
            onClick={() => setView('settings')}
            className="tap-area relative self-center text-[11px] text-gray-500 underline decoration-dotted"
          >
            налаштувати
          </button>
          <div className="mb-auto" />
        </div>
      ) : (
        <div className="mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col p-4 sm:p-6 short:p-3">
          <h2 className="font-serif text-xl font-bold">
            Налаштування приватності
          </h2>
          <p className="mt-1 text-sm text-ink-soft" aria-live="polite">
            Законний інтерес: увімкнено{' '}
            <strong className="tabular-nums">
              {enabledCount} з {PARTNER_COUNT}
            </strong>
            . Кожного партнера треба вимкнути окремо.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={rejectAll}
              disabled={rejectAllState !== 'ready'}
              className="rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              {rejectAllState === 'ready'
                ? 'Вимкнути всі'
                : 'Вимкнути всі (тимчасово недоступно)'}
            </button>
            {rejectAllState === 'just-failed' && (
              <span role="alert" className="text-xs font-semibold text-red-700">
                Упс! Сталася помилка — усіх партнерів увімкнено знову.
              </span>
            )}
          </div>

          <ul className="mt-3 min-h-24 flex-1 divide-y divide-gray-100 overflow-y-auto overscroll-contain rounded-lg border border-gray-200 short:mt-2">
            {PARTNERS.map((partner, index) => (
              <li
                key={partner.name}
                className="flex items-center justify-between gap-3 px-3 py-2"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">
                    {partner.name}
                  </span>
                  <span className="block truncate text-xs text-ink-soft">
                    {partner.purpose}
                  </span>
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={enabled[index]}
                  aria-label={`Законний інтерес: ${partner.name}`}
                  onClick={() => toggle(index)}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                    enabled[index] ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      enabled[index] ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-between gap-3 short:mt-2">
            <button
              type="button"
              onClick={save}
              className="tap-area relative text-xs text-gray-500 underline decoration-dotted"
            >
              зберегти мій вибір
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="whitespace-nowrap rounded-xl bg-green-600 px-4 py-2.5 text-sm font-extrabold uppercase text-white shadow-lg hover:bg-green-500 sm:px-6 sm:py-3 sm:text-base"
            >
              Прийняти все 🍪
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}
