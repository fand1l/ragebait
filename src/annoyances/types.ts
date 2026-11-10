export interface AnnoyanceProps {
  /** `silent` — зникло саме, користувач нічого не закривав. */
  dismiss: (opts?: { silent?: boolean }) => void
  /** Котрий це показ за сесію, починаючи з 1. */
  showIndex: number
}
