(() => {
"use strict";
/* ---------- utils ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const pad = n => String(n).padStart(2, "0");
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseIso = s => { if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null; const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const TODAY = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; })();
const TODAY_ISO = iso(TODAY);
const daysUntil = s => { const d = parseIso(s); return d ? Math.round((d - TODAY) / 864e5) : null; };
const WD = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const MES = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
const MES3 = MES.map(m => m.slice(0, 3));
const WD_FULL = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
/* inline SVG icons (Lucide-style, 24x24, stroke=currentColor); decorative, so aria-hidden. Static markup uses <i data-ic="name"> placeholders */
const ICON = (() => {
  const svg = p => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${p}</svg>`;
  const P = {
    plus: `<path d="M5 12h14"/><path d="M12 5v14"/>`,
    calc: `<rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><path d="M16 14v4"/><path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M8 18h.01M12 18h.01"/>`,
    calendar: `<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>`,
    calendarCheck: `<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/>`,
    calendarPlus: `<path d="M8 2v4"/><path d="M16 2v4"/><path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"/><path d="M3 10h18"/><path d="M16 19h6"/><path d="M19 16v6"/>`,
    fileCheck: `<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m9 15 2 2 4-4"/>`,
    file: `<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>`,
    users: `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
    award: `<path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/>`,
    clock: `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`,
    edit: `<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>`,
    x: `<path d="M18 6 6 18"/><path d="m6 6 12 12"/>`,
    check: `<path d="M20 6 9 17l-5-5"/>`,
    tri: `<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>`,
    undo: `<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>`,
    save: `<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/>`,
    trash: `<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>`,
    back: `<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>`,
    left: `<path d="m15 18-6-6 6-6"/>`,
    right: `<path d="m9 18 6-6-6-6"/>`,
    link: `<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>`,
    inbox: `<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>`,
    cap: `<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>`,
    alert: `<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>`,
    list: `<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4M12 16h4M8 11h.01M8 16h.01"/>`,
    sun: `<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>`,
    calendarX: `<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m14 14-4 4"/><path d="m10 14 4 4"/>`,
    lamp: `<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>`,
    moon: `<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>`,
    chevDown: `<path d="m6 9 6 6 6-6"/>`,
    flag: `<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>`,
  };
  return Object.fromEntries(Object.entries(P).map(([k, v]) => [k, svg(v)]));
})();
/* placeholders in static markup -> inline SVG (a <i> is replaced, any other element receives the icon) */
document.querySelectorAll("[data-ic]").forEach(el => { const s = ICON[el.dataset.ic]; if (!s) return; if (el.tagName === "I") el.outerHTML = s; else el.innerHTML = s; });const shortDate = s => { const d = parseIso(s); return d ? `${WD[d.getDay()]}, ${pad(d.getDate())}/${pad(d.getMonth() + 1)}` : "sem data"; };
const ddmm = s => { const d = parseIso(s); return d ? `${pad(d.getDate())}/${pad(d.getMonth() + 1)}` : "—"; };
const rel = n => n == null ? "sem prazo" : n === 0 ? "hoje" : n === 1 ? "amanhã" : n === -1 ? "ontem" : n > 1 ? `em ${n} dias` : `há ${-n} dias`;
const fmt = (n, min = 1, max = 2) => n == null || !isFinite(n) ? "—" : n.toLocaleString("pt-BR", { minimumFractionDigits: min, maximumFractionDigits: max });
const num = v => { if (v == null) return null; const t = String(v).trim(); if (t === "") return null; const n = Number(t.replace(",", ".")); return isFinite(n) ? n : null; };
const ceil1 = x => Math.ceil(x * 10 - 1e-9) / 10;
const isPhone = () => matchMedia("(max-width: 560px)").matches;
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
const store = {
  get(k, d) { try { const v = localStorage.getItem("va:" + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem("va:" + k, JSON.stringify(v)); } catch {} }
};
function parseDateInput(s) {
  s = String(s || "").trim(); if (!s) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const m = s.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/);
  if (!m) return undefined;
  const y = m[3] ? (m[3].length === 2 ? 2000 + +m[3] : +m[3]) : TODAY.getFullYear();
  return `${y}-${pad(m[2])}-${pad(m[1])}`;
}

/* ---------- expression evaluator (no eval) ---------- */
function compile(source) {
  const src = String(source || "").replace(/(\d),(\d)/g, "$1.$2");
  const re = /\s*(\d+(?:\.\d+)?|[A-Za-z_][A-Za-z0-9_]*|[-+*/()^,])/y;
  const toks = []; re.lastIndex = 0;
  while (re.lastIndex < src.length) {
    if (/^\s*$/.test(src.slice(re.lastIndex))) break;
    const m = re.exec(src); if (!m) throw new Error(`símbolo inesperado perto de "${src.slice(re.lastIndex, re.lastIndex + 6)}"`);
    toks.push(m[1]);
  }
  if (!toks.length) throw new Error("fórmula vazia");
  let i = 0; const vars = new Set();
  const peek = () => toks[i], next = () => toks[i++];
  const expect = t => { if (toks[i] !== t) throw new Error(`esperava "${t}"`); i++; };
  const FN = { min: Math.min, max: Math.max };
  function expr() { let n = term(); while (peek() === "+" || peek() === "-") { const op = next(), a = n, b = term(); n = op === "+" ? v => a(v) + b(v) : v => a(v) - b(v); } return n; }
  function term() { let n = power(); while (peek() === "*" || peek() === "/") { const op = next(), a = n, b = power(); n = op === "*" ? v => a(v) * b(v) : v => a(v) / b(v); } return n; }
  function power() { const a = unary(); if (peek() === "^") { next(); const b = power(); return v => Math.pow(a(v), b(v)); } return a; }
  function unary() { if (peek() === "-") { next(); const a = unary(); return v => -a(v); } if (peek() === "+") { next(); return unary(); } return primary(); }
  function primary() {
    const t = next();
    if (t == null) throw new Error("fórmula incompleta");
    if (/^\d/.test(t)) { const k = Number(t); return () => k; }
    if (t === "(") { const e = expr(); expect(")"); return e; }
    if (/^[A-Za-z_]/.test(t)) {
      if (peek() === "(" && FN[t.toLowerCase()]) {
        next(); const args = [expr()]; while (peek() === ",") { next(); args.push(expr()); } expect(")");
        const f = FN[t.toLowerCase()]; return v => f(...args.map(a => a(v)));
      }
      vars.add(t);
      return v => { if (!(t in v)) throw new Error(`"${t}" não existe nas notas`); return v[t]; };
    }
    throw new Error(`"${t}" fora do lugar`);
  }
  const fn = expr(); if (i < toks.length) throw new Error(`sobrou "${toks[i]}"`);
  return { fn, vars };
}

/* ---------- grade analysis ---------- */
const partsOf = comp => comp.partes && comp.partes.length ? comp.partes : [{ id: "nota", rotulo: "Nota", peso: 1 }];
function analisar(d, notas) {
  const f = d.formula || {}; const comps = f.componentes || [];
  notas = notas || d.notas || {};
  let c;
  try { c = compile(f.expressao); for (const v of c.vars) if (!comps.some(k => k.id === v)) throw new Error(`"${v}" não é uma das notas`); }
  catch (e) { return { erro: "Fórmula inválida: " + e.message }; }
  if (!comps.length) return { erro: "Nenhuma nota cadastrada na fórmula." };
  const compVal = (comp, x) => {
    let s = 0, w = 0, missing = false;
    for (const p of partsOf(comp)) { let v = num(notas[comp.id]?.[p.id]); if (v == null) { v = x; missing = true; } s += p.peso * v; w += p.peso; }
    return { v: w ? s / w : 0, missing };
  };
  const varsAt = x => Object.fromEntries(comps.map(k => [k.id, compVal(k, x).v]));
  const M = x => c.fn(varsAt(x));
  const pend = comps.filter(k => compVal(k, 0).missing);
  const lanc = comps.filter(k => !compVal(k, 0).missing);
  const zero = Object.fromEntries(comps.map(k => [k.id, 0]));
  const base = c.fn(zero);
  const coef = k => c.fn({ ...zero, [k.id]: 1 }) - base;
  // average of what is graded so far: a note with only some parts graded counts by those parts
  const partial = k => { let s = 0, w = 0; for (const p of partsOf(k)) { const v = num(notas[k.id]?.[p.id]); if (v != null) { s += p.peso * v; w += p.peso; } } return w ? s / w : null; };
  let atual = null;
  { let s = 0, w = 0; for (const k of comps) { const v = partial(k); if (v == null) continue; s += coef(k) * v; w += coef(k); } if (w > 0) atual = s / w; }
  const alvo = num(f.aprovacao) ?? 6;
  const rec = f.recuperacao && f.recuperacao.ativa ? f.recuperacao : null;
  const out = { alvo, atual, pend, lanc, comps, rec, compVal, partial };
  const solve = (g, target) => { if (g(0) >= target) return 0; if (g(10) < target - 1e-9) return Infinity; let lo = 0, hi = 10; for (let k = 0; k < 50; k++) { const m = (lo + hi) / 2; if (g(m) >= target - 1e-9) hi = m; else lo = m; } return ceil1(hi); };
  if (pend.length) {
    out.needed = solve(M, alvo);
    out.max = M(10); out.min = M(0);
    if (out.needed === Infinity) out.status = rec && out.max >= num(rec.min) ? ["Recuperação", "warn"] : ["Risco alto", "bad"];
    else if (out.needed === 0) out.status = ["Aprovação garantida", "ok"];
    else if (atual == null) out.status = ["Sem notas", "info"];
    else if (out.needed <= 5) out.status = ["Tranquilo", "ok"];
    else if (out.needed <= 7.5) out.status = ["Atenção", "warn"];
    else out.status = ["Puxado", "bad"];
  } else {
    const m = M(0); out.final = m;
    if (m >= alvo - 1e-9) out.status = ["Aprovado", "ok"];
    else if (rec && m >= num(rec.min) - 1e-9 && m < (num(rec.max) ?? alvo)) {
      try {
        const rc = compile(rec.expressao || "(M+R)/2");
        const rparts = rec.partes && rec.partes.length ? rec.partes : [{ id: "nota", peso: 1 }];
        const rv = x => { let s = 0, w = 0, miss = false; for (const p of rparts) { let v = num(notas.REC?.[p.id]); if (v == null) { v = x; miss = true; } s += p.peso * v; w += p.peso; } return { v: w ? s / w : 0, miss }; };
        const g = x => rc.fn({ ...varsAt(0), M: m, R: rv(x).v });
        const ra = num(rec.aprovacao) ?? alvo;
        if (!rv(0).miss) { const fin = g(0); out.finalRec = fin; out.status = fin >= ra - 1e-9 ? ["Aprovado na rec.", "ok"] : ["Reprovado", "bad"]; }
        else { out.recNeeded = solve(g, ra); out.status = ["Recuperação", "warn"]; }
      } catch (e) { out.status = ["Recuperação", "warn"]; out.recErro = e.message; }
    } else out.status = ["Reprovado", "bad"];
  }
  return out;
}

/* ---------- state ---------- */
const COLS = ["disciplinas", "avaliacoes", "tarefas", "datas", "eventos", "certificados", "ligas", "faltas", "periodos"];
const S = { disciplinas: null, avaliacoes: null, tarefas: null, datas: null, eventos: null, certificados: null, ligas: null, faltas: null, periodos: null, regulamento: undefined };
/* ---------- períodos: RAW holds every document; S holds only the selected period (the Hub tab stays global) ----------
   disciplinas, avaliações, tarefas and datas carry `periodo` ("2026.2"); a document without it belongs to PER_BASE.
   faltas follow their disciplina. The list runs from 2026.1 to 2029.2, plus any extra doc in the periodos collection */
const RAW = {};
const SCOPED = ["disciplinas", "avaliacoes", "tarefas", "datas"];
const PER_BASE = "2026.2";
const perOf = x => x.periodo || PER_BASE;
const perKey = id => { const [y, h] = String(id).split("."); return +y * 10 + +h; };
function periodos() {
  const ids = new Set();
  for (let y = 2026; y <= 2029; y++) ids.add(`${y}.1`).add(`${y}.2`);
  for (const p of RAW.periodos || []) if (/^\d{4}\.[12]$/.test(p.id)) ids.add(p.id);
  return [...ids].sort((a, b) => perKey(a) - perKey(b)).map(id => ({ id, ...((RAW.periodos || []).find(p => p.id === id) || {}) }));
}
// the period today falls in: by the inicio/fim saved for it, else first half of the year = .1, second = .2
function perAtual() {
  const hit = periodos().find(p => p.inicio && p.fim && p.inicio <= TODAY_ISO && TODAY_ISO <= p.fim);
  return hit ? hit.id : `${TODAY.getFullYear()}.${TODAY.getMonth() < 7 ? 1 : 2}`;
}
const perVazio = id => !SCOPED.some(c => (RAW[c] || []).some(x => perOf(x) === id));
function applyPeriod() {
  for (const c of SCOPED) S[c] = RAW[c] == null ? null : RAW[c].filter(x => perOf(x) === ui.per);
  const ids = new Set((S.disciplinas || []).map(d => d.id));
  S.faltas = RAW.faltas == null ? null : RAW.faltas.filter(f => ids.has(f.disciplinaId));
  for (const c of ["eventos", "certificados", "ligas", "periodos"]) S[c] = RAW[c] ?? null;
}
let DB = null, ASSETS = null, dbState = "loading";
const ui = {
  tab: "hoje", disc: store.get("disc", null), weekOff: 0,
  month: (() => { const d = new Date(TODAY); d.setDate(1); return d; })(), selDay: TODAY_ISO,
  hubView: store.get("hubView", "eventos"),
  objOpen: {}, taskTab: "abertas", per: store.get("per", null),
};
const list = c => S[c] || [];
const discById = id => list("disciplinas").find(d => d.id === id);
const short = d => d.apelido || d.nome;
const discName = id => { const d = discById(id); return d ? short(d) : "Geral"; };
const isRec = a => a.tipo === "recuperacao";
const CORES = { azul: "Azul", verde: "Verde", rosa: "Rosa", amarelo: "Amarelo", lilas: "Lilás", pessego: "Pêssego", menta: "Menta", grafite: "Grafite" };
const COR_PADRAO = { "calculo-1": "azul", "poo": "verde", "estrutura-dados-1": "lilas", "arq-computadores": "pessego", "banco-dados-1": "amarelo", "topicos-comp-aplicada": "grafite", "transformacao-digital": "rosa" };
function corOf(id) {
  const d = discById(id); if (d && CORES[d.cor]) return d.cor;
  if (COR_PADRAO[id]) return COR_PADRAO[id];
  const keys = Object.keys(CORES); let h = 0; for (const ch of String(id || "")) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return keys[h % keys.length];
}
const tag = id => { const d = discById(id); return d ? `<span class="tag c-${corOf(id)}">${esc(short(d))}</span>` : `<span class="tag">Geral</span>`; };
const sortBy = (arr, f) => [...arr].sort((a, b) => { const x = f(a), y = f(b); return x < y ? -1 : x > y ? 1 : 0; });
const smooth = () => matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
function scrollToEl(sel) { requestAnimationFrame(() => $(sel)?.scrollIntoView({ behavior: smooth(), block: "start" })); }

/* ---------- faltas: one document per missed day; a missed day counts the absences the professor records (aulasPorDia, default 2) ---------- */
const aulasDia = d => num(d?.aulasPorDia) || 2;
// total classes in the semester: each class day of the plan counts the periods its SIGAA code gives that weekday
// (or the absences-per-day setting when there is no code), unless the student set the total by hand
function cargaH(d) {
  if (num(d?.cargaHoraria)) return num(d.cargaHoraria);
  const cr = d?.cronograma || []; if (!cr.length) return 64;
  const porDia = {}; let padrao = null;
  try { for (const h of sigaaToHorarios(d.sigaa || "")) { porDia[h.dia] = h.aulas; if (padrao == null) padrao = h.aulas; } } catch {}
  return cr.reduce((a, c) => { const x = parseIso(c.data); return a + ((x && porDia[x.getDay()]) || padrao || aulasDia(d)); }, 0);
}
const hasAula = (discId, day) => (discById(discId)?.cronograma || []).some(a => a.data === day);
const faltaOf = (discId, day) => list("faltas").find(f => f.disciplinaId === discId && f.data === day);
function freqOf(d) {
  const fs = sortBy(list("faltas").filter(f => f.disciplinaId === d.id), f => f.data);
  const porDia = aulasDia(d);
  const faltas = fs.length * porDia;
  const minPct = num(d.formula?.frequenciaMinima) ?? 75;
  const limite = Math.floor(cargaH(d) * (100 - minPct) / 100 + 1e-9);
  const resta = limite - faltas;
  const status = faltas > limite ? ["Reprovado por falta", "bad"] : resta === 0 ? ["No limite", "bad"] : resta <= 2 * porDia ? ["Atenção", "warn"] : faltas ? ["Em dia", "ok"] : ["Sem faltas", "ok"];
  return { fs, faltas, limite, resta, porDia, minPct, dias: Math.max(0, Math.floor(resta / porDia)), status };
}

/* ---------- média geral: plain average of each discipline's current average ---------- */
const META = 6;
function mediaAtual(d) {
  const r = analisar(d, notasOf(d)); if (r.erro) return null;
  return r.pend.length ? r.atual : (r.finalRec ?? r.final);
}
function geral() {
  const ds = list("disciplinas");
  const vals = ds.map(mediaAtual).filter(v => v != null && isFinite(v));
  return { n: vals.length, total: ds.length, media: vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null };
}
function meterHtml(v, sev = "") {
  const p = Math.max(0, Math.min(100, v * 10));
  return `<span class="meter ${sev}" role="img" aria-label="${esc(fmt(v, 1, 1))} de 10, meta ${esc(fmt(META, 1, 1))}"><span style="width:${p}%"></span><i style="left:${META * 10}%"></i></span><span class="scale" aria-hidden="true"><span>0</span><span style="left:${META * 10}%">meta ${fmt(META, 1, 1)}</span><span>10</span></span>`;
}
function geralHtml(ds) {
  const g = geral();
  if (g.media == null) return `<div class="geral"><div class="gk"><span class="flabel">Média geral do semestre</span><b class="gv">—</b></div><div class="geral-r"><span class="small muted">Aparece quando houver nota lançada em alguma disciplina.</span></div></div>`;
  const risco = ds.filter(d => { const r = analisar(d, notasOf(d)); return !r.erro && r.status && r.status[1] === "bad"; }).length;
  const ok = g.media >= META - 1e-9;
  return `<div class="geral">
    <div class="gk"><span class="flabel">Média geral do semestre</span><b class="gv">${fmt(g.media, 1, 1)}</b></div>
    <div class="geral-r">
      <div class="geral-l"><span class="chip ${ok ? "ok" : "warn"}">${ok ? "Acima da meta" : "Abaixo da meta"}</span><span class="small muted">Calculada com as ${g.n} de ${g.total} disciplinas que já têm nota. ${risco ? `${risco} ${risco === 1 ? "está" : "estão"} em risco.` : "Nenhuma em risco."}</span></div>
      ${meterHtml(g.media, ok ? "" : "warn")}
    </div></div>`;
}

/* ---------- writes ---------- */
const queues = {};
function enqueue(path, fn) { const p = (queues[path] || Promise.resolve()).then(fn, fn); queues[path] = p.catch(() => {}); return p; }
function failMsg(e) {
  const c = e && e.code;
  if (c === "invalid_argument") return "Você não tem permissão para alterar estes dados.";
  if (c === "quota_exceeded") return "O espaço de dados deste app está cheio. Apague itens antigos.";
  if (c === "resource_exhausted") return "Muitas alterações seguidas. Espere um instante.";
  return "Não foi possível salvar. Tente de novo.";
}
async function saveDoc(col, id, data) {
  if (!DB) { toast("Os dados não estão disponíveis nesta visualização."); throw new Error("no db"); }
  if (SCOPED.includes(col) && data.periodo == null) data = { ...data, periodo: ui.per };
  const ref = DB.collection(col).doc(id || undefined);
  return enqueue(ref.path, () => ref.set(data)).then(() => ref.id).catch(e => { toast(failMsg(e)); throw e; });
}
async function patchDoc(col, id, data) {
  if (!DB) return;
  const ref = DB.collection(col).doc(id);
  return enqueue(ref.path, () => ref.update(data)).catch(e => { toast(failMsg(e)); throw e; });
}
/* grades: write the whole document with set() so a cleared grade is really removed (update() merges nested objects) */
let pend = null; /* { id, notas }: edits not yet confirmed by the store */
const notasOf = d => (pend && pend.id === d.id ? pend.notas : d.notas) || {};
async function saveNotas(id, notas) {
  if (!DB) return;
  const ref = DB.collection("disciplinas").doc(id);
  return enqueue(ref.path, () => {
    const cur = discById(id); if (!cur) return;
    const { id: _i, _draft, ...rest } = cur;
    return ref.set({ ...rest, notas });
  }).catch(e => { toast(failMsg(e)); throw e; });
}
async function delDoc(col, id) {
  if (!DB) return;
  const ref = DB.collection(col).doc(id);
  return enqueue(ref.path, () => ref.delete()).catch(e => { toast(failMsg(e)); throw e; });
}

/* ---------- toast & banner ---------- */
let toastT;
function toast(msg, undo) {
  const t = $("#toast"); const bad = /n[ãa]o |erro|falh|indispon/i.test(msg);
  t.className = "toast" + (bad ? " err" : ""); t.innerHTML = (bad ? ICON.alert : ICON.check) + "<span></span>"; t.lastChild.textContent = msg;
  if (undo) { const b = document.createElement("button"); b.type = "button"; b.className = "toast-act"; b.textContent = "Desfazer"; b.onclick = () => { t.hidden = true; clearTimeout(toastT); undo(); }; t.append(b); }
  t.onclick = e => { if (!e.target.closest(".toast-act")) { t.hidden = true; clearTimeout(toastT); } }; // a tap dismisses it
  t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, undo ? 6000 : 3200);
}
function banner(msg) { $("#banner").hidden = !msg; $("#banner-text").textContent = msg || ""; }

