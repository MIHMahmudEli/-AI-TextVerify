"use client";

import { useMemo, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_PIRD_API_URL ?? "https://mohsineli-pird-api.hf.space";

const EXAMPLES = [
  {
    exhibit: "Exhibit A",
    text: "The proposed framework leverages a robust architecture to efficiently process large-scale data, demonstrating significant improvements across all evaluated benchmarks and establishing a new state of the art for the task under consideration.",
  },
  {
    exhibit: "Exhibit B",
    text: "honestly i wasn't sure the trip was gonna happen at all — the flight got delayed twice, my bag nearly didn't make it, and then it rained the whole first day. but somehow it turned out great.",
  },
];

type Result = { p_ai: number; label: "ai" | "human"; words: number };

export default function Analyzer() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const words = useMemo(
    () => text.trim().split(/\s+/).filter(Boolean).length,
    [text],
  );

  async function analyze() {
    if (loading || words < 20) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "The detector could not process this passage.",
        );
      }
      setResult(data as Result);
    } catch (e) {
      setError(
        e instanceof Error && e.message !== "Failed to fetch"
          ? e.message
          : "The detector is unreachable — it may be waking from sleep. Please try again in a moment.",
      );
    } finally {
      setLoading(false);
    }
  }

  function clear() {
    setText("");
    setResult(null);
    setError(null);
  }

  const pct = result ? Math.round(result.p_ai * 1000) / 10 : 0;
  const isAi = result?.label === "ai";

  return (
    <section className="mx-auto max-w-2xl">
      {/* examination panel */}
      <div className="border border-line bg-panel shadow-[0_1px_0_var(--line)]">
        <div className="flex items-baseline justify-between border-b border-line px-5 py-3 sm:px-7">
          <span className="text-[0.7rem] uppercase tracking-[0.28em] text-ink-soft">
            Passage under examination
          </span>
          <span className="text-sm italic text-ink-soft">
            {words} {words === 1 ? "word" : "words"}
          </span>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={9}
          aria-label="Passage under examination"
          placeholder="Transcribe or paste a passage of at least twenty words…"
          className="manuscript block w-full resize-y bg-transparent px-5 py-4 text-[1.08rem]
                     text-ink outline-none placeholder:italic placeholder:text-ink-soft/60 sm:px-7"
        />

        <div className="flex items-center justify-between gap-4 border-t border-line px-5 py-3.5 sm:px-7">
          <span className="text-sm italic text-ink-soft">
            {words > 0 && words < 20
              ? `${20 - words} more ${20 - words === 1 ? "word" : "words"} required`
              : " "}
          </span>
          <div className="flex gap-3">
            <button
              onClick={clear}
              className="cursor-pointer border border-line px-5 py-2 text-[0.7rem] font-semibold
                         uppercase tracking-[0.2em] text-ink-soft transition-colors
                         hover:border-accent hover:text-accent-strong"
            >
              Clear
            </button>
            <button
              onClick={analyze}
              disabled={loading || words < 20}
              className="cursor-pointer bg-btn px-7 py-2 text-[0.7rem] font-semibold uppercase
                         tracking-[0.2em] text-btn-text transition-colors hover:bg-btn-hover
                         disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "Examining" : "Render verdict"}
            </button>
          </div>
        </div>
      </div>

      {/* exhibits */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.exhibit}
            onClick={() => {
              setText(ex.text);
              setResult(null);
              setError(null);
            }}
            title={ex.text}
            className="group cursor-pointer border border-line bg-panel px-4 py-3 text-left
                       transition-colors hover:border-accent"
          >
            <span className="text-[0.65rem] uppercase tracking-[0.26em] text-accent-strong">
              {ex.exhibit}
            </span>
            <span className="mt-1 line-clamp-2 block text-sm italic leading-snug text-ink-soft group-hover:text-ink">
              “{ex.text}”
            </span>
          </button>
        ))}
      </div>

      {/* deliberation / error / verdict */}
      <div aria-live="polite">
        {loading && (
          <p className="deliberating mt-10 text-center italic text-ink-soft">
            The tribunal is deliberating
          </p>
        )}

        {!loading && error && (
          <p className="rise mt-10 text-center italic text-ai">{error}</p>
        )}

        {!loading && result && (
          <div className="rise mt-10 text-center">
            <div className={isAi ? "stamp text-ai" : "stamp text-human"}>
              {isAi ? "Likely AI-generated" : "Likely human-written"}
            </div>
            <p className="mt-4 text-sm italic text-ink-soft">
              calibrated verdict · {result.words} words examined
            </p>

            <div className="mx-auto mt-6 max-w-md">
              <div className="mb-2 flex justify-between text-[0.68rem] uppercase tracking-[0.22em] text-ink-soft">
                <span>P(AI-generated)</span>
                <span className="font-semibold text-ink">{pct}%</span>
              </div>
              <div
                className="gauge"
                role="meter"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pct}
                aria-label="Probability the passage is AI-generated"
              >
                <div className="gauge-fill" style={{ width: `${pct}%` }} />
                <div className="gauge-ticks" />
              </div>
              <div className="mt-2 flex justify-between text-[0.68rem] uppercase tracking-[0.22em] text-ink-soft">
                <span>Human</span>
                <span>AI</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
