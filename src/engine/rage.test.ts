import { describe, expect, it } from 'vitest'
import { rageLevel } from './rage'

describe('rageLevel', () => {
  it('starts calm', () => {
    expect(rageLevel(0).label).toBe('Спокій')
  })

  it('switches exactly on the threshold', () => {
    expect(rageLevel(11).label).toBe('Спокій')
    expect(rageLevel(12).label).toBe('Трохи бісить')
    expect(rageLevel(55).label).toBe('Лють')
  })

  it('stays at the top level past the bar maximum', () => {
    expect(rageLevel(9000).label).toBe('ПЕКЛО')
  })
})