/* ---------- tabs ---------- */
/* phone tab bar: every tab keeps its own scroll position, and tapping the active tab again scrolls it to the top */
const tabY = {};
const compact = () => matchMedia("(max-width: 760px)").matches;
function setTab(t, focus) {
  if (!["hoje", "media", "calendario", "hub"].includes(t)) t = "hoje";
  const was = ui.tab; if (was !== t && compact()) tabY[was] = scrollY;
  ui.tab = t;
  $$("[data-panel]").forEach(p => p.hidden = p.dataset.panel !== t);
  // the phone bar's sliding pill follows --i; .glow replays the light under it on every change
  const bar = $(".tabs");
  $$(".tabs a").forEach((a, i) => { if (a.dataset.tab === t) { a.setAttribute("aria-current", "page"); bar.style.setProperty("--i", i); } else a.removeAttribute("aria-current"); });
  $$(".sb-nav a").forEach(a => a.dataset.tab === t ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
  if (was !== t) { bar.classList.remove("glow"); void bar.offsetWidth; bar.classList.add("glow"); }
  setFab(t);
  if (was !== t) revealTitle($(`#tab-${t} .disp`));
  if (was !== t && compact()) scrollTo(0, tabY[t] || 0);
  // a shortcut (KPI, day link) hides the panel that held focus: hand focus to the new page's title instead of dropping it on <body>
  if (focus) { const h = $(`#tab-${t} h1`); if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); } }
}
// blur reveal, same math as Spell UI's BlurReveal: letter by letter, stagger = 0.03s / speedReveal, each letter takes 0.3s / speedSegment.
// Each text run becomes an .sr copy for screen readers plus aria-hidden letters (.bc, index in --k); words stay unbroken (.bw)
const REVEAL = { speedReveal: 1.0, speedSegment: 0.5 };
function revealTitle(h) {
  if (!h || reduceMotion()) return;
  const walk = node => {
    for (const n of [...node.childNodes]) {
      if (n.nodeType === 3) {
        if (!n.textContent.trim()) continue;
        const frag = document.createDocumentFragment();
        const sr = document.createElement("span"); sr.className = "sr"; sr.textContent = n.textContent; frag.append(sr);
        const vis = document.createElement("span"); vis.className = "br"; vis.setAttribute("aria-hidden", "true");
        for (const part of n.textContent.split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) { vis.append(part); continue; }
          const w = document.createElement("span"); w.className = "bw";
          for (const ch of part) { const c = document.createElement("span"); c.className = "bc"; c.textContent = ch; w.append(c); }
          vis.append(w);
        }
        frag.append(vis); n.replaceWith(frag);
      } else if (n.nodeType === 1 && !n.classList.contains("br") && !n.classList.contains("sr")) walk(n);
    }
  };
  walk(h);
  h.querySelectorAll(".bc").forEach((c, k) => c.style.setProperty("--k", k));
  h.style.setProperty("--st", `${0.03 / REVEAL.speedReveal}s`);
  h.style.setProperty("--du", `${0.3 / REVEAL.speedSegment}s`);
  h.classList.remove("reveal"); void h.offsetWidth; h.classList.add("reveal");
}
// tilt card: KPI tiles lean away from a mouse pointer, with a light that follows it (CSS limits it to fine pointers)
{
  const box = $("#kpis"), LIM = 5;
  const tiltOk = () => matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion();
  box.addEventListener("pointermove", e => {
    const k = e.target.closest(".kpi"); if (!k || e.pointerType !== "mouse" || !tiltOk()) return;
    const r = k.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    k.style.setProperty("--rx", `${((0.5 - py) * LIM * 2).toFixed(2)}deg`);
    k.style.setProperty("--ry", `${((px - 0.5) * LIM * 2).toFixed(2)}deg`);
    k.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`); k.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    k.classList.add("tilting");
  });
  box.addEventListener("pointerout", e => {
    const k = e.target.closest(".kpi"); if (k && !k.contains(e.relatedTarget)) k.classList.remove("tilting");
  });
}
window.addEventListener("hashchange", () => setTab(location.hash.slice(1)));
$(".tabs").addEventListener("click", e => {
  const a = e.target.closest("a[data-tab]");
  if (a && a.dataset.tab === ui.tab && compact()) { e.preventDefault(); scrollTo({ top: 0, behavior: smooth() }); }
});
$("[data-skip]").addEventListener("click", e => { e.preventDefault(); const h = $("[data-panel]:not([hidden]) h1"); if (h) { h.tabIndex = -1; h.focus(); } });
// --top-h follows the real height of the sticky header (offline banner, wrapped tabs), so scroll-padding and the sticky result card always clear it
{ const top = $(".top"), sync = () => document.documentElement.style.setProperty("--top-h", top.offsetHeight + "px"); sync(); if (window.ResizeObserver) new ResizeObserver(sync).observe(top); }

/* ---------- render scheduling ---------- */
let raf = 0;
function schedule() { if (!raf) raf = requestAnimationFrame(() => { raf = 0; renderAll(); }); }
function renderAll() {
  // a re-render replaces the "Faltei" button that was just pressed, so hand focus back to its twin
  const a = document.activeElement;
  const fk = a && a.dataset && a.dataset.falta ? `[data-falta="${CSS.escape(a.dataset.falta)}"][data-fday="${CSS.escape(a.dataset.fday)}"]` : null;
  renderPer(); renderHoje(); renderCalc(); renderOverview(); renderUpcoming(); renderCalendar(); renderTasks(); renderHub(); renderHours();
  if (fk) $$(fk).find(el => el.offsetParent !== null)?.focus();
}
const loading = c => S[c] == null && dbState === "loading";
const loadingHtml = `<div class="skel" aria-busy="true"><span class="sr">Carregando…</span><i></i><i></i><i></i></div>`;

/* ================= HOJE ================= */
const TURNO = { matutino: ["Matutino", 1], diurno: ["Diurno", 1], vespertino: ["Vespertino", 2], integral: ["Integral", 2], noturno: ["Noturno", 3] };
// SIGAA schedule code, e.g. 35N12: weekday digits (2 = segunda … 7 = sábado), shift letter, then that shift's periods
const SIGAA_TURNO = { M: "matutino", T: "vespertino", N: "noturno" };
const SIGAA_AULAS = {
  M: [["07:30", "08:20"], ["08:20", "09:10"], ["09:30", "10:20"], ["10:20", "11:10"], ["11:10", "12:00"]],
  T: [["13:30", "14:20"], ["14:20", "15:10"], ["15:30", "16:20"], ["16:20", "17:10"], ["17:10", "18:00"], ["18:00", "18:50"]],
  N: [["19:00", "19:45"], ["19:45", "20:30"], ["20:45", "21:30"], ["21:30", "22:15"]],
};
function horarioNoDia(d, day) { const x = parseIso(day); return x && d ? (d.horarios || []).find(h => h.dia === x.getDay() && h.inicio) || null : null; }
const addDays = (s, n) => { const d = parseIso(s); d.setDate(d.getDate() + n); return iso(d); };
function goTab(t) { if (location.hash.slice(1) !== t) location.hash = t; setTab(t, true); }
function gotoDay(day) {
  const d = parseIso(day); if (!d) return;
  ui.selDay = day; ui.month = new Date(d.getFullYear(), d.getMonth(), 1);
  goTab("calendario"); renderCalendar();
  scrollToEl(isPhone() ? "#day-detail" : "#calendar");
}
async function toggleFalta(discId, day, undone) {
  if (!DB) { toast("Os dados não estão disponíveis nesta visualização."); return; }
  const d = discById(discId); if (!d) return;
  const id = `${discId}_${day}`;
  const prev = list("faltas"); const had = prev.find(f => f.id === id);
  S.faltas = had ? prev.filter(f => f.id !== id) : [...prev, { id, disciplinaId: discId, data: day }];
  schedule();
  try {
    if (had) await delDoc("faltas", id); else await saveDoc("faltas", id, { disciplinaId: discId, data: day });
    const f = freqOf(d);
    toast(had ? `Falta removida · ${short(d)}` : `Falta marcada · ${short(d)}: ${f.faltas} de ${f.limite} faltas`, undone ? undefined : () => toggleFalta(discId, day, true));
  } catch { S.faltas = prev; schedule(); }
}
function nextBusyDay() {
  for (let i = 1; i <= 14; i++) { const s = addDays(TODAY_ISO, i); if (itemsOn(s).length) return s; }
  return addDays(TODAY_ISO, 1);
}
function renderHoje() {
  $("#hoje-script").textContent = `${WD_FULL[TODAY.getDay()]}, ${TODAY.getDate()} de ${MES[TODAY.getMonth()]}`;
  $("#hoje-label").textContent = `Hoje · ${shortDate(TODAY_ISO)}`;
  renderKpis(); renderWeek();
  if (loading("disciplinas")) { $("#hoje-day").innerHTML = $("#prox-day").innerHTML = loadingHtml; return; }
  $("#hoje-day").innerHTML = dayDetailHtml(TODAY_ISO, { head: false, empty: "Nenhuma aula ou prazo hoje." });
  const nx = nextBusyDay();
  $("#prox-label").textContent = `${daysUntil(nx) === 1 ? "Amanhã" : "Próximo dia"} · ${shortDate(nx)}`;
  $("#prox-day").innerHTML = dayDetailHtml(nx, { head: false, empty: "Nada marcado nas próximas duas semanas." }) + tipHtml();
}
function renderKpis() {
  const el = $("#kpis");
  if (loading("disciplinas")) { el.innerHTML = `<span class="sr">Carregando…</span>` + `<div class="skel-card" aria-hidden="true"><i></i><i></i><i></i></div>`.repeat(4); return; }
  const g = geral();
  const next = sortBy(list("avaliacoes").filter(a => a.data && a.data >= TODAY_ISO && !isRec(a)), a => a.data)[0];
  const n = next ? daysUntil(next.data) : null;
  const anyF = list("faltas").length > 0;
  const fr = sortBy(list("disciplinas").map(d => ({ d, f: freqOf(d) })), x => x.f.resta)[0];
  const open = list("tarefas").filter(t => !isDone(t));
  const late = open.filter(t => t.prazo && t.prazo < TODAY_ISO).length;
  const semana = open.filter(t => t.prazo && t.prazo >= TODAY_ISO && daysUntil(t.prazo) <= 7).length;
  const media = g.media == null
    ? `<b class="v">—</b><span class="s">Aparece quando houver nota lançada.</span>`
    : `<b class="v">${fmt(g.media, 1, 1)}</b>${meterHtml(g.media, g.media >= META - 1e-9 ? "" : "warn")}<span class="s">${g.n} de ${g.total} disciplinas com nota</span>`;
  const prova = !next ? `<b class="v">—</b><span class="s">Nenhuma avaliação marcada.</span>`
    : `<b class="v">${n === 0 ? "Hoje" : n === 1 ? "Amanhã" : `${n} dias`}</b><span class="kpi-m">${tag(next.disciplinaId)}</span><span class="s">${esc(TIPO_AVAL[next.tipo] || "Avaliação")}${next.componente ? " · " + esc(next.componente) : ""} · ${shortDate(next.data)}${(() => { const hp = next.hora || horarioNoDia(discById(next.disciplinaId), next.data)?.inicio; return hp ? " · " + esc(hp) : ""; })()}</span>`;
  const faltas = !anyF || !fr ? `<b class="v">0</b><span class="s">Nenhuma falta marcada.</span>`
    : `<b class="v">${fr.f.faltas}<small>/${fr.f.limite}</small></b><span class="kpi-m">${tag(fr.d.id)}${fr.f.status[1] !== "ok" ? `<span class="chip ${fr.f.status[1]}">${fr.f.status[0]}</span>` : ""}</span><span class="s">${fr.f.faltas > fr.f.limite ? "Passou do limite de faltas." : `Ainda pode faltar ${fr.f.dias} ${fr.f.dias === 1 ? "dia" : "dias"}.`}</span>`;
  el.innerHTML = `<button type="button" class="kpi hero" data-kpi="media"><span class="flabel">Média geral</span>${media}</button>
    <button type="button" class="kpi" ${next ? `data-goto-day="${esc(next.data)}"` : `data-kpi="calendario"`}><span class="flabel">Próxima avaliação</span>${prova}</button>
    <button type="button" class="kpi" data-kpi="faltas"${anyF && fr ? ` data-id="${esc(fr.d.id)}"` : ""}><span class="flabel">Faltas</span>${faltas}</button>
    <button type="button" class="kpi" data-kpi="tarefas"><span class="flabel">Tarefas da semana</span><b class="v">${semana}</b><span class="s">${late ? `<span class="chip bad">${late} ${late === 1 ? "atrasada" : "atrasadas"}</span>` : "Nenhuma atrasada."}</span></button>`;
}
$("#kpis").addEventListener("click", e => {
  const b = e.target.closest("[data-kpi]"); if (!b) return;
  const k = b.dataset.kpi;
  if (k === "media") { goTab("media"); scrollToEl("#overview"); }
  else if (k === "faltas") { if (b.dataset.id) { ui.disc = b.dataset.id; store.set("disc", ui.disc); calcKey = ""; } goTab("media"); renderCalc(); scrollToEl("#freq-box"); }
  else if (k === "tarefas") { goTab("calendario"); scrollToEl("#tasks"); }
  else if (k === "calendario") goTab("calendario");
});

/* weekly timetable: the days come from each plan's class schedule unless the student set them */
function diasDe(d) {
  if ((d.horarios || []).length) return d.horarios;
  const c = {};
  for (const a of d.cronograma || []) { const x = parseIso(a.data); if (x) c[x.getDay()] = (c[x.getDay()] || 0) + 1; }
  return Object.keys(c).filter(k => c[k] >= 3).map(k => ({ dia: +k }));
}
const ordTurno = x => { if (x.inicio) { const h = +x.inicio.slice(0, 2); return h < 12 ? 1 : h < 18 ? 2 : 3; } return TURNO[x.d.turno]?.[1] ?? 4; };
function renderWeek() {
  const el = $("#week");
  if (loading("disciplinas")) { el.innerHTML = loadingHtml; return; }
  const ds = list("disciplinas");
  if (!ds.length) { el.innerHTML = `<div class="empty"><span class="empty-ic">${ICON.calendar}</span><b>Nenhuma disciplina em ${esc(ui.per)}.</b><span>O horário da semana aparece quando as disciplinas forem cadastradas.</span></div>`; return; }
  const slots = ds.flatMap(d => diasDe(d).map(h => ({ ...h, d })));
  // on a weekend the useful week is the next one
  const base = new Date(TODAY); const wd = base.getDay();
  if (wd === 6) base.setDate(base.getDate() + 2); else if (wd === 0) base.setDate(base.getDate() + 1);
  const mon = new Date(base); mon.setDate(base.getDate() - (base.getDay() + 6) % 7 + ui.weekOff * 7);
  const dias = [1, 2, 3, 4, 5].concat(slots.some(s => s.dia === 6) ? [6] : [], slots.some(s => s.dia === 0) ? [0] : []);
  const dayIso = dia => { const x = new Date(mon); x.setDate(mon.getDate() + (dia === 0 ? 6 : dia - 1)); return iso(x); };
  const semHora = ds.some(d => !(d.horarios || []).some(h => h.inicio));
  const cols = dias.map(dia => {
    const s = dayIso(dia); const off = itemsOn(s).find(x => x.k === "off"); const today = s === TODAY_ISO;
    const blocks = sortBy(slots.filter(x => x.dia === dia), x => `${ordTurno(x)}|${x.inicio || "99:99"}|${short(x.d)}`);
    return `<div class="wcol${today ? " today" : ""}${off ? " off" : ""}"${today ? ` aria-current="date"` : ""}>
      <div class="wcol-h"><b>${WD[dia]}</b><span>${ddmm(s)}</span></div>
      <div class="wcol-b">${off ? `<span class="woff">${esc(off.t)}</span>` : ""}${blocks.length ? blocks.map(x => {
        const prova = list("avaliacoes").find(a => a.disciplinaId === x.d.id && a.data === s);
        const semAula = !off && !hasAula(x.d.id, s);
        const hora = x.inicio ? `${x.inicio}${x.fim ? "–" + x.fim : ""}` : `${TURNO[x.d.turno] ? TURNO[x.d.turno][0] + " · " : ""}horário a definir`;
        return `<button type="button" class="wblk c-${corOf(x.d.id)}${semAula ? " none" : ""}" data-hor="${esc(x.d.id)}"><b>${esc(short(x.d))}</b><span class="t">${esc(hora)}</span>${x.sala ? `<span class="sl">${esc(x.sala)}</span>` : ""}${semAula ? `<span class="sl">sem aula nesta data</span>` : ""}${prova ? `<span class="wtag">${esc(TIPO_AVAL[prova.tipo] || "Avaliação")}${prova.componente ? " · " + esc(prova.componente) : ""}</span>` : ""}${faltaOf(x.d.id, s) ? `<span class="wtag fal">Falta</span>` : ""}</button>`;
      }).join("") : (off ? "" : `<span class="woff">Sem aula</span>`)}</div></div>`;
  }).join("");
  el.innerHTML = `<div class="week-h"><h3>Semana de ${ddmm(dayIso(dias[0]))} a ${ddmm(dayIso(dias[dias.length - 1]))}</h3>
      <button class="btn sm" type="button" data-week="-1" aria-label="Semana anterior">${ICON.left}</button>
      <button class="btn sm" type="button" data-week="0">${ICON.calendarCheck}Esta semana</button>
      <button class="btn sm" type="button" data-week="1" aria-label="Próxima semana">${ICON.right}</button></div>
    <div class="week" style="--days:${dias.length}">${cols}</div>
    ${semHora ? `<p class="small muted" style="margin:10px 0 0">Os dias vêm do cronograma de cada plano de ensino. Toque numa matéria para colar o código de horário do SIGAA, como 35N12.</p>` : ""}`;
}
$("#week").addEventListener("click", e => {
  const w = e.target.closest("[data-week]");
  if (w) { const k = +w.dataset.week; ui.weekOff = k === 0 ? 0 : ui.weekOff + k; renderWeek(); $(`#week [data-week="${k}"]`)?.focus(); return; }
  const h = e.target.closest("[data-hor]"); if (h) { const d = discById(h.dataset.hor); if (d) horarioForm(d); }
});

/* attendance box inside the calculator */
function renderFreq(d) {
  const el = $("#freq-box"); if (!el) return;
  const f = freqOf(d);
  const pct = f.limite ? Math.min(100, f.faltas / f.limite * 100) : 100;
  const msg = f.faltas > f.limite ? `Você passou ${f.faltas - f.limite} ${f.faltas - f.limite === 1 ? "falta" : "faltas"} do limite.`
    : f.resta === 0 ? "Você chegou ao limite. Mais uma falta reprova por frequência."
    : `Ainda cabem ${f.resta} ${f.resta === 1 ? "falta" : "faltas"}, ou ${f.dias} ${f.dias === 1 ? "dia" : "dias"} de aula. Cada dia faltado conta ${f.porDia} faltas.`;
  el.innerHTML = `<div class="freq">
    <div class="freq-h"><span class="flabel">Faltas</span><span class="chip ${f.status[1]}">${f.status[0]}</span></div>
    <div class="freq-n"><b>${f.faltas}</b><span class="small muted">de ${f.limite} faltas permitidas (${fmt(100 - f.minPct, 0, 0)}% de ${cargaH(d)} aulas)</span></div>
    <span class="meter ${f.status[1] === "ok" ? "" : f.status[1]}" role="img" aria-label="${f.faltas} de ${f.limite} faltas"><span style="width:${pct}%"></span></span>
    <p>${msg}</p>
    ${f.fs.length ? `<div class="fdays">${f.fs.map(x => `<button type="button" class="fday" data-goto-day="${esc(x.data)}" aria-label="Ver ${esc(shortDate(x.data))} no calendário">${esc(shortDate(x.data))}</button>`).join("")}</div>`
      : `<span class="small muted">Marque uma falta pelo botão “Faltei” na aba Hoje ou no dia do calendário.</span>`}
  </div>`;
}

/* ================= CALCULADORA ================= */
let calcKey = "";
function currentDisc() {
  const ds = sortBy(list("disciplinas"), d => d.nome || "");
  let d = ds.find(x => x.id === ui.disc) || ds[0];
  if (d && d.id !== ui.disc) { ui.disc = d.id; }
  return d;
}
function renderCalc() {
  const el = $("#calc");
  if (loading("disciplinas")) { el.innerHTML = loadingHtml; calcKey = ""; return; }
  const ds = sortBy(list("disciplinas"), d => d.nome || "");
  if (!ds.length) {
    calcKey = "";
    el.innerHTML = `<div class="empty"><span class="empty-ic">${ICON.calc}</span><b>Nenhuma disciplina em ${esc(ui.per)}.</b><span>Mande o plano de ensino em PDF na conversa com o Claude, ou cadastre a fórmula à mão.</span><button class="btn primary" type="button" data-act="add-disc">${ICON.plus}Cadastrar disciplina</button></div>`;
    return;
  }
  const d = currentDisc();
  const key = d.id + "|" + JSON.stringify(d.formula) + "|" + ds.map(x => x.id + x.nome).join();
  const notas = notasOf(d);
  if (key !== calcKey) {
    calcKey = key;
    const f = d.formula || {};
    const comps = f.componentes || [];
    el.innerHTML = `
      <div class="calc">
        <div class="calc-main">
          <div class="disc-pick" role="group" aria-label="Disciplina">${ds.map(x => `<button type="button" data-disc="${esc(x.id)}" aria-pressed="${x.id === d.id}">${esc(short(x))}</button>`).join("")}</div>
          <div class="field disc-select"><label for="disc-select">Disciplina</label><select id="disc-select">${ds.map(x => `<option value="${esc(x.id)}" ${x.id === d.id ? "selected" : ""}>${esc(short(x))}</option>`).join("")}</select></div>
          <span class="chip info origem">${esc(d.origem || "Cadastro manual")}</span>
          <h2 class="calc-h">${esc(d.nome)}: quanto eu preciso tirar?</h2>
          <div class="small muted">${esc([d.codigo, d.professor].filter(Boolean).join(" · "))}</div>
          <div class="comps">${comps.map(k => `
            <div class="comp">
              <div class="comp-h"><b>${esc(k.id)}</b><span class="muted small">${k.data ? ddmm(k.data) : ""}</span></div>
              ${partsOf(k).map(p => `<div class="field"><label for="g-${esc(k.id)}-${esc(p.id)}">${esc(p.rotulo || p.id)}${partsOf(k).length > 1 ? ` · ${fmt(p.peso, 0, 2)}` : ""}</label>
                <input class="grade" id="g-${esc(k.id)}-${esc(p.id)}" data-comp="${esc(k.id)}" data-part="${esc(p.id)}" inputmode="decimal" autocomplete="off" placeholder="—" value="${esc(fmtIn(notas[k.id]?.[p.id]))}"></div>`).join("")}
            </div>`).join("")}
          </div>
          <div id="rec-inputs"></div>
          <div class="formula"><span>M =</span><code>${esc(f.expressao || "?")}</code></div>
          <div class="formula meta"><span class="chip line">Aprovação ≥ ${fmt(num(f.aprovacao) ?? 6, 1, 1)}</span>${num(f.frequenciaMinima) ? `<span class="chip line">Frequência ≥ ${fmt(num(f.frequenciaMinima), 0, 0)}%</span>` : ""}</div>
          <div class="formula">
            <button class="btn sm" type="button" data-act="edit-disc" data-id="${esc(d.id)}">${ICON.edit}Editar fórmula</button>
            <button class="btn sm" type="button" data-act="edit-hor" data-id="${esc(d.id)}">${ICON.clock}Horário e faltas</button>
          </div>
          ${(d.pendencias || []).length ? `<details class="fold notes"><summary><span class="flabel">A confirmar</span><span class="chip warn">${d.pendencias.length}</span></summary>${d.pendencias.map(p => `<div class="note">${esc(p)}</div>`).join("")}</details>` : ""}
        </div>
        <div class="calc-r">
          <div class="result" id="result" aria-live="polite"></div>
          <div id="freq-box"></div>
        </div>
      </div>`;
  } else {
    $$("#calc input.grade").forEach(inp => { if (document.activeElement !== inp) { const v = inp.dataset.comp === "REC" ? notas.REC?.[inp.dataset.part] : notas[inp.dataset.comp]?.[inp.dataset.part]; inp.value = fmtIn(v); } });
  }
  renderFreq(d);
  renderResult(d, notas);
  gradeKeys();
}
function fmtIn(v) { const n = num(v); return n == null ? "" : String(n).replace(".", ","); }
/* numeric keypad action key: "next" on every grade field but the last, which gets "done" */
function gradeKeys() { const g = $$("#calc input.grade"); g.forEach((el, i) => { el.enterKeyHint = i < g.length - 1 ? "next" : "done"; }); }
function renderResult(d, notas) {
  const r = analisar(d, notas);
  const el = $("#result"); if (!el) return;
  const recBox = $("#rec-inputs");
  const name = esc(d.nome);
  if (r.erro) { el.innerHTML = `<span class="mono">Resultado · ${name}</span><p>${esc(r.erro)}</p><p>Use “Editar fórmula” para corrigir.</p>`; return; }
  const pendNames = r.pend.map(k => k.id);
  const lista = pendNames.length === 1 ? `na ${pendNames[0]}` : `em cada uma (${pendNames.join(", ")})`;
  const pct = r.atual != null ? Math.min(100, (r.atual / 10) * 100) : 0;
  let html = `<span class="mono">Resultado · ${name}</span>`;
  if (r.pend.length) {
    if (r.needed === 0) {
      html += `<p>Você já passou, mesmo tirando zero no que falta.</p><div class="big">0,0</div>`;
    } else if (r.needed === Infinity) {
      html += `<p>Nem com 10 ${lista} a média chega a ${fmt(r.alvo, 1, 1)}.</p><div class="big small-big">Máx. ${fmt(r.max)}</div>`;
      if (r.rec && r.max >= num(r.rec.min)) html += `<p>Ainda dá para ir à recuperação se a média ficar entre ${fmt(num(r.rec.min), 1, 1)} e ${fmt(num(r.rec.max), 1, 1)}.</p>`;
    } else {
      html += `<p>Você precisa tirar ${lista}</p><div class="big num">${fmt(r.needed, 1, 1)}</div>`;
    }
    html += `<div class="bar" aria-hidden="true"><span style="width:${pct}%"></span></div>`;
    html += `<p class="small">${r.atual != null ? `Média das notas lançadas: <b>${fmt(r.atual)}</b>.` : "Nenhuma nota lançada ainda."} ${r.needed > 0 && isFinite(r.needed) ? `Com ${fmt(r.needed, 1, 1)} ${lista} você fecha em ${fmt(analisarFecha(r))}.` : ""}</p>`;
    if (r.rec && r.rec.obs) html += `<div class="rec">Recuperação: ${esc(r.rec.obs)}</div>`;
  } else {
    html += `<p>Média final do semestre</p><div class="big num">${fmt(r.final)}</div><div class="bar" aria-hidden="true"><span style="width:${Math.min(100, r.final * 10)}%"></span></div>`;
    html += `<p><span class="chip ${r.status[1]}">${r.status[0]}</span></p>`;
    if (r.recNeeded != null) html += `<div class="rec">Na recuperação você precisa de <b>${isFinite(r.recNeeded) ? fmt(r.recNeeded, 1, 1) : "mais de 10"}</b> para fechar com ${fmt(num(r.rec.aprovacao) ?? r.alvo, 1, 1)}. ${esc(r.rec.obs || "")}</div>`;
    if (r.finalRec != null) html += `<div class="rec">Média depois da recuperação: <b>${fmt(r.finalRec)}</b>.</div>`;
  }
  const fq = freqOf(d);
  if (fq.faltas > fq.limite) html += `<div class="rec">Com ${fq.faltas} faltas você passou do limite de ${fq.limite}. A reprovação por frequência vale mesmo com nota boa.</div>`;
  el.innerHTML = html;
  // recovery inputs appear only when the semester average lands in the recovery range
  const showRec = r.rec && !r.pend.length && r.final < r.alvo && r.final >= num(r.rec.min) - 1e-9;
  const want = showRec ? "on" : "off";
  if (recBox && recBox.dataset.state !== want) {
    recBox.dataset.state = want;
    const rp = r.rec && r.rec.partes && r.rec.partes.length ? r.rec.partes : [{ id: "nota", rotulo: "Nota da recuperação", peso: 1 }];
    recBox.innerHTML = showRec ? `<div class="comps"><div class="comp"><div class="comp-h"><b>REC</b><span class="muted small">recuperação</span></div>${rp.map(p => `<div class="field"><label for="g-REC-${esc(p.id)}">${esc(p.rotulo || p.id)} · ${fmt(p.peso, 0, 2)}</label><input class="grade" id="g-REC-${esc(p.id)}" data-comp="REC" data-part="${esc(p.id)}" inputmode="decimal" autocomplete="off" placeholder="—" value="${esc(fmtIn(notas.REC?.[p.id]))}"></div>`).join("")}</div></div>` : "";
    gradeKeys();
  }
}
function analisarFecha(r) {
  const x = r.needed; const vars = Object.fromEntries(r.comps.map(k => [k.id, r.compVal(k, x).v]));
  const d = currentDisc(); try { return compile(d.formula.expressao).fn(vars); } catch { return null; }
}
let gradeT;
$("#calc").addEventListener("input", e => {
  const inp = e.target.closest("input.grade"); if (!inp) return;
  const d = currentDisc(); if (!d) return;
  const raw = inp.value.trim(); const v = num(raw);
  const bad = raw !== "" && (v == null || v < 0 || v > 10);
  inp.classList.toggle("bad-input", bad);
  // say why, next to the field (and to screen readers), instead of only turning the border red
  inp.setAttribute("aria-invalid", bad ? "true" : "false");
  { const fl = inp.closest(".field"); let er = fl && fl.querySelector(".gerr");
    if (bad && fl && !er) { er = document.createElement("span"); er.className = "gerr"; er.id = inp.id + "-e"; er.setAttribute("role", "alert"); er.textContent = "Use de 0 a 10."; fl.append(er); inp.setAttribute("aria-describedby", er.id); }
    else if (!bad && er) { er.remove(); inp.removeAttribute("aria-describedby"); } }
  if (bad) return;
  const target = (pend && pend.id === d.id) ? pend.notas : structuredClone(d.notas || {});
  pend = { id: d.id, notas: target, ver: ((pend && pend.id === d.id && pend.ver) || 0) + 1 };
  const c = inp.dataset.comp, p = inp.dataset.part;
  target[c] = { ...(target[c] || {}) }; if (v == null) delete target[c][p]; else target[c][p] = v;
  if (!Object.keys(target[c]).length) delete target[c];
  renderResult(d, target);
  clearTimeout(gradeT);
  const draft = structuredClone(target), id = d.id, ver = pend.ver;
  gradeT = setTimeout(() => { saveNotas(id, draft).then(() => { toast("Nota salva"); if (pend && pend.id === id && pend.ver === ver) { const cur = discById(id); if (cur && JSON.stringify(cur.notas || {}) === JSON.stringify(draft)) { pend = null; renderCalc(); } else pend.saved = true; } }).catch(() => {}); }, 700);
});
$("#calc").addEventListener("click", e => {
  const b = e.target.closest("[data-disc]"); if (b) { ui.disc = b.dataset.disc; store.set("disc", ui.disc); calcKey = ""; renderCalc(); return; }
});
$("#calc").addEventListener("change", e => {
  if (e.target.id !== "disc-select") return;
  ui.disc = e.target.value; store.set("disc", ui.disc); calcKey = ""; renderCalc();
});
// grade fields: Enter jumps to the next field and the last one closes the keypad; tapping empty space also closes it (the iOS decimal pad has no Done key)
$("#calc").addEventListener("keydown", e => {
  const inp = e.target.closest("input.grade"); if (!inp || e.key !== "Enter") return;
  e.preventDefault();
  const all = $$("#calc input.grade"), nx = all[all.indexOf(inp) + 1];
  if (nx) nx.focus(); else inp.blur();
});
document.addEventListener("click", e => {
  const a = document.activeElement;
  if (a && a.matches && a.matches("input.grade") && !e.target.closest("input,select,textarea,label,summary,button,a")) a.blur();
});

function renderOverview() {
  const el = $("#overview");
  if (loading("disciplinas")) { el.innerHTML = loadingHtml; return; }
  const ds = list("disciplinas");
  if (!ds.length) { el.innerHTML = `<div class="empty"><span class="empty-ic">${ICON.list}</span><b>Nada para comparar ainda.</b><span>As disciplinas cadastradas aparecem aqui com a situação de cada uma.</span></div>`; return; }
  // one card per discipline, most urgent first: risk, then attention, then no grades yet, then calm
  const PRIO = { bad: 0, warn: 1, info: 2, ok: 3 };
  const SICON = { ok: ICON.check, warn: ICON.tri, bad: ICON.x, info: ICON.clock };
  const cards = ds.map(d => {
    const r = analisar(d, notasOf(d)); const f = freqOf(d);
    const st = f.faltas > f.limite ? ["Reprovado por falta", "bad"] : r.erro ? ["Revisar", "bad"] : r.status;
    const metric = (k, v, extra = "") => `<div class="dc-m"><span class="dc-k">${k}</span><span class="dc-v num">${v}</span>${extra}</div>`;
    const faltas = metric("Faltas", `${f.faltas}<span class="muted">/${f.limite}</span>`, f.status[1] !== "ok" && f.faltas <= f.limite ? `<span class="chip ${f.status[1]}">${f.status[0]}</span>` : "");
    let corpo;
    if (r.erro) corpo = `<div class="dc-notas muted small">${esc(r.erro)}</div><div class="dc-ms">${faltas}</div>`;
    else {
      const notas = r.comps.map(k => { const pv = r.partial(k); return `<span class="g${pv == null ? " none" : ""}"><span class="gk">${esc(k.id)}</span>${pv == null ? "—" : fmt(pv, 1, 1)}</span>`; }).join("");
      // the pending assessments already show as dashed chips, so "Precisa" is only the number
      const precisa = r.pend.length ? (r.needed === Infinity ? "> 10" : r.needed === 0 ? "—" : fmt(r.needed, 1, 1)) : (r.recNeeded != null ? `${isFinite(r.recNeeded) ? fmt(r.recNeeded, 1, 1) : "> 10"} <span class="muted small">na rec.</span>` : "—");
      corpo = `<div class="dc-notas" aria-label="Notas">${notas}</div><div class="dc-ms">${metric("Média", r.pend.length ? fmt(r.atual) : fmt(r.final))}${metric("Precisa", precisa)}${faltas}</div>`;
    }
    const html = `<li class="dcard c-${corOf(d.id)} s-${st[1]}" data-disc-row="${esc(d.id)}">
      <div class="dc-id"><button type="button" class="rowbtn dc-nome" data-disc-row="${esc(d.id)}"><span class="sq" aria-hidden="true"></span>${esc(d.nome)}</button><span class="muted small dc-sub">${esc(d.codigo || "")}${d.professor ? " · " + esc(d.professor) : ""}</span></div>
      ${corpo}<span class="sbadge ${st[1]}">${SICON[st[1]] || ""}${st[0]}</span></li>`;
    return { html, p: PRIO[st[1]] ?? 9, nome: d.nome || "" };
  }).sort((a, b) => a.p - b.p || a.nome.localeCompare(b.nome, "pt-BR"));
  el.innerHTML = `<div class="ov">${geralHtml(ds)}<ul class="dlist">${cards.map(c => c.html).join("")}</ul></div>`;
}
$("#overview").addEventListener("click", e => {
  const tr = e.target.closest("[data-disc-row]"); if (!tr) return;
  ui.disc = tr.dataset.discRow; store.set("disc", ui.disc); calcKey = ""; renderCalc();
  $("#calc").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
});

/* ================= CALENDÁRIO ================= */
const TIPO_AVAL = { prova: "Prova", seminario: "Seminário", pratica: "Prática", trabalho: "Trabalho", recuperacao: "Recuperação" };
const TIPO_DATA = { feriado: "Feriado", "sem-aula": "Sem aula", prazo: "Prazo acadêmico", semestre: "Semestre" };
// study reviews already show up as the exam itself, so the calendar leaves them out
const isRevisao = t => t.revisao === true || /^(revis|prepar)/i.test(t.titulo || "");
function itemsOn(day) {
  const out = [];
  for (const a of list("avaliacoes")) if (a.data === day) {
    const hd = horarioNoDia(discById(a.disciplinaId), day); const hp = a.hora || hd?.inicio;
    out.push({ k: "prova", col: "avaliacoes", id: a.id, disc: a.disciplinaId, t: `${TIPO_AVAL[a.tipo] || "Avaliação"}${a.componente ? " · " + a.componente : ""}`, m: [hp, hd?.sala].filter(Boolean).join(" · "), s: a.conteudo, lab: a.componente || TIPO_AVAL[a.tipo] || "Avaliação", aula: hasAula(a.disciplinaId, day) });
  }
  for (const t of list("tarefas")) if (t.prazo === day && !isRevisao(t)) out.push({ k: "entrega", col: "tarefas", id: t.id, disc: t.disciplinaId, t: t.titulo, done: isDone(t) });
  for (const x of list("datas")) { if (x.data && x.data <= day && (x.fim || x.data) >= day) out.push({ k: x.tipo === "feriado" || x.tipo === "sem-aula" ? "off" : "prazo", col: "datas", id: x.id, t: x.titulo, s: TIPO_DATA[x.tipo] || "" }); }
  for (const ev of list("eventos")) { if (ev.data && ev.data <= day && (ev.fim || ev.data) >= day) out.push({ k: "ev", col: "eventos", id: ev.id, t: ev.nome, s: ev.local || ev.organizador || "" }); }
  // a class on the day of that subject's exam is the exam itself, so it is not listed twice
  const provaDisc = new Set(out.filter(x => x.k === "prova").map(x => x.disc));
  const aulas = [];
  for (const d of list("disciplinas")) for (const a of d.cronograma || []) if (a.data === day && !provaDisc.has(d.id)) {
    const h = horarioNoDia(d, day);
    aulas.push({ k: "aula", col: "disciplinas", id: d.id, disc: d.id, t: a.conteudo, m: h ? `${h.inicio}–${h.fim}${h.sala ? " · " + h.sala : ""}` : "", ini: h?.inicio || "99:99" });
  }
  out.push(...sortBy(aulas, x => x.ini));
  return out;
}
// [kind, header, icon]: order = what weighs most on the day first, routine classes last
const DAY_GROUPS = [["prova", "Avaliações", "fileCheck"], ["entrega", "Entregas", "inbox"], ["prazo", "Prazos acadêmicos", "flag"], ["off", "Feriado / sem aula", "calendarX"], ["ev", "Eventos", "users"], ["aula", "Aulas", "cap"]];
// a delivery says what to do about it, not just "deadline"
function dueText(day, done) {
  if (done) return "Entregue";
  const n = daysUntil(day);
  return n === 0 ? "Vence hoje" : n === 1 ? "Vence amanhã" : n === -1 ? "Venceu ontem" : n < 0 ? `Venceu há ${-n} dias` : `Vence em ${n} dias`;
}
function dayDetailHtml(day, { head = true, empty = "Nada marcado neste dia." } = {}) {
  const its = itemsOn(day); const n = daysUntil(day);
  const off = its.some(x => x.k === "off");
  const hd = head ? `<div class="dayhead"><b>${shortDate(day)}</b>${n != null && Math.abs(n) <= 7 ? `<span class="chip line">${rel(n)}</span>` : ""}</div>` : "";
  if (!its.length) return hd + `<div class="empty-day"><span class="empty-ic">${ICON.calendarCheck}</span><span>${esc(empty)}</span></div>`;
  return hd + DAY_GROUPS.map(([k, label, ic]) => {
    const g = its.filter(x => x.k === k); if (!g.length) return "";
    return `<section class="dgroup ${k}"><h3 class="dgh">${ICON[ic]}${label}<span class="ct" aria-label="${g.length} ${g.length === 1 ? "item" : "itens"}">${g.length}</span></h3>${g.map(x => {
      // a missed day can be marked on a class (or on an exam held in class time), up to today
      const canFalta = x.disc && (k === "aula" || x.aula) && day <= TODAY_ISO && !off;
      const marked = canFalta && faltaOf(x.disc, day);
      // a marked day keeps the time and room and adds a status chip (shape + text, never color alone)
      const nf = marked ? aulasDia(discById(x.disc)) : 0;
      const meta = k === "entrega" ? `<span class="ditem-m${x.done ? "" : " due"}">${esc(dueText(day, x.done))}</span>` : x.m ? `<span class="ditem-m">${esc(x.m)}</span>` : "";
      const inner = `${x.disc ? tag(x.disc) : ""}<span class="ditem-t">${esc(x.t)}</span>${meta}${x.s ?`<span class="ditem-s">${esc(x.s)}</span>` : ""}${marked ? `<span class="chip bad">Falta marcada · ${nf} ${nf === 1 ? "falta" : "faltas"}</span>` : ""}`;
      const item = k === "aula" ? `<div class="ditem ${k}">${inner}</div>` : `<button type="button" class="ditem ${k}" data-edit="${x.col}" data-id="${esc(x.id)}">${inner}</button>`;
      if (!canFalta) return item;
      return `<div class="ditem-w">${item}<button type="button" class="fbtn" data-falta="${esc(x.disc)}" data-fday="${day}" aria-pressed="${marked ? "true" : "false"}" aria-label="Faltei na aula de ${esc(discName(x.disc))}">${marked ? ICON.check : ICON.calendarX}Faltei</button></div>`;
    }).join("")}</section>`;
  }).join("");
}
function renderUpcoming() {
  const el = $("#upcoming");
  if (loading("avaliacoes")) { el.innerHTML = loadingHtml; return; }
  const up = sortBy(list("avaliacoes").filter(a => a.data && a.data >= TODAY_ISO && !isRec(a)), a => a.data);
  const in14 = up.filter(a => daysUntil(a.data) <= 14).length;
  if (!up.length) { el.innerHTML = `<div class="empty"><span class="empty-ic">${ICON.calendarCheck}</span><b>Nenhuma avaliação pela frente.</b><span>Elas entram aqui pelo plano de ensino ou pelo botão “+ Avaliação”.</span></div>`; return; }
  el.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px">
      <h2>${greeting()}</h2><span class="chip ${in14 >= 3 ? "bad" : in14 ? "warn" : "info"}">${in14} ${in14 === 1 ? "avaliação" : "avaliações"} em 14 dias</span></div>
    <div class="countdown">${up.slice(0, 3).map((a, i) => {
      const n = daysUntil(a.data);
      return `<button type="button" class="cd ${i === 0 ? "hot" : ""}" data-goto="${esc(a.data)}" aria-label="Ver ${esc(shortDate(a.data))} no calendário">
        <span class="mono">${esc(TIPO_AVAL[a.tipo] || "Avaliação")}${a.componente ? " · " + esc(a.componente) : ""}</span>
        <span class="t">${tag(a.disciplinaId)}</span>
        <span class="d num">${n === 0 ? "Hoje" : n === 1 ? "Amanhã" : n + " dias"}</span>
        <span class="muted small">${shortDate(a.data)}${a.hora ? " · " + esc(a.hora) : ""}</span></button>`;
    }).join("")}</div>`;
}
function greeting() {
  const n = list("avaliacoes").filter(a => a.data >= TODAY_ISO && !isRec(a) && daysUntil(a.data) <= 7).length;
  return n >= 2 ? "Semana pesada vindo aí" : n === 1 ? "Uma avaliação nesta semana" : "Semana tranquila por aqui";
}
// month cell on desktop: up to two pills (exam, holiday, delivery, deadline, event), each with its day-panel icon; classes become a cap + count
const CEV_ORDER = { prova: 0, off: 1, entrega: 2, prazo: 3, ev: 4 };
const KIND_ICON = Object.fromEntries(DAY_GROUPS.map(([k, , ic]) => [k, ic]));
function cevHtml(its) {
  const ev = sortBy(its.filter(x => x.k in CEV_ORDER), x => CEV_ORDER[x.k]); if (!ev.length) return "";
  const pill = x => `<span class="cev ${x.k}">${ICON[KIND_ICON[x.k]]}<span class="cev-t">${esc(x.k === "prova" ? `${x.lab} · ${discName(x.disc)}` : x.t)}</span></span>`;
  return `<span class="cevs" aria-hidden="true">${ev.slice(0, 2).map(pill).join("")}${ev.length > 2 ? `<span class="cev more">+${ev.length - 2}</span>` : ""}</span>`;
}
// the legend is rendered twice: under the grid on wide screens (lg-d), under the day detail on narrow ones (lg-m); CSS shows one
const legendHtml = c => `<div class="legend ${c}"><span class="flabel">Legenda</span>
        <span class="lb prova">${ICON.fileCheck}Avaliação</span><span class="lb entrega">${ICON.inbox}Entrega</span><span class="lb prazo">${ICON.flag}Prazo acadêmico</span>
        <span class="lb off">${ICON.calendarX}Feriado / sem aula</span><span class="lb ev">${ICON.users}Evento</span><span class="lb aula">${ICON.cap}Aulas no dia</span>
        <span class="lb hoje">Hoje</span><span class="lb fal"><i></i>Falta</span>${c === "lg-d" ? `<span class="hint">Setas: dias · PgUp/PgDn: mês</span>` : ""}</div>`;
function renderCalendar() {
  const el = $("#calendar");
  const m = ui.month; const y = m.getFullYear(), mo = m.getMonth();
  const first = new Date(y, mo, 1); const start = new Date(first); start.setDate(1 - first.getDay());
  let cells = "";
  for (let i = 0; i < 42; i++) {
    const d = new Date(start); d.setDate(start.getDate() + i);
    if (i >= 35 && d.getMonth() !== mo) break;
    const s = iso(d); const its = itemsOn(s);
    const cls = ["day"];
    if (d.getMonth() !== mo) cls.push("out");
    if (s === TODAY_ISO) cls.push("today");
    if (its.some(x => x.k === "prova")) cls.push("prova"); else if (its.some(x => x.k === "entrega")) cls.push("entrega"); else if (its.some(x => x.k === "prazo")) cls.push("prazo");
    if (its.some(x => x.k === "off")) cls.push("off");
    if (s === ui.selDay) cls.push("sel");
    const marks = its.filter(x => x.k === "ev").length ? `<i class="ev"></i>` : "";
    // narrow screens keep the dot; wide ones show a cap with how many classes the day has
    const nAulas = its.filter(x => x.k === "aula").length;
    const aula = nAulas ? `<i class="au"></i><span class="au-n">${ICON.cap}${nAulas}</span>` : "";
    const fal = list("faltas").filter(f => f.data === s);
    const label = `${d.getDate()} de ${MES[d.getMonth()]}${its.length ? ": " + its.map(x => (x.disc ? discName(x.disc) + ", " : "") + x.t + (x.k === "prova" && x.m ? ", " + x.m : "")).join("; ") : ""}${fal.length ? `; falta em ${fal.map(f => discName(f.disciplinaId)).join(", ")}` : ""}`;
    cells += `<button type="button" class="${cls.join(" ")}" data-day="${s}" aria-label="${esc(label)}"${its.length ? ` title="${esc(label)}"` : ""} aria-pressed="${s === ui.selDay}"${s === TODAY_ISO ? ` aria-current="date"` : ""}><span class="n">${d.getDate()}</span><span class="marks">${aula}${marks}${fal.length ? `<i class="fal"></i>` : ""}</span>${cevHtml(its)}</button>`;
  }
  el.innerHTML = `<div class="cal-grid">
    <div>
      <div class="month-h"><h3>${MES[mo]} ${y}</h3>
        <button class="btn sm" type="button" data-month="-1" aria-label="Mês anterior">${ICON.left}</button>
        <button class="btn sm" type="button" data-month="0">${ICON.calendarCheck}Hoje</button>
        <button class="btn sm" type="button" data-month="1" aria-label="Próximo mês">${ICON.right}</button></div>
      <div class="month">${WD.map(w => `<div class="wd">${w}</div>`).join("")}${cells}</div>
      ${legendHtml("lg-d")}
    </div>
    <div class="stack" style="gap:14px;align-content:start">
      <div class="daydetail" id="day-detail" aria-live="polite">${dayDetailHtml(ui.selDay)}</div>
      ${tipHtml()}
      ${legendHtml("lg-m")}
      ${!list("datas").length && !loading("datas") ? `<p class="muted small" style="margin:0">Feriados e dias sem aula aparecem quando o calendário acadêmico for importado.</p>` : ""}
    </div></div>`;
  // one tab stop for the whole grid, arrow keys move inside it: the selected day, else today, else the 1st
  const days = $$("[data-day]", el); const stop = days.find(b => b.dataset.day === ui.selDay) || days.find(b => b.dataset.day === TODAY_ISO) || days.find(b => !b.classList.contains("out"));
  days.forEach(b => { b.tabIndex = b === stop ? 0 : -1; });
}
function tipHtml() {
  const next = sortBy(list("avaliacoes").filter(a => a.data >= TODAY_ISO && !isRec(a)), a => a.data)[0];
  if (!next) return "";
  const n = daysUntil(next.data); const disc = discName(next.disciplinaId);
  const rev = list("tarefas").find(t => t.disciplinaId === next.disciplinaId && t.prazo === next.data && !isDone(t));
  const left = rev ? (rev.objetivos || []).filter(o => !o.feito).length : 0;
  let txt;
  if (n === 0) txt = `Hoje tem ${next.componente || "avaliação"} de ${disc}. Revise só os pontos-chave e descanse.`;
  else if (n > 21) return "";
  else if (rev && left) txt = `${n === 1 ? "Amanhã" : `Em ${n} dias`} tem ${next.componente || "prova"} de ${disc}. Faltam ${left} ${left === 1 ? "tópico" : "tópicos"} na revisão, uns ${Math.ceil(left / Math.max(n, 1))} por dia.`;
  else txt = `${n === 1 ? "Amanhã" : `Em ${n} dias`} tem ${next.componente || "prova"} de ${disc}. Comece a revisão hoje.`;
  return `<aside class="tip" aria-label="Sugestão de estudo"><span class="tip-ic">${ICON.lamp}</span><b>Sugestão de estudo</b><span>${esc(txt)}</span></aside>`;
}
// a countdown card opens that day in the calendar instead of the edit form
$("#upcoming").addEventListener("click", e => {
  const b = e.target.closest("[data-goto]"); if (!b) return;
  const d = parseIso(b.dataset.goto); if (!d) return;
  ui.selDay = b.dataset.goto; ui.month = new Date(d.getFullYear(), d.getMonth(), 1);
  renderCalendar();
  const target = isPhone() ? $("#day-detail") : $("#calendar");
  target?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
});
$("#calendar").addEventListener("click", e => {
  const mb = e.target.closest("[data-month]");
  if (mb) { const k = +mb.dataset.month; if (k === 0) { ui.month = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1); ui.selDay = TODAY_ISO; } else ui.month = new Date(ui.month.getFullYear(), ui.month.getMonth() + k, 1); renderCalendar(); return; }
  const db = e.target.closest("[data-day]");
  if (db) { ui.selDay = db.dataset.day; const d = parseIso(ui.selDay); if (d.getMonth() !== ui.month.getMonth()) ui.month = new Date(d.getFullYear(), d.getMonth(), 1); renderCalendar(); $(`[data-day="${ui.selDay}"]`)?.focus({ preventScroll: true });
    // on a phone the day's detail sits below the grid: bring it into view
    if (compact()) $("#day-detail")?.scrollIntoView({ block: "nearest", behavior: smooth() }); }
});
// keyboard: arrows move by day/week, Home/End go to the week's edges, PageUp/PageDown change month
$("#calendar").addEventListener("keydown", e => {
  const b = e.target.closest && e.target.closest("[data-day]"); if (!b) return;
  const cur = b.dataset.day, d = parseIso(cur); let next = null;
  const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
  if (step) next = addDays(cur, step);
  else if (e.key === "Home") next = addDays(cur, -d.getDay());
  else if (e.key === "End") next = addDays(cur, 6 - d.getDay());
  else if (e.key === "PageUp" || e.key === "PageDown") { const k = e.key === "PageUp" ? -1 : 1; next = iso(new Date(d.getFullYear(), d.getMonth() + k, Math.min(d.getDate(), new Date(d.getFullYear(), d.getMonth() + k + 1, 0).getDate()))); }
  if (!next || e.altKey || e.ctrlKey || e.metaKey) return;
  e.preventDefault();
  const nd = parseIso(next); ui.selDay = next; ui.month = new Date(nd.getFullYear(), nd.getMonth(), 1);
  renderCalendar(); $(`[data-day="${next}"]`)?.focus();
});

const STATUS_T = { "a-fazer": "A fazer", fazendo: "Fazendo", entregue: "Concluída" };
// a task is concluded when its status says so OR when every objective is ticked (covers tasks saved before the automatic rule)
const allObjsDone = t => (t.objetivos || []).length > 0 && t.objetivos.every(o => o.feito);
const isDone = t => t.status === "entregue" || allObjsDone(t);
const statusOf = t => isDone(t) ? "entregue" : (t.status === "fazendo" || (t.objetivos || []).some(o => o.feito)) ? "fazendo" : "a-fazer";
function renderTasks() {
  const el = $("#tasks");
  if (loading("tarefas")) { el.innerHTML = loadingHtml; return; }
  const ts = list("tarefas");
  if (!ts.length) { el.innerHTML = `<div class="empty"><span class="empty-ic">${ICON.list}</span><b>Nenhuma tarefa cadastrada.</b><span>Crie uma tarefa com prazo e objetivos para acompanhar a entrega.</span><button class="btn primary" type="button" data-act="add-task">${ICON.plus}Nova tarefa</button></div>`; return; }
  const open = ts.filter(t => !isDone(t));
  const late = sortBy(open.filter(t => t.prazo && t.prazo < TODAY_ISO), t => t.prazo);
  const week = sortBy(open.filter(t => t.prazo && t.prazo >= TODAY_ISO && daysUntil(t.prazo) <= 7), t => t.prazo);
  const later = sortBy(open.filter(t => !t.prazo || daysUntil(t.prazo) > 7), t => t.prazo || "9999");
  const done = sortBy(ts.filter(isDone), t => t.prazo || "").reverse();
  const group = (title, arr, chip) => arr.length ? `<div class="tgroup"><h3>${title} <span class="chip ${chip}">${arr.length}</span></h3><div class="tlist">${arr.map(taskCard).join("")}</div></div>` : "";
  const tab = ui.taskTab === "concluidas" ? "concluidas" : "abertas";
  const pick = `<div class="disc-pick" role="group" aria-label="Filtrar tarefas">
    <button type="button" data-task-tab="abertas" aria-pressed="${tab === "abertas"}">Pendentes (${open.length})</button>
    <button type="button" data-task-tab="concluidas" aria-pressed="${tab === "concluidas"}">Concluídas (${done.length})</button></div>`;
  const body = tab === "concluidas"
    ? (done.length ? `<div class="tlist">${done.map(taskCard).join("")}</div>` : `<div class="empty"><span class="empty-ic">${ICON.check}</span><b>Nenhuma tarefa concluída ainda.</b><span>Quando você marcar todos os objetivos de uma tarefa, ela vem para cá.</span></div>`)
    : (open.length ? `<div class="tasks">${group("Atrasadas", late, "bad")}${group("Próximos 7 dias", week, "warn")}${group("Mais adiante", later, "info")}</div>` : `<div class="empty"><span class="empty-ic">${ICON.check}</span><b>Tudo em dia.</b><span>Nenhuma tarefa pendente.</span></div>`);
  // FLIP: after a task changes tab, the cards that stay slide into their new place instead of jumping
  const flip = ui.taskFlip && !reduceMotion(); ui.taskFlip = false;
  const before = flip ? new Map($$("#tasks article[data-tid]").map(a => [a.dataset.tid, a.getBoundingClientRect()])) : null;
  el.innerHTML = `<div class="tasks-h"><h3>Atividades e prazos</h3></div>` + pick + body;
  if (flip) $$("#tasks article[data-tid]").forEach(a => {
    const r0 = before.get(a.dataset.tid), r1 = a.getBoundingClientRect();
    if (!r0) { a.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 260, easing: "ease-out" }); return; }
    const dx = r0.left - r1.left, dy = r0.top - r1.top;
    if (dx || dy) a.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: "none" }], { duration: 300, easing: "cubic-bezier(.22,.61,.36,1)" });
  });
}
const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
// writes a task change; when the task switches between Pendentes and Concluídas, its card fades out first
function moveTask(t, patch, msg) {
  const card = $(`#tasks article[data-tid="${CSS.escape(t.id)}"]`);
  const moves = isDone(t) !== isDone({ ...t, ...patch });
  const undoPatch = { objetivos: structuredClone(t.objetivos || []), status: t.status || "a-fazer" };
  const go = () => {
    if (moves) ui.taskFlip = true;
    return patchDoc("tarefas", t.id, patch)
      .then(() => { if (msg) toast(msg, () => { ui.taskFlip = true; patchDoc("tarefas", t.id, undoPatch).catch(() => {}); }); })
      .catch(() => { ui.taskFlip = false; card?.classList.remove("leaving", "to-done"); });
  };
  if (!moves || !card || reduceMotion()) return go();
  card.classList.add("leaving"); if (isDone({ ...t, ...patch })) card.classList.add("to-done");
  setTimeout(go, 260);
}
$("#tasks").addEventListener("click", e => {
  const all = e.target.closest("[data-task-all]");
  if (all) {
    const t = list("tarefas").find(x => x.id === all.dataset.taskAll); if (!t) return;
    const concluir = all.dataset.v === "1";
    const objetivos = (t.objetivos || []).map(o => ({ ...o, feito: concluir }));
    all.disabled = true;
    moveTask(t, { objetivos, status: concluir ? "entregue" : "a-fazer" }, concluir ? "Tarefa concluída. Movida para Concluídas." : "Tarefa reaberta. Voltou para Pendentes.");
    return;
  }
  const b = e.target.closest("[data-task-tab]"); if (!b) return;
  ui.taskTab = b.dataset.taskTab; renderTasks();
});
function taskCard(t) {
  const objs = t.objetivos || []; const feitos = objs.filter(o => o.feito).length;
  const n = daysUntil(t.prazo);
  const st = statusOf(t);
  const late = st !== "entregue" && n != null && n < 0;
  const fin = st === "entregue";
  return `<article class="task ${late ? "late" : ""}" data-tid="${esc(t.id)}">
    <div class="task-h"><h4><button type="button" data-edit="tarefas" data-id="${esc(t.id)}">${esc(t.titulo)}</button></h4>
      <span class="chip ${st === "entregue" ? "ok" : st === "fazendo" ? "warn" : "line"}">${STATUS_T[st]}</span></div>
    <div class="task-meta">${tag(t.disciplinaId)}<span class="small muted">${t.prazo ? `${shortDate(t.prazo)} (${rel(n)})` : "sem prazo definido"}</span></div>
    ${objs.length ? `<details class="objfold" data-objs="${esc(t.id)}" ${(ui.objOpen[t.id] ?? (!isPhone() && n != null && n <= 7)) ? "open" : ""}><summary class="prog"><span class="bar"><span style="width:${(feitos / objs.length) * 100}%"></span></span><span class="num">${feitos}/${objs.length}</span><span class="objfold-l">objetivos</span></summary>
    <div class="objs">${objs.map((o, i) => `<label class="obj ${o.feito ? "done" : ""}${tickCls(t.id, i)}"><span class="cbx"><input type="checkbox" data-task="${esc(t.id)}" data-obj="${i}" ${o.feito ? "checked" : ""}><svg class="ck" viewBox="0 0 20 20" aria-hidden="true"><path pathLength="1" d="M5.5 10.5l3 3.2 6-7"/></svg></span><span class="ot"><span>${esc(o.texto)}</span></span></label>`).join("")}</div></details>` : ""}
    ${t.obs ? `<div class="small muted">${esc(t.obs)}</div>` : ""}
    ${t.link ? `<a class="small lnk" href="${esc(t.link)}" target="_blank" rel="noopener">${ICON.link}Abrir link da entrega</a>` : ""}
    <div class="task-f"><button type="button" class="btn sm${fin ? " ghost" : ""}" data-task-all="${esc(t.id)}" data-v="${fin ? 0 : 1}">${fin ? ICON.undo + "Marcar como não concluída" : ICON.check + "Concluir tudo"}</button></div>
  </article>`;
}
// remember which checklists the user opened or closed, so a re-render after a tick keeps them as they were
$("#tasks").addEventListener("toggle", e => {
  const d = e.target; if (d.matches && d.matches("details.objfold")) ui.objOpen[d.dataset.objs] = d.open;
}, true);
// animated checkbox: the label being ticked gets .done at once (the CSS transitions run);
// a re-render inside the next 400ms rebuilds it with .tick/.untick and a negative delay, so the motion carries on instead of restarting
let lastTick = null;
function tickCls(tid, i) {
  if (!lastTick || lastTick.key !== `${tid}#${i}`) return "";
  const el = performance.now() - lastTick.at; if (el > 400) return "";
  return `${lastTick.on ? " tick" : " untick"}" style="--t:-${Math.round(el)}ms`;
}
$("#tasks").addEventListener("change", e => {
  const cb = e.target.closest("input[data-task]"); if (!cb) return;
  const t = list("tarefas").find(x => x.id === cb.dataset.task); if (!t) return;
  const objs = structuredClone(t.objetivos || []); const i = +cb.dataset.obj; if (!objs[i]) return;
  lastTick = { key: `${t.id}#${i}`, at: performance.now(), on: cb.checked };
  cb.closest(".obj")?.classList.toggle("done", cb.checked);
  objs[i].feito = cb.checked;
  const wasDone = isDone(t);
  const patch = { objetivos: objs };
  // all objectives ticked -> concluded; unticking one of a concluded task -> back to "fazendo"; any tick on a new task -> "fazendo"
  if (objs.every(o => o.feito)) patch.status = "entregue";
  else if (wasDone || objs.some(o => o.feito) || t.status === "fazendo") patch.status = "fazendo";
  else patch.status = "a-fazer";
  const nowDone = patch.status === "entregue";
  moveTask(t, patch, nowDone && !wasDone ? "Tarefa concluída. Movida para Concluídas." : wasDone && !nowDone ? "Tarefa reaberta. Voltou para Pendentes." : null);
});

/* ================= HUB ================= */
const EV_STATUS = { interesse: ["Interesse", "line"], pendente: ["Pendente", "warn"], inscrita: ["Inscrita", "info"], confirmado: ["Confirmado", "ok"], realizado: ["Realizado", "line"] };
const CERT_STATUS = { salvo: ["Salvo", "info"], aguardando: ["Aguardando envio", "warn"], enviado: ["Enviado", "info"], validado: ["Validado", "ok"], recusado: ["Recusado", "bad"] };
function renderHub() {
  const el = $("#hub-box");
  const v = ui.hubView;
  const counts = { eventos: list("eventos").filter(e => e.status !== "realizado").length, ligas: list("ligas").length, certificados: list("certificados").length };
  const totalH = list("certificados").filter(c => c.status !== "recusado").reduce((a, c) => a + (num(c.horas) || 0), 0);
  el.innerHTML = `<nav class="side" aria-label="Hub">
      <span class="mono">Vida acadêmica</span>
      ${[["eventos", "Eventos", counts.eventos, "calendar"], ["ligas", "Ligas", counts.ligas, "users"], ["certificados", "Certificados", counts.certificados, "award"], ["horas", "Horas", fmt(totalH, 0, 1) + "h", "clock"]].map(([k, l, c, ic]) => `<button type="button" data-hub="${k}" aria-current="${v === k}">${ICON[ic]}<span class="lbl">${l}</span><span class="ct">${c}</span></button>`).join("")}
    </nav>
    <div class="hub-main">${v === "eventos" ? hubEventos() : v === "ligas" ? hubLigas() : v === "certificados" ? hubCerts() : hubHoras()}</div>`;
}
const dateTile = s => { const d = parseIso(s); return d ? `<div class="date-tile"><b>${pad(d.getDate())}</b><span>${MES3[d.getMonth()]}</span></div>` : `<div class="date-tile"><b>—</b><span>data</span></div>`; };
function hubEventos() {
  if (loading("eventos")) return loadingHtml;
  const evs = list("eventos");
  const up = sortBy(evs.filter(e => e.status !== "realizado" && (e.fim || e.data || "9999") >= TODAY_ISO), e => e.data || "9999");
  const past = sortBy(evs.filter(e => !up.includes(e)), e => e.data || "").reverse();
  const row = e => { const st = EV_STATUS[e.status] || EV_STATUS.interesse; const pz = e.prazoInscricao && e.status !== "realizado" && e.status !== "confirmado" && e.status !== "inscrita" ? ` · inscrições até ${ddmm(e.prazoInscricao)}` : "";
    return `<div class="row">${dateTile(e.data)}<div><h4><button type="button" data-edit="eventos" data-id="${esc(e.id)}">${esc(e.nome)}</button></h4><div class="sub">${esc([e.organizador, e.local].filter(Boolean).join(" · "))}${pz}${e.fim && e.fim !== e.data ? ` · até ${ddmm(e.fim)}` : ""}</div></div>
      <div class="right"><span class="chip ${st[1]}">${st[0]}</span>${num(e.horasPrevistas) ? `<span class="small muted">${fmt(num(e.horasPrevistas), 0, 1)}h</span>` : ""}</div></div>`; };
  return `<div class="hub-h"><h2>Próximos eventos</h2><button class="btn primary sm" type="button" data-act="add-evento">${ICON.plus}Evento</button></div>
    ${up.length ? `<div class="rows">${up.map(row).join("")}</div>` : `<div class="empty"><span class="empty-ic">${ICON.calendar}</span><b>Nenhum evento marcado.</b><span>Congressos, simpósios, palestras e reuniões de liga entram aqui com o status da inscrição.</span></div>`}
    ${past.length ? `<details class="fold"><summary><h3>Já realizados</h3> <span class="chip line">${past.length}</span></summary><div class="rows" style="margin-top:10px">${past.map(row).join("")}</div></details>` : ""}`;
}
function hubLigas() {
  if (loading("ligas")) return loadingHtml;
  const ls = sortBy(list("ligas"), l => l.nome || "");
  return `<div class="hub-h"><h2>Ligas acadêmicas</h2><button class="btn primary sm" type="button" data-act="add-liga">${ICON.plus}Liga</button></div>
    ${ls.length ? `<div class="rows">${ls.map(l => `<div class="row nodate"><div><h4><button type="button" data-edit="ligas" data-id="${esc(l.id)}">${esc(l.nome)}</button></h4><div class="sub">${esc([l.papel, l.reunioes, l.inicio ? "desde " + ddmm(l.inicio) : ""].filter(Boolean).join(" · "))}</div></div><div class="right">${num(l.horas) ? `<span class="chip info">${fmt(num(l.horas), 0, 1)}h</span>` : ""}</div></div>`).join("")}</div>`
      : `<div class="empty"><span class="empty-ic">${ICON.users}</span><b>Nenhuma liga cadastrada.</b><span>Registre as ligas de que você participa, o seu papel e quando são as reuniões.</span></div>`}`;
}
function hubCerts() {
  if (loading("certificados")) return loadingHtml;
  const cs = sortBy(list("certificados"), c => c.fim || c.inicio || c.emitidoEm || "").reverse();
  const aguard = cs.filter(c => c.status === "aguardando" || c.status === "salvo").length;
  return `<div class="hub-h"><div><h2>Certificados</h2><div class="small muted">${cs.length} ${cs.length === 1 ? "certificado salvo" : "certificados salvos"}${aguard ? ` · ${aguard} ainda não ${aguard === 1 ? "enviado" : "enviados"} à coordenação` : ""}</div></div><button class="btn primary sm" type="button" data-act="add-cert">${ICON.plus}Certificado</button></div>
    ${cs.length ? `<div class="rows">${cs.map(c => { const st = CERT_STATUS[c.status] || CERT_STATUS.salvo; return `<div class="row">${dateTile(c.fim || c.inicio || c.emitidoEm)}<div><h4><button type="button" data-edit="certificados" data-id="${esc(c.id)}">${esc(c.titulo)}</button></h4>
      <div class="sub">${esc([c.emissor, c.categoria].filter(Boolean).join(" · "))}${c.inicio ? ` · ${ddmm(c.inicio)} a ${ddmm(c.fim || c.inicio)}` : ""}</div>
      ${c.codigoVerificacao ? `<div class="sub mono" style="text-transform:none">Doc. ${esc(c.numeroDocumento || "—")} · código ${esc(c.codigoVerificacao)}</div>` : ""}
      ${c.obs ? `<div class="sub">${esc(c.obs)}</div>` : ""}</div>
      <div class="right"><span class="chip ${st[1]}">${st[0]}</span><b class="num">${fmt(num(c.horas), 0, 1)}h</b>${c.arquivo ? `<a class="small lnk" href="/_blob/${esc(c.arquivo)}" target="_blank" rel="noopener">${ICON.file}Abrir PDF</a>` : ""}</div></div>`; }).join("")}</div>`
      : `<div class="empty"><span class="empty-ic">${ICON.award}</span><b>Nenhum certificado ainda.</b><span>Mande o PDF na conversa ou adicione aqui com as horas e a categoria.</span></div>`}`;
}
function hubHoras() {
  const reg = S.regulamento;
  return `<div class="hub-h"><h2>Regulamento</h2><button class="btn sm" type="button" data-act="edit-reg">${ICON.edit}Preencher regulamento</button></div>${regHtml(reg)}`;
}
function regHtml(reg) {
  const r = reg || {};
  const waiting = !r.status || r.status === "aguardando";
  const slot = `<span class="ph-slot slot" aria-label="a definir"></span>`;
  const cats = r.categorias || [];
  return `<div class="ph">
    <div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;align-items:center"><b>${esc(r.titulo || "Regulamento de atividades complementares")}</b><span class="chip ${waiting ? "warn" : "ok"}">${waiting ? "Aguardando colegiado" : "Aprovado"}</span></div>
    ${waiting ? `<span class="small muted">${esc(r.observacao || "O regulamento ainda depende de aprovação do colegiado. Os campos abaixo serão preenchidos quando ele sair.")}</span>` : ""}
    <dl>
      <dt>Total de horas exigido</dt><dd>${num(r.totalExigido) ? fmt(num(r.totalExigido), 0, 0) + "h" : slot}</dd>
      <dt>Categorias aceitas</dt><dd>${cats.length ? cats.length : slot}</dd>
      <dt>Limite por categoria</dt><dd>${cats.some(c => num(c.limite)) ? "ver abaixo" : slot}</dd>
      <dt>Prazo para enviar certificados</dt><dd>${r.prazoEnvio ? esc(ddmm(r.prazoEnvio) !== "—" ? shortDate(r.prazoEnvio) : r.prazoEnvio) : slot}</dd>
      <dt>Como validar</dt><dd>${r.comoValidar ? esc(r.comoValidar) : slot}</dd>
      <dt>Aprovado por</dt><dd>${r.orgao && !waiting ? esc(r.orgao) : slot}</dd>
    </dl></div>`;
}
function renderHours() {
  const el = $("#hours");
  if (loading("certificados")) { el.innerHTML = loadingHtml; return; }
  const reg = S.regulamento || {};
  const cs = list("certificados").filter(c => c.status !== "recusado");
  const total = cs.reduce((a, c) => a + (num(c.horas) || 0), 0);
  const validadas = cs.filter(c => c.status === "validado").reduce((a, c) => a + (num(c.horas) || 0), 0);
  const req = num(reg.totalExigido);
  const byCat = {};
  for (const c of cs) { const k = c.categoria || "Sem categoria"; byCat[k] = (byCat[k] || 0) + (num(c.horas) || 0); }
  const regCats = reg.categorias || [];
  const names = [...new Set([...regCats.map(c => c.nome), ...Object.keys(byCat)])];
  const maxH = Math.max(1, ...Object.values(byCat), ...regCats.map(c => num(c.limite) || 0));
  el.innerHTML = `<div class="hours">
    <div class="tot"><span class="flabel">Total acumulado</span><b class="num">${fmt(total, 0, 1)}h</b>
      <span class="muted small">${req ? `de ${fmt(req, 0, 0)}h exigidas` : "total exigido: aguardando regulamento"}</span>
      ${req ? `<div class="bar" style="color:var(--steel)"><span style="width:${Math.min(100, total / req * 100)}%;background:var(--navy)"></span></div>` : ""}
      <span class="small muted">${fmt(validadas, 0, 1)}h já validadas pela coordenação</span></div>
    <div class="cats">
      ${names.length ? names.map(n => { const h = byCat[n] || 0; const lim = num(regCats.find(c => c.nome === n)?.limite);
        return `<div class="cat"><div class="l"><span>${esc(n)}</span><b class="num">${fmt(h, 0, 1)}h${lim ? ` <span class="muted small">/ ${fmt(lim, 0, 0)}h</span>` : ` <span class="muted small">/ limite a definir</span>`}</b></div><div class="bar"><span style="width:${Math.min(100, h / (lim || maxH) * 100)}%"></span></div>${lim && h > lim ? `<span class="small" style="color:var(--bad)">Passou ${fmt(h - lim, 0, 1)}h do limite; o excedente pode não contar.</span>` : ""}</div>`; }).join("") : ""}
      ${regCats.length ? "" : `<div class="ph"><span class="small muted">As categorias e os limites de cada uma entram aqui quando o regulamento for aprovado.</span>
        ${[1, 2, 3].map(() => `<div class="cat"><div class="l"><span class="slot" style="width:120px"></span><span class="slot"></span></div><div class="bar"><span style="width:0"></span></div></div>`).join("")}</div>`}
      <span class="small muted">${cs.length} ${cs.length === 1 ? "certificado" : "certificados"} · ${cs.filter(c => c.status === "salvo" || c.status === "aguardando").length} aguardando envio</span>
    </div></div>`;
}
$("#hub-box").addEventListener("click", e => {
  const b = e.target.closest("[data-hub]"); if (!b) return;
  ui.hubView = b.dataset.hub; store.set("hubView", ui.hubView); renderHub(); $(`[data-hub="${ui.hubView}"]`)?.focus();
});

/* ================= FORMS ================= */
const dlg = $("#dlg"), dform = $("#dlg-form");
dlg.setAttribute("aria-labelledby", "dlg-title");
let formCtx = null, formSnap = "";
/* date fields: touch screens get the native date picker instead of a text box (no slashes to type); the saved value is the same ISO date */
const DATE_IDS = ["data", "fim", "prazo", "prazoInscricao", "inicio"];
function field(f, v) {
  const id = "f-" + f.id; const val = v ?? f.value ?? "";
  const cls = f.full ? "field full" : "field";
  const asDate = !f.type && DATE_IDS.includes(f.id) && matchMedia("(pointer: coarse)").matches;
  const help = f.help && !asDate ? `<span class="help">${esc(f.help)}</span>` : "";
  if (f.type === "checkbox") return `<label class="chk ${f.full ? "full" : ""}"><input type="checkbox" id="${id}" ${val ? "checked" : ""}> ${esc(f.label)}</label>`;
  if (f.type === "select") return `<div class="${cls}"><label for="${id}">${esc(f.label)}</label><select id="${id}">${f.options.map(([k, l]) => `<option value="${esc(k)}" ${String(val) === String(k) ? "selected" : ""}>${esc(l)}</option>`).join("")}</select>${help}</div>`;
  if (f.type === "textarea") return `<div class="${cls}"><label for="${id}">${esc(f.label)}</label><textarea id="${id}" rows="${f.rows || 4}">${esc(val)}</textarea>${help}</div>`;
  if (f.type === "file") return `<div class="${cls}"><label for="${id}">${esc(f.label)}</label><input type="file" id="${id}" accept="${esc(f.accept || "")}">${help}</div>`;
  const list = f.datalist ? `<datalist id="${id}-dl">${f.datalist.map(o => `<option value="${esc(o)}">`).join("")}</datalist>` : "";
  return `<div class="${cls}"><label for="${id}">${esc(f.label)}${f.required ? " *" : ""}</label><input id="${id}" type="${asDate ? "date" : f.type || "text"}" value="${esc(asDate ? String(val).replace(/^(\d{2})\/(\d{2})\/(\d{4})$/, "$3-$2-$1") : val)}" ${f.datalist ? `list="${id}-dl"` : ""} ${f.type === "number" ? `step="${f.step || "any"}" inputmode="decimal"` : ""} autocomplete="off">${list}${help}</div>`;
}
function openForm({ title, fields, values = {}, onSave, onDelete, note }) {
  formCtx = { fields, onSave, onDelete };
  dform.innerHTML = `<div class="dlg-h"><h2 id="dlg-title">${esc(title)}</h2><button type="button" class="btn ghost sm icon" data-close aria-label="Fechar">${ICON.x}</button></div>
    ${note ? `<p class="small muted" style="margin:0">${esc(note)}</p>` : ""}
    <div class="fgrid">${fields.map(f => field(f, values[f.id])).join("")}</div>
    <div class="ferr" id="ferr" role="alert"></div>
    <div class="dlg-f">${onDelete ? `<button type="button" class="btn danger spacer" data-del>${ICON.trash}Excluir</button>` : ""}<button type="button" class="btn" data-close>${ICON.back}Cancelar</button><button type="submit" class="btn primary">${ICON.save}Salvar</button></div>`;
  dlg.showModal(); dlg.scrollTop = 0;
  formSnap = snapForm();
  // touch screens keep the keypad closed until a field is tapped
  const firstInput = dform.querySelector(".fgrid input, .fgrid select, .fgrid textarea"); if (!matchMedia("(pointer: coarse)").matches) firstInput?.focus();
}
dform.addEventListener("click", async e => {
  if (e.target.closest("[data-close]")) { dlg.close(); return; }
  const del = e.target.closest("[data-del]");
  if (del) {
    if (!del.dataset.armed) {
      del.dataset.armed = "1"; del.innerHTML = ICON.alert + "Confirmar exclusão";
      // an armed delete that is ignored disarms itself, so a later stray click cannot confirm it
      setTimeout(() => { if (del.isConnected && del.dataset.armed) { delete del.dataset.armed; del.innerHTML = ICON.trash + "Excluir"; } }, 4000);
      return;
    }
    try { await formCtx.onDelete(); dlg.close(); toast("Excluído"); } catch {}
  }
});
dform.addEventListener("submit", async e => {
  e.preventDefault();
  const vals = {};
  for (const f of formCtx.fields) {
    const el = $("#f-" + f.id);
    vals[f.id] = f.type === "checkbox" ? el.checked : f.type === "file" ? el.files[0] || null : el.value.trim();
    if (f.required && !vals[f.id]) { $("#ferr").textContent = `Preencha “${f.label}”.`; el.focus(); return; }
  }
  const btn = dform.querySelector("[type=submit]"); btn.disabled = true; btn.innerHTML = ICON.save + "Salvando…";
  try { const err = await formCtx.onSave(vals); if (err) { $("#ferr").textContent = err; return; } dlg.close(); toast("Salvo"); }
  catch (er) { $("#ferr").textContent = er && er.message && er.message !== "no db" ? er.message : "Não foi possível salvar."; }
  finally { btn.disabled = false; btn.innerHTML = ICON.save + "Salvar"; }
});
/* phone bottom sheet: drag the header down or tap the dimmed area to dismiss, unless something was typed */
const isSheet = () => matchMedia("(max-width: 560px)").matches;
const snapForm = () => JSON.stringify($$(".fgrid input,.fgrid select,.fgrid textarea", dform).map(el => el.type === "checkbox" ? el.checked : el.type === "file" ? el.files.length : el.value));
function dismissSheet() {
  if (snapForm() !== formSnap) {
    const msg = "Há alterações não salvas. Toque em Cancelar para descartar.";
    const er = $("#ferr"); if (er) er.textContent = msg;
    $(".dlg-f")?.setAttribute("data-note", msg);
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) $(".dlg-f [data-close]")?.animate?.([{ boxShadow: "0 0 0 0 var(--steel)" }, { boxShadow: "0 0 0 8px transparent" }], { duration: 600 });
    return false;
  }
  dlg.close(); return true;
}
(() => {
  let y0 = null, dy = 0;
  dform.addEventListener("pointerdown", e => {
    if (!isSheet() || e.pointerType === "mouse" || !e.target.closest(".dlg-h") || e.target.closest("button")) return;
    y0 = e.clientY; dy = 0; dlg.style.transition = "none"; e.target.setPointerCapture?.(e.pointerId);
  });
  dform.addEventListener("pointermove", e => { if (y0 == null) return; dy = Math.max(0, e.clientY - y0); dlg.style.transform = `translateY(${dy}px)`; });
  const end = () => {
    if (y0 == null) return; const far = dy > 96; y0 = null;
    if (far && snapForm() === formSnap) {
      // finish the slide from where the finger left it, then close
      dlg.style.transition = "transform .2s cubic-bezier(.4,0,1,1)"; dlg.style.transform = "translateY(100%)";
      setTimeout(() => { dlg.close(); dlg.style.transition = dlg.style.transform = ""; }, 200);
      return;
    }
    if (far) dismissSheet();
    dlg.style.transition = "transform .22s cubic-bezier(.22,1,.36,1)"; dlg.style.transform = "";
    setTimeout(() => { dlg.style.transition = ""; }, 240);
  };
  dform.addEventListener("pointerup", end); dform.addEventListener("pointercancel", end);
})();
dlg.addEventListener("click", e => { if (e.target === dlg && isSheet()) dismissSheet(); });
// the sheet stays above the on-screen keyboard: --kb is the part of the layout viewport the keyboard covers
if (window.visualViewport) {
  const vv = visualViewport, root = document.documentElement;
  const sync = () => { const kb = vv.scale > 1.05 ? 0 : Math.max(0, Math.round(innerHeight - vv.height - vv.offsetTop)); root.style.setProperty("--kb", kb + "px"); root.toggleAttribute("data-kb", kb > 0); };
  vv.addEventListener("resize", sync); vv.addEventListener("scroll", sync);
}
function checkDate(v, label) { const d = parseDateInput(v); if (d === undefined) throw new Error(`${label}: use o formato dd/mm/aaaa.`); return d; }
const discOptions = () => [["", "Geral"], ...sortBy(list("disciplinas"), d => d.nome || "").map(d => [d.id, d.nome])];

