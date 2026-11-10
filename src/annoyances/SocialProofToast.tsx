import { motion } from 'motion/react'
import { useEffect } from 'react'
import { socialProofMessage } from '../content/socialProof'
import type { AnnoyanceProps } from './types'

const VISIBLE_MS = 5500

export function SocialProofToast({ dismiss, showIndex }: AnnoyanceProps) {
  const message = socialProofMessage(showIndex)

  useEffect(() => {
    const timer = window.setTimeout(() => dismiss({ silent: true }), VISIBLE_MS)
    return () => window.clearTimeout(timer)
  }, [dismiss])

  return (
    <motion.div
      role="status"
      className="pointer-events-auto m-3 flex max-w-xs items-center gap-3 rounded-xl border border-gray-200 bg-white py-2.5 pl-3 pr-2 shadow-xl"
      initial={{ x: -320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -320, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
    >
      <span className="text-2xl" aria-hidden="true">
        {message.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold leading-snug">
          {message.text}
        </span>
        <span className="block text-xs text-ink-soft">{message.ago}</span>
      </span>
      <button
        type="button"
        onClick={() => dismiss()}
        aria-label="Закрити сповіщення"
        className="self-start px-1 text-xs text-gray-400 hover:text-gray-700"
      >
        ✕
      </button>
    </motion.div>
  )
}
