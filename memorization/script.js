// =====================================================================
// Data taken directly from the paper (Morris et al., 2025, arXiv:2505.24832)
// =====================================================================

// Table 1 (p.6): capacity by depth/width, bf16 and fp32, exact transcription.
const TABLE1 = [
  { layers: 1, width: 32,  params: 8.04e4, capBf16: 3.16e5, capFp32: 3.39e5, alphaBf16: 3.93, alphaFp32: 4.23 },
  { layers: 1, width: 64,  params: 1.85e5, capBf16: 6.93e5, capFp32: 7.27e5, alphaBf16: 3.74, alphaFp32: 3.92 },
  { layers: 1, width: 128, params: 4.69e5, capBf16: 1.69e6, capFp32: 1.71e6, alphaBf16: 3.61, alphaFp32: 3.65 },
  { layers: 1, width: 256, params: 1.33e6, capBf16: 3.83e6, capFp32: 4.15e6, alphaBf16: 2.88, alphaFp32: 3.12 },
  { layers: 2, width: 32,  params: 9.31e4, capBf16: 3.31e5, capFp32: 3.87e5, alphaBf16: 3.56, alphaFp32: 4.16 },
  { layers: 2, width: 64,  params: 2.35e5, capBf16: 9.27e5, capFp32: 9.60e5, alphaBf16: 3.94, alphaFp32: 4.08 },
  { layers: 2, width: 128, params: 6.67e5, capBf16: 2.60e6, capFp32: 2.66e6, alphaBf16: 3.89, alphaFp32: 3.99 },
  { layers: 2, width: 256, params: 2.12e6, capBf16: 7.76e6, capFp32: 8.49e6, alphaBf16: 3.66, alphaFp32: 4.01 },
  { layers: 4, width: 32,  params: 1.18e5, capBf16: 3.99e5, capFp32: 4.65e5, alphaBf16: 3.37, alphaFp32: 3.92 },
  { layers: 4, width: 64,  params: 3.35e5, capBf16: 1.14e6, capFp32: 1.34e6, alphaBf16: 3.39, alphaFp32: 3.98 },
  { layers: 4, width: 128, params: 1.06e6, capBf16: 3.75e6, capFp32: 4.02e6, alphaBf16: 3.53, alphaFp32: 3.78 },
  { layers: 4, width: 256, params: 3.70e6, capBf16: 1.30e7, capFp32: 1.36e7, alphaBf16: 3.51, alphaFp32: 3.68 },
  { layers: 8, width: 32,  params: 1.69e5, capBf16: 4.85e5, capFp32: 5.12e5, alphaBf16: 2.86, alphaFp32: 3.02 },
  { layers: 8, width: 64,  params: 5.35e5, capBf16: 1.71e6, capFp32: 2.05e6, alphaBf16: 3.19, alphaFp32: 3.83 },
  { layers: 8, width: 128, params: 1.86e6, capBf16: 6.49e6, capFp32: 7.23e6, alphaBf16: 3.49, alphaFp32: 3.89 },
  { layers: 8, width: 256, params: 6.86e6, capBf16: 2.51e7, capFp32: 2.71e7, alphaBf16: 3.65, alphaFp32: 3.96 },
];

