"use strict";

const API = "https://date.nager.at/api/v3";
const TIMEOUT_MS = 10000;

// Zona horaria de referencia (capital) por país. Si falta, se usa la hora local del equipo.
const TZ = {
  AD: "Europe/Andorra", AL: "Europe/Tirane", AR: "America/Argentina/Buenos_Aires", AT: "Europe/Vienna",
  AU: "Australia/Sydney", AX: "Europe/Mariehamn", BA: "Europe/Sarajevo", BB: "America/Barbados",
  BE: "Europe/Brussels", BG: "Europe/Sofia", BJ: "Africa/Porto-Novo", BO: "America/La_Paz",
  BR: "America/Sao_Paulo", BS: "America/Nassau", BW: "Africa/Gaborone", BY: "Europe/Minsk",
  BZ: "America/Belize", CA: "America/Toronto", CH: "Europe/Zurich", CL: "America/Santiago",
  CN: "Asia/Shanghai", CO: "America/Bogota", CR: "America/Costa_Rica", CU: "America/Havana",
  CY: "Asia/Nicosia", CZ: "Europe/Prague", DE: "Europe/Berlin", DK: "Europe/Copenhagen",
  DO: "America/Santo_Domingo", EC: "America/Guayaquil", EE: "Europe/Tallinn", EG: "Africa/Cairo",
  ES: "Europe/Madrid", FI: "Europe/Helsinki", FO: "Atlantic/Faroe", FR: "Europe/Paris",
  GA: "Africa/Libreville", GB: "Europe/London", GD: "America/Grenada", GE: "Asia/Tbilisi",
  GG: "Europe/Guernsey", GI: "Europe/Gibraltar", GL: "America/Nuuk", GM: "Africa/Banjul",
  GR: "Europe/Athens", GT: "America/Guatemala", GY: "America/Guyana", HK: "Asia/Hong_Kong",
  HN: "America/Tegucigalpa", HR: "Europe/Zagreb", HT: "America/Port-au-Prince", HU: "Europe/Budapest",
  ID: "Asia/Jakarta", IE: "Europe/Dublin", IM: "Europe/Isle_of_Man", IS: "Atlantic/Reykjavik",
  IT: "Europe/Rome", JE: "Europe/Jersey", JM: "America/Jamaica", JP: "Asia/Tokyo",
  KR: "Asia/Seoul", KZ: "Asia/Almaty", LI: "Europe/Vaduz", LS: "Africa/Maseru",
  LT: "Europe/Vilnius", LU: "Europe/Luxembourg", LV: "Europe/Riga", MA: "Africa/Casablanca",
  MC: "Europe/Monaco", MD: "Europe/Chisinau", ME: "Europe/Podgorica", MG: "Indian/Antananarivo",
  MK: "Europe/Skopje", MN: "Asia/Ulaanbaatar", MT: "Europe/Malta", MX: "America/Mexico_City",
  MZ: "Africa/Maputo", NA: "Africa/Windhoek", NE: "Africa/Niamey", NG: "Africa/Lagos",
  NI: "America/Managua", NL: "Europe/Amsterdam", NO: "Europe/Oslo", NZ: "Pacific/Auckland",
  PA: "America/Panama", PE: "America/Lima", PL: "Europe/Warsaw", PR: "America/Puerto_Rico",
  PT: "Europe/Lisbon", PY: "America/Asuncion", RO: "Europe/Bucharest", RS: "Europe/Belgrade",
  RU: "Europe/Moscow", SE: "Europe/Stockholm", SG: "Asia/Singapore", SI: "Europe/Ljubljana",
  SJ: "Arctic/Longyearbyen", SK: "Europe/Bratislava", SM: "Europe/San_Marino", SR: "America/Paramaribo",
  SV: "America/El_Salvador", TN: "Africa/Tunis", TR: "Europe/Istanbul", UA: "Europe/Kyiv",
  US: "America/New_York", UY: "America/Montevideo", VA: "Europe/Vatican", VE: "America/Caracas",
  AG: "America/Antigua", DM: "America/Dominica", KN: "America/St_Kitts", LC: "America/St_Lucia",
  TT: "America/Port_of_Spain", VC: "America/St_Vincent",
  VN: "Asia/Ho_Chi_Minh", ZA: "Africa/Johannesburg", ZW: "Africa/Harare",
};

