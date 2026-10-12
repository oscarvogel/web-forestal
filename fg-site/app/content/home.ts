// Home copy. Every figure and claim comes from content already approved in the Eleventy site
// (src/_data/storyboardV2.js, homeNarrative.js, facts.js, servicios.json); add new ones only once the client confirms them.
import site from './site.json'
import servicios from './servicios.json'

export { site }

const detail = (slug: string) => (slug === 'consultoria-forestal' ? '/consultoria/' : `/servicios/${slug}/`)
const number = (index: number) => String(index + 1).padStart(2, '0')

const chapters = [
  { slug: 'cosecha-forestal', title: 'Cosecha', image: '/images/actualizadas/cosecha-forestal.png', alt: 'Procesadora forestal junto a madera cosechada', caption: 'Corte · Extracción · Carga' },
  { slug: 'transporte-forestal', title: 'Transporte', image: '/images/actualizadas/transporte-forestal.png', alt: 'Camión forestal junto a madera y equipo de carga', caption: 'Troncos · Chips · Logística' },
  { slug: 'playas-de-acopio', title: 'Acopio', image: '/images/servicios/playa_acopio_1.jpeg', alt: 'Equipos movilizando madera en una playa de acopio', caption: 'Descarga · Organización · Abastecimiento' },
  { slug: 'caminos-forestales', title: 'Caminos', image: '/images/actualizadas/caminos-forestales.png', alt: 'Motoniveladora trabajando en un camino forestal de tierra', caption: 'Apertura · Mantenimiento · Consolidación' },
  { slug: 'aprovechamiento-biomasa-forestal', title: 'Biomasa', image: '/images/actualizadas/biomasa-forestal.png', alt: 'Equipo procesando material forestal para su aprovechamiento como biomasa', caption: 'Biomasa forestal · Aprovechamiento' },
  { slug: 'consultoria-forestal', title: 'Consultoría', image: '/images/actualizadas/consultoria-forestal.png', alt: 'Vista aérea de plantaciones y paisaje forestal', caption: 'Planificación · Abastecimiento · Productividad' },
]

export const capabilities = chapters.map((chapter, index) => {
  const service = servicios.find((item) => item.slug === chapter.slug)
  if (!service) throw new Error(`Servicio desconocido: ${chapter.slug}`)
  return { ...chapter, number: number(index), summary: service.resumen_home, detail: detail(chapter.slug) }
})

export const narrative = [
  { id: 'planificar', title: 'Planificar', lines: ['Mirar el conjunto.', 'Preparar la operación.'], image: '/images/actualizadas/consultoria-forestal.png', alt: 'Vista aérea de plantaciones y paisaje forestal', copy: 'Planificación del abastecimiento y análisis de la cadena forestal para acompañar las necesidades de cada cliente.', service: 'consultoria-forestal', caption: 'Planificación · Abastecimiento · Análisis' },
  { id: 'operar-en-campo', title: 'Operar en campo', lines: ['Del plan', 'al trabajo en campo.'], image: '/images/actualizadas/cosecha-forestal.png', alt: 'Procesadora forestal trabajando junto a madera cosechada', copy: 'Corte, extracción y carga mediante operaciones mecanizadas, con equipos y sistemas adaptados al trabajo en campo.', service: 'cosecha-forestal', caption: 'Corte · Extracción · Carga' },
  { id: 'abastecer-la-industria', title: 'Abastecer la industria', lines: ['Conectar. Organizar.', 'Dar continuidad.'], image: '/images/servicios/playa_acopio_1.jpeg', alt: 'Equipos movilizando madera en una playa de acopio industrial', copy: 'La logística conecta el bosque con la industria. El acopio organiza la descarga, el acondicionamiento y los movimientos internos del recurso.', service: 'playas-de-acopio', caption: 'Logística · Acopio · Movimientos internos' },
].map((scene, index) => ({ ...scene, number: number(index), detail: detail(scene.service) }))

const foundingYear = Number(site.foundingYear)

// Group companies (nosotros.json). Misiones (AR, phone area 3743) and Itapúa (PY, Forestal Paraguay's own site);
// Foresvia is the casa matriz's trucking company (confirmed by the client), so it shares the AR pin.
export const group = [
  { name: 'Forestal Garuhapé SA', role: 'Casa matriz', place: 'Misiones, Argentina', pin: 'ar' as const },
  { name: 'Forestal Paraguay SA', role: 'Chips de biomasa y servicios', place: 'Itapúa, Paraguay', pin: 'py' as const, href: 'https://forestalparaguay.com/' },
  { name: 'Foresvia SA', role: 'Flota de camiones de la casa matriz', place: 'Misiones, Argentina', pin: 'ar' as const },
]

export const facts = [
  { value: new Date().getFullYear() - foundingYear, suffix: '', label: 'años de trayectoria' },
  // servicios.json, biomasa: "más de 500.000 toneladas de materia prima para la generación de electricidad".
  { value: 500000, suffix: '+', label: 'toneladas de biomasa para energía' },
  { value: 3, suffix: '', label: 'empresas en el grupo' },
  { value: 2, suffix: '', label: 'países de operación' },
]

export { foundingYear }

export const sgc = [
  { key: 'seguridad', title: 'Seguridad', copy: 'Cuidar la salud y la seguridad de las personas en la operación.' },
  { key: 'calidad', title: 'Calidad', copy: 'Orientar los servicios a la satisfacción de nuestros clientes.' },
  { key: 'sostenibilidad', title: 'Sostenibilidad', copy: 'Considerar el ambiente y las comunidades en las que operamos.' },
  { key: 'mejora', title: 'Mejora continua', copy: 'Revisar los servicios para mejorar su eficiencia y calidad.' },
]

export const serviceOptions = servicios.map((s) => ({ slug: s.slug, title: s.titulo }))