// Table 2 (p.11): validation points -- {label, params, D, targetF1, observedF1, observedErr}
// Capacity(theta) = 3.64 * params (alpha from Fig.6), so x = Capacity/|D|.
const ALPHA_FIG6 = 3.64;
const TABLE2 = [
  { model: "GPT-2 (1600-wide, 48 layers, ~1.56B params)", params: 1556075200, D: 170654583, target: 0.55, observed: 54.61, err: 1.3 },
  { model: "GPT-2 (1600-wide, 48 layers, ~1.56B params)", params: 1556075200, D: 76795021,  target: 0.75, observed: 71.08, err: 0.4 },
  { model: "GPT-2 (1600-wide, 48 layers, ~1.56B params)", params: 1556075200, D: 18851574,  target: 0.95, observed: 95.85, err: 0.8 },
  { model: "GPT-2 (768-wide, 12 layers, ~124M params)",  params: 123702528,  D: 13566442,  target: 0.55, observed: 53.44, err: 1.1 },
  { model: "GPT-2 (768-wide, 12 layers, ~124M params)",  params: 123702528,  D: 6104935,   target: 0.75, observed: 65.69, err: 0.6 },
  { model: "GPT-2 (768-wide, 12 layers, ~124M params)",  params: 123702528,  D: 1498634,   target: 0.95, observed: 97.98, err: 0.3 },
];

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initProgressBar();
  initNav();
  initKatex();
  initCapacityWidget();
  initCalculator();
  initDoubleDescentWidget();
  initSigmoidWidget();
  initQuiz();
  initBibtexCopy();
  initTable1();
});

// =====================================================================
// Theme toggle
// =====================================================================
function initTheme() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  let stored = null;
  try { stored = localStorage.getItem("re-theme"); } catch (e) {}
  if (stored === "dark" || stored === "light") {
    document.documentElement.setAttribute("data-theme", stored);
  }
  updateThemeIcon();

  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const effectiveDark = current ? current === "dark" : prefersDark;
    const next = effectiveDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("re-theme", next); } catch (e) {}
    updateThemeIcon();
  });

  function updateThemeIcon() {
    const current = document.documentElement.getAttribute("data-theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const effectiveDark = current ? current === "dark" : prefersDark;
    btn.setAttribute("aria-label", effectiveDark ? "Switch to light theme" : "Switch to dark theme");
    btn.innerHTML = effectiveDark
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/></svg>';
  }
}

// =====================================================================
// Reading progress bar
// =====================================================================
function initProgressBar() {
  const bar = document.getElementById("progress-bar");
  if (!bar) return;
  const update = () => {
    const h = document.documentElement;
    const scrollTop = h.scrollTop || document.body.scrollTop;
    const scrollHeight = (h.scrollHeight || document.body.scrollHeight) - h.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    bar.style.width = pct + "%";
  };
  document.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

// =====================================================================
// Mobile nav
// =====================================================================
function initNav() {
  const btn = document.getElementById("nav-hamburger");
  const links = document.getElementById("nav-links");
  if (!btn || !links) return;
  btn.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    })
  );
}

// =====================================================================
// KaTeX (CDN) with plain-text fallback
// =====================================================================
function initKatex() {
  document.querySelectorAll(".katex-target").forEach((el) => {
    const tex = el.getAttribute("data-tex");
    if (!tex) return;
    if (typeof katex === "undefined") return; // leave plain-text fallback visible
    try {
      katex.render(tex, el, { throwOnError: false, displayMode: el.hasAttribute("data-display") });
    } catch (e) {
      // keep plain-text fallback
    }
  });
}

// =====================================================================
// Small math / formatting helpers
// =====================================================================
function mapLog(value, dMin, dMax, rMin, rMax) {
  const lv = Math.log10(value), lmin = Math.log10(dMin), lmax = Math.log10(dMax);
  return rMin + ((lv - lmin) / (lmax - lmin)) * (rMax - rMin);
}
function mapLin(value, dMin, dMax, rMin, rMax) {
  return rMin + ((value - dMin) / (dMax - dMin)) * (rMax - rMin);
}
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function formatBits(bits) {
  if (bits >= 1e9) return (bits / 1e9).toFixed(2) + "×10⁹ bits";
  if (bits >= 1e6) return (bits / 1e6).toFixed(2) + "×10⁶ bits";
  if (bits >= 1e3) return (bits / 1e3).toFixed(2) + "×10³ bits";
  return Math.round(bits) + " bits";
}
function formatBytes(bits) {
  const bytes = bits / 8;
  if (bytes >= 1024 * 1024 * 1024) return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  if (bytes >= 1024) return (bytes / 1024).toFixed(2) + " KB";
  return Math.round(bytes) + " B";
}
function formatParams(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return String(n);
}
function formatSci(num, digits) {
  digits = digits === undefined ? 1 : digits;
  const exp = num.toExponential(digits);
  const [mantissa, e] = exp.split("e");
  const expNum = parseInt(e, 10);
  const supers = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
  const expStr = String(expNum).split("").map((ch) => supers[ch] || ch).join("");
  return `${mantissa}×10${expStr}`;
}
function parseParamCount(str) {
  if (!str) return null;
  const m = String(str).trim().match(/^([\d.,]+)\s*([kKmMbB]?)$/);
  if (!m) return null;
  const num = parseFloat(m[1].replace(/,/g, ""));
  if (isNaN(num)) return null;
  const mult = { k: 1e3, m: 1e6, b: 1e9, "": 1 }[m[2].toLowerCase()];
  return num * mult;
}

