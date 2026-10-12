import { countries, project } from '../content/map'

// Province-level pins (see content/home.ts `group`): Garuhapé in Misiones, Forestal Paraguay in Itapúa (Encarnación).
export const PIN_AR = project(-26.82, -54.96)
export const PIN_PY = project(-27.33, -55.87)

/** Argentina and Paraguay outlines with the group's two pins. Animated by HeroGrupo through data-* hooks. */
export default function MapaGrupo({ className }: { className?: string }) {
  return (
    <svg viewBox="70 130 425 560" className={className} role="img" aria-labelledby="mapa-titulo">
      <title id="mapa-titulo">Mapa de Argentina y Paraguay con Forestal Garuhapé y Foresvia en Misiones y Forestal Paraguay en Itapúa</title>
      <g data-world>
        {countries.map((c) => (
          <path
            key={c.id}
            d={c.d}
            data-outline
            data-context={c.active ? undefined : ''}
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset="0"
            vectorEffect="non-scaling-stroke"
            className={c.active ? 'fill-brand/35 stroke-focus' : 'fill-none stroke-ink-soft/20'}
            strokeWidth={c.active ? 1.25 : 0.75}
            strokeLinejoin="round"
          />
        ))}
        <g data-context className="fill-ink-soft/50" fontSize="9" fontWeight="600" letterSpacing="2.5">
          <text x="282" y="212">PARAGUAY</text>
          <text x="205" y="420">ARGENTINA</text>
        </g>

        {/* Leader lines and labels live in SVG units so they track the outlines at any size. */}
        <g data-context data-fade-svg>
          <path d={`M${PIN_PY.x} ${PIN_PY.y} L${PIN_PY.x - 40} ${PIN_PY.y + 40} H${PIN_PY.x - 110}`} className="fill-none stroke-ink-soft/50" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
          <text x={PIN_PY.x - 110} y={PIN_PY.y + 34} className="fill-ink" fontSize="10.5" fontWeight="600">Forestal Paraguay</text>
          <text x={PIN_PY.x - 110} y={PIN_PY.y + 52} className="fill-caption" fontSize="8" letterSpacing="1.4">ITAPÚA · PY</text>
          <path d={`M${PIN_AR.x} ${PIN_AR.y} L${PIN_AR.x + 6} ${PIN_AR.y - 36} H${PIN_AR.x + 128}`} className="fill-none stroke-focus/70" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
          <text x={PIN_AR.x + 10} y={PIN_AR.y - 76} className="fill-ink" fontSize="10.5" fontWeight="700">Forestal Garuhapé</text>
          <text x={PIN_AR.x + 10} y={PIN_AR.y - 60} className="fill-focus" fontSize="8" letterSpacing="1.1">CASA MATRIZ · MISIONES</text>
          <text x={PIN_AR.x + 10} y={PIN_AR.y - 46} className="fill-caption" fontSize="8" letterSpacing="1.1">+ FORESVIA · CAMIONES</text>
        </g>

        <g data-pin>
          <circle cx={PIN_PY.x} cy={PIN_PY.y} r="5" className="pin-pulse fill-ink-soft/40" style={{ animationDelay: '1.2s' }} />
          <circle cx={PIN_PY.x} cy={PIN_PY.y} r="3" className="fill-ink-soft stroke-night" strokeWidth="1" />
        </g>
        <g data-pin>
          <circle cx={PIN_AR.x} cy={PIN_AR.y} r="6" className="pin-pulse fill-signal/50" />
          <circle data-pin-ar cx={PIN_AR.x} cy={PIN_AR.y} r="4.5" className="fill-signal stroke-night" strokeWidth="1.2" />
        </g>
      </g>
    </svg>
  )
}
