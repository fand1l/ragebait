import { motion } from 'motion/react'
import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useGame } from '../engine/store'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

interface Props {
  /** Назва діалогу для скрінрідерів. */
  label: string
  /** Esc завжди закриває вікно — хоч якась справедливість. */
  onClose: () => void
  placement?: 'center' | 'bottom'
  className?: string
  children: ReactNode
}

export function Modal({
  label,
  onClose,
  placement = 'center',
  className = '',
  children,
}: Props) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const [shaking, setShaking] = useState(false)
  const misclick = useGame((s) => s.misclick)

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (event.key === 'Escape') {
      onClose()
      return
    }
    if (event.key !== 'Tab') return

    // Фокус не має тікати з вікна на сторінку під ним.
    const focusable = [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE)]
    if (focusable.length === 0) {
      event.preventDefault()
      return
    }
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement
    if (!dialog.contains(active)) {
      event.preventDefault()
      first.focus()
    } else if (event.shiftKey && (active === first || active === dialog)) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  })

  useEffect(() => {
    const previouslyFocused = document.activeElement
    dialogRef.current?.focus()
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [])

  const clickedPast = () => {
    // Клік повз вікно нічого не закриває. Звісно.
    misclick(1)
    setShaking(true)
  }

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex bg-black/60 ${
        placement === 'bottom'
          ? 'items-end justify-center'
          : 'items-center justify-center p-4'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) clickedPast()
      }}
    >
      <motion.div
        className={placement === 'bottom' ? 'w-full' : 'w-full max-w-md'}
        initial={
          placement === 'bottom' ? { y: '100%' } : { scale: 0.6, opacity: 0 }
        }
        animate={placement === 'bottom' ? { y: 0 } : { scale: 1, opacity: 1 }}
        exit={{
          ...(placement === 'bottom' ? { y: '100%' } : { scale: 0.8, opacity: 0 }),
          transition: { duration: 0.15 },
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      >
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          tabIndex={-1}
          className={`outline-none ${shaking ? 'animate-shake' : ''} ${className}`}
          onAnimationEnd={() => setShaking(false)}
        >
          {children}
        </div>
      </motion.div>
    </motion.div>
  )
}