// =====================================================================
// Widget 1: capacity-filling animated visual (Section 4 / Figure 1 & 5 / Appendix A.1)
// mem(X, L(X)) ~= min(capacity(L), H(X)),  H(X) = N * S * log2(V)   [p.7, p.15]
// =====================================================================
function initCapacityWidget() {
  const svg = document.getElementById("capacity-chart");
  const select = document.getElementById("capacity-model-select");
  const slider = document.getElementById("capacity-n-slider");
  const nLabel = document.getElementById("capacity-n-label");
  const readout = document.getElementById("capacity-readout");
  const playBtn = document.getElementById("capacity-play");
  if (!svg || !select || !slider) return;

  select.innerHTML = TABLE1.map(
    (r, i) => `<option value="${i}">${r.layers} layer(s), width ${r.width} (${formatParams(r.params)} params)</option>`
  ).join("");
  select.value = "15"; // 8 layers, width 256 -- the largest, matches Figure 5's model

  const S = 64, V = 2048; // paper defaults, p.7
  const bitsPerToken = Math.log2(V); // = 11
  const N_MIN = 1e2, N_MAX = 1e8;

  function currentCapacity() {
    return TABLE1[+select.value].capBf16;
  }

  function render() {
    const cap = currentCapacity();
    const N = Math.pow(10, +slider.value);
    const H = N * S * bitsPerToken;
    const mem = Math.min(cap, H);
    nLabel.textContent = formatSci(N);

    // y domain: a bit above the largest capacity in the table so the line never clips
    const yMax = Math.max(...TABLE1.map((r) => r.capBf16)) * 2.2;
    const yMin = 1e4;
    const padL = 54, padR = 16, padT = 16, padB = 32;
    const w = 640, h = 260;
    const x0 = padL, x1 = w - padR, y0 = h - padB, y1 = padT;

    const xOf = (n) => mapLog(n, N_MIN, N_MAX, x0, x1);
    const yOf = (bits) => mapLog(Math.max(bits, yMin), yMin, yMax, y0, y1);

    // curve: min(cap, N*S*bitsPerToken) sampled across N
    let d = "";
    const steps = 120;
    for (let i = 0; i <= steps; i++) {
      const logN = Math.log10(N_MIN) + (i / steps) * (Math.log10(N_MAX) - Math.log10(N_MIN));
      const n = Math.pow(10, logN);
      const bits = Math.min(cap, n * S * bitsPerToken);
      const x = xOf(n), y = yOf(bits);
      d += (i === 0 ? "M" : "L") + x.toFixed(1) + "," + y.toFixed(1) + " ";
    }

    const capY = yOf(cap);
    const markerX = xOf(N), markerY = yOf(mem);

    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.innerHTML = `
      <line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}" class="chart-axis" />
      <line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}" class="chart-axis" />
      <line x1="${x0}" y1="${capY}" x2="${x1}" y2="${capY}" class="chart-capacity-line" />
      <text x="${x1}" y="${capY - 6}" text-anchor="end" class="chart-label">capacity ceiling (${formatBits(cap)})</text>
      <path d="${d}" class="chart-curve" />
      <circle cx="${markerX}" cy="${markerY}" r="5.5" class="chart-marker" />
      <text x="${x0}" y="${h - 8}" class="chart-label">training set size (samples, log scale) →</text>
      <text x="14" y="${(y0 + y1) / 2}" text-anchor="middle" class="chart-label" transform="rotate(-90 14 ${(y0 + y1) / 2})">memorized bits (log) →</text>
    `;

    readout.innerHTML = `At <b>${N < 1e4 ? Math.round(N).toLocaleString() : formatSci(N)}</b> training samples, the model has memorized about
      <b>${formatBits(mem)}</b> (${formatBytes(mem)}) &mdash; ${mem >= cap * 0.98 ? "it has filled its capacity and plateaued." : "still below its capacity ceiling."}`;
  }

  select.addEventListener("change", render);
  slider.addEventListener("input", render);

  let playing = false;
  playBtn.addEventListener("click", () => {
    if (playing) return;
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { slider.value = Math.log10(N_MAX); render(); return; }
    playing = true;
    playBtn.disabled = true;
    const start = Math.log10(N_MIN), end = Math.log10(N_MAX);
    const duration = 2600;
    const t0 = performance.now();
    function step(t) {
      const p = clamp((t - t0) / duration, 0, 1);
      slider.value = start + p * (end - start);
      render();
      if (p < 1) requestAnimationFrame(step);
      else { playing = false; playBtn.disabled = false; }
    }
    requestAnimationFrame(step);
  });

  slider.value = Math.log10(1e5);
  render();
}

