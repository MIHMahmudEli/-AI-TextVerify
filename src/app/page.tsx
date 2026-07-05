import Analyzer from "@/components/Analyzer";
import ThemeToggle from "@/components/ThemeToggle";

const FEATURES = [
  {
    numeral: "I",
    title: "Paraphrase-Robust",
    body: "Unlike perplexity-based detectors, PIRD stays reliable when AI text is deliberately paraphrased to evade detection.",
  },
  {
    numeral: "II",
    title: "Cross-Domain",
    body: "Trained and evaluated across essays, reviews, news, and creative writing, so it generalises beyond one style of prose.",
  },
  {
    numeral: "III",
    title: "Calibrated",
    body: "The probability is temperature-calibrated: a 90% score means nine passages out of ten with that score are AI-written.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-5xl grow flex-col px-5 sm:px-8">
      {/* dateline */}
      <div className="flex items-center justify-between border-y border-line py-2 text-[0.64rem] uppercase tracking-[0.22em] text-ink-soft">
        <span className="hidden sm:inline">Vol. I — MMXXVI</span>
        <span className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/seal.svg" alt="" className="h-4 w-4" />
          Paraphrase-Robust Detection
        </span>
        <ThemeToggle />
      </div>

      {/* masthead */}
      <header className="pb-6 pt-9 text-center sm:pt-12">
        <h1 className="font-[family-name:var(--font-display)] text-[4rem] font-bold leading-none tracking-[0.1em] sm:text-[5.2rem]">
          <span className="pl-[0.1em]">PIRD</span>
        </h1>
        <p className="mt-3 text-[0.7rem] uppercase tracking-[0.34em] text-ink-soft">
          The Textual Examiner
        </p>
        <p className="mx-auto mt-4 max-w-xl text-[1.1rem] italic leading-relaxed text-ink-soft">
          Was it written by human hand, or by machine? Submit at least twenty
          words and receive a calibrated verdict in plain language.
        </p>
      </header>

      <div className="rule-double" />

      {/* examiner */}
      <main className="grow pt-8">
        <Analyzer />

        {/* method columns */}
        <section className="mt-16 border-t border-line pt-10">
          <h2 className="text-center text-[0.7rem] uppercase tracking-[0.36em] text-ink-soft">
            On the Method
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-line">
            {FEATURES.map((f) => (
              <article key={f.numeral} className="text-center sm:px-6">
                <div className="font-[family-name:var(--font-display)] text-xl text-accent">
                  {f.numeral}.
                </div>
                <h3 className="mt-1.5 font-[family-name:var(--font-display)] text-lg font-semibold">
                  {f.title}
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-[0.95rem] leading-relaxed text-ink-soft">
                  {f.body}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* colophon */}
      <footer className="mt-14 border-t-[3px] border-double border-line py-6 text-center">
        <div aria-hidden className="text-accent">
          ❧
        </div>
        <p className="mt-2 text-sm italic text-ink-soft">
          Research demonstration — predictions are probabilistic and not
          infallible. Do not use as sole evidence of misconduct.
        </p>
        <p className="mt-2 text-[0.68rem] uppercase tracking-[0.22em] text-ink-soft">
          <a
            href="https://huggingface.co/spaces/MohsinEli/pird-api"
            className="transition-colors hover:text-accent-strong"
          >
            API
          </a>
          <span className="mx-3">·</span>
          <a
            href="https://github.com/MIHMahmudEli/Pird-ai-text-detector"
            className="transition-colors hover:text-accent-strong"
          >
            Research
          </a>
        </p>
      </footer>
    </div>
  );
}