/* --- disciplina --- */
const partsToText = ps => (ps || []).map(p => `${p.rotulo || p.id} ${String(p.peso).replace(".", ",")}`).join(" + ");
function textToParts(s, prefix) {
  s = String(s || "").trim(); if (!s) return [];
  return s.split("+").map((chunk, i) => {
    const m = chunk.trim().match(/^(.*?)[\s:=]*([\d]+(?:[.,]\d+)?)\s*%?$/);
    if (!m) throw new Error(`Não entendi “${chunk.trim()}”. Use “Prova 0,9 + Listas 0,1”.`);
    let peso = Number(m[2].replace(",", ".")); if (/%\s*$/.test(chunk)) peso /= 100;
    const rot = m[1].trim() || `Parte ${i + 1}`;
    const id = rot.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `${prefix}${i + 1}`;
    return { id, rotulo: rot, peso };
  });
}
function compsToText(cs) { return (cs || []).map(c => [c.id, c.data ? ddmm(c.data) + "/" + c.data.slice(0, 4) : "", partsToText(c.partes)].join(" | ")).join("\n"); }
function textToComps(s) {
  return String(s || "").split("\n").map(l => l.trim()).filter(Boolean).map(l => {
    const [id, data, partes] = l.split("|").map(x => (x || "").trim());
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(id)) throw new Error(`“${id}” não serve como nome de nota. Use algo como N1, P2, T1.`);
    const d = checkDate(data, id);
    return { id, rotulo: id, data: d || null, partes: textToParts(partes, "p") };
  });
}
function discForm(d) {
  const f = d?.formula || {}; const rec = f.recuperacao || {};
  openForm({
    title: d ? `Editar ${d.nome}` : "Nova disciplina",
    note: "As notas da fórmula viram avaliações no calendário quando têm data.",
    values: d ? { nome: d.nome, apelido: d.apelido, cor: corOf(d.id), codigo: d.codigo, professor: d.professor, comps: compsToText(f.componentes), expressao: f.expressao, aprovacao: f.aprovacao, freq: f.frequenciaMinima, recAtiva: !!rec.ativa, recMin: rec.min, recMax: rec.max, recExpr: rec.expressao, recAprov: rec.aprovacao, recPartes: partsToText(rec.partes), recObs: rec.obs } : { comps: "N1 | | Prova 1\nN2 | | Prova 1", expressao: "(N1+N2)/2", aprovacao: "6", freq: "75", recExpr: "(M+R)/2" },
    fields: [
      { id: "nome", label: "Nome", required: true, full: true },
      { id: "apelido", label: "Nome curto", help: "Aparece nos botões e no calendário. Ex.: POO" },
      { id: "cor", label: "Cor", type: "select", options: Object.entries(CORES), help: "Cor da etiqueta da matéria no calendário e nas tarefas." },
      { id: "codigo", label: "Código" }, { id: "professor", label: "Professor(a)" },
      { id: "comps", label: "Notas que formam a média", type: "textarea", full: true, rows: 4, help: "Uma por linha: nome | data | partes com peso. Ex.: N1 | 23/09/2026 | Prova 0,9 + Listas 0,1" },
      { id: "expressao", label: "Fórmula da média (M)", required: true, full: true, help: "Ex.: (N1+N2+N3)/3 ou (N1*4+N2*6)/10" },
      { id: "aprovacao", label: "Média para aprovar", type: "number", step: "0.1" },
      { id: "freq", label: "Frequência mínima (%)", type: "number", step: "1" },
      { id: "recAtiva", label: "Tem recuperação / exame final", type: "checkbox", full: true },
      { id: "recMin", label: "Rec. a partir de média", type: "number", step: "0.1" }, { id: "recMax", label: "Rec. abaixo de média", type: "number", step: "0.1" },
      { id: "recExpr", label: "Média final com rec.", help: "M = média do semestre, R = nota da rec. Substitutiva: M + 0,3*(R - min(AV1,AV2))" }, { id: "recAprov", label: "Mínimo depois da rec.", type: "number", step: "0.1" },
      { id: "recPartes", label: "Partes da recuperação", full: true, help: "Ex.: Prova escrita 0,6 + Prova oral 0,4 (vazio = nota única)" },
      { id: "recObs", label: "Observação da recuperação", full: true },
    ],
    onDelete: d ? async () => { await delDoc("disciplinas", d.id); } : null,
    onSave: async v => {
      const componentes = textToComps(v.comps);
      if (!componentes.length) return "Cadastre pelo menos uma nota.";
      const formula = { expressao: v.expressao, aprovacao: num(v.aprovacao) ?? 6, frequenciaMinima: num(v.freq), componentes,
        recuperacao: { ativa: v.recAtiva, min: num(v.recMin), max: num(v.recMax), expressao: v.recExpr || "(M+R)/2", aprovacao: num(v.recAprov), partes: textToParts(v.recPartes, "r"), obs: v.recObs || "" } };
      const test = analisar({ formula, notas: {} });
      if (test.erro) return test.erro;
      if (v.recAtiva) { try { compile(formula.recuperacao.expressao); } catch (er) { return "Fórmula da recuperação: " + er.message; } }
      const doc = { ...(d ? stripMeta(d) : { notas: {}, origem: "Cadastro manual" }), nome: v.nome, apelido: v.apelido, cor: v.cor, codigo: v.codigo, professor: v.professor, formula };
      const id = await saveDoc("disciplinas", d?.id, doc);
      // keep calendar in sync: one avaliação per dated component
      for (const c of componentes) {
        if (!c.data) continue;
        const ex = list("avaliacoes").find(a => a.disciplinaId === id && a.componente === c.id);
        if (!ex) await saveDoc("avaliacoes", null, { disciplinaId: id, componente: c.id, titulo: c.id, tipo: "prova", data: c.data, origem: "Fórmula da disciplina" });
        else if (ex.data !== c.data) await patchDoc("avaliacoes", ex.id, { data: c.data });
      }
      ui.disc = id; store.set("disc", id); calcKey = "";
    }
  });
}
const stripMeta = o => { const { id, _draft, ...rest } = o; return rest; };

