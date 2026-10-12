// Service pages data, ported from the Eleventy serviceEditorial.js / galerias/*.json.
import servicios from './servicios.json'
import consultoria from './consultoria.json'
import cosecha from './galerias/cosecha-forestal.json'
import transporte from './galerias/transporte-forestal.json'
import biomasa from './galerias/aprovechamiento-biomasa-forestal.json'
import acopio from './galerias/playas-de-acopio.json'
import caminos from './galerias/caminos-forestales.json'
import images from './images.json'

type Photo = { src: string; alt: string; title: string }

export const detailUrl = (slug: string) => (slug === 'consultoria-forestal' ? '/consultoria/' : `/servicios/${slug}/`)

const galleries: Record<string, Photo[]> = {
  'cosecha-forestal': cosecha,
  'transporte-forestal': transporte,
  'aprovechamiento-biomasa-forestal': biomasa,
  'playas-de-acopio': acopio,
  'caminos-forestales': caminos,
}

const relations: Record<string, string[]> = {
  'cosecha-forestal': ['transporte-forestal', 'playas-de-acopio'],
  'transporte-forestal': ['cosecha-forestal', 'playas-de-acopio'],
  'playas-de-acopio': ['transporte-forestal', 'aprovechamiento-biomasa-forestal'],
  'caminos-forestales': ['transporte-forestal', 'consultoria-forestal'],
  'aprovechamiento-biomasa-forestal': ['cosecha-forestal', 'playas-de-acopio'],
  'consultoria-forestal': ['cosecha-forestal', 'caminos-forestales'],
}

// The acopio catalog render is weaker than the field photo the Home already uses.
const openingImage = (slug: string, imagen: string) => (slug === 'playas-de-acopio' ? '/images/servicios/playa_acopio_1.jpeg' : imagen)

export const services = servicios.map((s, index) => ({
  slug: s.slug,
  title: s.titulo,
  number: String(index + 1).padStart(2, '0'),
  summary: s.resumen,
  description: s.descripcion,
  // descripcion_ampliada carries <br> breaks from the old CMS; split into paragraphs instead of injecting HTML.
  technical: s.descripcion_ampliada.split(/(?:\s*<br>\s*)+/).map((p) => p.trim()).filter(Boolean),
  scope: s.alcance,
  image: openingImage(s.slug, s.imagen),
  url: detailUrl(s.slug),
  // Only photos with generated variants (scripts/images.mjs skips the SVG diagrams and files missing from the repo).
  gallery: (galleries[s.slug] ?? []).filter((p) => p.src in images && p.src !== openingImage(s.slug, s.imagen)),
  related: relations[s.slug],
}))

export type Service = (typeof services)[number]

export const serviceBySlug = (slug: string | undefined) => services.find((s) => s.slug === slug)

export const consultingAreas = consultoria.map((area) => ({ title: area.titulo, copy: area.descripcion, image: area.imagen }))