// =====================================================================
// Widget 2: parameter -> capacity calculator
// bits = params * 3.6 bits/param (paper's headline estimate, p.1/p.2/p.7)
// =====================================================================
function initCalculator() {
  const input = document.getElementById("calc-params");
  const btn = document.getElementById("calc-run");
  const out = document.getElementById("calc-readout");
  if (!input || !btn || !out) return;

  const BPP = 3.64; // Figure 6's fitted estimate, p.7 -- used consistently across this page

  function run() {
    const params = parseParamCount(input.value);
    if (params === null || params <= 0) {
      out.innerHTML = `<span style="color:var(--bad)">Enter a parameter count like <code>125M</code>, <code>1.5B</code>, or <code>7000000</code>.</span>`;
      return;
    }
    const bits = params * BPP;
    const MB = bits / 8 / 1000000;
    const sizeStr = MB >= 1000 ? `${(MB / 1000).toFixed(2)} GB &nbsp;(${MB.toLocaleString(undefined, { maximumFractionDigits: 2 })} MB)` : `${MB.toFixed(2)} MB`;
    out.innerHTML = `
      <div>Estimated capacity for a <b>${formatParams(params)}-parameter</b> model (at α = ${BPP} bits/parameter):</div>
      <div style="margin-top:.4rem"><b>${formatBits(bits)}</b> &nbsp;≈&nbsp; <b>${sizeStr}</b></div>
      <div style="margin-top:.5rem;font-size:0.8rem;color:var(--text-dim)">
        Formula: bits = params × ${BPP} &nbsp;·&nbsp; MB = bits ÷ 8 ÷ 1,000,000${MB >= 1000 ? " &nbsp;·&nbsp; GB = MB ÷ 1,000" : ""}
      </div>
    `;
  }
  btn.addEventListener("click", run);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") run(); });
  input.value = "125M";
  run();
}