/* --- horário e faltas --- */
function textToHorarios(s) {
  const DIAS = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];
  return String(s || "").split("\n").map(l => l.trim()).filter(Boolean).map(l => {
    const [dia, hora, sala] = l.split("|").map(x => (x || "").trim());
    const idx = DIAS.indexOf(dia.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().slice(0, 3));
    if (idx < 0) throw new Error(`“${dia}” não é um dia da semana. Use seg, ter, qua, qui, sex ou sáb.`);
    let inicio = "", fim = "";
    if (hora) {
      const m = hora.match(/^(\d{1,2})(?:[:h](\d{2})|h)?\s*(?:(?:-|–|às|as|a)\s*(\d{1,2})(?:[:h](\d{2})|h)?)?$/i);
      if (!m || +m[1] > 23 || (m[3] && +m[3] > 23)) throw new Error(`Não entendi o horário “${hora}”. Use 19:00-20:40.`);
      inicio = `${pad(m[1])}:${m[2] || "00"}`; if (m[3]) fim = `${pad(m[3])}:${m[4] || "00"}`;
    }
    return { dia: idx, inicio, fim, sala: sala || "" };
  });
}
function sigaaToHorarios(code) {
  const out = [];
  for (const p of String(code || "").toUpperCase().trim().split(/\s+/).filter(Boolean)) {
    const m = p.match(/^([2-7]+)([MTN])([1-6]+)$/);
    if (!m) throw new Error(`Não entendi o código “${p}”. Use o formato do SIGAA, como 35N12.`);
    const aulas = SIGAA_AULAS[m[2]], idx = [...new Set(m[3])].map(Number).sort((a, b) => a - b);
    const bad = idx.find(i => !aulas[i - 1]);
    if (bad) throw new Error(`O turno ${m[2]} não tem o ${bad}º horário.`);
    for (const dd of new Set(m[1])) out.push({ dia: +dd - 1, inicio: aulas[idx[0] - 1][0], fim: aulas[idx[idx.length - 1] - 1][1], aulas: idx.length, turno: SIGAA_TURNO[m[2]] });
  }
  return out;
}
function horarioForm(d) {
  const f = freqOf(d);
  const hs = (d.horarios || []).length ? d.horarios : diasDe(d);
  openForm({
    title: `Horário e faltas · ${short(d)}`,
    note: "Os dias já vêm do cronograma do plano de ensino. O código do SIGAA completa o horário.",
    values: { sigaa: d.sigaa || "", turno: d.turno || "", aulasPorDia: aulasDia(d), cargaHoraria: num(d.cargaHoraria) ?? "", horarios: hs.map(h => [WD[h.dia], h.inicio ? h.inicio + (h.fim ? "-" + h.fim : "") : "", h.sala || ""].join(" | ")).join("\n") },
    fields: [
      { id: "sigaa", label: "Código de horário do SIGAA", full: true, help: "Ex.: 35N12 = terça e quinta, 19:00 às 20:30. Com o código, dias, horários e turno saem dele." },
      { id: "horarios", label: "Dias, horários e salas", type: "textarea", full: true, rows: 3, help: "Uma linha por dia: dia | horário | sala. Ex.: ter | 19:00-20:30 | Sala 12" },
      { id: "turno", label: "Turno", type: "select", full: true, options: [["", "Não informado"], ...Object.entries(TURNO).map(([k, v]) => [k, v[0]])] },
      { id: "aulasPorDia", label: "Faltas por dia faltado", type: "number", step: "1", help: "Quantas faltas o professor lança quando você falta um dia." },
      { id: "cargaHoraria", label: "Total de aulas no semestre", type: "number", step: "1", help: `Vazio = ${cargaH({ ...d, cargaHoraria: null })} aulas, pelos dias do cronograma e o horário do SIGAA. O limite de faltas é ${fmt(100 - f.minPct, 0, 0)}% disso.` },
    ],
    onSave: async v => {
      const code = v.sigaa.toUpperCase().replace(/\s+/g, " ").trim();
      const manual = textToHorarios(v.horarios);
      let horarios = manual, turno = v.turno, aulas = num(v.aulasPorDia);
      const ch = num(v.cargaHoraria);
      if (code) {
        // the code decides days and times; the room still comes from that day's line
        const hs = sigaaToHorarios(code);
        horarios = hs.map(h => ({ dia: h.dia, inicio: h.inicio, fim: h.fim, sala: manual.find(x => x.dia === h.dia)?.sala || "" }));
        turno = hs[0].turno;
      }
      if (aulas != null && (aulas < 1 || aulas > 8 || !Number.isInteger(aulas))) return "Faltas por dia faltado: use um número inteiro de 1 a 8.";
      if (ch != null && (ch < 1 || !Number.isInteger(ch))) return "Total de aulas: use um número inteiro maior que zero, ou deixe vazio.";
      if (!DB) throw new Error("no db");
      await patchDoc("disciplinas", d.id, { sigaa: code, horarios, turno, aulasPorDia: aulas || 2, cargaHoraria: ch || null });
    }
  });
}

