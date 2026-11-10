interface Person {
  name: string
  /** Дієслова минулого часу узгоджуються з родом. */
  feminine: boolean
}

const PEOPLE: readonly Person[] = [
  { name: 'Олена', feminine: true },
  { name: 'Тарас', feminine: false },
  { name: 'Ірина', feminine: true },
  { name: 'Богдан', feminine: false },
  { name: 'Соломія', feminine: true },
  { name: 'Остап', feminine: false },
  { name: 'Мирослава', feminine: true },
  { name: 'Назар', feminine: false },
]

/** Одразу з прийменником і в родовому відмінку. */
const FROM_CITIES = [
  'з Житомира',
  'зі Львова',
  'з Полтави',
  'з Вінниці',
  'з Тернополя',
  'з Чернівців',
  'з Луцька',
  'з Ужгорода',
  'з Черкас',
]

const AGO = ['щойно', '1 хвилину тому', '2 хвилини тому', '14 секунд тому']

export interface SocialProof {
  icon: string
  text: string
  ago: string
}

/**
 * Детермінований «випадковий» фейк: той самий номер показу — те саме
 * повідомлення. Усі люди й покупки вигадані.
 */
export function socialProofMessage(showIndex: number): SocialProof {
  const i = Math.max(1, showIndex)
  const person = PEOPLE[(i * 3) % PEOPLE.length]
  const city = FROM_CITIES[(i * 5) % FROM_CITIES.length]
  const ago = AGO[i % AGO.length]

  switch (i % 4) {
    case 1:
      return {
        icon: '🛒',
        text: `${person.name} ${city} щойно ${person.feminine ? 'купила' : 'купив'} Premium`,
        ago,
      }
    case 2:
      return {
        icon: '👀',
        text: `Ще ${17 + ((i * 13) % 60)} людей читають цю сторінку`,
        ago: 'просто зараз',
      }
    case 3:
      return {
        icon: '⚠️',
        text: `Залишилося лише ${2 + (i % 3)} місця за акційною ціною!`,
        ago: 'поспішайте',
      }
    default:
      return {
        icon: '⭐',
        text: `${person.name} ${city} ${person.feminine ? 'оцінила' : 'оцінив'} Premium на 5 зірок`,
        ago,
      }
  }
}
