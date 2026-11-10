export interface Ad {
  emoji: string
  title: string
  text: string
  cta: string
  /** Класи Tailwind для фону — що огидніше, то краще. */
  background: string
  /** «Сайт рекламодавця», куди веде клік по рекламі чи фальшивому хрестику. */
  landing: {
    /** Вигадана адреса на зарезервованому домені .example. */
    url: string
    tagline: string
    features: readonly string[]
    price: string
  }
}

/** Усі товари, курси та «інвестиції» вигадані. */
export const STICKY_ADS: readonly Ad[] = [
  {
    emoji: '🍳',
    title: 'МегаКаструля 3000',
    text: 'Варить яйця на 0,3% швидше*. *Не доведено.',
    cta: 'Купити зараз',
    background: 'from-lime-400 via-yellow-300 to-orange-400',
    landing: {
      url: 'mega-kastrulya.example/promo',
      tagline: 'Каструля, яка змінить ваше життя. Або принаймні сніданок.',
      features: [
        'Варить яйця на 0,3% швидше (не доведено)',
        '47 режимів, з яких працює один',
        'Bluetooth. Навіщо — невідомо',
      ],
      price: '9 998 ₴ замість 9 999 ₴',
    },
  },
  {
    emoji: '🎓',
    title: 'Курс «Senior Egg Boiler»',
    text: 'Від нуля до яйця за 12 тижнів. Працевлаштування на власній кухні гарантуємо.',
    cta: 'Записатися',
    background: 'from-cyan-300 via-sky-400 to-fuchsia-400',
    landing: {
      url: 'senior-egg-boiler.example/enroll',
      tagline: 'Від нуля до яйця за 12 тижнів.',
      features: [
        'Модуль 1: що таке вода',
        'Модуль 7: яйце і soft skills',
        'Диплом, який можна з’їсти',
      ],
      price: '49 998 ₴ на місяць',
    },
  },
  {
    emoji: '🚀',
    title: 'ЖовткоКоїн',
    text: 'Криптояйце, яке ніколи не впаде*. *Впаде.',
    cta: 'Інвестувати',
    background: 'from-yellow-300 via-amber-400 to-pink-500',
    landing: {
      url: 'zhovtkocoin.example/to-the-moon',
      tagline: 'Криптояйце нового покоління.',
      features: [
        'Зростання на 9000% (у наших мріях)',
        'Забезпечений справжньою шкаралупою',
        'Не є фінансовою порадою. Не є нічим',
      ],
      price: '1 ЖВК = 1 яйце',
    },
  },
  {
    emoji: '🧘',
    title: 'Яйце-ретрит у Карпатах',
    text: 'Знайдіть свій внутрішній жовток. Вікенд мовчання — лише 9 999 ₴.',
    cta: 'Знайти себе',
    background: 'from-emerald-300 via-teal-300 to-indigo-400',
    landing: {
      url: 'egg-retreat.example/karpaty',
      tagline: 'Знайдіть свій внутрішній жовток.',
      features: [
        'Вікенд мовчання серед курей',
        'Медитація «Я — яйце»',
        'Телефони здаємо, каструлі — ні',
      ],
      price: '9 999 ₴ за вікенд',
    },
  },
]

export interface Clickbait {
  emoji: string
  title: string
  background: string
}

export const CLICKBAIT: readonly Clickbait[] = [
  {
    emoji: '😱',
    title: 'Лікарі в шоці: цей простий трюк із яйцем замінює сон',
    background: 'from-rose-200 to-rose-400',
  },
  {
    emoji: '🐔',
    title: 'Ви не повірите, який вигляд тепер має курка з реклами 2007 року',
    background: 'from-amber-200 to-amber-400',
  },
  {
    emoji: '💔',
    title: 'Самотні яйця у вашому місті шукають знайомства',
    background: 'from-pink-200 to-fuchsia-400',
  },
  {
    emoji: '🤑',
    title: 'Чоловік заробив мільйон на шкаралупі. Банки його ненавидять',
    background: 'from-lime-200 to-green-400',
  },
  {
    emoji: '🔮',
    title: 'Яке ви яйце за знаком зодіаку? Пройдіть тест (47 сторінок)',
    background: 'from-violet-200 to-indigo-400',
  },
  {
    emoji: '🦷',
    title: 'Стоматологи благають: припиніть робити ЦЕ з жовтком',
    background: 'from-sky-200 to-cyan-400',
  },
]