/* --- avaliação --- */
function avalForm(a) {
  openForm({
    title: a ? "Editar avaliação" : "Nova avaliação",
    values: a ? { ...a, data: a.data ? ddmm(a.data) + "/" + a.data.slice(0, 4) : "" } : { disciplinaId: ui.disc || "", tipo: "prova" },
    fields: [
      { id: "disciplinaId", label: "Disciplina", type: "select", options: discOptions() },
      { id: "tipo", label: "Tipo", type: "select", options: Object.entries(TIPO_AVAL) },
      { id: "componente", label: "Nota da fórmula", help: "Ex.: N2. Liga a prova à calculadora." },
      { id: "titulo", label: "Título" },
      { id: "data", label: "Data", required: true, help: "dd/mm/aaaa" }, { id: "hora", label: "Horário", type: "time" },
      { id: "conteudo", label: "Conteúdo", type: "textarea", full: true, rows: 3 },
    ],
    onDelete: a ? async () => { await delDoc("avaliacoes", a.id); } : null,
    onSave: async v => {
      const data = checkDate(v.data, "Data");
      await saveDoc("avaliacoes", a?.id, { ...(a ? stripMeta(a) : { origem: "Manual" }), disciplinaId: v.disciplinaId, tipo: v.tipo, componente: v.componente, titulo: v.titulo || v.componente || TIPO_AVAL[v.tipo], data, hora: v.hora, conteudo: v.conteudo });
    }
  });
}
/* --- tarefa --- */
function taskForm(t) {
  openForm({
    title: t ? "Editar tarefa" : "Nova tarefa",
    values: t ? { ...t, status: statusOf(t), prazo: t.prazo ? ddmm(t.prazo) + "/" + t.prazo.slice(0, 4) : "", objetivos: (t.objetivos || []).map(o => o.texto).join("\n") } : { disciplinaId: ui.disc || "", status: "a-fazer" },
    fields: [
      { id: "titulo", label: "Tarefa", required: true, full: true },
      { id: "disciplinaId", label: "Disciplina", type: "select", options: discOptions() },
      { id: "prazo", label: "Prazo", help: "dd/mm/aaaa" },
      { id: "status", label: "Status", type: "select", options: Object.entries(STATUS_T) },
      { id: "link", label: "Link da entrega", type: "url" },
      { id: "objetivos", label: "Objetivos", type: "textarea", full: true, rows: 5, help: "Um por linha. Viram uma checklist." },
      { id: "obs", label: "Observações", full: true },
    ],
    onDelete: t ? async () => { await delDoc("tarefas", t.id); } : null,
    onSave: async v => {
      const prazo = checkDate(v.prazo, "Prazo");
      const old = t?.objetivos || [];
      const objetivos = v.objetivos.split("\n").map(s => s.trim()).filter(Boolean).map(texto => ({ texto, feito: !!old.find(o => o.texto === texto)?.feito }));
      const status = objetivos.length && objetivos.every(o => o.feito) ? "entregue" : (v.status === "entregue" && objetivos.length ? "fazendo" : v.status);
      await saveDoc("tarefas", t?.id, { ...(t ? stripMeta(t) : { origem: "Manual" }), titulo: v.titulo, disciplinaId: v.disciplinaId, prazo, status, link: v.link, objetivos, obs: v.obs });
    }
  });
}
/* --- data acadêmica --- */
function dataForm(x) {
  openForm({
    title: x ? "Editar data" : "Nova data acadêmica",
    values: x ? { ...x, data: x.data ? ddmm(x.data) + "/" + x.data.slice(0, 4) : "", fim: x.fim ? ddmm(x.fim) + "/" + x.fim.slice(0, 4) : "" } : { tipo: "feriado" },
    fields: [
      { id: "titulo", label: "Descrição", required: true, full: true },
      { id: "tipo", label: "Tipo", type: "select", options: Object.entries(TIPO_DATA) },
      { id: "data", label: "Início", required: true, help: "dd/mm/aaaa" }, { id: "fim", label: "Fim (se durar mais de um dia)" },
    ],
    onDelete: x ? async () => { await delDoc("datas", x.id); } : null,
    onSave: async v => { await saveDoc("datas", x?.id, { ...(x ? stripMeta(x) : { origem: "Manual" }), titulo: v.titulo, tipo: v.tipo, data: checkDate(v.data, "Início"), fim: checkDate(v.fim, "Fim") }); }
  });
}
/* --- evento --- */
function eventForm(ev) {
  const cats = (S.regulamento?.categorias || []).map(c => c.nome);
  openForm({
    title: ev ? "Editar evento" : "Novo evento",
    values: ev ? { ...ev, data: ev.data ? ddmm(ev.data) + "/" + ev.data.slice(0, 4) : "", fim: ev.fim ? ddmm(ev.fim) + "/" + ev.fim.slice(0, 4) : "", prazoInscricao: ev.prazoInscricao ? ddmm(ev.prazoInscricao) + "/" + ev.prazoInscricao.slice(0, 4) : "" } : { status: "interesse" },
    fields: [
      { id: "nome", label: "Evento", required: true, full: true },
      { id: "organizador", label: "Organização" }, { id: "local", label: "Local / formato" },
      { id: "data", label: "Data", help: "dd/mm/aaaa" }, { id: "fim", label: "Termina em" },
      { id: "status", label: "Inscrição", type: "select", options: Object.entries(EV_STATUS).map(([k, v]) => [k, v[0]]) },
      { id: "prazoInscricao", label: "Inscrições até" },
      { id: "horasPrevistas", label: "Horas previstas", type: "number", step: "0.5" },
      { id: "categoria", label: "Categoria de horas", datalist: cats },
      { id: "link", label: "Link", type: "url", full: true },
    ],
    onDelete: ev ? async () => { await delDoc("eventos", ev.id); } : null,
    onSave: async v => { await saveDoc("eventos", ev?.id, { ...(ev ? stripMeta(ev) : { origem: "Manual" }), nome: v.nome, organizador: v.organizador, local: v.local, data: checkDate(v.data, "Data"), fim: checkDate(v.fim, "Termina em"), status: v.status, prazoInscricao: checkDate(v.prazoInscricao, "Inscrições até"), horasPrevistas: num(v.horasPrevistas), categoria: v.categoria, link: v.link }); }
  });
}
/* --- liga --- */
function ligaForm(l) {
  openForm({
    title: l ? "Editar liga" : "Nova liga",
    values: l ? { ...l, inicio: l.inicio ? ddmm(l.inicio) + "/" + l.inicio.slice(0, 4) : "" } : {},
    fields: [
      { id: "nome", label: "Liga", required: true, full: true },
      { id: "papel", label: "Seu papel", help: "Membro, diretoria…" }, { id: "reunioes", label: "Reuniões", help: "Ex.: quinzenal, qui 19h" },
      { id: "inicio", label: "Desde" }, { id: "horas", label: "Horas acumuladas", type: "number", step: "0.5" },
    ],
    onDelete: l ? async () => { await delDoc("ligas", l.id); } : null,
    onSave: async v => { await saveDoc("ligas", l?.id, { ...(l ? stripMeta(l) : {}), nome: v.nome, papel: v.papel, reunioes: v.reunioes, inicio: checkDate(v.inicio, "Desde"), horas: num(v.horas) }); }
  });
}
/* --- certificado --- */
function certForm(c) {
  const cats = [...new Set([...(S.regulamento?.categorias || []).map(x => x.nome), ...list("certificados").map(x => x.categoria).filter(Boolean)])];
  const fields = [
    { id: "titulo", label: "Atividade", required: true, full: true },
    { id: "emissor", label: "Emitido por" }, { id: "categoria", label: "Categoria", datalist: cats },
    { id: "horas", label: "Horas", type: "number", step: "0.5", required: true },
    { id: "status", label: "Situação", type: "select", options: Object.entries(CERT_STATUS).map(([k, v]) => [k, v[0]]) },
    { id: "inicio", label: "Início" }, { id: "fim", label: "Fim" },
    { id: "numeroDocumento", label: "Nº do documento" }, { id: "codigoVerificacao", label: "Código de verificação" },
    { id: "obs", label: "Observações", full: true },
  ];
  if (ASSETS) fields.push({ id: "arquivo", label: c?.arquivo ? "Trocar arquivo" : "Arquivo do certificado", type: "file", accept: "application/pdf,image/png,image/jpeg,image/webp", full: true, help: "PDF ou imagem, até 20 MB." });
  openForm({
    title: c ? "Editar certificado" : "Novo certificado",
    values: c ? { ...c, inicio: c.inicio ? ddmm(c.inicio) + "/" + c.inicio.slice(0, 4) : "", fim: c.fim ? ddmm(c.fim) + "/" + c.fim.slice(0, 4) : "" } : { status: "salvo" },
    fields,
    onDelete: c ? async () => { await delDoc("certificados", c.id); if (c.arquivo && ASSETS) { try { await ASSETS.delete(c.arquivo); } catch {} } } : null,
    onSave: async v => {
      const doc = { ...(c ? stripMeta(c) : { origem: "Manual" }), titulo: v.titulo, emissor: v.emissor, categoria: v.categoria, horas: num(v.horas), status: v.status, inicio: checkDate(v.inicio, "Início"), fim: checkDate(v.fim, "Fim"), numeroDocumento: v.numeroDocumento, codigoVerificacao: v.codigoVerificacao, obs: v.obs };
      if (v.arquivo && ASSETS) {
        try { const up = await ASSETS.upload(v.arquivo, v.arquivo.type ? undefined : { type: "application/pdf" }); doc.arquivo = up.id; }
        catch (er) { return er?.code === "too_large" ? "O arquivo passa de 20 MB." : er?.code === "unsupported_type" ? "Use PDF, PNG, JPG ou WebP." : "Não foi possível enviar o arquivo."; }
      }
      await saveDoc("certificados", c?.id, doc);
    }
  });
}
/* --- regulamento --- */
function regForm() {
  const r = S.regulamento || {};
  openForm({
    title: "Regulamento de horas",
    note: "Preencha quando o colegiado aprovar. Até lá, deixe como “Aguardando”.",
    values: { ...r, status: r.status || "aguardando", categorias: (r.categorias || []).map(c => `${c.nome} | ${c.limite ?? ""}`).join("\n"), prazoEnvio: r.prazoEnvio && parseIso(r.prazoEnvio) ? ddmm(r.prazoEnvio) + "/" + r.prazoEnvio.slice(0, 4) : (r.prazoEnvio || "") },
    fields: [
      { id: "titulo", label: "Nome do documento", full: true },
      { id: "status", label: "Situação", type: "select", options: [["aguardando", "Aguardando colegiado"], ["aprovado", "Aprovado"]] },
      { id: "totalExigido", label: "Total de horas exigido", type: "number", step: "1" },
      { id: "categorias", label: "Categorias e limites", type: "textarea", full: true, help: "Uma por linha: categoria | limite em horas. Ex.: Extensão | 60" },
      { id: "prazoEnvio", label: "Prazo para enviar certificados" }, { id: "orgao", label: "Aprovado por" },
      { id: "comoValidar", label: "Como validar", full: true }, { id: "observacao", label: "Observação", full: true },
    ],
    onSave: async v => {
      const categorias = v.categorias.split("\n").map(s => s.trim()).filter(Boolean).map(l => { const [nome, lim] = l.split("|").map(x => (x || "").trim()); return { nome, limite: num(lim) }; });
      if (!DB) throw new Error("no db");
      const ref = DB.doc("config/regulamento");
      await enqueue(ref.path, () => ref.set({ ...r, titulo: v.titulo, status: v.status, totalExigido: num(v.totalExigido), categorias, prazoEnvio: checkDate(v.prazoEnvio, "Prazo"), orgao: v.orgao, comoValidar: v.comoValidar, observacao: v.observacao })).catch(e => { toast(failMsg(e)); throw e; });
    }
  });
}

