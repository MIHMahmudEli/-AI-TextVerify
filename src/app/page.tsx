import Analyzer from "@/components/Analyzer";
import ThemeToggle from "@/components/ThemeToggle";

const FEATURES = [
  {
    title: "Paraphrase-Robust",
    body: "Unlike perplexity-based detectors, PIRD stays reliable when AI text is deliberately paraphrased to evade detection.",
  },
  {
    title: "Cross-Domain",
    body: "Trained and evaluated across essays, reviews, news, and creative writing, so it generalises beyond one style of prose.",
  },
  {
    title: "Calibrated",
    body: "The reported probability is temperature-calibrated: 90% means nine passages out of ten with that score are AI-written.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-5xl grow flex-col px-5 sm:px-8">
      {/* top bar */}
      <header className="flex items-center justify-between pt-6">
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/seal.svg" alt="PIRD seal" className="h-8 w-8" />
          <span className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-[0.1em]">
            PIRD
          </span>
        </div>
        <ThemeToggle />
      </header>

      {/* masthead */}
      <section className="pb-10 pt-12 text-center sm:pt-16">
        <p className="text-xs uppercase tracking-[0.34em] text-ink-soft">
          Paraphrase-Robust · Cross-Domain · Calibrated
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-6xl font-semibold tracking-[0.18em] sm:text-7xl">
          <span className="pl-[0.18em]">PIRD</span>
        </h1>
        <div className="mx-auto mt-4 flex max-w-md items-center gap-4 text-accent">
          <span className="h-px grow bg-line" />
          <span aria-hidden>❧</span>
          <span className="h-px grow bg-line" />
        </div>
        <p className="mx-auto mt-5 max-w-2xl text-lg italic leading-relaxed text-ink-soft">
          A paraphrase-robust detector of AI-generated text. Paste a passage of
          at least twenty words to receive a calibrated probability that it was
          machine-written.
        </p>
      </section>

      {/* analyzer */}
      <main className="grow">
        <Analyzer />

        {/* features */}
        <section className="mt-16 grid gap-6 border-t border-line pt-10 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title}>
              <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-accent-strong">
                {f.title}
              </h2>
              <p className="mt-2 text-[0.97rem] leading-relaxed text-ink-soft">
                {f.body}
              </p>
            </div>
          ))}
        </section>
      </main>

      {/* footer */}
      <footer className="mt-16 border-t-[3px] border-double border-line py-6 text-center">
        <p className="text-sm italic text-ink-soft">
          Research demonstration — predictions are probabilistic and not
          infallible. Do not use as sole evidence of misconduct.
        </p>
      </footer>
    </div>
  );
}