// =====================================================================
// Widget 3: double-descent regime slider
// Shape is ILLUSTRATIVE only -- the paper shows this relationship empirically
// (Figure 3, p.3) but does not give a closed-form equation for test loss vs.
// dataset-to-capacity ratio. The critical ratio = 1 is the paper's finding;
// the curve connecting the regimes is ours, for teaching purposes only.
// =====================================================================
function initDoubleDescentWidget() {
  const svg = document.getElementById("dd-chart");
  const slider = document.getElementById("dd-slider");
  const readout = document.getElementById("dd-readout");
  const regimeLabel = document.getElementById("dd-regime");
  if (!svg || !slider) return;

  // control points: [log10(ratio), relative illustrative loss]
  const pts = [
    [-2, 0.55], [-1.3, 0.34], [-0.6, 0.16], [-0.15, 0.10],
    [0, 1.0],
    [0.15, 0.11], [0.6, 0.065], [1.3, 0.045], [2, 0.035], [3, 0.03],
  ];
  function sampleCurve(n) {
    // simple Catmull-Rom spline sampler for a smooth illustrative curve
    const res = [];
    const P = pts;
    for (let seg = 0; seg < P.length - 1; seg++) {
      const p0 = P[Math.max(seg - 1, 0)];
      const p1 = P[seg];
      const p2 = P[seg + 1];
      const p3 = P[Math.min(seg + 2, P.length - 1)];
      for (let i = 0; i < n; i++) {
        const t = i / n;
        const t2 = t * t, t3 = t2 * t;
        const x = 0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);
        const y = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
        res.push([x, y]);
      }
    }
    res.push(P[P.length - 1]);
    return res;
  }
  const curve = sampleCurve(24);

  function valueAt(logRatio) {
    for (let i = 0; i < curve.length - 1; i++) {
      const [x1, y1] = curve[i], [x2, y2] = curve[i + 1];
      if (logRatio >= x1 && logRatio <= x2) {
        const t = x2 === x1 ? 0 : (logRatio - x1) / (x2 - x1);
        return y1 + t * (y2 - y1);
      }
    }
    return curve[curve.length - 1][1];
  }

  const w = 640, h = 240, padL = 54, padR = 16, padT = 16, padB = 40;
  const x0 = padL, x1 = w - padR, y0 = h - padB, y1 = padT;
  const xDomain = [-2, 3], yDomain = [0, 1.05];
  const xOf = (lr) => mapLin(lr, xDomain[0], xDomain[1], x0, x1);
  const yOf = (v) => mapLin(v, yDomain[0], yDomain[1], y0, y1);

  let d = "";
  curve.forEach(([x, y], i) => { d += (i === 0 ? "M" : "L") + xOf(x).toFixed(1) + "," + yOf(y).toFixed(1) + " "; });
  const ratioLineX = xOf(0);

  function render() {
    const logRatio = +slider.value;
    const ratio = Math.pow(10, logRatio);
    const val = valueAt(logRatio);
    const mx = xOf(logRatio), my = yOf(val);

    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.innerHTML = `
      <line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}" class="chart-axis" />
      <line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}" class="chart-axis" />
      <line x1="${ratioLineX}" y1="${y0}" x2="${ratioLineX}" y2="${y1}" class="chart-capacity-line" />
      <text x="${ratioLineX}" y="${y1 + 10}" text-anchor="middle" class="chart-label">capacity = dataset size</text>
      <path d="${d}" class="chart-curve" />
      <circle cx="${mx}" cy="${my}" r="5.5" class="chart-marker" />
      <text x="${x0}" y="${h - 8}" class="chart-label">dataset-to-capacity ratio (log scale) →</text>
      <text x="14" y="${(y0 + y1) / 2}" text-anchor="middle" class="chart-label" transform="rotate(-90 14 ${(y0 + y1) / 2})">test loss (illustrative) →</text>
    `;

    let regime, desc;
    if (logRatio < -0.3) {
      regime = "Under capacity";
      desc = "The dataset is smaller than the model can hold. The model can memorize it almost point-for-point.";
    } else if (logRatio <= 0.3) {
      regime = "Critical zone (near ratio = 1)";
      desc = "Dataset size is close to model capacity. This is where the paper observes the double-descent peak in test loss (Figure 3).";
    } else {
      regime = "Over capacity";
      desc = "The dataset is far bigger than the model can memorize, so the model is forced to share information across examples — i.e. generalize.";
    }
    regimeLabel.textContent = regime;
    readout.innerHTML = `<b>Ratio ≈ ${ratio < 1 ? ratio.toFixed(2) : ratio.toFixed(0)}</b> &mdash; ${desc}`;
  }

  slider.addEventListener("input", render);
  slider.value = "0";
  render();
}

