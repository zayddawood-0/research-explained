# Research, Explained

A small, growing collection of interactive, self-contained explainers for machine learning research papers. Each paper gets its own folder with a single-page, no-build-step website that opens directly from `index.html` — no server, no npm, no framework.

## Papers

### How Much Do Language Models Memorize?

An interactive explainer of:

> Morris, J. X., Sitawarin, C., Guo, C., Kokhlikyan, N., Suh, G. E., Rush, A. M., Chaudhuri, K., & Mahloujifar, S. (2025). *How Much Do Language Models Memorize?* arXiv:2505.24832.

[Read the paper on arXiv →](https://arxiv.org/abs/2505.24832)

The paper proposes an information-theoretic definition of memorization that cleanly separates *unintended memorization* (what a model knows about one specific dataset) from *generalization* (what it knows about the true data-generating process), and uses it to estimate that GPT-style transformers store roughly 3.6 bits of information per parameter.

## How to view

No installation needed.

1. Clone or download this repository.
2. Open `index.html` in any modern browser (double-click it, or drag it into a browser window).
3. From the landing page, click into the "How Much Do Language Models Memorize?" card to open the explainer.

Everything works fully offline from `file://` — the only external resource is KaTeX, loaded from a CDN purely to render math nicely. If there's no internet connection, plain-text fallbacks are shown instead of rendered equations, and the rest of the page (charts, calculators, quiz) is unaffected either way.

## Features

- Sticky top navigation with anchor links and a mobile hamburger menu
- Light/dark theme toggle that respects `prefers-color-scheme`, plus a reading progress bar
- Hand-rolled SVG/JS interactive charts (no charting library dependency):
  - An animated "capacity filling up" visual tied to the paper's own capacity formula
  - A parameter-count → estimated-capacity calculator (bits and MB)
  - A double-descent regime slider
  - A membership-inference scaling-law chart anchored to the paper's actual validation data points
- A 6-question multiple-choice quiz with per-question feedback and a final score
- Full glossary of every technical term used on the page
- Math rendered with KaTeX (CDN), with plain-text fallback if offline
- Fully responsive, keyboard-accessible, semantic HTML

## Folder structure

```
research-explained/
├── index.html                 # landing page listing all papers
├── memorization/
│   ├── index.html             # the "How Much Do Language Models Memorize?" explainer
│   ├── style.css
│   ├── script.js
│   └── assets/                # SVG icons and illustrations
├── README.md
├── LICENSE                    # MIT, for the original code/text in this repo
└── .gitignore
```

## Disclaimer

This repository contains an independent, educational summary of a published research paper. It is **not affiliated with, endorsed by, or reviewed by** the paper's authors or their institutions. All credit for the underlying research belongs entirely to the original authors. Any errors in this explanation are the author of this repository's own.

The paper's PDF is intentionally **not** included in this repository (see `.gitignore`) since arXiv redistribution rights for the PDF itself are not clear-cut — please read the paper directly on [arXiv](https://arxiv.org/abs/2505.24832).

## Screenshot

*(placeholder — add a screenshot of the explainer page here, e.g. `docs/screenshot.png`)*

---

Written by Muhammad Zayd Dawood — [GitHub](https://github.com/zayddawood-0) · [Portfolio](https://portfolio-ruddy-eta-kuetcldrzu.vercel.app/)
