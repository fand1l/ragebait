import { useGame } from '../engine/store'

export function Paywall() {
  const finish = useGame((s) => s.finish)

  return (
    <section
      id="recipe"
      aria-labelledby="recipe-title"
      className="relative mt-8 min-h-80 scroll-mt-40 overflow-hidden rounded-2xl border-2 border-yolk bg-white shadow-lg"
    >
      <div className="p-6">
        <h2 id="recipe-title" className="font-serif text-2xl font-bold">
          Рецепт: варене яйце
        </h2>
        {/* Розмиті рядки-заглушки: справжній рецепт чекає на фінальному екрані. */}
        <div className="mt-4 select-none space-y-3 blur-sm" aria-hidden="true">
          <div className="h-4 w-11/12 rounded bg-shell" />
          <div className="h-4 w-9/12 rounded bg-shell" />
          <div className="h-4 w-10/12 rounded bg-shell" />
          <div className="h-4 w-7/12 rounded bg-shell" />
          <div className="h-4 w-8/12 rounded bg-shell" />
          <div className="h-4 w-6/12 rounded bg-shell" />
          <div className="h-4 w-9/12 rounded bg-shell" />
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/80 p-4 text-center backdrop-blur-[2px]">
        <p className="font-serif text-xl font-bold sm:text-2xl">
          🔒 Цей рецепт доступний лише з Жовток Premium
        </p>
        <p className="text-sm text-ink-soft">
          <s>990 ₴</s>{' '}
          <strong className="text-lg text-red-700">99 ₴ на місяць</strong> —
          тільки сьогодні!
        </p>
        <button
          type="button"
          onClick={() => finish('bought')}
          className="rounded-xl bg-red-600 px-6 py-3 font-extrabold uppercase text-white shadow-lg hover:bg-red-500"
        >
          Оформити Premium
        </button>
        <button
          type="button"
          onClick={() => finish('resisted')}
          className="text-[11px] text-gray-500 underline"
        >
          Ні, дякую, я й далі їстиму яйця сирими
        </button>
      </div>
    </section>
  )
}
