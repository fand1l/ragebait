/** Де на екрані живе дратівник. */
export type Slot = 'top' | 'modal' | 'bottom' | 'toast'

/** Що його запускає. */
export type Trigger =
  | { type: 'time'; afterMs: number }
  | { type: 'scroll'; percent: number }

export interface AnnoyanceConfig {
  id: string
  /** Людська назва dark pattern — показуємо на фінальному екрані. */
  pattern: string
  slot: Slot
  trigger: Trigger
  /** Пауза після закриття, перш ніж він повернеться. */
  cooldownMs: number
  /** Скільки разів може з'явитися за одну сесію. */
  maxShows: number
  /** Скільки «гніву» додає закриття вручну. */
  rage: number
}

export interface AnnoyanceRuntime {
  shows: number
  active: boolean
  lastClosedAt: number | null
}

export interface SchedulerContext {
  now: number
  /** Час від початку сесії. */
  elapsedMs: number
  /** Найглибша точка скролу за сесію, 0–100. */
  maxScrollPercent: number
  lastModalClosedAt: number | null
}

export const EMPTY_RUNTIME: AnnoyanceRuntime = {
  shows: 0,
  active: false,
  lastClosedAt: null,
}