// =====================================================================
// Widget 4: membership-inference sigmoid chart
// The paper's printed formula + fitted constants (p.10) do NOT numerically
// reproduce its own Table 2 (verified against Capacity/|D| computed with
// alpha=3.64). So this chart plots Table 2's real (x, F1) points and an
// illustrative monotone curve fit to THOSE points -- not the paper's literal
// equation. See the disclosure note in the HTML next to this widget.
// =====================================================================
function initSigmoidWidget() {
  const svg = document.getElementById("sigmoid-chart");
  const slider = document.getElementById("sigmoid-slider");
  const readout = document.getElementById("sigmoid-readout");
  if (!svg || !slider) return;

  // Illustrative logistic in log10(x), fit by hand to the six Table 2 points
  // (see build notes): k ~ 5.39, midpoint x0 ~ 1.974 in log10 space.
  const K = 5.39, X0 = 1.974;
  function illustrativeF1(x) {
    const lx = Math.log10(x);
    const v = 0.5 + 0.5 / (1 + Math.exp(-K * (lx - X0)));
    return clamp(v, 0.5, 1.0);
  }

  const xDomain = [1, 1000];
  const yDomain = [0.45, 1.02];
  const w = 640, h = 280, padL = 54, padR = 16, padT = 16, padB = 36;
  const x0 = padL, x1 = w - padR, y0 = h - padB, y1 = padT;
  const xOf = (x) => mapLog(x, xDomain[0], xDomain[1], x0, x1);
  const yOf = (y) => mapLin(y, yDomain[0], yDomain[1], y0, y1);

  let curveD = "";
  const steps = 160;
  for (let i = 0; i <= steps; i++) {
    const lx = Math.log10(xDomain[0]) + (i / steps) * (Math.log10(xDomain[1]) - Math.log10(xDomain[0]));
    const x = Math.pow(10, lx);
    const y = illustrativeF1(x);
    curveD += (i === 0 ? "M" : "L") + xOf(x).toFixed(1) + "," + yOf(y).toFixed(1) + " ";
  }

  const tablePoints = TABLE2.map((r) => {
    const cap = r.params * ALPHA_FIG6;
    const x = cap / r.D;
    return { x, yObserved: r.observed / 100, yTarget: r.target, model: r.model };
  });

  function render() {
    const x = +slider.value;
    const val = illustrativeF1(x);
    const mx = xOf(x), my = yOf(val);

    const half = yOf(0.5);
    let markersSvg = tablePoints
      .map(
        (p) => `<circle cx="${xOf(p.x).toFixed(1)}" cy="${yOf(p.yObserved).toFixed(1)}" r="4.5" class="chart-datapoint" />`
      )
      .join("");

    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.innerHTML = `
      <line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}" class="chart-axis" />
      <line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}" class="chart-axis" />
      <line x1="${x0}" y1="${half}" x2="${x1}" y2="${half}" class="chart-capacity-line" />
      <text x="${x1}" y="${half - 6}" text-anchor="end" class="chart-label">F1 = 0.5 (coin flip)</text>
      <path d="${curveD}" class="chart-curve" />
      ${markersSvg}
      <circle cx="${mx}" cy="${my}" r="5.5" class="chart-marker" />
      <text x="${x0}" y="${h - 6}" class="chart-label">Capacity(θ) / |D|  (log scale) →</text>
      <text x="14" y="${(y0 + y1) / 2}" text-anchor="middle" class="chart-label" transform="rotate(-90 14 ${(y0 + y1) / 2})">membership-inference F1 →</text>
    `;

    readout.innerHTML = `At <b>Capacity/|D| ≈ ${x < 10 ? x.toFixed(2) : Math.round(x)}</b>, the illustrative curve predicts <b>F1 ≈ ${val.toFixed(2)}</b>. (Markers = the paper's actual Table 2 observed points.)`;
  }

  slider.addEventListener("input", render);
  slider.value = "90";
  render();
}