// Catálogo de ciudades que el usuario puede elegir (zona IANA fija). No se muestra ninguna por defecto.
const STORAGE_KEY = "worldClocks";
const WORLD_CITIES = [
  // América del Norte
  { name: "Ottawa, Canadá", tz: "America/Toronto" },
  { name: "Nueva York, EE. UU.", tz: "America/New_York" },
  { name: "Los Ángeles, EE. UU.", tz: "America/Los_Angeles" },
  { name: "Ciudad de México, México", tz: "America/Mexico_City" },
  // América Central
  { name: "Belmopán, Belice", tz: "America/Belize" },
  { name: "San José, Costa Rica", tz: "America/Costa_Rica" },
  { name: "San Salvador, El Salvador", tz: "America/El_Salvador" },
  { name: "Ciudad de Guatemala, Guatemala", tz: "America/Guatemala" },
  { name: "Tegucigalpa, Honduras", tz: "America/Tegucigalpa" },
  { name: "Managua, Nicaragua", tz: "America/Managua" },
  { name: "Ciudad de Panamá, Panamá", tz: "America/Panama" },
  // Caribe
  { name: "Saint John's, Antigua y Barbuda", tz: "America/Antigua" },
  { name: "Nassau, Bahamas", tz: "America/Nassau" },
  { name: "Bridgetown, Barbados", tz: "America/Barbados" },
  { name: "La Habana, Cuba", tz: "America/Havana" },
  { name: "Roseau, Dominica", tz: "America/Dominica" },
  { name: "Saint George's, Granada", tz: "America/Grenada" },
  { name: "Puerto Príncipe, Haití", tz: "America/Port-au-Prince" },
  { name: "Kingston, Jamaica", tz: "America/Jamaica" },
  { name: "Santo Domingo, República Dominicana", tz: "America/Santo_Domingo" },
  { name: "Basseterre, San Cristóbal y Nieves", tz: "America/St_Kitts" },
  { name: "Castries, Santa Lucía", tz: "America/St_Lucia" },
  { name: "Kingstown, San Vicente y las Granadinas", tz: "America/St_Vincent" },
  { name: "Puerto España, Trinidad y Tobago", tz: "America/Port_of_Spain" },
  // América del Sur
  { name: "Buenos Aires, Argentina", tz: "America/Argentina/Buenos_Aires" },
  { name: "La Paz, Bolivia", tz: "America/La_Paz" },
  { name: "São Paulo, Brasil", tz: "America/Sao_Paulo" },
  { name: "Santiago, Chile", tz: "America/Santiago" },
  { name: "Bogotá, Colombia", tz: "America/Bogota" },
  { name: "Quito, Ecuador", tz: "America/Guayaquil" },
  { name: "Georgetown, Guyana", tz: "America/Guyana" },
  { name: "Asunción, Paraguay", tz: "America/Asuncion" },
  { name: "Lima, Perú", tz: "America/Lima" },
  { name: "Paramaribo, Surinam", tz: "America/Paramaribo" },
  { name: "Montevideo, Uruguay", tz: "America/Montevideo" },
  { name: "Caracas, Venezuela", tz: "America/Caracas" },
  // Resto del mundo
  { name: "Londres", tz: "Europe/London" },
  { name: "Madrid", tz: "Europe/Madrid" },
  { name: "Moscú", tz: "Europe/Moscow" },
  { name: "El Cairo", tz: "Africa/Cairo" },
  { name: "Dubái", tz: "Asia/Dubai" },
  { name: "Nueva Delhi", tz: "Asia/Kolkata" },
  { name: "Shanghái", tz: "Asia/Shanghai" },
  { name: "Tokio", tz: "Asia/Tokyo" },
  { name: "Sídney", tz: "Australia/Sydney" },
  { name: "Auckland", tz: "Pacific/Auckland" },
];

const $ = (id) => document.getElementById(id);
const els = {
  country: $("country"), year: $("year"), status: $("status"), calendar: $("calendar"),
  list: $("holiday-list"), count: $("count"), time: $("clock-time"),
  date: $("clock-date"), zone: $("clock-zone"), world: $("world-clock"),
  worldPick: $("world-pick"), worldAdd: $("world-add"), worldEmpty: $("world-empty"),
};

let currentTz = undefined; // undefined => zona local del equipo
let holidays = new Map();  // "YYYY-MM-DD" -> [holiday]
let loadSeq = 0;
let shownYear = null;      // año dibujado en el calendario
let renderedToday = null;  // "hoy" usado en el último dibujado
const worldCells = [];     // { fmtTime, fmtDate, fmtOffset, time, date, offset }
let selectedTz = [];       // zonas elegidas por el usuario, en orden de adición

// ---------- Utilidades ----------
function setStatus(msg, isError = false) {
  els.status.textContent = msg;
  els.status.classList.toggle("error", isError);
}

