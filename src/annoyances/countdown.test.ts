import { describe, expect, it } from 'vitest'
import {
  RESTART_SECONDS,
  formatClock,
  initialSeconds,
  tickCountdown,
} from './countdown'

describe('formatClock', () => {
  it('pads minutes and seconds', () => {
    expect(formatClock(0)).toBe('00:00')
    expect(formatClock(45)).toBe('00:45')
    expect(formatClock(15 * 60)).toBe('15:00')
    expect(formatClock(61)).toBe('01:01')
  })

  it('never shows negative time', () => {
    expect(formatClock(-5)).toBe('00:00')
  })
})

describe('tickCountdown', () => {
  it('counts down by one second', () => {
    expect(tickCountdown(45)).toEqual({ secondsLeft: 44, restarted: false })
  })

  it('restarts instead of ever reaching zero', () => {
    expect(tickCountdown(1)).toEqual({
      secondsLeft: RESTART_SECONDS,
      restarted: true,
    })
    expect(tickCountdown(0).restarted).toBe(true)
  })
})

describe('initialSeconds', () => {
  it('always starts under a minute so the "deadline" is visible', () => {
    for (let show = 1; show <= 50; show++) {
      expect(initialSeconds(show)).toBeGreaterThanOrEqual(20)
      expect(initialSeconds(show)).toBeLessThan(60)
    }
  })
})
