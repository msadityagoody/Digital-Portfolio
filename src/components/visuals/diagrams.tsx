/* Original abstract diagrams for each project (640×480 viewBox). Decorative labels only — no data. */

const T = 'fill-muted font-mono text-[11px] tracking-[0.06em]';
const TA = 'fill-accent font-mono text-[11px] tracking-[0.06em]';
const BOX = 'stroke-line fill-surface';
const LINE = 'stroke-line';
const FLOW = 'stroke-accent flow';

function Node({ x, y, w, h, label, accent }: { x: number; y: number; w: number; h: number; label: string; accent?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} className={accent ? 'stroke-accent fill-surface' : BOX} strokeWidth={1.25} />
      <text x={x + 14} y={y + h / 2 + 4} className={accent ? TA : T}>
        {label}
      </text>
    </g>
  );
}

export function BmsVisual() {
  const floors = [0, 1, 2, 3];
  return (
    <g>
      {floors.map((f) => {
        const y = 92 + f * 76;
        return (
          <g key={f}>
            <rect x={56} y={y} width={196} height={58} rx={8} className={BOX} strokeWidth={1.25} />
            <text x={70} y={y + 22} className={T}>{`FLOOR 0${4 - f}`}</text>
            {[0, 1, 2, 3].map((s) => (
              <circle key={s} cx={86 + s * 40} cy={y + 40} r={4} className={`fill-accent pulse`} style={{ animationDelay: `${(f + s) * 0.2}s` }} />
            ))}
            <path d={`M252 ${y + 29} H300 V250 H322`} className={`${FLOW}`} strokeWidth={1.25} />
          </g>
        );
      })}
      <Node x={322} y={224} w={92} h={52} label="MQTT" accent />
      <path d="M414 250 H446" className={FLOW} strokeWidth={1.25} />
      <Node x={446} y={224} w={84} h={52} label="API" />
      <path d="M488 224 V178" className={LINE} strokeWidth={1.25} />
      <path d="M488 276 V318" className={LINE} strokeWidth={1.25} />
      {/* dashboard */}
      <rect x={430} y={78} width={168} height={100} rx={10} className={BOX} strokeWidth={1.25} />
      <text x={444} y={98} className={T}>DASHBOARD</text>
      <path d="M444 160 L470 140 L494 148 L520 122 L546 132 L584 108" className="stroke-accent" strokeWidth={1.5} />
      {/* billing / alerts */}
      <rect x={430} y={318} width={168} height={84} rx={10} className={BOX} strokeWidth={1.25} />
      <text x={444} y={338} className={T}>BILLING · ALERTS</text>
      {[0, 1, 2].map((r) => (
        <rect key={r} x={444} y={352 + r * 14} width={r === 1 ? 92 : 132} height={6} rx={3} className="fill-line" />
      ))}
    </g>
  );
}

export function SldVisual() {
  const feeders = [120, 250, 380, 520];
  const JOG = 40;
  return (
    <g>
      {/* supply / transformer */}
      <path d="M320 40 V78" className={LINE} strokeWidth={1.5} />
      <circle cx={320} cy={92} r={14} className="stroke-muted" strokeWidth={1.5} />
      <circle cx={320} cy={112} r={14} className="stroke-muted" strokeWidth={1.5} />
      <path d="M320 126 V156" className={LINE} strokeWidth={1.5} />
      <text x={346} y={106} className={T}>SUPPLY</text>
      {/* main bus */}
      <path d="M80 160 H560" className="stroke-ink" strokeWidth={3} />
      <text x={80} y={148} className={T}>MAIN BUS</text>
      {feeders.map((x, i) => {
        const routed = i === 2;
        return (
          <g key={x}>
            <path d={`M${x} 160 V214`} className={routed ? 'stroke-accent' : LINE} strokeWidth={1.5} />
            {/* breaker */}
            <rect x={x - 10} y={214} width={20} height={20} rx={3} className={routed ? 'stroke-accent fill-surface' : BOX} strokeWidth={1.5} />
            <path d={`M${x - 6} 230 L${x + 6} 218`} className={routed ? 'stroke-accent' : 'stroke-muted'} strokeWidth={1.5} />
            <path d={`M${x} 234 V${routed ? 300 : 330}`} className={routed ? FLOW : LINE} strokeWidth={1.5} />
            {routed && <path d={`M${x} 300 H${x + JOG} V330`} className={FLOW} strokeWidth={1.5} />}
            <rect
              x={(routed ? x + JOG : x) - 44}
              y={330}
              width={88}
              height={44}
              rx={8}
              className={routed ? 'stroke-accent fill-surface' : BOX}
              strokeWidth={1.25}
            />
            <text x={(routed ? x + JOG : x) - 30} y={357} className={routed ? TA : T}>
              {['PANEL A', 'PANEL B', 'MCC', 'DB-04'][i]}
            </text>
          </g>
        );
      })}
      <text x={80} y={420} className={T}>FEEDER ROUTE</text>
      <path d="M190 416 H230" className={FLOW} strokeWidth={1.5} />
    </g>
  );
}

