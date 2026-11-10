/** Скільки триває «останній шанс» після кожного перезапуску. */
export const RESTART_SECONDS = 15 * 60

export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds))
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

/**
 * Один тік таймера «тільки сьогодні». Доходить до нуля — і, яка несподіванка,
 * акцію продовжено.
 */
export function tickCountdown(secondsLeft: number): {
  secondsLeft: number
  restarted: boolean
} {
  if (secondsLeft <= 1) return { secondsLeft: RESTART_SECONDS, restarted: true }
  return { secondsLeft: secondsLeft - 1, restarted: false }
}

/** З чого стартує таймер: мало, щоб «кінець акції» настав на очах. */
export function initialSeconds(showIndex: number): number {
  return showIndex === 1 ? 45 : 20 + ((showIndex * 7) % 25)
}
