export const PARTNER_COUNT = 47

const NAMES = [
  'ДатаПлюс',
  'ТрекМакс',
  'КлікГруп',
  'ТаргетЛаб',
  'ПіксельХаб',
  'ПрофільІнвест',
  'КукіСервіс',
  'АдсГалактика',
]

const FORMS = ['ТОВ', 'ПП', 'Холдинг', 'Агенція', 'Консорціум', 'Фонд']

const PURPOSES = [
  'Вимірювання вашого терпіння',
  'Персоналізація реклами каструль',
  'Зберігання ваших зітхань',
  'Аналіз швидкості скролу',
  'Продаж вашого часу третім сторонам',
  'Прогнозування, коли ви здастеся',
  'Підрахунок закритих поп-апів',
]

export interface Partner {
  name: string
  purpose: string
}

/** 47 вигаданих «партнерів». Жодного з них не існує. */
export const PARTNERS: readonly Partner[] = Array.from(
  { length: PARTNER_COUNT },
  (_, i) => ({
    name: `${FORMS[i % FORMS.length]} «${NAMES[i % NAMES.length]}${
      i >= NAMES.length ? ` ${Math.floor(i / NAMES.length) + 1}` : ''
    }»`,
    purpose: PURPOSES[i % PURPOSES.length],
  }),
)