/* ---------- global click wiring ---------- */
document.addEventListener("click", e => {
  const fb = e.target.closest("[data-falta]");
  if (fb) { toggleFalta(fb.dataset.falta, fb.dataset.fday); return; }
  const gd = e.target.closest("[data-goto-day]");
  if (gd) { gotoDay(gd.dataset.gotoDay); return; }
  const a = e.target.closest("[data-act]");
  if (a) {
    const k = a.dataset.act;
    if (k === "add-disc") discForm(); else if (k === "edit-disc") discForm(discById(a.dataset.id));
    else if (k === "edit-hor") { const d = discById(a.dataset.id); if (d) horarioForm(d); }
    else if (k === "add-task") taskForm(); else if (k === "add-evento") eventForm(); else if (k === "add-liga") ligaForm();
    else if (k === "add-cert") certForm(); else if (k === "edit-reg") regForm();
    return;
  }
  const ed = e.target.closest("[data-edit]");
  if (ed) {
    const col = ed.dataset.edit, it = list(col).find(x => x.id === ed.dataset.id); if (!it) return;
    ({ avaliacoes: avalForm, tarefas: taskForm, datas: dataForm, eventos: eventForm, certificados: certForm, ligas: ligaForm, disciplinas: discForm })[col]?.(it);
  }
});
/* ---------- "+" button: each tab adds its own thing; on Calendário it opens a small menu ---------- */
const FAB = {
  hoje: { label: "Nova tarefa", run: () => taskForm() },
  media: { label: "Nova disciplina", run: () => discForm() },
  calendario: { label: "Cadastrar no calendário", menu: true },
  hub: { label: "Novo evento", run: () => eventForm() },
};
const FAB_ITEM = { aval: () => avalForm(), data: () => dataForm(), task: () => taskForm() };
function fabMenu(open, focusFab) {
  const m = $("#fab-menu"), b = $("#fab");
  if (m.hidden === !open) return;
  m.hidden = !open;
  if (FAB[ui.tab]?.menu) b.setAttribute("aria-expanded", open);
  if (open) m.querySelector("button").focus(); else if (focusFab) b.focus();
}
function setFab(t) {
  const f = FAB[t] || FAB.hoje, b = $("#fab");
  fabMenu(false);
  b.setAttribute("aria-label", f.label); b.title = f.label;
  if (f.menu) { b.setAttribute("aria-haspopup", "menu"); b.setAttribute("aria-expanded", "false"); b.setAttribute("aria-controls", "fab-menu"); }
  else ["aria-haspopup", "aria-expanded", "aria-controls"].forEach(k => b.removeAttribute(k));
}
$("#fab").addEventListener("click", () => { const f = FAB[ui.tab] || FAB.hoje; if (f.menu) fabMenu($("#fab-menu").hidden); else f.run(); });
$("#fab-menu").addEventListener("click", e => { const it = e.target.closest("[data-fab]"); if (!it) return; fabMenu(false); FAB_ITEM[it.dataset.fab](); });
$("#fab-menu").addEventListener("keydown", e => {
  const items = $$("#fab-menu [role=menuitem]"), i = items.indexOf(document.activeElement);
  if (e.key === "Escape") { e.preventDefault(); fabMenu(false, true); }
  else if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); items[(i + (e.key === "ArrowDown" ? 1 : items.length - 1)) % items.length].focus(); }
  else if (e.key === "Home" || e.key === "End") { e.preventDefault(); items[e.key === "Home" ? 0 : items.length - 1].focus(); }
  else if (e.key === "Tab") fabMenu(false);
});
document.addEventListener("pointerdown", e => { if (!$("#fab-menu").hidden && !e.target.closest("#fab-menu,#fab")) fabMenu(false); });
$("#add-disc").addEventListener("click", () => discForm());
$("#add-aval").addEventListener("click", () => avalForm());
$("#add-data").addEventListener("click", () => dataForm());
$("#add-task").addEventListener("click", () => taskForm());