export function WaypointVisual() {
  return (
    <g>
      {/* listings */}
      <text x={48} y={84} className={T}>COLLECT</text>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x={48} y={100 + i * 56} width={150} height={42} rx={8} className={BOX} strokeWidth={1.25} />
          <rect x={62} y={114 + i * 56} width={i % 2 ? 70 : 100} height={6} rx={3} className="fill-line" />
          <rect x={62} y={126 + i * 56} width={48} height={5} rx={2.5} className="fill-line opacity-60" />
          <path d={`M198 ${121 + i * 56} C 240 ${121 + i * 56}, 240 238, 268 238`} className={i === 1 || i === 3 ? FLOW : LINE} strokeWidth={1.25} />
        </g>
      ))}
      {/* match */}
      <text x={268} y={84} className={T}>MATCH</text>
      <path d="M268 182 H372 L344 238 L372 294 H268 Z" className="stroke-accent fill-surface" strokeWidth={1.25} />
      <text x={286} y={243} className={TA}>ROLE FIT</text>
      <path d="M372 238 H428" className={FLOW} strokeWidth={1.25} />
      {/* review */}
      <text x={428} y={84} className={T}>REVIEW</text>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={428} y={170 + i * 50} width={164} height={38} rx={8} className={i === 0 ? 'stroke-accent fill-surface' : BOX} strokeWidth={1.25} />
          <rect x={442} y={183 + i * 50} width={12} height={12} rx={3} className={i === 0 ? 'fill-accent' : 'stroke-muted'} strokeWidth={1.25} />
          <rect x={466} y={186 + i * 50} width={i === 2 ? 64 : 96} height={6} rx={3} className="fill-line" />
        </g>
      ))}
    </g>
  );
}

export function ChatVisual() {
  const packets = [0, 1, 2, 3];
  return (
    <g>
      {[64, 456].map((x, i) => (
        <g key={x}>
          <rect x={x} y={104} width={120} height={200} rx={16} className={BOX} strokeWidth={1.25} />
          <text x={x + 16} y={130} className={T}>{i ? 'CLIENT B' : 'CLIENT A'}</text>
          {[0, 1, 2].map((m) => (
            <rect
              key={m}
              x={(m + i) % 2 ? x + 40 : x + 16}
              y={150 + m * 36}
              width={64}
              height={22}
              rx={8}
              className={(m + i) % 2 ? 'fill-accent/80' : 'fill-line'}
            />
          ))}
        </g>
      ))}
      {/* channel */}
      <path d="M184 204 H456" className={LINE} strokeWidth={1.25} />
      <path d="M184 204 H456" className={FLOW} strokeWidth={1.5} />
      <text x={262} y={180} className={T}>WEBSOCKET · AES</text>
      {packets.map((p) => (
        <g key={p}>
          <rect x={212 + p * 58} y={194} width={40} height={20} rx={4} className="stroke-accent fill-bg" strokeWidth={1.25} />
          <text x={218 + p * 58} y={208} className="fill-accent font-mono text-[9px]">
            {['7f3a', 'c91e', '04bd', 'e2a8'][p]}
          </text>
        </g>
      ))}
      {/* lock */}
      <rect x={306} y={250} width={28} height={22} rx={4} className="stroke-accent" strokeWidth={1.5} />
      <path d="M312 250 V242 a8 8 0 0 1 16 0 V250" className="stroke-accent" strokeWidth={1.5} />
      <path d="M320 272 V340" className={LINE} strokeWidth={1.25} />
      <Node x={262} y={340} w={116} h={48} label="SQLITE" />
    </g>
  );
}

export function HvacVisual() {
  return (
    <g>
      {/* floor plan */}
      <rect x={40} y={70} width={340} height={300} rx={6} className="stroke-muted" strokeWidth={1.5} />
      <path d="M40 200 H220 M220 70 V370 M220 260 H380 M300 70 V260" className="stroke-muted" strokeWidth={1.25} />
      <text x={56} y={96} className={T}>RM-01</text>
      <text x={56} y={226} className={T}>RM-02</text>
      <text x={236} y={96} className={T}>RM-03</text>
      <text x={316} y={96} className={T}>RM-04</text>
      <text x={236} y={286} className={T}>RM-05</text>
      {/* equipment + ducts */}
      <rect x={236} y={180} width={44} height={34} rx={4} className="stroke-accent fill-surface" strokeWidth={1.5} />
      <text x={244} y={201} className="fill-accent font-mono text-[10px]">AHU</text>
      <path d="M236 197 H130 V140 M130 197 V300 M280 197 H340 V160 M258 214 V320" className={FLOW} strokeWidth={1.5} />
      {[
        [130, 140],
        [130, 300],
        [340, 160],
        [258, 320],
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={(x ?? 0) - 7} y={(y ?? 0) - 7} width={14} height={14} rx={2} className="stroke-accent fill-bg" strokeWidth={1.25} />
      ))}
      {/* extraction arrow */}
      <path d="M396 220 H436" className={FLOW} strokeWidth={1.5} />
      <path d="M430 214 L438 220 L430 226" className="stroke-accent" strokeWidth={1.5} />
      {/* table */}
      <rect x={450} y={110} width={160} height={220} rx={8} className={BOX} strokeWidth={1.25} />
      <text x={464} y={134} className={T}>ROOM · EQUIP · DUCT</text>
      <path d="M450 146 H610" className={LINE} strokeWidth={1.25} />
      {[0, 1, 2, 3, 4, 5].map((r) => (
        <g key={r}>
          <rect x={464} y={162 + r * 26} width={34} height={6} rx={3} className="fill-line" />
          <rect x={512} y={162 + r * 26} width={38} height={6} rx={3} className={r === 1 ? 'fill-accent/70' : 'fill-line'} />
          <rect x={564} y={162 + r * 26} width={30} height={6} rx={3} className="fill-line" />
        </g>
      ))}
    </g>
  );
}
