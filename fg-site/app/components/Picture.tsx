import images from '../content/images.json'

type Props = {
  src: string
  alt: string
  sizes?: string
  className?: string
  eager?: boolean
}

const manifest = images as Record<string, { slug: string; width: number; height: number; widths: number[] }>

/** Graded AVIF/WebP variants from scripts/images.mjs; width/height keep the layout from shifting. */
export default function Picture({ src, alt, sizes = '100vw', className, eager = false }: Props) {
  const image = manifest[src]
  if (!image) throw new Error(`Imagen sin variantes: ${src}. Agregarla en scripts/images.mjs`)
  const set = (format: string) => image.widths.map((w) => `/img/${image.slug}-${w}.${format} ${w}w`).join(', ')
  const largest = image.widths[image.widths.length - 1]
  return (
    <picture>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <img
        src={`/img/${image.slug}-${largest}.webp`}
        srcSet={set('webp')}
        sizes={sizes}
        alt={alt}
        width={image.width}
        height={image.height}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
        decoding="async"
        className={className}
      />
    </picture>
  )
}
