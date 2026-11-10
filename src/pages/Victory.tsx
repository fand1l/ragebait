import { formatClock } from '../annoyances/countdown'
import { PARTNER_COUNT } from '../content/cookiePartners'
import { ANNOYANCES, STATIC_PATTERNS } from '../engine/configs'
import { rageLevel } from '../engine/rage'
import { useGame, type Stats } from '../engine/store'

const COOKIE_SUMMARY: Record<NonNullable<Stats['cookieChoice']>, string> = {
  'accepted-all': `прийняли всіх ${PARTNER_COUNT} партнерів`,
  'rejected-all': `вручну вимкнули всіх ${PARTNER_COUNT} партнерів — героїчно`,
  partial: 'вимкнули частину партнерів',
}

/** «1 раз», «2 рази», «5 разів» — українська множина. */
function timesWord(count: number): string {
  const lastTwo = count % 100
  const last = count % 10
  if (lastTwo >= 11 && lastTwo <= 14) return 'разів'
  if (last === 1) return 'раз'
  if (last >= 2 && last <= 4) return 'рази'
  return 'разів'
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: string
  value: string | number
  label: string
}) {
  return (
    <li className="rounded-xl border border-shell bg-white p-4">
      <div className="text-2xl" aria-hidden="true">
        {icon}
      </div>
      <div className="mt-1 font-serif text-2xl font-bold tabular-nums sm:text-3xl">
        {value}
      </div>
      <div className="text-sm text-ink-soft">{label}</div>
    </li>
  )
}

export function Victory() {
  const stats = useGame((s) => s.stats)
  const rage = useGame((s) => s.rage)
  const runtimes = useGame((s) => s.runtimes)
  const startedAt = useGame((s) => s.startedAt)
  const finishedAt = useGame((s) => s.finishedAt)
  const restart = useGame((s) => s.restart)

  const level = rageLevel(rage)
  const seconds = Math.round(((finishedAt ?? startedAt) - startedAt) / 1000)
  const met = ANNOYANCES.filter((config) => runtimes[config.id].shows > 0)

  const playAgain = () => {
    restart()
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-8">
      <h1 className="font-serif text-3xl font-bold sm:text-5xl">
        🎉 Вітаємо, ви вижили!
      </h1>
      <p className="mt-3 text-lg text-ink-soft">
        {stats.ending === 'bought'
          ? 'Ви натиснули «Оформити Premium». Добра новина: Premium не існує, і грошей ніхто не взяв.'
          : 'Ви встояли перед Premium. Його, до речі, і не існує.'}{' '}
        Ось рецепт — безкоштовно, як і мало бути від самого початку.
      </p>

      <section
        aria-labelledby="real-recipe"
        className="mt-6 rounded-2xl border-2 border-yolk bg-white p-6 shadow-lg"
      >
        <h2 id="real-recipe" className="font-serif text-2xl font-bold">
          Як зварити яйце
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-6 font-serif text-lg">
          <li>Опустіть яйце в киплячу воду.</li>
          <li>
            Варіть 6 хвилин, якщо любите рідкий жовток, 8 — «у мішечок», 10 —
            круто.
          </li>
          <li>Остудіть під холодною водою й почистьте.</li>
        </ol>
        <p className="mt-3 text-sm text-ink-soft">
          Це все. {PARTNER_COUNT} партнерів для цього не знадобилися.
        </p>
      </section>

      <h2 className="mt-10 font-serif text-2xl font-bold">
        Статистика ваших страждань
      </h2>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon="⏱" value={formatClock(seconds)} label="часу на сайті" />
        <Stat
          icon={level.emoji}
          value={rage}
          label={`гнів: ${level.label}`}
        />
        <Stat
          icon="🪟"
          value={stats.popupsClosed}
          label="вікон і банерів закрито"
        />
        <Stat
          icon="🎯"
          value={stats.misclicks}
          label="кліків по рекламі й повз вікна"
        />
        <Stat
          icon="🍪"
          value={stats.cookieToggles}
          label="cookie-перемикачів перемкнуто"
        />
        <Stat
          icon="⏳"
          value={stats.timerRestarts}
          label="разів акцію «продовжили»"
        />
        <Stat
          icon="📧"
          value={stats.fakeSubscriptions}
          label="«підписок» (нічого не відправлено)"
        />
        <Stat
          icon="💸"
          value="99 ₴"
          label="зекономлено на Premium"
        />
      </ul>
      {stats.fakeCloses > 0 && (
        <p className="mt-3 text-sm text-ink-soft">
          ❌ Фальшивий хрестик у рекламі обдурив вас{' '}
          <span className="tabular-nums">{stats.fakeCloses}</span>{' '}
          {timesWord(stats.fakeCloses)}.
        </p>
      )}
      {stats.cookieChoice && (
        <p className="mt-3 text-sm text-ink-soft">
          🍪 У cookie-вікні ви {COOKIE_SUMMARY[stats.cookieChoice]}.
        </p>
      )}

      <h2 className="mt-10 font-serif text-2xl font-bold">
        Що саме вас щойно бісило
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-6">
        {met.map((config) => (
          <li key={config.id}>
            {config.pattern}{' '}
            <span className="text-sm text-ink-soft tabular-nums">
              × {runtimes[config.id].shows}
            </span>
          </li>
        ))}
        {STATIC_PATTERNS.map((pattern) => (
          <li key={pattern}>{pattern}</li>
        ))}
      </ul>

      <button
        type="button"
        onClick={playAgain}
        className="mt-10 rounded-full bg-yolk px-6 py-3 font-bold text-ink shadow hover:brightness-105"
      >
        🔁 Постраждати ще раз
      </button>
    </main>
  )
}
