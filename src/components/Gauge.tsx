"use client";

/* Half-dial gauge for P(AI-generated). Left = human, right = AI, neutral
   band in the middle. The needle + big number carry the value; color is
   redundant (ends are text-labeled), so the dial stays readable for
   color-blind readers. */

const CX = 110;
const CY = 100;
const R = 82;

function point(f: number, r: number) {
  const theta = Math.PI * (1 - f);
  return [CX + r * Math.cos(theta), CY - r * Math.sin(theta)] as const;
}

function arc(f1: number, f2: number, r: number) {
  const [x1, y1] = point(f1, r);
  const [x2, y2] = point(f2, r);
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

export default function Gauge({ p }: { p: number | null }) {
  const f = p ?? 0.5;
  const idle = p === null;

  return (
    <svg
      viewBox="0 0 220 128"
      className="mx-auto w-full max-w-[340px]"
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={p === null ? undefined : Math.round(f * 1000) / 10}
      aria-label="Probability the passage is AI-generated, from 0 (human) to 100 (AI)"
    >
      {/* dial segments: human / neutral / AI, with 2px-ish gaps */}
      <g
        fill="none"
        strokeWidth={13}
        opacity={idle ? 0.35 : 1}
        style={{ transition: "opacity 0.4s ease" }}
      >
        <path d={arc(0.0, 0.44, R)} stroke="var(--human)" />
        <path d={arc(0.455, 0.545, R)} stroke="var(--line)" />
        <path d={arc(0.56, 1.0, R)} stroke="var(--ai)" />
      </g>

      {/* ticks every 10% */}
      <g stroke="var(--ink-soft)" strokeWidth={1} opacity={0.7}>
        {Array.from({ length: 11 }, (_, i) => {
          const [x1, y1] = point(i / 10, R + 9);
          const [x2, y2] = point(i / 10, R + 15);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>

      {/* scale captions */}
      <g
        fill="var(--ink-soft)"
        fontSize="9"
        letterSpacing="0.14em"
        fontFamily="inherit"
      >
        <text x={CX - R - 2} y={CY + 16} textAnchor="middle">
          0
        </text>
        <text x={CX} y={CY - R - 20} textAnchor="middle">
          50
        </text>
        <text x={CX + R + 2} y={CY + 16} textAnchor="middle">
          100
        </text>
      </g>
      <g fontSize="10.5" letterSpacing="0.18em" fontFamily="inherit">
        <text x={CX - R + 4} y={CY + 27} textAnchor="middle" fill="var(--human)">
          HUMAN
        </text>
        <text x={CX + R - 4} y={CY + 27} textAnchor="middle" fill="var(--ai)">
          AI
        </text>
      </g>

      {/* needle */}
      <g
        className="needle"
        opacity={idle ? 0.3 : 1}
        style={{
          transform: `rotate(${(f - 0.5) * 180}deg)`,
          transformOrigin: `${CX}px ${CY}px`,
        }}
      >
        <line
          x1={CX}
          y1={CY}
          x2={CX}
          y2={CY - R + 20}
          stroke="var(--ink)"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <circle cx={CX} cy={CY} r={5.5} fill="var(--ink)" />
        <circle cx={CX} cy={CY} r={2} fill="var(--paper)" />
      </g>
    </svg>
  );
}