/* ---------- tema: the sidebar switch sets data-theme on <html>; without a saved choice the system theme rules ---------- */
const sysDark = matchMedia("(prefers-color-scheme: dark)");
const isDark = () => (document.documentElement.dataset.theme || (sysDark.matches ? "dark" : "light")) === "dark";
function syncTheme() { $("#theme-sw").setAttribute("aria-checked", String(isDark())); }
{ const t = store.get("theme", null); if (t === "dark" || t === "light") document.documentElement.dataset.theme = t; }
function applyTheme(t) { document.documentElement.dataset.theme = t; store.set("theme", t); syncTheme(); }
// the switch fades the whole page from one theme to the other: a View Transition cross-fade where the browser has it,
// else every color eases for the same time (.theme-fade); reduced motion swaps at once
$("#theme-sw").addEventListener("click", () => {
  const t = isDark() ? "light" : "dark", root = document.documentElement;
  if (reduceMotion()) return applyTheme(t);
  if (document.startViewTransition) { document.startViewTransition(() => applyTheme(t)); return; }
  root.classList.add("theme-fade"); applyTheme(t);
  clearTimeout(root._fadeT); root._fadeT = setTimeout(() => root.classList.remove("theme-fade"), 520);
});
sysDark.addEventListener?.("change", syncTheme);
syncTheme();

