/** Pause control for content that moves on its own for more than 5 s (WCAG 2.2.2). */
export default function PauseButton({ paused, onToggle, label, className = '' }: { paused: boolean; onToggle: () => void; label: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={paused}
      aria-label={`${paused ? 'Reanudar' : 'Pausar'} ${label}`}
      className={`eyebrow inline-flex items-center gap-2 rounded-[2px] px-2 py-1.5 motion-reduce:hidden ${className}`}
    >
      <span aria-hidden="true" className="inline-flex h-2.5 w-2.5 items-center justify-center gap-[3px]">
        {paused ? (
          <span className="h-0 w-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-current" />
        ) : (
          <>
            <span className="h-2.5 w-[3px] bg-current" />
            <span className="h-2.5 w-[3px] bg-current" />
          </>
        )}
      </span>
      {paused ? 'Reanudar' : 'Pausar'}
    </button>
  )
}
