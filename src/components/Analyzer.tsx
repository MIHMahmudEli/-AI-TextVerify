"use client";

import { useMemo, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_PIRD_API_URL ?? "https://mohsineli-pird-api.hf.space";

const EXAMPLES = [
  "The proposed framework leverages a robust architecture to efficiently process large-scale data, demonstrating significant improvements across all evaluated benchmarks and establishing a new state of the art for the task under consideration.",
  "honestly i wasn't sure the trip was gonna happen at all — the flight got delayed twice, my bag nearly didn't make it, and then it rained the whole first day. but somehow it turned out great.",
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
        e instanceof Error
          ? e.message
          : "The detector is unreachable. Please try again shortly.",
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
    <section className="grid gap-8 lg:grid-cols-[7fr_5fr]">
      {/* input side */}
      <div>
        <label
          htmlFor="passage"
          className="mb-2 block text-xs uppercase tracking-[0.18em] text-ink-soft"
        >
          Passage under examination
        </label>
        <textarea
          id="passage"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={11}
          placeholder="Paste a passage of at least 20 words…"
          className="w-full resize-y rounded-sm border border-line bg-panel p-4
                     text-[1.05rem] leading-relaxed text-ink shadow-none outline-none
                     transition-colors placeholder:italic placeholder:text-ink-soft/70
                     focus:border-accent"
        />
        <div className="mt-3 flex items-center justify-between gap-4">
          <span className="text-sm italic text-ink-soft">
            {words} {words === 1 ? "word" : "words"}
            {words > 0 && words < 20 && " — at least 20 required"}
          </span>
          <div className="flex gap-3">
            <button
              onClick={clear}
              className="rounded-sm border border-line px-5 py-2.5 text-xs font-semibold
                         uppercase tracking-[0.16em] text-ink transition-colors
                         hover:border-accent hover:text-accent-strong cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={analyze}
              disabled={loading || words < 20}
              className="rounded-sm bg-btn px-7 py-2.5 text-xs font-semibold uppercase
                         tracking-[0.16em] text-btn-text transition-colors
                         hover:bg-btn-hover disabled:cursor-not-allowed disabled:opacity-45
                         cursor-pointer"
            >
              {loading ? "Examining…" : "Analyze"}
            </button>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 text-xs uppercase tracking-[0.18em] text-ink-soft">
            Specimens to try
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.slice(0, 24)}
                onClick={() => {
                  setText(ex);
                  setResult(null);
                  setError(null);
                }}
                className="truncate rounded-sm border border-line bg-panel px-3 py-2
                           text-left text-sm text-ink transition-colors
                           hover:border-accent cursor-pointer"
                title={ex}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* verdict side */}
      <div>
        <div className="mb-2 text-xs uppercase tracking-[0.18em] text-ink-soft">
          Verdict
        </div>
        <div className="rounded-sm border border-line bg-panel p-6">
          {loading && (
            <p className="italic text-ink-soft">
              Consulting the detector — a moment, please…
            </p>
          )}

          {!loading && error && <p className="italic text-ai">{error}</p>}

          {!loading && !error && !result && (
            <p className="italic text-ink-soft">
              The verdict will appear here once a passage has been examined.
            </p>
          )}

          {!loading && result && (
            <div>
              <div
                className={`font-[family-name:var(--font-display)] text-2xl font-semibold ${
                  isAi ? "text-ai" : "text-human"
                }`}
              >
                {isAi ? "Likely AI-generated" : "Likely human-written"}
              </div>
              <p className="mt-1 text-sm italic text-ink-soft">
                calibrated · {result.words} words
              </p>

              <div className="mt-5">
                <div className="mb-1.5 flex justify-between text-xs uppercase tracking-[0.14em] text-ink-soft">
                  <span>P(AI-generated)</span>
                  <span className="font-semibold text-ink">{pct}%</span>
                </div>
                <div
                  role="meter"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={pct}
                  aria-label="Probability the passage is AI-generated"
                  className="h-2.5 overflow-hidden rounded-full border border-line bg-paper"
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-accent-strong transition-[width] duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-1.5 flex justify-between text-[0.7rem] uppercase tracking-[0.14em] text-ink-soft">
                  <span>Human</span>
                  <span>AI</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
