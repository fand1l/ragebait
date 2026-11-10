import { create } from 'zustand'
import { ANNOYANCES, CONFIG_BY_ID, type AnnoyanceId } from './configs'
import { EMPTY_RUNTIME, type AnnoyanceRuntime } from './types'

export interface Stats {
  /** Скільки вікон, банерів і спливашок закрито вручну. */
  popupsClosed: number
  /** Кліки по рекламі, клікбейту й «не тих» кнопках. */
  misclicks: number
  /** Скільки разів повірили фальшивому хрестику в рекламі. */
  fakeCloses: number
  /** Скільки cookie-перемикачів перемкнуто руками. */
  cookieToggles: number
  cookieChoice: 'accepted-all' | 'rejected-all' | 'partial' | null
  /** Скільки разів таймер «тільки сьогодні» почався заново. */
  timerRestarts: number
  /** Скільки разів натиснули «Підписатися» (нічого не відправлено). */
  fakeSubscriptions: number
  /** Як дійшли до рецепта: купили «Premium» чи відмовились. */
  ending: 'bought' | 'resisted' | null
}

const EMPTY_STATS: Stats = {
  popupsClosed: 0,
  misclicks: 0,
  fakeCloses: 0,
  cookieToggles: 0,
  cookieChoice: null,
  timerRestarts: 0,
  fakeSubscriptions: 0,
  ending: null,
}

type Runtimes = Record<AnnoyanceId, AnnoyanceRuntime>

const emptyRuntimes = (): Runtimes =>
  Object.fromEntries(
    ANNOYANCES.map((c) => [c.id, { ...EMPTY_RUNTIME }]),
  ) as Runtimes

interface SessionState {
  startedAt: number
  finishedAt: number | null
  screen: 'article' | 'victory'
  /** Режим спокою: аварійний вихід, що вимикає весь хаос. */
  calm: boolean
  rage: number
  runtimes: Runtimes
  lastModalClosedAt: number | null
  /** Номер реклами, чий «сайт» зараз відкрито поверх сторінки. */
  adPage: number | null
  stats: Stats
}

interface Actions {
  open: (id: AnnoyanceId) => void
  /** `silent` — зникло саме (таймаут), без гніву й без «закрито вручну». */
  dismiss: (id: AnnoyanceId, opts?: { silent?: boolean }) => void
  addRage: (amount: number) => void
  misclick: (rage?: number) => void
  /** «Перехід» на сайт рекламодавця: через саму рекламу чи фальшивий хрестик. */
  openAdPage: (adIndex: number, via: 'ad' | 'fake-close') => void
  closeAdPage: () => void
  patchStats: (patch: Partial<Stats>) => void
  bumpStat: (
    key: 'cookieToggles' | 'timerRestarts' | 'fakeSubscriptions',
    by?: number,
  ) => void
  setCalm: (calm: boolean) => void
  finish: (ending: NonNullable<Stats['ending']>) => void
  restart: () => void
}

const freshSession = (): SessionState => ({
  startedAt: Date.now(),
  finishedAt: null,
  screen: 'article',
  calm: false,
  rage: 0,
  runtimes: emptyRuntimes(),
  lastModalClosedAt: null,
  adPage: null,
  stats: { ...EMPTY_STATS },
})

const closeAll = (runtimes: Runtimes, now: number): Runtimes =>
  Object.fromEntries(
    Object.entries(runtimes).map(([id, r]) => [
      id,
      r.active ? { ...r, active: false, lastClosedAt: now } : r,
    ]),
  ) as Runtimes

export const useGame = create<SessionState & Actions>()((set) => ({
  ...freshSession(),

  open: (id) =>
    set((s) => {
      const r = s.runtimes[id]
      if (r.active) return s
      return {
        runtimes: {
          ...s.runtimes,
          [id]: { ...r, active: true, shows: r.shows + 1 },
        },
      }
    }),

  dismiss: (id, opts) =>
    set((s) => {
      const r = s.runtimes[id]
      if (!r.active) return s
      const now = Date.now()
      const config = CONFIG_BY_ID[id]
      const manual = !opts?.silent
      return {
        runtimes: {
          ...s.runtimes,
          [id]: { ...r, active: false, lastClosedAt: now },
        },
        lastModalClosedAt:
          config.slot === 'modal' ? now : s.lastModalClosedAt,
        rage: manual ? s.rage + config.rage : s.rage,
        stats: manual
          ? { ...s.stats, popupsClosed: s.stats.popupsClosed + 1 }
          : s.stats,
      }
    }),

  addRage: (amount) => set((s) => ({ rage: s.rage + amount })),

  misclick: (rage = 2) =>
    set((s) => ({
      rage: s.rage + rage,
      stats: { ...s.stats, misclicks: s.stats.misclicks + 1 },
    })),

  openAdPage: (adIndex, via) =>
    set((s) => ({
      adPage: adIndex,
      // Обман із хрестиком бісить сильніше, ніж чесний промах по рекламі.
      rage: s.rage + (via === 'fake-close' ? 6 : 3),
      stats: {
        ...s.stats,
        misclicks: s.stats.misclicks + 1,
        fakeCloses: s.stats.fakeCloses + (via === 'fake-close' ? 1 : 0),
      },
    })),

  closeAdPage: () => set({ adPage: null }),

  patchStats: (patch) => set((s) => ({ stats: { ...s.stats, ...patch } })),

  bumpStat: (key, by = 1) =>
    set((s) => ({ stats: { ...s.stats, [key]: s.stats[key] + by } })),

  setCalm: (calm) =>
    set((s) =>
      calm
        ? {
            calm: true,
            adPage: null,
            runtimes: closeAll(s.runtimes, Date.now()),
          }
        : { calm: false },
    ),

  finish: (ending) =>
    set((s) => {
      const now = Date.now()
      return {
        screen: 'victory',
        finishedAt: now,
        adPage: null,
        runtimes: closeAll(s.runtimes, now),
        stats: { ...s.stats, ending },
      }
    }),

  restart: () => set(freshSession()),
}))