/* ---------- barra lateral: Spell UI "animated gradient", the same WebGL2 shader rewritten for plain JS ----------
   Speed 6.4 = 40% of the first 16, as the user asked. Custom preset in the app's navy/blue. It only runs while the sidebar is on screen (>= 1024px) and the tab is visible;
   reduced motion gets one still frame; without WebGL2 the CSS gradient under the canvas stays */
(() => {
  const box = $(".sb-bg"), cv = box && box.querySelector("canvas");
  const gl = cv && cv.getContext("webgl2", { premultipliedAlpha: true, alpha: true, antialias: true });
  if (!gl) return;
  const P = { color1: "#0A1428", color2: "#3D7CF0", color3: "#16336E", rotation: -50, proportion: 50, scale: 0.35, speed: 6.4,
    distortion: 6, swirl: 60, swirlIterations: 8, softness: 100, offset: -260, shape: 0, shapeSize: 34 };
  const VS = `#version 300 es
in vec4 a_position;
void main() { gl_Position = a_position; }`;
  const FS = `#version 300 es
precision highp float;
uniform float u_time; uniform float u_pixelRatio; uniform vec2 u_resolution;
uniform float u_scale; uniform float u_rotation; uniform vec4 u_color1; uniform vec4 u_color2; uniform vec4 u_color3;
uniform float u_proportion; uniform float u_softness; uniform float u_shape; uniform float u_shapeScale;
uniform float u_distortion; uniform float u_swirl; uniform float u_swirlIterations;
out vec4 fragColor;
#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846
vec2 rotate(vec2 uv, float th) { return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv; }
float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123); }
float noise(vec2 st) {
  vec2 i = floor(st); vec2 f = fract(st);
  float a = random(i); float b = random(i + vec2(1.0, 0.0)); float c = random(i + vec2(0.0, 1.0)); float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
vec4 blend_colors(vec4 c1, vec4 c2, vec4 c3, float mixer, float edgesWidth, float edge_blur) {
  vec3 color1 = c1.rgb * c1.a; vec3 color2 = c2.rgb * c2.a; vec3 color3 = c3.rgb * c3.a;
  float r1 = smoothstep(.0 + .35 * edgesWidth, .7 - .35 * edgesWidth + .5 * edge_blur, mixer);
  float r2 = smoothstep(.3 + .35 * edgesWidth, 1. - .35 * edgesWidth + edge_blur, mixer);
  vec3 blended_color_2 = mix(color1, color2, r1); float blended_opacity_2 = mix(c1.a, c2.a, r1);
  return vec4(mix(blended_color_2, color3, r2), mix(blended_opacity_2, c3.a, r2));
}
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float t = .5 * u_time;
  float noise_scale = .0005 + .006 * u_scale;
  uv -= .5; uv *= (noise_scale * u_resolution); uv = rotate(uv, u_rotation * .5 * PI); uv /= u_pixelRatio; uv += .5;
  float n1 = noise(uv * 1. + t); float n2 = noise(uv * 2. - t); float angle = n1 * TWO_PI;
  uv.x += 4. * u_distortion * n2 * cos(angle); uv.y += 4. * u_distortion * n2 * sin(angle);
  float iterations_number = ceil(clamp(u_swirlIterations, 1., 30.));
  for (float i = 1.; i <= iterations_number; i++) {
    uv.x += clamp(u_swirl, 0., 2.) / i * cos(t + i * 1.5 * uv.y);
    uv.y += clamp(u_swirl, 0., 2.) / i * cos(t + i * 1. * uv.x);
  }
  float proportion = clamp(u_proportion, 0., 1.);
  float shape = 0.; float mixer = 0.;
  if (u_shape < .5) {
    vec2 checks_shape_uv = uv * (.5 + 3.5 * u_shapeScale);
    shape = .5 + .5 * sin(checks_shape_uv.x) * cos(checks_shape_uv.y);
    mixer = shape + .48 * sign(proportion - .5) * pow(abs(proportion - .5), .5);
  } else if (u_shape < 1.5) {
    vec2 stripes_shape_uv = uv * (.25 + 3. * u_shapeScale);
    float f = fract(stripes_shape_uv.y);
    shape = smoothstep(.0, .55, f) * smoothstep(1., .45, f);
    mixer = shape + .48 * sign(proportion - .5) * pow(abs(proportion - .5), .5);
  } else {
    float sh = 1. - uv.y; sh -= .5; sh /= (noise_scale * u_resolution.y); sh += .5;
    float shape_scaling = .2 * (1. - u_shapeScale);
    shape = smoothstep(.45 - shape_scaling, .55 + shape_scaling, sh + .3 * (proportion - .5));
    mixer = shape;
  }
  fragColor = blend_colors(u_color1, u_color2, u_color3, mixer, 1. - clamp(u_softness, 0., 1.), .01 + .01 * u_scale);
}`;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
  const vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS); if (!vs || !fs) return;
  const prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  const pos = gl.getAttribLocation(prog, "a_position"); gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
  const U = n => gl.getUniformLocation(prog, n);
  const rgba = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255).concat(1);
  // everything but time and size is fixed, so it is sent once
  gl.uniform1f(U("u_scale"), P.scale); gl.uniform1f(U("u_rotation"), P.rotation * Math.PI / 180);
  gl.uniform4f(U("u_color1"), ...rgba(P.color1)); gl.uniform4f(U("u_color2"), ...rgba(P.color2)); gl.uniform4f(U("u_color3"), ...rgba(P.color3));
  gl.uniform1f(U("u_proportion"), P.proportion / 100); gl.uniform1f(U("u_softness"), P.softness / 100);
  gl.uniform1f(U("u_shape"), P.shape); gl.uniform1f(U("u_shapeScale"), P.shapeSize / 100);
  gl.uniform1f(U("u_distortion"), P.distortion / 50); gl.uniform1f(U("u_swirl"), P.swirl / 100);
  gl.uniform1f(U("u_swirlIterations"), P.swirl === 0 ? 0 : P.swirlIterations);
  const uTime = U("u_time"), uRes = U("u_resolution"), uPr = U("u_pixelRatio");
  const wide = matchMedia("(min-width: 1024px)");
  const t0 = performance.now(); let raf = 0;
  const resize = () => {
    const pr = window.devicePixelRatio || 1, w = box.clientWidth, h = box.clientHeight; if (!w || !h) return;
    cv.width = Math.round(w * pr); cv.height = Math.round(h * pr);
    gl.viewport(0, 0, cv.width, cv.height); gl.uniform2f(uRes, cv.width, cv.height); gl.uniform1f(uPr, pr);
  };
  const draw = now => { gl.uniform1f(uTime, (now - t0) / 1000 * (P.speed / 100) * 5 + P.offset * 0.01); gl.drawArrays(gl.TRIANGLES, 0, 6); };
  const loop = now => { draw(now); raf = requestAnimationFrame(loop); };
  const run = () => {
    cancelAnimationFrame(raf); raf = 0;
    if (!wide.matches || document.hidden) return;
    resize();
    if (reduceMotion()) draw(t0); else raf = requestAnimationFrame(loop);
    box.classList.add("on");
  };
  wide.addEventListener?.("change", run);
  document.addEventListener("visibilitychange", run);
  matchMedia("(prefers-reduced-motion: reduce)").addEventListener?.("change", run);
  if (window.ResizeObserver) new ResizeObserver(() => { resize(); if (!raf && wide.matches) draw(performance.now()); }).observe(box);
  run();
})();

/* ---------- seletor de período: chip in the header, a menu of radio items under it (a sheet from the bottom on phones) ---------- */
if (!ui.per) ui.per = perAtual();
function renderPer() {
  const atual = perAtual();
  $("#per-label").textContent = ui.per;
  $("#per-btn").setAttribute("aria-label", `Período ${ui.per}${ui.per === atual ? ", atual" : ""}. Trocar período`);
  $("#per-list").innerHTML = periodos().map(p => {
    const vazio = perVazio(p.id), sel = p.id === ui.per;
    return `<button type="button" role="menuitemradio" aria-checked="${sel}" data-per="${esc(p.id)}" class="${vazio ? "vazio" : ""}" tabindex="-1">
      <span class="pl">${esc(p.id)}</span>${p.id === atual ? `<span class="pb">atual</span>` : vazio ? `<span class="pv">vazio</span>` : ""}<span class="pk">${sel ? ICON.check : ""}</span></button>`;
  }).join("");
  const note = $("#per-note");
  if (ui.per === atual) { note.hidden = true; return; }
  const quando = perKey(ui.per) < perKey(atual) ? "passado" : "futuro";
  note.hidden = false;
  note.innerHTML = `<span class="pn-ic">${ICON.calendar}</span><span>Você está vendo o período <b>${esc(ui.per)}</b> (${quando}${perVazio(ui.per) ? ", ainda vazio" : ""}). O que você cadastrar agora vai para ele.</span><button class="btn sm" type="button" data-per-go="${esc(atual)}">Voltar para ${esc(atual)}</button>`;
}
function setPer(id) {
  if (id === ui.per) return;
  ui.per = id; store.set("per", id); ui.disc = null;
  applyPeriod(); renderAll();
  toast(`Período ${id}`);
}
function perMenu(open, refocus) {
  const m = $("#per-menu"), b = $("#per-btn");
  if (open === !m.hidden) return;
  m.hidden = !open; b.setAttribute("aria-expanded", String(open));
  if (open) { const cur = $(`#per-list [aria-checked="true"]`) || $("#per-list button"); cur?.focus(); cur?.scrollIntoView({ block: "nearest" }); }
  else if (refocus) b.focus();
}
$("#per-btn").addEventListener("click", () => perMenu($("#per-menu").hidden));
$("#per-menu").addEventListener("click", e => {
  const it = e.target.closest("[data-per]"); if (it) { perMenu(false, true); setPer(it.dataset.per); return; }
  if (e.target === $("#per-menu")) perMenu(false, true);
});
$("#per-menu").addEventListener("keydown", e => {
  const items = $$("#per-list [data-per]"), i = items.indexOf(document.activeElement);
  if (e.key === "Escape") { e.preventDefault(); perMenu(false, true); }
  else if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); items[(i + (e.key === "ArrowDown" ? 1 : items.length - 1)) % items.length].focus(); }
  else if (e.key === "Home" || e.key === "End") { e.preventDefault(); items[e.key === "Home" ? 0 : items.length - 1].focus(); }
  else if (e.key === "Tab") perMenu(false);
});
document.addEventListener("pointerdown", e => { if (!$("#per-menu").hidden && !e.target.closest(".per-box,#per-btn")) perMenu(false); });
document.addEventListener("click", e => { const g = e.target.closest("[data-per-go]"); if (g) setPer(g.dataset.perGo); });

/* ---------- boot ---------- */
$("#today-label").textContent = `${WD[TODAY.getDay()]}, ${pad(TODAY.getDate())} de ${MES[TODAY.getMonth()]}`;
setTab(location.hash.slice(1) || "hoje");
renderAll();

function waitClaude(ms) {
  return new Promise(res => { const t0 = Date.now(); (function poll() { if (window.claude && typeof window.claude.use === "function") return res(window.claude); if (Date.now() - t0 > ms) return res(null); setTimeout(poll, 100); })(); });
}
(async () => {
  const slow = setTimeout(() => { if (dbState === "loading") banner("Os dados ainda não carregaram. Confira a conexão; a página continua tentando."); }, 10000);
  const cl = await waitClaude(4000);
  let db = null;
  try { db = cl ? await cl.use("db") : null; } catch { db = null; }
  if (!db) {
    clearTimeout(slow); dbState = "off";
    banner("Os dados salvos não estão disponíveis nesta visualização. Abra o app pelo Claude, conectado à sua conta.");
    for (const c of COLS) RAW[c] = RAW[c] || [];
    applyPeriod(); S.regulamento = null; schedule(); return;
  }
  DB = db; dbState = "on";
  const settle = () => { clearTimeout(slow); banner(""); };
  for (const c of COLS) {
    db.collection(c).onSnapshot(snap => {
      RAW[c] = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (c === "disciplinas" && pend && pend.saved) pend = null;
      applyPeriod();
      if (!snap.metadata.fromCache) settle();
      schedule();
    }, err => { RAW[c] = RAW[c] || []; applyPeriod(); settle(); if (err.code !== "revoked") toast("Não foi possível carregar parte dos dados."); schedule(); });
  }
  db.doc("config/regulamento").onSnapshot(s => { S.regulamento = s.exists ? s.data() : null; schedule(); }, () => { S.regulamento = null; schedule(); });
  try { ASSETS = await cl.use("assets"); } catch { ASSETS = null; }
})();
})();
