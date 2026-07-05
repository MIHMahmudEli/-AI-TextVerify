# PIRD — Paraphrase-Robust AI-Text Detector (web)

Next.js + Tailwind front-end for the PIRD detector. Vintage classic design with
light ("classic white") and dark ("classic black") modes and a persistent toggle.

The UI calls the PIRD REST API hosted on Hugging Face Spaces:
[`MohsinEli/pird-api`](https://huggingface.co/spaces/MohsinEli/pird-api)
(`POST https://mohsineli-pird-api.hf.space/predict` with `{"text": "..."}`).

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
```

## Configure

`NEXT_PUBLIC_PIRD_API_URL` — base URL of the PIRD API (defaults to the
Hugging Face Space above; see `.env.example`).

## Deploy on Vercel

Import this repo at https://vercel.com/new — no special settings needed.
Optionally set `NEXT_PUBLIC_PIRD_API_URL` in Project → Settings → Environment
Variables to point at a different API deployment.

---

_Research demonstration — predictions are probabilistic and not infallible.
Do not use as sole evidence of misconduct._
