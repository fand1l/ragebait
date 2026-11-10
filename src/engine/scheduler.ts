import {
  EMPTY_RUNTIME,
  type AnnoyanceConfig,
  type AnnoyanceRuntime,
  type SchedulerContext,
} from './types'

/** Скільки модалок можна показувати одночасно. */
export const MAX_MODALS = 1
/** Перепочинок між модалками: дати повірити, що все скінчилося. */
export const MODAL_GRACE_MS = 2500

export function isEligible(
  config: AnnoyanceConfig,
  runtime: AnnoyanceRuntime,
  ctx: SchedulerContext,
): boolean {
  if (runtime.active) return false
  if (runtime.shows >= config.maxShows) return false
  if (
    runtime.lastClosedAt !== null &&
    ctx.now - runtime.lastClosedAt < config.cooldownMs
  ) {
    return false
  }
  switch (config.trigger.type) {
    case 'time':
      return ctx.elapsedMs >= config.trigger.afterMs
    case 'scroll':
      return ctx.maxScrollPercent >= config.trigger.percent
  }
}

/**
 * Вирішує, кого відкрити на цьому тіку. Порядок у `configs` — це пріоритет:
 * якщо модалок кілька, першою йде та, що вище в списку.
 */
export function pickToOpen<C extends AnnoyanceConfig>(
  configs: readonly C[],
  runtimes: Readonly<Partial<Record<string, AnnoyanceRuntime>>>,
  ctx: SchedulerContext,
): C['id'][] {
  const runtimeOf = (id: string) => runtimes[id] ?? EMPTY_RUNTIME

  let modalBudget =
    MAX_MODALS -
    configs.filter((c) => c.slot === 'modal' && runtimeOf(c.id).active).length
  if (
    ctx.lastModalClosedAt !== null &&
    ctx.now - ctx.lastModalClosedAt < MODAL_GRACE_MS
  ) {
    modalBudget = 0
  }

  const toOpen: C['id'][] = []
  for (const config of configs) {
    if (!isEligible(config, runtimeOf(config.id), ctx)) continue
    if (config.slot === 'modal') {
      if (modalBudget <= 0) continue
      modalBudget -= 1
    }
    toOpen.push(config.id)
  }
  return toOpen
}

export function scrollPercent(
  scrollY: number,
  scrollHeight: number,
  viewportHeight: number,
): number {
  const scrollable = scrollHeight - viewportHeight
  if (scrollable <= 0) return 0
  return Math.min(100, Math.max(0, (scrollY / scrollable) * 100))
}