async function fetchJson(path) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${API}${path}`, { signal: ctrl.signal, credentials: "omit" });
    if (res.status === 204) return [];
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

const pad = (n) => String(n).padStart(2, "0");
const isoKey = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;

// ---------- Reloj ----------
function loadSelectedTz() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(raw)) return [];
    const valid = new Set(WORLD_CITIES.map((c) => c.tz)); // lista blanca
    return [...new Set(raw)].filter((tz) => typeof tz === "string" && valid.has(tz));
  } catch {
    return [];
  }
}

function saveSelectedTz() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedTz));
  } catch {
    // almacenamiento no disponible: la selección sólo vale para esta sesión
  }
}

function renderWorldPicker() {
  els.worldPick.replaceChildren();
  const available = WORLD_CITIES.filter((c) => !selectedTz.includes(c.tz))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
  for (const c of available) {
    const opt = document.createElement("option");
    opt.value = c.tz;
    opt.textContent = c.name;
    els.worldPick.appendChild(opt);
  }
  els.worldPick.disabled = els.worldAdd.disabled = available.length === 0;
}

function addWorldClock() {
  const tz = els.worldPick.value;
  if (!WORLD_CITIES.some((c) => c.tz === tz) || selectedTz.includes(tz)) return;
  selectedTz.push(tz);
  saveSelectedTz();
  buildWorldClock();
  tickWorldClock(new Date());
}

function removeWorldClock(tz) {
  selectedTz = selectedTz.filter((t) => t !== tz);
  saveSelectedTz();
  buildWorldClock();
  tickWorldClock(new Date());
}

function buildWorldClock() {
  els.world.replaceChildren();
  worldCells.length = 0;
  els.worldEmpty.hidden = selectedTz.length > 0;
  renderWorldPicker();
  for (const tz of selectedTz) {
    const c = WORLD_CITIES.find((x) => x.tz === tz);
    if (!c) continue;
    const li = document.createElement("li");
    const name = document.createElement("div");
    name.className = "w-city";
    name.textContent = c.name;
    const del = document.createElement("button");
    del.type = "button";
    del.className = "w-remove";
    del.textContent = "×";
    del.setAttribute("aria-label", `Quitar ${c.name}`);
    del.addEventListener("click", () => removeWorldClock(c.tz));
    name.appendChild(del);
    const time = document.createElement("div");
    time.className = "w-time";
    const date = document.createElement("div");
    date.className = "w-date";
    const offset = document.createElement("div");
    offset.className = "w-offset";
    li.append(name, time, date, offset);
    els.world.appendChild(li);
    worldCells.push({
      time, date, offset,
      fmtTime: new Intl.DateTimeFormat("es", { timeZone: c.tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
      fmtDate: new Intl.DateTimeFormat("es", { timeZone: c.tz, weekday: "short", day: "numeric", month: "short" }),
      fmtOffset: new Intl.DateTimeFormat("en", { timeZone: c.tz, timeZoneName: "shortOffset" }),
    });
  }
}

function tickWorldClock(now) {
  for (const c of worldCells) {
    c.time.textContent = c.fmtTime.format(now);
    c.date.textContent = c.fmtDate.format(now);
    const part = c.fmtOffset.formatToParts(now).find((p) => p.type === "timeZoneName");
    c.offset.textContent = part ? part.value : "";
  }
}

function tickClock() {
  const now = new Date();
  tickWorldClock(now);
  // Si cambió el día (p. ej. pasó la medianoche), redibuja para mover el resaltado de "hoy".
  if (shownYear !== null && todayKey() !== renderedToday) renderCalendar(shownYear);
  const opts = currentTz ? { timeZone: currentTz } : {};
  els.time.textContent = now.toLocaleTimeString("es", { ...opts, hour12: false });
  els.date.textContent = now.toLocaleDateString("es", {
    ...opts, weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  els.zone.textContent = currentTz ? `Zona horaria: ${currentTz}` : "Hora local del equipo";
}

// ---------- Calendario ----------
function todayKey() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    ...(currentTz ? { timeZone: currentTz } : {}), year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
  return parts; // YYYY-MM-DD
}

function renderCalendar(year) {
  els.calendar.replaceChildren();
  const today = todayKey();
  shownYear = year;
  renderedToday = today;

  const monthFmt = new Intl.DateTimeFormat("es", { month: "long" });
  const dowFmt = new Intl.DateTimeFormat("es", { weekday: "narrow" });

  for (let m = 0; m < 12; m++) {
    const box = document.createElement("div");
    box.className = "month";
    const h = document.createElement("h3");
    h.textContent = monthFmt.format(new Date(year, m, 1));
    const grid = document.createElement("div");
    grid.className = "grid";

    // Cabecera lunes..domingo (2024-01-01 fue lunes)
    for (let i = 0; i < 7; i++) {
      const c = document.createElement("div");
      c.className = "dow";
      c.textContent = dowFmt.format(new Date(2024, 0, 1 + i));
      grid.appendChild(c);
    }
    const offset = (new Date(year, m, 1).getDay() + 6) % 7;
    for (let i = 0; i < offset; i++) grid.appendChild(document.createElement("div"));

    const days = new Date(year, m + 1, 0).getDate();
    for (let d = 1; d <= days; d++) {
      const cell = document.createElement("div");
      cell.className = "day";
      cell.textContent = d;
      const key = isoKey(year, m, d);
      const dow = new Date(year, m, d).getDay();
      if (dow === 0 || dow === 6) cell.classList.add("weekend");
      const hs = holidays.get(key);
      if (hs) {
        cell.classList.add("holiday");
        cell.title = hs.map((h) => h.localName === h.name ? h.name : `${h.localName} (${h.name})`).join("\n");
      }
      if (key === today) cell.classList.add("today");
      grid.appendChild(cell);
    }
    box.append(h, grid);
    els.calendar.appendChild(box);
  }
}

function renderList(year) {
  els.list.replaceChildren();
  const fmt = new Intl.DateTimeFormat("es", { weekday: "long", day: "numeric", month: "long" });
  const all = [...holidays.entries()].sort(([a], [b]) => a.localeCompare(b));
  let n = 0;
  for (const [key, hs] of all) {
    const [y, mo, d] = key.split("-").map(Number);
    for (const h of hs) {
      n++;
      const li = document.createElement("li");
      const date = document.createElement("span");
      date.className = "h-date";
      date.textContent = fmt.format(new Date(y, mo - 1, d));
      const name = document.createElement("span");
      name.textContent = h.localName;
      li.append(date, name);
      if (h.name !== h.localName) {
        const en = document.createElement("div");
        en.className = "h-local";
        en.textContent = h.name;
        li.appendChild(en);
      }
      els.list.appendChild(li);
    }
  }
  els.count.textContent = `(${n}) – ${year}`;
}

// ---------- Carga de datos ----------
async function loadHolidays() {
  const code = els.country.value;
  const year = Number(els.year.value);
  if (!/^[A-Z]{2}$/.test(code) || !Number.isInteger(year) || year < 1975 || year > 2075) return;

  const seq = ++loadSeq;
  currentTz = TZ[code];
  tickClock();
  setStatus("Cargando festivos…");
  try {
    const data = await fetchJson(`/PublicHolidays/${year}/${code}`);
    if (seq !== loadSeq) return; // respuesta obsoleta
    holidays = new Map();
    for (const h of data) {
      if (typeof h.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(h.date)) continue;
      if (!holidays.has(h.date)) holidays.set(h.date, []);
      holidays.get(h.date).push({ name: String(h.name), localName: String(h.localName) });
    }
    renderCalendar(year);
    renderList(year);
    setStatus(TZ[code] ? "" : "Zona horaria del país no disponible: se muestra la hora local del equipo.");
  } catch {
    if (seq !== loadSeq) return;
    holidays = new Map();
    renderCalendar(year);
    renderList(year);
    setStatus("No se pudieron cargar los festivos. Intenta de nuevo más tarde.", true);
  }
}

async function init() {
  els.year.value = new Date().getFullYear();
  selectedTz = loadSelectedTz();
  els.worldAdd.addEventListener("click", addWorldClock);
  buildWorldClock();
  tickClock();
  setInterval(tickClock, 1000);

  try {
    const countries = await fetchJson("/AvailableCountries");
    const names = new Intl.DisplayNames(["es"], { type: "region" });
    const opts = countries
      .filter((c) => /^[A-Z]{2}$/.test(c.countryCode))
      .map((c) => ({ code: c.countryCode, label: names.of(c.countryCode) || c.name }))
      .sort((a, b) => a.label.localeCompare(b.label, "es"));

    els.country.replaceChildren();
    for (const o of opts) {
      const opt = document.createElement("option");
      opt.value = o.code;
      opt.textContent = o.label;
      els.country.appendChild(opt);
    }
    const lang = (navigator.language || "").split("-")[1];
    els.country.value = opts.some((o) => o.code === lang) ? lang : (opts.find((o) => o.code === "MX") ? "MX" : opts[0].code);
    els.country.disabled = false;
    els.country.addEventListener("change", loadHolidays);
    els.year.addEventListener("change", loadHolidays);
    await loadHolidays();
  } catch {
    setStatus("No se pudo cargar la lista de países. Revisa tu conexión.", true);
  }
}

init();
