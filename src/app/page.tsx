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
    body: "The reported probability is temperature-calibrated: 90% means nine passages out of ten with that score are AI-written.",
  },
];

export default function Home() {
  return (
    <div className="certificate m-3 flex grow flex-col sm:m-5">
      <div className="certificate-inner flex grow flex-col">
        <div className="mx-auto flex w-full max-w-4xl grow flex-col px-5 sm:px-10">
          {/* top bar */}
          <header className="flex items-center justify-between border-b border-line py-5">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/seal.svg" alt="PIRD seal" className="h-9 w-9" />
              <div>
                <div className="font-[family-name:var(--font-display)] text-base font-semibold tracking-[0.14em]">
                  PIRD
                </div>
                <div className="text-[0.62rem] uppercase tracking-[0.28em] text-ink-soft">
                  Textual Verification
                </div>
              </div>
            </div>
            <ThemeToggle />
          </header>

          {/* masthead */}
          <section className="pb-12 pt-14 text-center sm:pt-16">
            <p className="text-[0.7rem] uppercase tracking-[0.4em] text-ink-soft">
              Paraphrase-Robust · Cross-Domain · Calibrated
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-[4.2rem] font-semibold leading-none tracking-[0.16em] sm:text-[5.5rem]">
              <span className="pl-[0.16em]">PIRD</span>
            </h1>
            <div className="mx-auto mt-6 flex max-w-sm items-center gap-4 text-accent">
              <span className="h-px grow bg-line" />
              <span aria-hidden className="text-lg">
                ❦
              </span>
              <span className="h-px grow bg-line" />
            </div>
            <p className="mx-auto mt-6 max-w-xl text-[1.15rem] italic leading-relaxed text-ink-soft">
              Determine whether a passage was written by human hand or by
              machine. Submit at least twenty words and receive a calibrated
              verdict, robust to paraphrase and disguise.
            </p>
          </section>

          {/* analyzer */}
          <main className="grow">
            <Analyzer />

            {/* method, in three articles */}
            <section className="mt-20 border-t border-line pt-12">
              <h2 className="text-center text-[0.7rem] uppercase tracking-[0.4em] text-ink-soft">
                On the Method
              </h2>
              <div className="mt-8 grid gap-10 text-center sm:grid-cols-3 sm:gap-6">
                {FEATURES.map((f) => (
                  <article key={f.numeral}>
                    <div className="font-[family-name:var(--font-display)] text-2xl text-accent">
                      {f.numeral}.
                    </div>
                    <h3 className="mt-2 font-[family-name:var(--font-display)] text-lg font-semibold">
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
          <footer className="mt-16 border-t-[3px] border-double border-line py-7 text-center">
            <div aria-hidden className="text-accent">
              ❧
            </div>
            <p className="mt-2 text-sm italic text-ink-soft">
              Research demonstration — predictions are probabilistic and not
              infallible. Do not use as sole evidence of misconduct.
            </p>
            <p className="mt-2 text-[0.7rem] uppercase tracking-[0.24em] text-ink-soft">
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
      </div>
    </div>
  );
}
