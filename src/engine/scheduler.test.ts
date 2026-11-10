import { describe, expect, it } from 'vitest'
import {
  MODAL_GRACE_MS,
  isEligible,
  pickToOpen,
  scrollPercent,
} from './scheduler'
import type {
  AnnoyanceConfig,
  AnnoyanceRuntime,
  SchedulerContext,
} from './types'

const config = (over: Partial<AnnoyanceConfig> = {}): AnnoyanceConfig => ({
  id: 'x',
  pattern: 'test',
  slot: 'toast',
  trigger: { type: 'time', afterMs: 1000 },
  cooldownMs: 5000,
  maxShows: 3,
  rage: 1,
  ...over,
})

const runtime = (over: Partial<AnnoyanceRuntime> = {}): AnnoyanceRuntime => ({
  shows: 0,
  active: false,
  lastClosedAt: null,
  ...over,
})

const ctx = (over: Partial<SchedulerContext> = {}): SchedulerContext => ({
  now: 100_000,
  elapsedMs: 10_000,
  maxScrollPercent: 0,
  lastModalClosedAt: null,
  ...over,
})

describe('isEligible', () => {
  it('waits for the time trigger', () => {
    expect(isEligible(config(), runtime(), ctx({ elapsedMs: 999 }))).toBe(false)
    expect(isEligible(config(), runtime(), ctx({ elapsedMs: 1000 }))).toBe(true)
  })

  it('waits for the scroll trigger', () => {
    const c = config({ trigger: { type: 'scroll', percent: 30 } })
    expect(isEligible(c, runtime(), ctx({ maxScrollPercent: 29 }))).toBe(false)
    expect(isEligible(c, runtime(), ctx({ maxScrollPercent: 30 }))).toBe(true)
  })

  it('never reopens something already on screen', () => {
    expect(isEligible(config(), runtime({ active: true }), ctx())).toBe(false)
  })

  it('stops after maxShows', () => {
    expect(isEligible(config(), runtime({ shows: 3 }), ctx())).toBe(false)
    expect(isEligible(config(), runtime({ shows: 2 }), ctx())).toBe(true)
  })

  it('respects the cooldown after a close', () => {
    const closedJustNow = runtime({ shows: 1, lastClosedAt: 100_000 - 4999 })
    const closedLongAgo = runtime({ shows: 1, lastClosedAt: 100_000 - 5000 })
    expect(isEligible(config(), closedJustNow, ctx())).toBe(false)
    expect(isEligible(config(), closedLongAgo, ctx())).toBe(true)
  })
})

describe('pickToOpen', () => {
  const modalA = config({ id: 'a', slot: 'modal' })
  const modalB = config({ id: 'b', slot: 'modal' })
  const toast = config({ id: 't', slot: 'toast' })
  const banner = config({ id: 'top', slot: 'top' })

  it('opens only one modal at a time, in list order', () => {
    expect(pickToOpen([modalA, modalB], {}, ctx())).toEqual(['a'])
  })

  it('holds the next modal while one is open', () => {
    const runtimes = { a: runtime({ shows: 1, active: true }) }
    expect(pickToOpen([modalA, modalB], runtimes, ctx())).toEqual([])
  })

  it('gives a breather after a modal closes', () => {
    const runtimes = { a: runtime({ shows: 3, lastClosedAt: 99_000 }) }
    const during = ctx({ lastModalClosedAt: 100_000 - MODAL_GRACE_MS + 1 })
    const after = ctx({ lastModalClosedAt: 100_000 - MODAL_GRACE_MS })
    expect(pickToOpen([modalA, modalB], runtimes, during)).toEqual([])
    expect(pickToOpen([modalA, modalB], runtimes, after)).toEqual(['b'])
  })

  it('does not limit non-modal slots', () => {
    const runtimes = { a: runtime({ shows: 1, active: true }) }
    const during = ctx({ lastModalClosedAt: 100_000 })
    expect(pickToOpen([modalA, toast, banner], runtimes, during)).toEqual([
      't',
      'top',
    ])
  })
})

describe('scrollPercent', () => {
  it('maps scroll position to 0–100', () => {
    expect(scrollPercent(0, 3000, 1000)).toBe(0)
    expect(scrollPercent(1000, 3000, 1000)).toBe(50)
    expect(scrollPercent(2000, 3000, 1000)).toBe(100)
  })

  it('is 0 when the page does not scroll', () => {
    expect(scrollPercent(0, 800, 1000)).toBe(0)
  })

  it('clamps overscroll', () => {
    expect(scrollPercent(2500, 3000, 1000)).toBe(100)
    expect(scrollPercent(-50, 3000, 1000)).toBe(0)
  })
})
