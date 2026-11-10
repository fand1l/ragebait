import type { AnnoyanceConfig } from './types'

/**
 * Усі дратівники, якими керує планувальник.
 * Порядок = пріоритет серед модалок (хто вище, той вискакує першим).
 */
export const ANNOYANCES = [
  {
    id: 'cookie-banner',
    pattern: 'Cookie-стіна без кнопки «Відхилити»',
    slot: 'modal',
    trigger: { type: 'time', afterMs: 1000 },
    cooldownMs: 90_000,
    maxShows: 2,
    rage: 6,
  },
  {
    id: 'newsletter-popup',
    pattern: 'Confirmshaming — присоромлення за відмову',
    slot: 'modal',
    trigger: { type: 'scroll', percent: 8 },
    cooldownMs: 25_000,
    maxShows: 4,
    rage: 5,
  },
  {
    id: 'premium-countdown',
    pattern: 'Фальшива терміновість: таймер, який ніколи не закінчується',
    slot: 'top',
    trigger: { type: 'time', afterMs: 3000 },
    cooldownMs: 20_000,
    maxShows: Infinity,
    rage: 3,
  },
  {
    id: 'sticky-ad',
    pattern: 'Реклама на пів екрана з мікроскопічним хрестиком',
    slot: 'bottom',
    trigger: { type: 'time', afterMs: 5000 },
    cooldownMs: 15_000,
    maxShows: Infinity,
    rage: 4,
  },
  {
    id: 'social-proof',
    pattern: 'Фейковий соціальний доказ («Олена щойно купила…»)',
    slot: 'toast',
    trigger: { type: 'time', afterMs: 9000 },
    cooldownMs: 8000,
    maxShows: Infinity,
    rage: 1,
  },
] as const satisfies readonly AnnoyanceConfig[]

export type AnnoyanceId = (typeof ANNOYANCES)[number]['id']

export const CONFIG_BY_ID = Object.fromEntries(
  ANNOYANCES.map((c) => [c.id, c]),
) as Record<AnnoyanceId, AnnoyanceConfig>

/** Те, що бісить завжди й не залежить від планувальника. */
export const STATIC_PATTERNS = [
  'Життєпис автора перед рецептом на два рядки',
  'Клікбейт-банери посеред тексту',
  'Paywall у самому кінці: «лише для Premium»',
]