// =====================================================================
// Table 1 render (Experiments section)
// =====================================================================
function initTable1() {
  const tbody = document.getElementById("table1-body");
  if (!tbody) return;
  tbody.innerHTML = TABLE1.map(
    (r) => `<tr>
      <td>${r.layers}</td>
      <td>${r.width}</td>
      <td>${formatParams(r.params)}</td>
      <td>${r.capFp32.toExponential(2)}</td>
      <td>${r.capBf16.toExponential(2)}</td>
      <td>${r.alphaFp32.toFixed(2)}</td>
      <td>${r.alphaBf16.toFixed(2)}</td>
    </tr>`
  ).join("");
}

// =====================================================================
// Quiz
// =====================================================================
const QUIZ = [
  {
    q: "According to the paper, approximately how much information can a GPT-style transformer store per parameter?",
    options: ["About 1 bit", "About 2 bits", "About 3.6 bits", "About 8 bits"],
    correct: 2,
    explain: "The paper's headline estimate is ~3.5–3.6 bits per parameter (3.64 in Figure 6's fit), noticeably higher than the ~2 bits/parameter estimated by prior quantization-based work.",
  },
  {
    q: "What triggers the double-descent peak in this paper's framework?",
    options: [
      "The learning rate schedule finishing its warmup",
      "The dataset size (in bits) exceeding the model's capacity (in bits)",
      "The vocabulary size exceeding 2048 tokens",
      "The model being trained for more than 10⁶ steps",
    ],
    correct: 1,
    explain: "The paper finds double descent begins exactly when the dataset's information content exceeds model capacity — i.e. at a dataset-to-capacity ratio of 1.",
  },
  {
    q: "Why does the paper use a reference (or 'oracle') model at all?",
    options: [
      "To generate the training data",
      "To separate what the model memorized about THIS dataset from what any well-trained model would know about the general distribution",
      "To replace the need for a test set",
      "To speed up training",
    ],
    correct: 1,
    explain: "The reference/oracle model approximates the true data-generating process, so subtracting its compression of x isolates unintended (sample-specific) memorization from generalization.",
  },
  {
    q: "As the dataset size |D| grows toward infinity (for a fixed model capacity), what does the paper's scaling law predict for membership-inference F1?",
    options: ["It approaches 1.0 (perfect)", "It approaches 0.5 (a coin flip)", "It approaches 0.0", "It oscillates unpredictably"],
    correct: 1,
    explain: "The sigmoid scaling law's limiting behavior is F1 → 0.5 as |D| → ∞ — loss-based membership inference becomes no better than guessing.",
  },
  {
    q: "In the paper's experiments, which is generally easier to succeed at: extraction or membership inference?",
    options: [
      "Extraction is always easier",
      "They are always identical",
      "Membership inference is generally easier than extraction",
      "Neither works on any model tested",
    ],
    correct: 2,
    explain: "Figure 10 shows membership inference succeeding (F1 up to 0.97 in one case) even when the exact-suffix extraction rate is 0 — MI is strictly easier in every case tested.",
  },
  {
    q: "Why did the authors add an extra deduplication step to their text experiments?",
    options: [
      "To make training faster",
      "Because truncating sequences to 64 tokens would otherwise leave 1–2% near-duplicates, which confounds memorization measurements",
      "Because FineWeb contains no duplicates by default and none was needed",
      "To increase the vocabulary size",
    ],
    correct: 1,
    explain: "The paper notes that truncating to 64-token sequences creates 1–2% duplicates unless specifically deduplicated, and that careful deduplication was important for faithfully measuring extraction/memorization rates.",
  },
];

