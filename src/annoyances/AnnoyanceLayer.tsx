import { AnimatePresence } from 'motion/react'
import type { ComponentType } from 'react'
import { ANNOYANCES, type AnnoyanceId } from '../engine/configs'
import { useGame } from '../engine/store'
import type { Slot } from '../engine/types'
import { AdLandingPage } from './AdLandingPage'
import { CookieBanner } from './CookieBanner'
import { NewsletterPopup } from './NewsletterPopup'
import { PremiumCountdown } from './PremiumCountdown'
import { SocialProofToast } from './SocialProofToast'
import { StickyAd } from './StickyAd'
import type { AnnoyanceProps } from './types'

const COMPONENTS: Record<AnnoyanceId, ComponentType<AnnoyanceProps>> = {
  'cookie-banner': CookieBanner,
  'newsletter-popup': NewsletterPopup,
  'premium-countdown': PremiumCountdown,
  'sticky-ad': StickyAd,
  'social-proof': SocialProofToast,
}

// Стабільні посилання: дратівники використовують `dismiss` в ефектах.
const DISMISSERS = Object.fromEntries(
  ANNOYANCES.map((config) => [
    config.id,
    (opts?: { silent?: boolean }) =>
      useGame.getState().dismiss(config.id, opts),
  ]),
) as Record<AnnoyanceId, AnnoyanceProps['dismiss']>

/** Усі активні дратівники одного слота. */
export function AnnoyanceSlot({ slot }: { slot: Slot }) {
  const runtimes = useGame((s) => s.runtimes)

  return (
    <AnimatePresence>
      {ANNOYANCES.filter(
        (config) => config.slot === slot && runtimes[config.id].active,
      ).map((config) => {
        const Component = COMPONENTS[config.id]
        const { shows } = runtimes[config.id]
        return (
          <Component
            // Новий показ — новий екземпляр із чистим станом.
            key={`${config.id}-${shows}`}
            dismiss={DISMISSERS[config.id]}
            showIndex={shows}
          />
        )
      })}
    </AnimatePresence>
  )
}

/** Усе, що висить поверх сторінки: модалки, нижня реклама, спливашки. */
export function AnnoyanceOverlays() {
  const adPage = useGame((s) => s.adPage)

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex flex-col items-start">
        <AnnoyanceSlot slot="toast" />
        <AnnoyanceSlot slot="bottom" />
      </div>
      <AnnoyanceSlot slot="modal" />
      <AnimatePresence>
        {adPage !== null && <AdLandingPage key={adPage} adIndex={adPage} />}
      </AnimatePresence>
    </>
  )
}
