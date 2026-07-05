"use client";

import { useMemo, useRef, useState } from "react";
import Gauge from "@/components/Gauge";

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

/* Plain-language reading of the calibrated probability. */
function interpret(p: number) {
  if (p >= 0.98)
    return { headline: "Almost certainly AI-written", side: "ai" as const };
  if (p >= 0.8)
    return { headline: "Very likely AI-written", side: "ai" as const };
  if (p >= 0.55)
    return { headline: "Probably AI-written", side: "ai" as const };
  if (p > 0.45)
    return { headline: "Too close to call", side: "neutral" as const };
  if (p > 0.2)
    return { headline: "Probably human-written", side: "human" as const };
  if (p > 0.02)
    return { headline: "Very likely human-written", side: "human" as const };
  return { headline: "Almost certainly human-written", side: "human" as const };
}

function explanation(p: number) {
  if (p > 0.45 && p < 0.55)
    return "The evidence points both ways — treat this passage as unresolved.";
  const ai = p >= 0.55;
  const n = Math.min(99, Math.round((ai ? p : 1 - p) * 100));
  return `Roughly ${n} of every 100 passages with this score turn out to be ${
    ai ? "AI-written" : "human-written"
  }.`;
}

export default function Analyzer() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const verdictRef = useRef<HTMLDivElement>(null);

  const words = useMemo(
    () => text.trim().split(/\s+/).filter(Boolean).length,
    [text],
  );

  async function analyze() {
    if (loading || words < 20) return;
    setLoading(true);
    setError(null);
    setResult(null);
    verdictRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
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

  const pct = result ? Math.round(result.p_ai * 1000) / 10 : null;
  const verdict = result ? interpret(result.p_ai) : null;
  const verdictColor =
    verdict?.side === "ai"
      ? "text-ai"
      : verdict?.side === "human"
        ? "text-human"
        : "text-ink";

  return (
    <section className="grid items-start gap-8 lg:grid-cols-2">
      {/* ---- input column ---- */}
      <div>
        <div className="border border-line bg-panel">
          <div className="flex items-baseline justify-between border-b border-line px-5 py-3">
            <span className="text-[0.68rem] uppercase tracking-[0.26em] text-ink-soft">
              The Passage
            </span>
            <span className="text-sm italic text-ink-soft">
              {words} {words === 1 ? "word" : "words"}
            </span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            aria-label="Passage to examine"
            placeholder="Paste the passage in question — at least twenty words…"
            className="manuscript block w-full resize-y bg-transparent px-5 py-3 text-[1.06rem]
                       text-ink outline-none placeholder:italic placeholder:text-ink-soft/60"
          />
          <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-3">
            <span className="text-sm italic text-ink-soft">
              {words > 0 && words < 20
                ? `${20 - words} more ${20 - words === 1 ? "word" : "words"} needed`
                : " "}
            </span>
            <div className="flex gap-3">
              <button
                onClick={clear}
                className="cursor-pointer border border-line px-4 py-2 text-[0.68rem] font-semibold
                           uppercase tracking-[0.2em] text-ink-soft transition-colors
                           hover:border-accent hover:text-accent-strong"
              >
                Clear
              </button>
              <button
                onClick={analyze}
                disabled={loading || words < 20}
                className="cursor-pointer bg-btn px-6 py-2 text-[0.68rem] font-semibold uppercase
                           tracking-[0.2em] text-btn-text transition-colors hover:bg-btn-hover
                           disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "Examining" : "Examine"}
              </button>
            </div>
          </div>
        </div>

        {/* exhibits */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
              <span className="text-[0.62rem] uppercase tracking-[0.24em] text-accent-strong">
                {ex.exhibit}
              </span>
              <span className="mt-1 line-clamp-2 block text-sm italic leading-snug text-ink-soft group-hover:text-ink">
                “{ex.text}”
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ---- verdict column ---- */}
      <div
        ref={verdictRef}
        className="border-2 border-ink/40 p-1 lg:sticky lg:top-6"
      >
        <div className="border border-line bg-panel px-6 py-6 text-center">
          <div className="text-[0.68rem] uppercase tracking-[0.3em] text-ink-soft">
            The Verdict
          </div>
          <div className="mx-auto mt-2 h-px w-16 bg-line" />

          <div aria-live="polite" className="mt-5">
            {/* headline */}
            {result && verdict ? (
              <h2
                className={`rise font-[family-name:var(--font-display)] text-[1.65rem] font-bold leading-tight ${verdictColor}`}
              >
                {verdict.headline}
              </h2>
            ) : (
              <h2 className="font-[family-name:var(--font-display)] text-[1.65rem] font-bold leading-tight text-ink-soft/60">
                {loading ? " " : "Awaiting a passage"}
              </h2>
            )}

            {/* hero number */}
            <div className="mt-4">
              <div
                className={`font-[family-name:var(--font-display)] text-[4.6rem] font-semibold leading-none ${
                  result ? "text-ink" : "text-ink-soft/40"
                }`}
              >
                {pct !== null ? `${pct}%` : "—"}
              </div>
              <div className="mt-1.5 text-[0.68rem] uppercase tracking-[0.26em] text-ink-soft">
                probability of AI authorship
              </div>
            </div>

            {/* dial */}
            <div className="mt-5">
              <Gauge p={result ? result.p_ai : null} />
            </div>

            {/* interpretation */}
            <div className="mt-4 min-h-[3.2rem]">
              {loading && (
                <p className="deliberating italic text-ink-soft">
                  Examining the passage
                </p>
              )}
              {!loading && error && (
                <p className="rise italic text-ai">{error}</p>
              )}
              {!loading && !error && result && (
                <>
                  <p className="rise mx-auto max-w-xs text-[1.02rem] italic leading-snug">
                    {explanation(result.p_ai)}
                  </p>
                  <p className="mt-3 text-[0.68rem] uppercase tracking-[0.22em] text-ink-soft">
                    {result.words} words examined · calibrated
                  </p>
                </>
              )}
              {!loading && !error && !result && (
                <p className="mx-auto max-w-xs italic leading-snug text-ink-soft">
                  Paste a passage and press Examine — the dial swings toward
                  Human or AI and the score is explained in plain words.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