function initQuiz() {
  const container = document.getElementById("quiz-container");
  const scoreBox = document.getElementById("quiz-score");
  if (!container) return;

  const state = QUIZ.map(() => ({ selected: null, checked: false }));

  function renderQuiz() {
    container.innerHTML = QUIZ.map((item, qi) => {
      const st = state[qi];
      return `
      <div class="quiz-item" data-qi="${qi}">
        <div class="quiz-q">${qi + 1}. ${item.q}</div>
        <div class="quiz-options" role="radiogroup" aria-label="Question ${qi + 1} options">
          ${item.options
            .map(
              (opt, oi) => `
            <label class="quiz-option ${st.selected === oi ? "selected" : ""}">
              <input type="radio" name="q${qi}" value="${oi}" ${st.selected === oi ? "checked" : ""} ${st.checked ? "disabled" : ""} />
              <span>${opt}</span>
            </label>`
            )
            .join("")}
        </div>
        <button class="quiz-check-btn" data-qi="${qi}" ${st.selected === null || st.checked ? "disabled" : ""}>Check answer</button>
        <div class="quiz-feedback ${st.checked ? (st.selected === item.correct ? "correct" : "incorrect") : ""}">
          <span class="label">${st.checked ? (st.selected === item.correct ? "Correct." : "Not quite.") : ""}</span>
          ${st.checked ? item.explain : ""}
        </div>
      </div>`;
    }).join("");

    container.querySelectorAll('input[type="radio"]').forEach((input) => {
      input.addEventListener("change", (e) => {
        const qi = +e.target.closest(".quiz-item").dataset.qi;
        state[qi].selected = +e.target.value;
        renderQuiz();
      });
    });
    container.querySelectorAll(".quiz-check-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const qi = +e.target.dataset.qi;
        state[qi].checked = true;
        renderQuiz();
        maybeShowScore();
      });
    });
  }

  function maybeShowScore() {
    if (state.every((s) => s.checked)) {
      const score = state.filter((s, i) => s.selected === QUIZ[i].correct).length;
      scoreBox.style.display = "block";
      scoreBox.innerHTML = `You scored ${score} / ${QUIZ.length}. <button class="quiz-retake-btn" id="quiz-retake">Retake quiz</button>`;
      document.getElementById("quiz-retake").addEventListener("click", () => {
        state.forEach((s) => { s.selected = null; s.checked = false; });
        scoreBox.style.display = "none";
        renderQuiz();
      });
    }
  }

  renderQuiz();
}

// =====================================================================
// BibTeX copy button
// =====================================================================
function initBibtexCopy() {
  const btn = document.getElementById("bibtex-copy");
  const pre = document.getElementById("bibtex-block");
  if (!btn || !pre) return;
  function selectFallback() {
    const range = document.createRange();
    range.selectNode(pre);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    btn.textContent = "Selected — press Ctrl/Cmd+C";
    setTimeout(() => (btn.textContent = "Copy"), 2000);
  }

  btn.addEventListener("click", async () => {
    const text = pre.textContent;
    // Some contexts (restrictive file:// permission prompts) can leave the
    // Clipboard API promise pending indefinitely rather than rejecting, so
    // race it against a short timeout and fall back to text selection.
    const writeOrTimeout = Promise.race([
      navigator.clipboard && navigator.clipboard.writeText
        ? navigator.clipboard.writeText(text).then(() => "ok")
        : Promise.reject(new Error("Clipboard API unavailable")),
      new Promise((resolve) => setTimeout(() => resolve("timeout"), 1200)),
    ]);
    try {
      const result = await writeOrTimeout;
      if (result === "ok") {
        const old = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = old), 1500);
      } else {
        selectFallback();
      }
    } catch (e) {
      selectFallback();
    }
  });
}
