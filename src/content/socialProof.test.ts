import { describe, expect, it } from 'vitest'
import { socialProofMessage } from './socialProof'

describe('socialProofMessage', () => {
  it('is deterministic for the same show', () => {
    expect(socialProofMessage(7)).toEqual(socialProofMessage(7))
  })

  it('opens with a fake purchase', () => {
    expect(socialProofMessage(1).text).toMatch(/щойно (купила|купив) Premium$/)
  })

  it('agrees the verb with the name', () => {
    for (let show = 1; show <= 80; show++) {
      const { text } = socialProofMessage(show)
      const feminineName = /^(Олена|Ірина|Соломія|Мирослава) /.test(text)
      const masculineName = /^(Тарас|Богдан|Остап|Назар) /.test(text)
      if (feminineName) expect(text).toMatch(/купила|оцінила/)
      if (masculineName) expect(text).toMatch(/купив|оцінив/)
    }
  })

  it('keeps "місця" grammatical (only 2–4 left)', () => {
    for (let show = 3; show <= 80; show += 4) {
      const count = Number(socialProofMessage(show).text.match(/\d+/)?.[0])
      expect(count).toBeGreaterThanOrEqual(2)
      expect(count).toBeLessThanOrEqual(4)
    }
  })
})
