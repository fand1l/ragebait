export interface RageLevel {
  min: number
  emoji: string
  label: string
}

export const RAGE_LEVELS: readonly RageLevel[] = [
  { min: 0, emoji: '😌', label: 'Спокій' },
  { min: 12, emoji: '😐', label: 'Трохи бісить' },
  { min: 30, emoji: '😠', label: 'Дратує' },
  { min: 55, emoji: '😡', label: 'Лють' },
  { min: 90, emoji: '🤬', label: 'ПЕКЛО' },
]

/** Після цього значення шкала заповнена, але лічильник росте далі. */
export const RAGE_BAR_MAX = 100

export function rageLevel(rage: number): RageLevel {
  let current = RAGE_LEVELS[0]
  for (const level of RAGE_LEVELS) {
    if (rage >= level.min) current = level
  }
  return current
}
