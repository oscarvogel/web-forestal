import Picture from './Picture'

type Photo = { src: string; alt: string; title: string }

/** Editorial photo grid: the first frame leads wide, the rest follow in pairs. Each frame unclips on entry. */
export default function Gallery({ photos }: { photos: Photo[] }) {
  if (!photos.length) return null
  return (
    <section aria-labelledby="galeria-titulo" className="bg-night px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <h2 id="galeria-titulo" className="text-[clamp(2.5rem,5vw,5rem)]" data-anim="lines">La operación en imágenes.</h2>
        <p className="eyebrow text-caption">{photos.length} fotos</p>
      </div>
      <ul className="grid gap-x-6 gap-y-12 md:grid-cols-2">
        {photos.map((photo, index) => (
          <li key={photo.src} className={index === 0 ? 'md:col-span-2' : undefined}>
            <figure>
              <div data-anim="media" className="overflow-hidden bg-forest">
                <Picture
                  src={photo.src}
                  alt={photo.alt}
                  sizes={index === 0 ? '100vw' : '(min-width: 768px) 50vw, 100vw'}
                  className={`w-full object-cover ${index === 0 ? 'aspect-[21/9]' : 'aspect-[4/3]'}`}
                />
              </div>
              <figcaption className="mt-4 flex gap-4 text-sm text-caption">
                <span className="text-number">{String(index + 1).padStart(2, '0')}</span>
                {photo.title}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  )
}
