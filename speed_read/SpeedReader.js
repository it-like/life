const LIMITS = {
  maxChars: 200_000,
  maxTokens: 50_000,
};

function clampInt(value, min, max, fallback) {
  const n = Number.parseInt(String(value), 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function msPerWordFromWpm(wpm) {
  return Math.round(60_000 / Math.max(1, wpm));
}

function isAlphaNumCodePoint(codePoint) {
  // Letters + numbers (Unicode aware).
  const ch = String.fromCodePoint(codePoint);
  return /[\p{L}\p{N}]/u.test(ch);
}

function pickOrpIndexByAlphaNumCount(alphaNumCount) {
  if (alphaNumCount <= 1) return 0;
  if (alphaNumCount <= 5) return 1;
  if (alphaNumCount <= 9) return 2;
  if (alphaNumCount <= 13) return 3;
  return 4;
}

function getCodePointCharAt(str, index) {
  const cp = str.codePointAt(index);
  if (cp === undefined) return "";
  return String.fromCodePoint(cp);
}

function hasSentenceEndingPunctuation(token) {
  // Adds extra pause for tokens ending in ., ?, or !, including cases like .” or !)).
  // Implemented via a simple backward scan to keep it cheap.
  for (let i = token.length - 1; i >= 0; i -= 1) {
    const ch = token[i];

    // Skip common trailing closers/quotes.
    if (ch === ")" || ch === "]" || ch === "}" || ch === '"' || ch === "'" || ch === "”" || ch === "’") {
      continue;
    }

    return ch === "." || ch === "?" || ch === "!";
  }
  return false;
}

function computeDisplayParts(token) {
  const alphaNumPositions = [];
  for (let i = 0; i < token.length; ) {
    const cp = token.codePointAt(i);
    if (cp === undefined) break;
    if (isAlphaNumCodePoint(cp)) alphaNumPositions.push(i);
    i += String.fromCodePoint(cp).length;
  }

  let orpPos = 0;
  let highlight = false;

  if (alphaNumPositions.length > 0) {
    const idx = Math.min(
      alphaNumPositions.length - 1,
      Math.max(0, pickOrpIndexByAlphaNumCount(alphaNumPositions.length)),
    );
    orpPos = alphaNumPositions[idx];
    highlight = true;
  }

  const orpChar = getCodePointCharAt(token, orpPos);
  const left = token.slice(0, orpPos);
  const right = token.slice(orpPos + orpChar.length);

  return {
    token,
    left,
    orp: orpChar,
    right,
    highlight,
    sentenceEnd: hasSentenceEndingPunctuation(token),
  };
}

function tokenize(text) {
  return String(text)
    .replace(/\r\n/g, "\n")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

function parseTextWithLimits(text) {
  const normalized = String(text ?? "");
  if (normalized.trim().length === 0) {
    return { ok: false, error: "No text provided." };
  }

  if (normalized.length > LIMITS.maxChars) {
    return {
      ok: false,
      error: `Text too large (${normalized.length} chars). Limit is ${LIMITS.maxChars}.`,
    };
  }

  const tokens = tokenize(normalized);
  if (tokens.length > LIMITS.maxTokens) {
    return {
      ok: false,
      error: `Too many words (${tokens.length}). Limit is ${LIMITS.maxTokens}.`,
    };
  }

  return {
    ok: true,
    tokens: tokens.map(computeDisplayParts),
  };
}

export class SpeedReader {
  constructor(rootEl, options = {}) {
    if (!rootEl) throw new Error("SpeedReader: missing root element");

    this.root = rootEl;

    const selectors = {
      wpm: "#srWpm",
      useText: "#srUseText",
      startPause: "#srStartPause",
      restart: "#srRestart",
      status: "#srStatus",
      progress: "#srProgress",
      textarea: "#srText",
      file: "#srFile",
      useFile: "#srUseFile",
      word: ".sr-word",
      left: "#srLeft",
      orp: "#srOrp",
      right: "#srRight",
    };

    const optionalSelectors = {
      sampleSelect: "#srSampleSelect",
      loadSample: "#srLoadSample",
    };

    this.els = {};
    for (const [key, selector] of Object.entries(selectors)) {
      const el = rootEl.querySelector(selector);
      if (!el) throw new Error(`SpeedReader: missing element ${selector}`);
      this.els[key] = el;
    }

    for (const [key, selector] of Object.entries(optionalSelectors)) {
      this.els[key] = rootEl.querySelector(selector);
    }

    this.state = {
      tokens: [],
      index: 0,
      playing: false,
      timer: null,
      wpm: clampInt(options.wpm ?? this.els.wpm.value, 0, 2000, 300),
    };

    this.els.wpm.value = String(this.state.wpm);

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onWpmInput = this.onWpmInput.bind(this);
    this.onUseText = this.onUseText.bind(this);
    this.onUseFile = this.onUseFile.bind(this);
    this.onStartPause = this.onStartPause.bind(this);
    this.onRestart = this.onRestart.bind(this);
    this.onLoadSample = this.onLoadSample.bind(this);
    this.onResize = this.onResize.bind(this);

    this.els.wpm.addEventListener("input", this.onWpmInput);
    this.els.useText.addEventListener("click", this.onUseText);
    this.els.useFile.addEventListener("click", this.onUseFile);
    this.els.startPause.addEventListener("click", this.onStartPause);
    this.els.restart.addEventListener("click", this.onRestart);

    if (this.els.loadSample) {
      this.els.loadSample.addEventListener("click", this.onLoadSample);
    }

    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("resize", this.onResize);

    this.setStatus("Paste text below and click “Use text”");
    this.initSamples();
    this.render();
    this.updateButtons();
  }

  destroy() {
    this.stopTimer();
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("resize", this.onResize);

    this.els.wpm.removeEventListener("input", this.onWpmInput);
    this.els.useText.removeEventListener("click", this.onUseText);
    this.els.useFile.removeEventListener("click", this.onUseFile);
    this.els.startPause.removeEventListener("click", this.onStartPause);
    this.els.restart.removeEventListener("click", this.onRestart);

    if (this.els.loadSample) {
      this.els.loadSample.removeEventListener("click", this.onLoadSample);
    }
  }

  async initSamples() {
    if (!this.els.sampleSelect) return;

    // Client-only: load a local static index.json listing sample .txt files.
    this.els.sampleSelect.innerHTML = "";

    try {
      // Revalidate so updates to sample lists show up after refresh.
      const res = await fetch("./samples/index.json", { cache: "no-cache" });
      if (!res.ok) throw new Error("index.json fetch failed");
      const data = await res.json();
      const files = Array.isArray(data?.files) ? data.files : [];

      if (files.length === 0) {
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "(no sample texts)";
        this.els.sampleSelect.appendChild(opt);
        this.els.sampleSelect.disabled = true;
        if (this.els.loadSample) this.els.loadSample.disabled = true;
        return;
      }

      this.els.sampleSelect.disabled = false;
      if (this.els.loadSample) this.els.loadSample.disabled = false;

      for (const f of files) {
        const name = typeof f?.name === "string" ? f.name : "";
        if (!name) continue;
        const label = typeof f?.label === "string" ? f.label : name;

        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = label;
        this.els.sampleSelect.appendChild(opt);
      }
    } catch (_err) {
      // If samples aren't deployed, just keep the UI non-fatal.
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "(samples unavailable)";
      this.els.sampleSelect.appendChild(opt);
      this.els.sampleSelect.disabled = true;
      if (this.els.loadSample) this.els.loadSample.disabled = true;
    }
  }

  async onLoadSample() {
    if (!this.els.sampleSelect) return;
    const fileName = this.els.sampleSelect.value;
    if (!fileName) {
      this.setStatus("No sample selected.");
      return;
    }

    if (fileName.includes("/") || fileName.includes("\\") || fileName.includes("..")) {
      this.setStatus("Invalid sample name.");
      return;
    }

    this.setStatus("Loading sample…");

    try {
      // Revalidate so edits to sample files show up after refresh.
      const res = await fetch(`./samples/${encodeURIComponent(fileName)}`, { cache: "no-cache" });
      if (!res.ok) throw new Error("sample fetch failed");
      const text = await res.text();
      this.loadText(text, `sample: ${fileName}`);
    } catch (_err) {
      this.setStatus("Could not load that sample.");
    }
  }

  setStatus(message) {
    this.els.status.textContent = message;
  }

  setProgress() {
    const total = this.state.tokens.length;
    this.els.progress.textContent = total > 0 ? `${this.state.index + 1}/${total}` : "";
  }

  updateButtons() {
    const hasText = this.state.tokens.length > 0;
    this.els.startPause.disabled = !hasText;
    this.els.restart.disabled = !hasText;
    this.els.startPause.textContent = this.state.playing ? "Pause" : "Start";
  }

  stopTimer() {
    if (this.state.timer) {
      clearTimeout(this.state.timer);
      this.state.timer = null;
    }
  }

  scheduleNextTick() {
    this.stopTimer();
    if (!this.state.playing) return;

    const token = this.state.tokens[this.state.index];
    const base = msPerWordFromWpm(this.state.wpm);
    const extra = token?.sentenceEnd ? Math.max(240, Math.round(base * 0.35)) : 0;
    const delay = base + extra;

    this.state.timer = setTimeout(() => {
      if (!this.state.playing) return;

      if (this.state.index >= this.state.tokens.length - 1) {
        this.state.playing = false;
        this.updateButtons();
        this.setStatus("Done");
        return;
      }

      this.state.index += 1;
      this.render();
      this.scheduleNextTick();
    }, delay);
  }

  render() {
    if (this.state.tokens.length === 0) {
      this.els.left.textContent = "";
      this.els.orp.textContent = "";
      this.els.right.textContent = "";
      this.els.orp.classList.add("sr-orp--muted");
      this.fitCurrentWord();
      this.setProgress();
      return;
    }

    const t = this.state.tokens[this.state.index];
    this.els.left.textContent = t.left;
    this.els.orp.textContent = t.orp;
    this.els.right.textContent = t.right;

    if (t.highlight) {
      this.els.orp.classList.remove("sr-orp--muted");
    } else {
      this.els.orp.classList.add("sr-orp--muted");
    }
    this.fitCurrentWord();
    this.setProgress();
  }

  fitCurrentWord() {
    // Only shrink when the left/right sides would ellipsize.
    // Keeps ORP centered thanks to the fixed 1ch middle column in CSS.
    if (!this.els.word) return;

    const wordEl = this.els.word;
    const left = this.els.left;
    const right = this.els.right;

    // Reset any previous fit to measure from the base size.
    wordEl.style.fontSize = "";

    const basePx = Number.parseFloat(getComputedStyle(wordEl).fontSize);
    if (!Number.isFinite(basePx) || basePx <= 0) return;

    const needsFit = () => left.scrollWidth > left.clientWidth || right.scrollWidth > right.clientWidth;
    if (!needsFit()) return;

    // Compute a target ratio from the worst overflow side.
    const ratios = [];
    if (left.scrollWidth > 0) ratios.push(left.clientWidth / left.scrollWidth);
    if (right.scrollWidth > 0) ratios.push(right.clientWidth / right.scrollWidth);
    let ratio = Math.min(...ratios, 1);
    if (!Number.isFinite(ratio)) return;

    // Add a tiny safety margin so we don't sit right on the edge.
    ratio *= 0.985;

    const minPx = 16;
    const maxShrink = 0.6; // don't go below 60% of base unless minPx requires it
    const targetPx = Math.max(minPx, basePx * Math.max(maxShrink, ratio));
    wordEl.style.fontSize = `${targetPx.toFixed(2)}px`;

    // If we're still overflowing (due to rounding), gently step down a few times.
    let curPx = targetPx;
    for (let i = 0; i < 6 && needsFit() && curPx > minPx; i += 1) {
      curPx = Math.max(minPx, curPx * 0.95);
      wordEl.style.fontSize = `${curPx.toFixed(2)}px`;
    }
  }

  onResize() {
    this.fitCurrentWord();
  }

  loadText(text, sourceLabel) {
    const parsed = parseTextWithLimits(text);
    if (!parsed.ok) {
      this.state.playing = false;
      this.stopTimer();
      this.state.tokens = [];
      this.state.index = 0;
      this.render();
      this.updateButtons();
      this.setStatus(parsed.error);
      return false;
    }

    this.state.playing = false;
    this.stopTimer();
    this.state.tokens = parsed.tokens;
    this.state.index = 0;

    this.render();
    this.updateButtons();
    this.setStatus(`Ready (${sourceLabel})`);
    return true;
  }

  startOrPause() {
    if (this.state.tokens.length === 0) return;

    this.state.playing = !this.state.playing;
    if (this.state.playing) {
      this.setStatus("Playing");
      this.scheduleNextTick();
    } else {
      this.setStatus("Paused");
      this.stopTimer();
    }

    this.updateButtons();
  }

  restart() {
    if (this.state.tokens.length === 0) return;
    this.state.index = 0;
    this.render();
    this.setStatus(this.state.playing ? "Playing" : "Ready");
  }

  step(delta) {
    if (this.state.tokens.length === 0) return;
    this.state.index = Math.max(0, Math.min(this.state.tokens.length - 1, this.state.index + delta));
    this.render();
  }

  onWpmInput(e) {
    this.state.wpm = clampInt(e.target.value, 0, 2000, this.state.wpm);
    e.target.value = String(this.state.wpm);

    if (this.state.playing) {
      this.scheduleNextTick();
    }
  }

  onUseText() {
    this.loadText(this.els.textarea.value, "custom text");
  }

  async onUseFile() {
    const file = this.els.file.files && this.els.file.files[0];
    if (!file) {
      this.setStatus("No file selected.");
      return;
    }

    if (!file.name.toLowerCase().endsWith(".txt")) {
      this.setStatus("Please select a .txt file.");
      return;
    }

    this.setStatus("Reading file…");

    try {
      const text = await file.text();
      this.loadText(text, `file: ${file.name}`);
    } catch (_err) {
      this.setStatus("Could not read the file.");
    }
  }

  onStartPause() {
    this.startOrPause();
  }

  onRestart() {
    this.restart();
  }

  onKeyDown(e) {
    const tag = e.target && e.target.tagName;
    if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;

    if (e.code === "Space") {
      e.preventDefault();
      this.startOrPause();
      return;
    }

    if (e.code === "ArrowLeft") {
      e.preventDefault();
      this.state.playing = false;
      this.stopTimer();
      this.updateButtons();
      this.setStatus("Paused");
      this.step(-1);
      return;
    }

    if (e.code === "ArrowRight") {
      e.preventDefault();
      this.state.playing = false;
      this.stopTimer();
      this.updateButtons();
      this.setStatus("Paused");
      this.step(1);
      return;
    }
  }
}
