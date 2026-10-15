import { stagger } from '../lib/motion'
import type { ReactNode } from 'react'

type Props = { eyebrow: ReactNode; title: string; lead?: string; children?: ReactNode }

/** Opening of text-led interior pages: same giant-headline / tiny-label contrast as the Home. */
export default function PageIntro({ eyebrow, title, lead, children }: Props) {
  return (
    <section className="bg-night px-5 pt-36 pb-16 sm:px-8 lg:px-12 lg:pt-48 lg:pb-24">
      <p className="intro eyebrow text-caption">{eyebrow}</p>
      <h1 className="intro mt-6 max-w-6xl text-[clamp(3.25rem,8.6vw,9rem)] leading-[0.92]" style={stagger(1)}>
        {title}
      </h1>
      {lead && (
        <p className="intro mt-10 max-w-xl text-lg leading-relaxed text-ink-soft" style={stagger(3)}>
          {lead}
        </p>
      )}
      {children}
    </section>
  )
}
