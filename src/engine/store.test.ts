import { beforeEach, describe, expect, it } from 'vitest'
import { useGame } from './store'

const game = () => useGame.getState()

beforeEach(() => game().restart())

describe('game store', () => {
  it('counts a show when an annoyance opens, once', () => {
    game().open('sticky-ad')
    game().open('sticky-ad')
    expect(game().runtimes['sticky-ad']).toMatchObject({
      active: true,
      shows: 1,
    })
  })

  it('adds rage and a closed popup on manual dismiss', () => {
    game().open('cookie-banner')
    game().dismiss('cookie-banner')
    expect(game().runtimes['cookie-banner'].active).toBe(false)
    expect(game().rage).toBe(6)
    expect(game().stats.popupsClosed).toBe(1)
    expect(game().lastModalClosedAt).not.toBeNull()
  })

  it('adds nothing when it goes away by itself', () => {
    game().open('social-proof')
    game().dismiss('social-proof', { silent: true })
    expect(game().rage).toBe(0)
    expect(game().stats.popupsClosed).toBe(0)
    expect(game().runtimes['social-proof'].lastClosedAt).not.toBeNull()
  })

  it('ignores a dismiss for something that is not open', () => {
    game().dismiss('sticky-ad')
    expect(game().rage).toBe(0)
    expect(game().stats.popupsClosed).toBe(0)
  })

  it('calm mode closes everything without adding rage', () => {
    game().open('cookie-banner')
    game().open('sticky-ad')
    game().setCalm(true)
    expect(game().calm).toBe(true)
    expect(Object.values(game().runtimes).some((r) => r.active)).toBe(false)
    expect(game().rage).toBe(0)
  })

  it('finishing closes everything and records the ending', () => {
    game().open('premium-countdown')
    game().finish('resisted')
    expect(game().screen).toBe('victory')
    expect(game().stats.ending).toBe('resisted')
    expect(game().finishedAt).not.toBeNull()
    expect(game().runtimes['premium-countdown'].active).toBe(false)
  })

  it('restart wipes the session', () => {
    game().open('sticky-ad')
    game().misclick()
    game().finish('bought')
    game().restart()
    expect(game().screen).toBe('article')
    expect(game().rage).toBe(0)
    expect(game().stats.misclicks).toBe(0)
    expect(game().runtimes['sticky-ad'].shows).toBe(0)
  })
})
