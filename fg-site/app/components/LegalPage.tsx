import type { ReactNode } from 'react'

type Props = { title: string; intro: string; sections: { title: string; body: ReactNode }[]; contact: string }

/** Long-form reading layout for legal pages: narrow measure, numbered headings. */
export default function LegalPage({ title, intro, sections, contact }: Props) {
  return (
    <article className="bg-night px-5 pt-36 pb-32 sm:px-8 lg:px-12 lg:pt-48">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow text-caption">Legal</p>
        <h1 className="mt-6 text-[clamp(3rem,7vw,6.5rem)] leading-[0.92]">{title}</h1>
        <p className="mt-10 text-lg leading-relaxed text-ink-soft">{intro}</p>
        {sections.map((section, index) => (
          <section key={section.title} className="mt-12 border-t border-line pt-8">
            <h2 className="flex gap-4 text-2xl tracking-[-0.03em]">
              <span className="eyebrow pt-2 font-sans text-number">{String(index + 1).padStart(2, '0')}</span>
              {section.title}
            </h2>
            <p className="mt-4 leading-relaxed text-ink-soft">{section.body}</p>
          </section>
        ))}
        <section className="mt-12 border-t border-line pt-8">
          <h2 className="text-2xl tracking-[-0.03em]">Contacto</h2>
          <p className="mt-4 leading-relaxed text-ink-soft">{contact}</p>
        </section>
      </div>
    </article>
  )
}
