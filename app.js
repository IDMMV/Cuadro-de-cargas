import {
  initGoogleAuth,
  loginWithGoogle,
  logoutGoogle,
  exportToGoogleSheets,
  generateAppsScriptCode,
  getCurrentUser,
  fetchCalendarEvents,
  createCalendarEvent
} from './googleSheets.js';

const KEY = "hugo_cargas_v2";
const T = 0.6545;

const measuredOperational = [
  ["Piso 3", "TV MIRAY 43 MS43-E201", "Standby / Reposo", 29.31, "mA", "UT251C+", "LECTURA PINZA", "Prueba en frío / Standby", 6.45, 70, "Lectura reportada en reposo (Standby).", 3],
  ["Piso 3", "TV MIRAY 43 MS43-E201", "Funcionamiento", 394, "mA", "UT251C+", "LECTURA PINZA", "Prueba en caliente (Plena carga)", 86.68, 70, "VA de referencia; potencia activa 70 W.", 3],
  ["Piso 3", "PS5", "Standby / Reposo", 16.05, "mA", "UT251C+", "LECTURA PINZA", "Prueba en frío / Standby", 3.53, 216.8, "Corriente en modo reposo.", 2],
  ["Piso 3", "PS5", "Funcionamiento", 985.4, "mA", "UT251C+", "LECTURA PINZA", "Prueba en caliente (Plena carga)", 216.8, 216.8, "Consumo activo en juego.", 2],
  ["Piso 1", "Refrigeradora Samsung RT38K5930S8", "Standby / Reposo", 122.4, "mA", "UT251C+", "LECTURA PINZA", "Prueba en frío / Standby", 26.93, 33.6, "Compresor en reposo entre ciclos.", 24],
  ["Piso 1", "Refrigeradora Samsung RT38K5930S8", "Funcionamiento", 650.0, "mA", "UT251C+", "LECTURA PINZA", "Prueba en caliente (Plena carga)", 143.0, 140.0, "Compresor encendido a plena carga.", 24],
  ["Piso 1", "Congelador Miray CMV-380HF", "Standby / Reposo", 115.0, "mA", "UT251C+", "LECTURA PINZA", "Prueba en frío / Standby", 25.30, 32.6, "Modo reposo.", 24],
  ["Piso 1", "Congelador Miray CMV-380HF", "Funcionamiento", 580.0, "mA", "UT251C+", "LECTURA PINZA", "Prueba en caliente (Plena carga)", 127.6, 130.0, "Arranque y congelación activa.", 24],
  ["Piso 2", "Terma a gas Aghaso TER-AGH011", "Standby / Reposo", 10.98, "mA", "UT251C+", "LECTURA PINZA", "Prueba en frío / Standby", 2.42, 5, "Display auxiliar en reposo.", 0.2],
  ["Piso 2", "Terma a gas Aghaso TER-AGH011", "Funcionamiento", 122.0, "mA", "UT251C+", "LECTURA PINZA", "Prueba en caliente (Plena carga)", 26.84, 5, "Chispero y ventilación auxiliar.", 0.2],
  ["Piso 1", "Termo Miray TME-52", "Standby / Reposo", 6.52, "mA", "UT251C+", "LECTURA PINZA", "Prueba en frío / Standby", 1.43, 750, "Corriente en reposo / mantención.", 0.5],
  ["Piso 1", "Termo Miray TME-52", "Funcionamiento", 3409.0, "mA", "UT251C+", "LECTURA PINZA", "Prueba en caliente (Plena carga)", 750.0, 750, "Calentamiento activo (ebullición).", 0.5],
  ["Piso 3", "Módem/router", "Standby / Reposo", 45.7, "mA", "UT251C+", "LECTURA PINZA", "Prueba en frío / Standby", 10.05, 8, "Módem en reposo nocturno.", 24],
  ["Piso 3", "Módem/router", "Funcionamiento", 85.0, "mA", "UT251C+", "LECTURA PINZA", "Prueba en caliente (Plena carga)", 18.7, 8, "Módem con tráfico de datos activo.", 24],
  ["Piso 2", "PC Lenovo AIO", "Standby / Reposo", 25.0, "mA", "UT251C+", "LECTURA PINZA", "Prueba en frío / Standby", 5.5, 90, "PC suspendida en standby.", 3],
  ["Piso 2", "PC Lenovo AIO", "Funcionamiento", 409.0, "mA", "UT251C+", "LECTURA PINZA", "Prueba en caliente (Plena carga)", 90.0, 90, "PC en uso activo.", 3]
];

const initialLeaks = [
  ["Piso 1", "Acometida General", "Prueba aislamiento diferencial", 0.895, "UT251C+", "30.0 mA", "BAJO", "Fuga normal en parámetros."],
  ["Piso 1", "C-1 Iluminación", "Prueba circuito alumbrado", 0.430, "UT251C+", "30.0 mA", "BAJO", "Aislamiento en buen estado."],
  ["Piso 1", "C-2 Tomacorrientes", "Prueba circuito tomacorrientes", 0.495, "UT251C+", "30.0 mA", "BAJO", "Aislamiento en buen estado."],
  ["Piso 2", "Sub-tablero General", "Prueba aislamiento diferencial", 0.635, "UT251C+", "30.0 mA", "BAJO", "Fuga dentro de límites."],
  ["Piso 2", "C-1 Iluminación", "Prueba circuito alumbrado", 0.285, "UT251C+", "30.0 mA", "BAJO", "Aislamiento en buen estado."],
  ["Piso 2", "C-2 Tomacorrientes", "Prueba circuito tomacorrientes", 0.386, "UT251C+", "30.0 mA", "BAJO", "Aislamiento en buen estado."],
  ["Piso 3", "Sub-tablero General", "Prueba aislamiento diferencial", 0.450, "UT251C+", "30.0 mA", "BAJO", "Fuga aceptable."],
  ["Piso 3", "C-1 Iluminación", "Prueba circuito alumbrado", 0.201, "UT251C+", "30.0 mA", "BAJO", "Aislamiento en buen estado."],
  ["Piso 3", "C-2 Tomacorrientes", "Prueba circuito tomacorrientes", 0.219, "UT251C+", "30.0 mA", "BAJO", "Aislamiento en buen estado."],
  ["Acometida General", "Acometida General", "Medición general acometida", 1.790, "UT251C+", "30.0 mA", "SEGURO", "Fuga total 1.79 mA."]
];

const initialAgenda = [
  { id: 1, p: "Piso 1", t: "Prueba mensual botón TEST de Interruptor Diferencial (30 mA)", type: "Prueba Botón Test ID", date: "2026-10-15", time: "09:00", resp: "Ing. Proyectista CIP", freq: "Mensual", st: "Pendiente", notes: "Verificar disparo automático (<30ms) en ID." },
  { id: 2, p: "Piso 2", t: "Inspección y medición de fugas en tomacorrientes", type: "Inspección de Fugas mA", date: "2026-10-20", time: "10:30", resp: "Hugo / Inspector", freq: "Trimestral", st: "Pendiente", notes: "Monitorear con pinza UT251C+." },
  { id: 3, p: "Piso 1", t: "Mantenimiento preventivo Tablero General TG-1", type: "Mantenimiento Preventivo Tablero", date: "2026-11-01", time: "11:00", resp: "Técnico Electricista", freq: "Semestral", st: "Pendiente", notes: "Ajuste de pernos en llaves e ITM." },
  { id: 4, p: "Exteriores / Servicios", t: "Medición de resistencia de Pozo a Tierra", type: "Medición Pozo a Tierra", date: "2026-12-10", time: "08:00", resp: "Ing. Proyectista CIP", freq: "Anual", st: "Pendiente", notes: "Verificar resistencia R < 25 Ohmios (CNE)." }
];

// Presets: [Ubicación, Nombre, Cant, W_activo, V, Fase, FP, FD, h_activo, mA_reposo, fixedKwh, DatoSpec]
const preset = [
  ["Piso 1", "Refrigeradora Samsung RT38K5930S8", 1, 33.6, 220, "1F", .95, 1, 24.0, 122.4, 24.17, "ETIQUETA (290 kWh/año)"],
  ["Piso 1", "Congelador Miray CMV-380HF", 1, 32.6, 220, "1F", .95, 1, 24.0, 115.0, 23.50, "ETIQUETA (282 kWh/año)"],
  ["Piso 1", "Termo hervidor Miray TME-52", 1, 750, 220, "1F", .99, 1, .5, 6.52, "", "PLACA + STANDBY (6.52mA)"],
  ["Piso 1", "Cocina + horno Aghaso (chispero/display)", 1, 5, 220, "1F", .95, 1, .3, 5.0, "", "ESTIMADO"],
  ["Piso 1", "TV MIRAY QLED 85 MQ85-E2000GBT", 1, 300, 220, "1F", .90, 1, 10, 25.0, "", "ESTIMADO + STANDBY"],
  ["Piso 1", "TV MIRAY 32", 1, 55, 220, "1F", .90, 1, 4, 15.0, "", "REFERENCIA"],
  ["Piso 1", "Campana extractora", 1, 150, 220, "1F", .85, .8, .5, 3.0, "", "ESTIMADO"],
  ["Piso 1", "Microondas", 1, 1000, 220, "1F", .95, .7, .25, 15.0, "", "ESTIMADO + STANDBY"],
  ["Piso 1", "Iluminación sala/comedor", 4, 12, 220, "1F", .95, 1, 5.5, 0, "", "DATO USUARIO"],
  ["Piso 1", "Transformador + TV box", 1, 15, 220, "1F", .90, 1, 24, 45.0, "", "ESTIMADO"],
  ["Piso 2", "PC Lenovo AIO", 1, 90, 220, "1F", .95, .8, 3, 25.0, "", "PLACA + DATO USUARIO"],
  ["Piso 2", "Lavadora Samsung WA19T6260BV", 1, 900, 220, "1F", .85, 1, .38, 10.0, 15.6, "CICLOS / EDITABLE"],
  ["Piso 2", "Secadora a gas", 1, 5, 220, "1F", .90, 1, .57, 5.0, "", "ESTIMADO"],
  ["Piso 2", "Terma a gas Aghaso TER-AGH011", 1, 5, 220, "1F", .90, 1, .2, 10.98, "", "PLACA + STANDBY (10.98mA)"],
  ["Piso 2", "Impresora Brother DCP-T710W", 1, 3, 220, "1F", .80, 1, 1, 12.0, "", "ESTIMADO + PLACA"],
  ["Piso 2", "TV LG 55 55UM7100PSA", 1, 140, 220, "1F", .90, 1, .86, 20.0, "", "CONFIRMADO / PLACA"],
  ["Piso 2", "Focos 2do piso", 4, 12, 220, "1F", .95, 1, 2, 0, "", "DATO USUARIO"],
  ["Piso 2", "Ventilador", 1, 60, 220, "1F", .85, .8, .28, 0, "", "ESTIMADO"],
  ["Piso 3", "TV MIRAY QLED 85 MQ85-E2000GBT", 1, 300, 220, "1F", .90, 1, 3, 25.0, "", "ESTIMADO + STANDBY"],
  ["Piso 3", "TV MIRAY 43 MS43-E201", 1, 70, 220, "1F", .90, 1, 3, 29.31, "", "CONFIRMADO / STANDBY (29.3mA)"],
  ["Piso 3", "Cámaras EZVIZ CS-H6c", 4, 5, 220, "1F", .90, 1, 24, 0, "", "CONFIRMADO / PLACA"],
  ["Piso 3", "Módems/routers", 5, 8, 220, "1F", .90, 1, 24, 45.7, "", "ESTIMADO + DATO USUARIO"],
  ["Piso 3", "Focos 3er piso", 4, 12, 220, "1F", .95, 1, 2, 0, "", "ESTIMADO"],
  ["Piso 3", "PS5", 1, 216.8, 220, "1F", .95, 1, 2, 16.05, "", "REFERENCIA OFICIAL + STANDBY"],
  ["Piso 3", "Plancha Oster GCSTC5000-053", 1, 2200, 220, "1F", .98, 1, .107, 0, "", "PLACA + ESTIMADO"],
  ["Piso 3", "Lámpara emergencia LED HALUX", 1, 3, 220, "1F", .90, 1, 24, 0, "", "ESTIMADO"],
  ["Piso 3", "Reloj de pared LED", 1, 3, 220, "1F", .90, 1, 24, 0, "", "ESTIMADO"]
];

let S = {
  p: { v: 220, sys: "3F", tar: T, days: 30, area: 360, bill: 331 },
  a: [],
  m: measuredOperational.map(x => ({ p: x[0], e: x[1], s: x[2], r: x[3], u: x[4], i: x[5], t: x[6], c: x[7], va: x[8], pw: x[9], o: x[10], ha: x[11] ?? 8 })),
  f: initialLeaks.map(x => ({ p: x[0], z: x[1], c: x[2], r: x[3], i: x[4], u: x[5], n: x[6], o: x[7] })),
  agenda: JSON.parse(JSON.stringify(initialAgenda)),
  recPct: {}
};

function init() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) {
      S = JSON.parse(saved);
      // Migrate saved items to ensure all fields are editable and remove old lock flags
      if (Array.isArray(S.a)) {
        S.a.forEach(item => {
          delete item.isAuditRecord;
          delete item.fromMeas;
          if (item.ir === undefined || item.ir === null) {
            const match = preset.find(p => p[1] === item.n);
            item.ir = match ? match[9] : 0;
          } else if (+item.ir > 1000) {
            // Fix corrupted values (e.g., 100000 mA -> 100 mA, or reset to preset default)
            const match = preset.find(p => p[1] === item.n);
            item.ir = match ? match[9] : (+item.ir / 1000);
          }
        });
      }
      if (!Array.isArray(S.agenda) || !S.agenda.length) {
        S.agenda = JSON.parse(JSON.stringify(initialAgenda));
      }
      if (Array.isArray(S.m)) {
        S.m.forEach((m, idx) => {
          if (!m.p && measuredOperational[idx]) m.p = measuredOperational[idx][0];
          if (!m.c && measuredOperational[idx]) m.c = measuredOperational[idx][7];
        });
      }
      if (Array.isArray(S.f)) {
        S.f.forEach((f, idx) => {
          if (!f.p && initialLeaks[idx]) f.p = initialLeaks[idx][0];
        });
      }
    }
  } catch (e) {}

  if (!S.recPct) S.recPct = {};
  if (!Array.isArray(S.agenda) || !S.agenda.length) {
    S.agenda = JSON.parse(JSON.stringify(initialAgenda));
  }
  if (!Array.isArray(S.m) || !S.m.length) {
    S.m = measuredOperational.map(x => ({ p: x[0], e: x[1], s: x[2], r: x[3], u: x[4], i: x[5], t: x[6], c: x[7], va: x[8], pw: x[9], o: x[10] }));
  }
  if (!Array.isArray(S.f) || !S.f.length) {
    S.f = initialLeaks.map(x => ({ p: x[0], z: x[1], c: x[2], r: x[3], i: x[4], u: x[5], n: x[6], o: x[7] }));
  }
  if (!S.a || !S.a.length) restore();

  bind();
  draw();

  // Set default calendar date picker to tomorrow
  const calDateInput = document.getElementById('calDate');
  const agDateInput = document.getElementById('agDate');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  if (calDateInput) calDateInput.value = tomorrowStr;
  if (agDateInput) agDateInput.value = tomorrowStr;

  document.querySelectorAll(".tab").forEach(x => {
    x.onclick = () => tab(x.dataset.tab);
  });

  // Init Google Auth
  initGoogleAuth((user, token) => {
    updateAuthUI(user);
    if (user) {
      handleRefreshCalendarEvents();
    }
  });
}

function restore() {
  S.recPct = {};
  S.a = preset.map(x => ({
    r: x[0], n: x[1], q: x[2], w: x[3], v: x[4], f: x[5], pf: x[6], fd: x[7], h: x[8], ir: x[9], fixed: x[10], d: x[11], fromMeas: false
  }));
  S.m = measuredOperational.map(x => ({ p: x[0], e: x[1], s: x[2], r: x[3], u: x[4], i: x[5], t: x[6], c: x[7], va: x[8], pw: x[9], o: x[10] }));
  S.f = initialLeaks.map(x => ({ p: x[0], z: x[1], c: x[2], r: x[3], i: x[4], u: x[5], n: x[6], o: x[7] }));
  S.agenda = JSON.parse(JSON.stringify(initialAgenda));
  save();
  draw();
  showToast("Datos reales de cálculo, mediciones, fugas y agenda CNE restaurados");
}

function bind() {
  ["voltage", "system", "tariff", "days", "area", "bill"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.oninput = () => {
        let k = { voltage: "v", system: "sys", tariff: "tar", days: "days", area: "area", bill: "bill" }[id];
        S.p[k] = id === "system" ? el.value : +el.value;
        save();
        draw();
      };
    }
  });
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(S));
}

function tab(id) {
  document.querySelectorAll(".page").forEach(x => x.classList.remove("active"));
  document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
  const targetPage = document.getElementById(id);
  const targetTab = document.querySelector('[data-tab="' + id + '"]');
  if (targetPage) targetPage.classList.add("active");
  if (targetTab) targetTab.classList.add("active");
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function calc(x) {
  let q = +x.q || 1, h = +x.h || 0, d = S.p.days || 30, pf = Math.max(.01, +x.pf || 1), fd = +x.fd || 0, v = +x.v || S.p.v || 220;
  let w = +x.w || 0;
  let ir = +x.ir || 0; // Standby current in mA

  if ((!w || w === 0) && x.fixed !== "" && x.fixed != null && +x.fixed > 0 && h > 0) {
    w = (+x.fixed * 1000) / (h * d * q);
    x.w = +w.toFixed(1);
  }

  let inst = w * q;
  let kActive = (inst * h * d) / 1000;

  // Standby calculation
  let hStandby = Math.max(0, 24 - h);
  let wStandby = (v * ir) / 1000; // Power in Watts from standby mA
  let kStandby = (wStandby * q * hStandby * d) / 1000;

  let kTotal = (x.fixed !== "" && x.fixed != null && x.fixed !== undefined && x.fixed !== "") 
    ? +x.fixed 
    : (kActive + kStandby);

  let tar = S.p.tar || 0.6545;
  let costTotal = kTotal * tar;
  let costActive = kActive * tar;
  let costStandby = kStandby * tar;

  let I = x.f === "3F" ? inst / (Math.sqrt(3) * v * pf) : inst / (v * pf);

  return {
    inst,
    k: kTotal,
    kActive,
    kStandby,
    cost: costTotal,
    costActive,
    costStandby,
    demand: inst * fd / 1000,
    I,
    wStandby,
    hStandby
  };
}

function esc(v) {
  return String(v ?? "").replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function edit(i, k, v) {
  if (!S.a[i]) return;

  if (["w", "h", "ir", "q", "pf", "v"].includes(k)) {
    S.a[i].fixed = "";
  }

  S.a[i][k] = (k === "r" || k === "n" || k === "f" || k === "d" || k === "fixed") ? v : (v === "" ? "" : +v);
  save();

  const activeEl = document.activeElement;
  const isTypingInTable = activeEl && activeEl.closest("#loadTable");

  if (isTypingInTable) {
    const tr = document.querySelector(`#loadTable tr[data-row="${i}"]`);
    if (tr) {
      let c = calc(S.a[i]);
      const elI = tr.querySelector(".col-i");
      const elMd = tr.querySelector(".col-md");
      const elKwh = tr.querySelector(".col-kwh");
      const elCost = tr.querySelector(".col-cost");

      if (elI) elI.textContent = c.I.toFixed(2) + " A";
      if (elMd) elMd.textContent = c.demand.toFixed(2);
      if (elKwh) elKwh.innerHTML = `<b>${c.k.toFixed(2)}</b>`;
      if (elCost) elCost.textContent = `S/ ${c.cost.toFixed(2)}`;
    }
    drawDash();
    drawAnalysis();
    drawRecommendations();
  } else {
    draw();
  }
}

function field(i, k) {
  let x = S.a[i];
  let val = x[k] ?? "";
  const extraStyle = k === "n" ? 'style="min-width:250px; width:100%;"' : '';
  return `<input value="${esc(val)}" ${extraStyle} oninput="window.edit(${i},'${k}',this.value)">`;
}

function mfield(i, k) {
  const extraStyle = k === "e" ? 'style="min-width:230px; width:100%;"' : '';
  return `<input value="${esc(S.m[i][k])}" ${extraStyle} oninput="window.mf(${i},'${k}',this.value)">`;
}

function mf(i, k, v) {
  if (!S.m[i]) return;
  S.m[i][k] = (k === 'ha' || k === 'r' || k === 'va' || k === 'pw') ? (v === "" ? "" : +v) : v;

  // Sync with Cuadro de Cargas if equipment name or active hours or reading changes
  if (S.m[i] && S.m[i].e) {
    const equipName = S.m[i].e.trim().toLowerCase();
    const loadItem = S.a.find(a => (a.n || '').trim().toLowerCase() === equipName);
    if (loadItem) {
      if (k === 'ha') {
        loadItem.h = +v;
      } else if (k === 'r') {
        if (S.m[i].s && (S.m[i].s.toLowerCase().includes('standby') || S.m[i].s.toLowerCase().includes('reposo')) || S.m[i].u === 'mA') {
          loadItem.ir = +v;
        }
      }
    }
  }

  save();

  const activeEl = document.activeElement;
  const isTypingInTable = activeEl && activeEl.closest("#measurementsTable");

  if (isTypingInTable) {
    if (k === 'ha') {
      const tr = activeEl.closest("tr");
      if (tr) {
        const elHr = tr.querySelector(".col-hr");
        if (elHr) {
          const hrVal = Math.max(0, 24 - (+v || 0));
          elHr.textContent = hrVal.toFixed(1) + " h";
        }
      }
    }
    drawDash();
    drawAnalysis();
    drawRecommendations();
  } else {
    draw();
  }
}

function lfield(i, k) {
  return `<input value="${esc(S.f[i][k])}" oninput="window.lf(${i},'${k}',this.value)">`;
}

function lf(i, k, v) {
  S.f[i][k] = (k === 'r') ? (v === "" ? "" : +v) : v;
  save();

  const activeEl = document.activeElement;
  const isTypingInTable = activeEl && activeEl.closest("#leakTable");

  if (isTypingInTable) {
    drawLeaks();
  } else {
    draw();
  }
}

function draw() {
  ["voltage", "system", "tariff", "days", "area", "bill"].forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) el.value = [S.p.v, S.p.sys, S.p.tar, S.p.days, S.p.area, S.p.bill][i];
  });

  filterLoads();
  drawMeasurements();
  drawLeaks();
  drawAgenda();
  drawDash();
  drawAnalysis();
  drawRecommendations();
}

function filterLoads() {
  const loc = document.getElementById('locationFilter')?.value || 'ALL';
  const search = document.getElementById('loadSearch')?.value?.toLowerCase() || '';

  const tb = document.querySelector("#loadTable tbody");
  if (!tb) return;

  const filtered = S.a.map((x, i) => ({ x, i })).filter(({ x }) => {
    const matchLoc = loc === 'ALL' || x.r === loc;
    const matchSearch = !search || (x.n || '').toLowerCase().includes(search) || (x.r || '').toLowerCase().includes(search);
    return matchLoc && matchSearch;
  });

  tb.innerHTML = filtered.map(({ x, i }) => {
    let c = calc(x);
    // Only lock equipment name if explicitly synced from field measurement log
    const isFromMeasurement = x.fromMeas === true;

    return `<tr data-row="${i}">` +
      '<td>' + field(i, "r") + '</td>' +
      '<td>' + (isFromMeasurement 
        ? `<input value="${esc(x.n)}" disabled style="background:#f1f5f9; font-weight:700; color:#0f172a; min-width:250px; width:100%; border:1px solid #cbd5e1; cursor:not-allowed;" title="🔒 Registro Sincronizado de Mediciones">` 
        : field(i, "n")) + '</td>' +
      '<td>' + field(i, "q") + '</td>' +
      '<td>' + field(i, "w") + '</td>' +
      '<td>' + field(i, "v") + '</td>' +
      '<td><select style="padding:4px 6px; border-radius:4px; border:1px solid var(--border-color); font-size:12px;" onchange="window.edit(' + i + ',\'f\',this.value)"><option ' + (x.f === "1F" ? "selected" : "") + '>1F</option><option ' + (x.f === "3F" ? "selected" : "") + '>3F</option></select></td>' +
      '<td>' + field(i, "pf") + '</td>' +
      '<td>' + field(i, "fd") + '</td>' +
      '<td class="col-i" style="font-weight:700; color:#4c1d95; background:#f5f3ff;" title="Corriente de diseño calculada">' + c.I.toFixed(2) + ' A</td>' +
      '<td class="col-md">' + c.demand.toFixed(2) + '</td>' +
      '<td>' + field(i, "h") + '</td>' +
      '<td>' + field(i, "ir") + '</td>' +
      '<td class="col-kwh"><b>' + c.k.toFixed(2) + '</b></td>' +
      '<td class="col-cost" style="font-weight:700; color:#047857; background:#f0fdf4;">S/ ' + c.cost.toFixed(2) + '</td>' +
      '<td>' + field(i, "d") + '</td>' +
      '<td><button class="danger sm" onclick="window.deleteLoad(' + i + ')" title="Eliminar registro">×</button></td>' +
    '</tr>';
  }).join("");
}

function deleteLoad(i) {
  S.a.splice(i, 1);
  save();
  draw();
  showToast("Equipo eliminado");
}

function drawMeasurements() {
  let tb = document.querySelector("#measurementsTable tbody");
  if (!tb) return;

  const floors = ["Piso 1", "Piso 2", "Piso 3", "Exteriores / Servicios", "Acometida General", "Sub-tablero General"];
  const units = ["mA", "A", "V", "W"];
  const instruments = ["UT251C+", "Multímetro Digital", "Pinza Fluke", "Telurómetro"];
  const types = ["LECTURA PINZA", "LECTURA REPORTADA", "LECTURA DIRECTA", "LECTURA ANTERIOR"];

  tb.innerHTML = S.m.map((m, i) => {
    const sVal = m.s || 'Normal';
    const pVal = m.p || 'Piso 1';
    const uVal = m.u || 'mA';
    const iVal = m.i || 'UT251C+';
    const tVal = m.t || 'LECTURA PINZA';

    return '<tr data-mrow="' + i + '">' +
      '<td>' +
        '<select style="padding:4px 6px; border-radius:4px; border:1px solid var(--border-color); font-size:12px;" onchange="window.mf(' + i + ',\'p\',this.value)">' +
          floors.map(f => `<option value="${f}" ${f === pVal ? 'selected' : ''}>${f}</option>`).join('') +
        '</select>' +
      '</td>' +
      '<td>' + mfield(i, "e") + '</td>' +
      '<td>' +
        '<select style="padding:4px 6px; border-radius:4px; border:1px solid var(--border-color); font-size:12px; font-weight:600;" onchange="window.mf(' + i + ',\'s\',this.value)">' +
          '<option value="Funcionamiento" ' + (sVal === "Funcionamiento" ? "selected" : "") + '>⚡ Funcionamiento (Activo)</option>' +
          '<option value="Standby / Reposo" ' + (sVal.toLowerCase().includes("standby") || sVal.toLowerCase().includes("reposo") ? "selected" : "") + '>💤 Standby / Reposo</option>' +
          '<option value="Prueba en caliente" ' + (sVal.toLowerCase().includes("caliente") ? "selected" : "") + '>🔥 Prueba en caliente</option>' +
          '<option value="Normal" ' + (sVal === "Normal" ? "selected" : "") + '>🟢 Normal</option>' +
        '</select>' +
      '</td>' +
      '<td>' + mfield(i, "r") + '</td>' +
      '<td>' +
        '<select style="padding:4px 6px; border-radius:4px; border:1px solid var(--border-color); font-size:12px;" onchange="window.mf(' + i + ',\'u\',this.value)">' +
          units.map(u => `<option value="${u}" ${u === uVal ? 'selected' : ''}>${u}</option>`).join('') +
        '</select>' +
      '</td>' +
      '<td>' +
        '<select style="padding:4px 6px; border-radius:4px; border:1px solid var(--border-color); font-size:12px;" onchange="window.mf(' + i + ',\'i\',this.value)">' +
          instruments.map(inst => `<option value="${inst}" ${inst === iVal ? 'selected' : ''}>${inst}</option>`).join('') +
        '</select>' +
      '</td>' +
      '<td>' +
        '<select style="padding:4px 6px; border-radius:4px; border:1px solid var(--border-color); font-size:12px;" onchange="window.mf(' + i + ',\'t\',this.value)">' +
          types.map(t => `<option value="${t}" ${t === tVal ? 'selected' : ''}>${t}</option>`).join('') +
        '</select>' +
      '</td>' +
      '<td>' + ((+m.va || 0) ? (+m.va).toFixed(2) : "—") + '</td>' +
      '<td>' + ((+m.pw || 0) ? (+m.pw).toFixed(2) : "—") + '</td>' +
      '<td>' + mfield(i, "o") + '</td>' +
      '<td><button class="danger sm" onclick="window.deleteMeasurement(' + i + ')">×</button></td>' +
    '</tr>';
  }).join("");
}

function drawLeaks() {
  let tb = document.querySelector("#leakTable tbody");
  if (!tb) return;

  const floors = ["Piso 1", "Piso 2", "Piso 3", "Exteriores / Servicios", "Acometida General", "Sub-tablero General"];
  const circuits = ["Acometida General", "C-1 Iluminación", "C-2 Tomacorrientes", "C-3 Fuerza / Termo", "C-4 Cocina", "Sub-tablero General", "Tablero Principal"];
  const insts = ["UT251C+", "Fluke 368", "Telurómetro", "Multímetro Digital"];
  const thresholds = ["30.0 mA", "10.0 mA", "100.0 mA", "300.0 mA"];
  const risks = ["SEGURO", "BAJO", "TOLERABLE", "PELIGROSO", "CRÍTICO"];

  tb.innerHTML = S.f.map((f, i) => {
    const isTotal = (f.z || '').toLowerCase().includes('total') || (f.p || '').toLowerCase().includes('acometida');
    const pVal = f.p || 'Piso 1';
    const zVal = f.z || 'Acometida General';
    const iVal = f.i || 'UT251C+';
    const uVal = f.u || '30.0 mA';
    const nVal = f.n || 'BAJO';

    return `<tr style="${isTotal ? 'background:#fef2f2; font-weight:700;' : ''}">
      <td>
        <select style="padding:4px 6px; border-radius:4px; border:1px solid var(--border-color); font-size:12px;" onchange="window.lf(${i},'p',this.value)">
          ${floors.map(fl => `<option value="${fl}" ${fl === pVal ? 'selected' : ''}>${fl}</option>`).join('')}
        </select>
      </td>
      <td>
        <select style="padding:4px 6px; border-radius:4px; border:1px solid var(--border-color); font-size:12px;" onchange="window.lf(${i},'z',this.value)">
          ${circuits.map(ck => `<option value="${ck}" ${ck === zVal ? 'selected' : ''}>${ck}</option>`).join('')}
        </select>
      </td>
      <td><b>${lfield(i, 'r')} mA</b></td>
      <td>
        <select style="padding:4px 6px; border-radius:4px; border:1px solid var(--border-color); font-size:12px;" onchange="window.lf(${i},'i',this.value)">
          ${insts.map(it => `<option value="${it}" ${it === iVal ? 'selected' : ''}>${it}</option>`).join('')}
        </select>
      </td>
      <td>
        <select style="padding:4px 6px; border-radius:4px; border:1px solid var(--border-color); font-size:12px;" onchange="window.lf(${i},'u',this.value)">
          ${thresholds.map(th => `<option value="${th}" ${th === uVal ? 'selected' : ''}>${th}</option>`).join('')}
        </select>
      </td>
      <td>
        <select style="padding:4px 6px; border-radius:4px; border:1px solid var(--border-color); font-size:12px; font-weight:700;" onchange="window.lf(${i},'n',this.value)">
          ${risks.map(rk => `<option value="${rk}" ${rk === nVal ? 'selected' : ''}>${rk}</option>`).join('')}
        </select>
      </td>
      <td>${lfield(i, 'o')}</td>
      <td><button class="danger sm" onclick="window.deleteLeakMeasurement(${i})">×</button></td>
    </tr>`;
  }).join("");

  // Dynamic leak KPI calculation
  const totalLeakRow = S.f.find(x => (x.z || '').toLowerCase().includes('fuga total') || (x.z || '').toLowerCase().includes('total vivienda'));
  let totalVal = totalLeakRow ? +totalLeakRow.r : S.f.reduce((acc, curr) => acc + (+curr.r || 0), 0);
  if (isNaN(totalVal) || totalVal <= 0) totalVal = 1.79;

  const elTotalLeak = document.getElementById("leakTotalKpi");
  const elMarginKpi = document.getElementById("leakMarginKpi");
  const elStatusKpi = document.getElementById("leakStatusKpi");
  const elDynamicAnalysis = document.getElementById("leakDynamicAnalysis");

  if (elTotalLeak) elTotalLeak.textContent = totalVal.toFixed(2) + " mA";
  if (elMarginKpi) elMarginKpi.textContent = (((30 - totalVal) / 30) * 100).toFixed(2) + " %";
  if (elStatusKpi) {
    if (totalVal >= 30) {
      elStatusKpi.style.color = "#b91c1c";
      elStatusKpi.textContent = "🚨 CRÍTICO (≥ 30 mA)";
    } else if (totalVal >= 10) {
      elStatusKpi.style.color = "#b45309";
      elStatusKpi.textContent = "⚠️ ADVERTENCIA (≥ 10 mA)";
    } else {
      elStatusKpi.style.color = "#047857";
      elStatusKpi.textContent = "✅ SEGURO (< 30 mA)";
    }
  }

  if (elDynamicAnalysis) {
    let effectText = "";
    if (totalVal < 0.5) {
      effectText = "El valor acumulado de <b>" + totalVal.toFixed(2) + " mA</b> es inofensivo e imperceptible para la piel (< 0.5 mA). Operación 100% segura.";
    } else if (totalVal <= 3.0) {
      effectText = "El valor acumulado medido con la pinza UT251C+ en la acometida es de <b>" + totalVal.toFixed(2) + " mA</b>. En caso de contacto indirecto accidental, la persona experimentaría como máximo una ligera sensación de <i>cosquilleo o hormigueo en la piel</i> (umbral de reacción de 0.5 a 3.0 mA), sin dolor ni parálisis muscular. Situado con un margen de seguridad del " + (((30 - totalVal) / 30) * 100).toFixed(1) + "% frente al umbral de disparo del interruptor diferencial (30 mA).";
    } else if (totalVal <= 10.0) {
      effectText = "El valor acumulado de <b>" + totalVal.toFixed(2) + " mA</b> se ubica en el rango de <i>sacudida muscular y choque molesto</i> (3.0 a 10.0 mA). La persona aún conserva el control motriz voluntario para soltar el conductor. Se recomienda revisar aislamientos.";
    } else {
      effectText = "<b>ALERTA DE SEGURIDAD ELÉCTRICA:</b> El valor acumulado de <b>" + totalVal.toFixed(2) + " mA</b> supera el umbral de 10 mA, pudiendo provocar <i>contracción muscular involuntaria (tetanización)</i> con incapacidad de soltar el conductor por sí mismo. Requiere mantenimiento inmediato del circuito.";
    }
    elDynamicAnalysis.innerHTML = effectText;
  }

  // Dynamically update physiological table row highlighting
  let activeRowId = 2; // Default for 1.79 mA (0.5 to 3.0 mA)
  if (totalVal < 0.5) activeRowId = 1;
  else if (totalVal <= 3.0) activeRowId = 2;
  else if (totalVal <= 10.0) activeRowId = 3;
  else if (totalVal <= 30.0) activeRowId = 4;
  else if (totalVal <= 50.0) activeRowId = 5;
  else activeRowId = 6;

  [1, 2, 3, 4, 5, 6].forEach(num => {
    const r = document.getElementById("physioRow" + num);
    if (r) {
      if (num === activeRowId) {
        r.style.background = num === 6 ? "#7f1d1d" : num >= 4 ? "#fffbeb" : "#ecfdf5";
        r.style.fontWeight = "600";
        const badgeSpan = r.querySelector(".physio-badge");
        if (badgeSpan) {
          badgeSpan.textContent = `📍 Total Vivienda: ${totalVal.toFixed(2)} mA`;
        }
      } else {
        r.style.background = num === 6 ? "#7f1d1d" : "transparent";
        r.style.fontWeight = "normal";
        const badgeSpan = r.querySelector(".physio-badge");
        if (badgeSpan) {
          badgeSpan.remove();
        }
      }
    }
  });
}

function drawAgenda() {
  const tb = document.querySelector("#agendaTable tbody");
  if (!tb) return;

  if (!Array.isArray(S.agenda)) S.agenda = JSON.parse(JSON.stringify(initialAgenda));

  const pFilter = document.getElementById("agPisoFilter")?.value || "ALL";
  const sFilter = document.getElementById("agStatusFilter")?.value || "ALL";

  const filtered = S.agenda.filter(item => {
    const matchP = pFilter === "ALL" || item.p === pFilter;
    const matchS = sFilter === "ALL" || item.st === sFilter;
    return matchP && matchS;
  });

  const totalCount = S.agenda.length;
  const pendingCount = S.agenda.filter(x => x.st === "Pendiente").length;
  const completedCount = S.agenda.filter(x => x.st === "Completado").length;
  const compliancePct = totalCount ? Math.round((completedCount / totalCount) * 100) : 100;

  const elTot = document.getElementById("agendaTotalKpi");
  const elPen = document.getElementById("agendaPendingKpi");
  const elCom = document.getElementById("agendaCompletedKpi");
  const elCmp = document.getElementById("agendaComplianceKpi");

  if (elTot) elTot.textContent = totalCount;
  if (elPen) elPen.textContent = pendingCount;
  if (elCom) elCom.textContent = completedCount;
  if (elCmp) elCmp.textContent = compliancePct + " %";

  if (!filtered.length) {
    tb.innerHTML = '<tr><td colspan="9" style="text-align:center; color:var(--text-muted); padding:16px;">No hay actividades programadas con los filtros seleccionados.</td></tr>';
    return;
  }

  const statuses = ["Pendiente", "En Proceso", "Completado"];

  tb.innerHTML = filtered.map(item => {
    return `
      <tr>
        <td><b>${esc(item.p)}</b></td>
        <td><b>${esc(item.t)}</b></td>
        <td><span class="tag" style="font-size:11px;">${esc(item.type)}</span></td>
        <td>📅 ${esc(item.date)} ${esc(item.time || '')}</td>
        <td>${esc(item.resp)}</td>
        <td>${esc(item.freq)}</td>
        <td>
          <select style="padding:4px 6px; border-radius:4px; font-weight:700; font-size:12px; border:1px solid var(--border-color); background:${item.st === 'Completado' ? '#ecfdf5' : item.st === 'En Proceso' ? '#fffbeb' : '#fef2f2'}; color:${item.st === 'Completado' ? '#047857' : item.st === 'En Proceso' ? '#b45309' : '#b91c1c'};" onchange="window.updateAgendaStatus(${item.id}, this.value)">
            ${statuses.map(st => `<option value="${st}" ${st === item.st ? 'selected' : ''}>${st}</option>`).join('')}
          </select>
        </td>
        <td style="font-size:12px; color:var(--text-muted);">${esc(item.notes || '—')}</td>
        <td style="white-space:nowrap;">
          <button class="sm success" onclick="window.scheduleAgendaToCalendar(${item.id})" title="Agendar en Google Calendar">📅 Calendar</button>
          <button class="sm danger" onclick="window.deleteAgendaItem(${item.id})">×</button>
        </td>
      </tr>
    `;
  }).join("");
}

function addAgendaItem() {
  const p = document.getElementById("agPiso")?.value || "Piso 1";
  const t = document.getElementById("agTitle")?.value?.trim();
  if (!t) {
    showToast("Ingresa un título para la inspección o mantenimiento");
    return;
  }
  const type = document.getElementById("agType")?.value || "Inspección de Fugas mA";
  const date = document.getElementById("agDate")?.value || new Date().toISOString().split('T')[0];
  const time = document.getElementById("agTime")?.value || "09:00";
  const resp = document.getElementById("agResp")?.value || "Ing. Proyectista CIP";
  const freq = document.getElementById("agFreq")?.value || "Mensual";
  const st = document.getElementById("agStatus")?.value || "Pendiente";
  const notes = document.getElementById("agNotes")?.value || "";

  const newId = Date.now();
  S.agenda.push({ id: newId, p, t, type, date, time, resp, freq, st, notes });
  save();
  draw();
  showToast("📅 Inspección agregada a la Agenda de Mantenimiento");

  if (document.getElementById("agTitle")) document.getElementById("agTitle").value = "";
  if (document.getElementById("agNotes")) document.getElementById("agNotes").value = "";
}

function deleteAgendaItem(id) {
  S.agenda = S.agenda.filter(x => x.id !== id);
  save();
  draw();
  showToast("Actividad eliminada de la agenda");
}

function updateAgendaStatus(id, newStatus) {
  const item = S.agenda.find(x => x.id === id);
  if (item) {
    item.st = newStatus;
    save();
    draw();
    showToast(`Estado actualizado a "${newStatus}"`);
  }
}

async function scheduleAgendaToCalendar(id) {
  const item = S.agenda.find(x => x.id === id);
  if (!item) return;

  const startDateTime = new Date(`${item.date}T${item.time || '09:00'}:00`).toISOString();
  const endDate = new Date(new Date(`${item.date}T${item.time || '09:00'}:00`).getTime() + 3600000);
  const endDateTime = endDate.toISOString();

  const confirmed = window.confirm(
    `¿Deseas agendar la actividad "${item.t}" (${item.p}) para el ${item.date} a las ${item.time} en tu Google Calendar?`
  );
  if (!confirmed) return;

  try {
    showToast("Agendando evento en Google Calendar...");
    await createCalendarEvent({
      summary: `⚡ ${item.t} (${item.p})`,
      location: `Vivienda Unifamiliar - ${item.p}`,
      description: `Tipo: ${item.type}\nResponsable: ${item.resp}\nFrecuencia: ${item.freq}\nNotas: ${item.notes || 'Sin notas.'}`,
      startDateTime,
      endDateTime
    });
    showToast("¡Evento agendado exitosamente en Google Calendar!");
    handleRefreshCalendarEvents();
  } catch (err) {
    console.error(err);
    showToast(`Error al agendar: ${err.message}`);
  }
}

function deleteMeasurement(i) {
  S.m.splice(i, 1);
  save();
  draw();
  showToast("Medición eliminada");
}

function deleteLeakMeasurement(i) {
  S.f.splice(i, 1);
  save();
  draw();
  showToast("Registro de fuga eliminado");
}

function addMeasurement() {
  S.m.push({ p: "Piso 1", e: "", s: "Funcionamiento", r: "", u: "mA", i: "UT251C+", t: "LECTURA PINZA", c: "", va: "", pw: "", o: "" });
  save();
  draw();
  showToast("Fila de medición agregada en blanco");

  setTimeout(() => {
    const rows = document.querySelectorAll("#measurementsTable tbody tr");
    if (rows.length) {
      const lastRow = rows[rows.length - 1];
      const nameInput = lastRow.querySelector("input");
      if (nameInput) {
        nameInput.focus();
        lastRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, 60);
}

function addLeakMeasurement() {
  S.f.push({ p: "Piso 1", z: "", c: "Prueba aislamiento diferencial", r: "", i: "UT251C+", u: "30.0 mA", n: "BAJO", o: "" });
  save();
  draw();
  showToast("Fila de lectura de fuga agregada en blanco");

  setTimeout(() => {
    const rows = document.querySelectorAll("#leakTable tbody tr");
    if (rows.length) {
      const lastRow = rows[rows.length - 1];
      const input = lastRow.querySelector("input");
      if (input) {
        input.focus();
        lastRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, 60);
}

function exportMeasurements() {
  let rows = [["Piso", "Equipo", "Estado", "Lectura", "Unidad", "Instrumento", "Tipo", "Condición Prueba", "VA ref.", "W placa/cálculo", "Observación"], ...S.m.map(m => [m.p, m.e, m.s, m.r, m.u, m.i, m.t, m.c, m.va, m.pw, m.o])];
  let csv = rows.map(r => r.map(v => '"' + String(v ?? "").replaceAll('"', '""') + '"').join(",")).join("\n");
  let a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  a.download = "mediciones_electricas_UT251C.csv";
  a.click();
  showToast("Archivo CSV descargado");
}

function drawAnalysis() {
  let box = document.getElementById("analysisList");
  if (!box) return;
  let top = [...S.a].map(l => ({ l, c: calc(l) })).sort((a, b) => b.c.k - a.c.k).slice(0, 10);
  box.innerHTML = top.map((x, i) =>
    '<div class="analysis-row" style="display:grid; grid-template-columns:2fr 1fr 2fr; gap:10px; padding:10px 0; border-bottom:1px solid var(--border-color); font-size:13px;"><b>' + (i + 1) + '. ' + esc(x.l.n) + '</b><span>' + x.c.k.toFixed(1) + ' kWh/mes · <b style="color:#047857;">S/ ' + x.c.cost.toFixed(2) + '</b></span><span>Escenario -20% horas: -' + (x.c.k * .2).toFixed(1) + ' kWh/mes (ahorro S/ ' + (x.c.cost * .2).toFixed(2) + ').</span></div>'
  ).join("");
}

function drawDash() {
  let t = S.a.reduce((a, x) => {
    let c = calc(x);
    a.i += c.inst;
    a.k += c.k;
    a.d += c.demand;
    a.cost += c.cost;
    a.costStandby += c.costStandby;
    a.totalAmps += c.I;
    return a;
  }, { i: 0, k: 0, d: 0, cost: 0, costStandby: 0, totalAmps: 0 });

  const elInst = document.getElementById("kInst");
  const elDem = document.getElementById("kDem");
  const elKwh = document.getElementById("kKwh");
  const elCost = document.getElementById("kCost");
  const elBill = document.getElementById("kBill");
  const elDiff = document.getElementById("kDiff");

  if (elInst) elInst.textContent = (t.i / 1000).toFixed(2) + " kW";
  if (elDem) elDem.textContent = t.d.toFixed(2) + " kW";
  if (elKwh) elKwh.textContent = t.k.toFixed(2) + " kWh";
  if (elCost) elCost.textContent = "S/ " + t.cost.toFixed(2);
  if (elBill) elBill.textContent = S.p.bill + " kWh";
  if (elDiff) elDiff.textContent = (t.k - S.p.bill).toFixed(2) + " kWh";

  // Update KPI Cards on Cuadro de Cargas tab
  const totalLeakRow = S.f.find(x => (x.z || '').toLowerCase().includes('fuga total') || (x.z || '').toLowerCase().includes('total vivienda'));
  let totalLeakVal = totalLeakRow ? +totalLeakRow.r : S.f.reduce((acc, curr) => acc + (+curr.r || 0), 0);
  if (isNaN(totalLeakVal) || totalLeakVal <= 0) totalLeakVal = 1.79;

  const elCardCost = document.getElementById("cardTotalCost");
  const elCardStandby = document.getElementById("cardStandbyCost");
  const elCardCurrent = document.getElementById("cardTotalCurrent");
  const elCardKwh = document.getElementById("cardTotalKwh");
  const elCardMaxDemand = document.getElementById("cardMaxDemand");
  const elCardLeak = document.getElementById("cardLeakCurrent");

  if (elCardCost) elCardCost.textContent = "S/ " + t.cost.toFixed(2) + " /mes";
  if (elCardStandby) elCardStandby.textContent = "S/ " + t.costStandby.toFixed(2) + " /mes";
  if (elCardCurrent) elCardCurrent.textContent = t.totalAmps.toFixed(2) + " A";
  if (elCardKwh) elCardKwh.textContent = t.k.toFixed(2) + " kWh";
  if (elCardMaxDemand) elCardMaxDemand.textContent = t.d.toFixed(2) + " kW";
  if (elCardLeak) elCardLeak.textContent = totalLeakVal.toFixed(2) + " mA";

  // Update Mobile & Google Workspace KPI Cards
  const elMobLoads = document.getElementById("mobKpiLoads");
  const elMobMeas = document.getElementById("mobKpiMeas");
  const elGwStatus = document.getElementById("gwKpiStatus");
  const elGwSheets = document.getElementById("gwKpiSheets");
  const elGwCalendar = document.getElementById("gwKpiCalendar");

  if (elMobLoads) elMobLoads.textContent = S.a.length;
  if (elMobMeas) elMobMeas.textContent = S.m.length + S.f.length;
  if (elGwStatus) {
    const user = getCurrentUser();
    elGwStatus.textContent = user ? (`✅ ${user.displayName || user.email}`) : "🔒 No Conectado";
    elGwStatus.style.color = user ? "#047857" : "var(--primary)";
  }
  if (elGwSheets) elGwSheets.textContent = `${S.a.length} equipos`;
  if (elGwCalendar) elGwCalendar.textContent = `${(S.agenda || []).length} agendados`;

  let top = [...S.a].sort((x, y) => calc(y).k - calc(x).k).slice(0, 8);
  let mx = calc(top[0] || { w: 1, q: 1, h: 1 }).k || 1;

  const elTop = document.getElementById("top");
  const elBars = document.getElementById("bars");
  if (elTop) elTop.innerHTML = top.slice(0, 5).map(x => {
    const c = calc(x);
    return '<p style="margin:6px 0; font-size:13px; display:flex; justify-content:space-between;"><span><b>' + esc(x.n) + '</b> — ' + c.k.toFixed(1) + ' kWh/mes</span> <b style="color:#047857;">S/ ' + c.cost.toFixed(2) + '/mes</b></p>';
  }).join("");
  
  if (elBars) elBars.innerHTML = top.map(x => {
    let c = calc(x);
    return '<div class="bar"><span>' + esc(x.n) + '</span><div class="barline"><div class="fill" style="width:' + Math.max(3, c.k / mx * 100) + '%"></div></div><b style="color:#047857;">S/ ' + c.cost.toFixed(2) + '</b></div>';
  }).join("");
}

function setRecPct(name, value) {
  S.recPct[name] = Math.max(0, Math.min(100, +value || 0));
  save();
  draw();
}

function drawRecommendations() {
  const box = document.getElementById("recommendationList");
  const sum = document.getElementById("recommendationSummary");
  const tb = document.getElementById("recommendationTable");
  if (!box || !sum) return;

  const items = S.a.map(x => ({ x, c: calc(x) })).sort((a, b) => b.c.k - a.c.k);
  const total = items.reduce((z, o) => z + o.c.k, 0);
  const top = items.slice(0, 10);
  let savings = 0;

  top.forEach(o => {
    if (S.recPct[o.x.n] == null) S.recPct[o.x.n] = 20;
    savings += o.c.k * (Math.max(0, Math.min(100, +S.recPct[o.x.n])) / 100);
  });

  const newTotal = total - savings;
  const currentCost = total * S.p.tar;
  const newCost = newTotal * S.p.tar;
  const bill = S.p.bill;

  sum.innerHTML =
    '<div class="rec-kpi"><small>Consumo Actual Modelado</small><b>' + total.toFixed(1) + ' kWh</b><small style="color:#047857; font-weight:700;">S/ ' + currentCost.toFixed(2) + '</small></div>' +
    '<div class="rec-kpi"><small>Ahorro Recomendado</small><b>' + savings.toFixed(1) + ' kWh</b><small style="color:#047857; font-weight:700;">S/ ' + (savings * S.p.tar).toFixed(2) + '/mes</small></div>' +
    '<div class="rec-kpi new-total"><small>Nuevo Consumo Proyectado</small><b>' + newTotal.toFixed(1) + ' kWh</b><small style="color:#047857; font-weight:700;">S/ ' + newCost.toFixed(2) + '/mes</small></div>' +
    '<div class="rec-kpi"><small>Recibo Luz Real</small><b>' + bill.toFixed(1) + ' kWh</b><small style="color:#047857; font-weight:700;">S/ ' + (bill * S.p.tar).toFixed(2) + '</small></div>' +
    '<div class="rec-kpi"><small>Reducción Global</small><b>' + ((savings / Math.max(total, 1)) * 100).toFixed(1) + '%</b><small>' + ((newTotal / Math.max(bill, 1)) * 100).toFixed(1) + '% del recibo</small></div>';

  if (tb) {
    tb.innerHTML = top.map(o => {
      const pct = Math.max(0, Math.min(100, +S.recPct[o.x.n] || 0));
      const save = o.c.k * pct / 100;
      const n = o.c.k - save;
      return '<tr><td><b>' + esc(o.x.n) + '</b></td><td>' + o.c.k.toFixed(2) + '</td><td><input type="number" min="0" max="100" step="5" value="' + pct + '" onchange="window.setRecPct(\'' + esc(o.x.n).replaceAll("'", "\\'") + '\',this.value)"> %</td><td>' + save.toFixed(2) + '</td><td><b>' + n.toFixed(2) + '</b></td><td style="color:#047857; font-weight:700;">S/ ' + o.c.cost.toFixed(2) + '</td><td style="color:#047857; font-weight:700;">S/ ' + (n * S.p.tar).toFixed(2) + '</td></tr>';
    }).join("") +
    '<tr class="new-total"><td><b>NUEVO TOTAL PROYECTADO</b></td><td>' + total.toFixed(2) + '</td><td>—</td><td><b>' + savings.toFixed(2) + '</b></td><td><b>' + newTotal.toFixed(2) + '</b></td><td style="color:#047857; font-weight:700;">S/ ' + currentCost.toFixed(2) + '</td><td style="color:#047857; font-weight:800;">S/ ' + newCost.toFixed(2) + '</td></tr>';
  }

  box.innerHTML = top.slice(0, 5).map((o, i) => {
    const pct = Math.max(0, Math.min(100, +S.recPct[o.x.n] || 0));
    const save = o.c.k * pct / 100;
    return '<div class="rec-card ' + (i < 2 ? "high" : "") + '"><h3>' + esc(o.x.n) + '</h3><p>' + o.c.k.toFixed(1) + ' kWh/mes (S/ ' + o.c.cost.toFixed(2) + '/mes actualmente).</p><p class="rec-save">Con ' + pct + '% de reducción: ' + (o.c.k - save).toFixed(1) + ' kWh/mes → ahorro ' + save.toFixed(1) + ' kWh/mes (S/ ' + (save * S.p.tar).toFixed(2) + '/mes).</p></div>';
  }).join("");

  drawStandbyVampires();
}

function drawStandbyVampires() {
  const vampires = S.a.map(x => ({ x, c: calc(x) })).filter(o => o.c.kStandby > 0 || (+o.x.ir || 0) > 0).sort((a, b) => b.c.costStandby - a.c.costStandby);

  const totalStandbyKwh = vampires.reduce((acc, o) => acc + o.c.kStandby, 0);
  const totalStandbyCost = totalStandbyKwh * S.p.tar;
  const totalStandbyWatts = vampires.reduce((acc, o) => acc + (o.c.wStandby * (+o.x.q || 1)), 0);

  const elCost = document.getElementById("standbyCostKpi");
  const elKwh = document.getElementById("standbyKwhKpi");
  const elWatts = document.getElementById("standbyWattsKpi");
  const elSave = document.getElementById("standbySaveKpi");
  const tb = document.getElementById("standbyVampiresTable");

  if (elCost) elCost.textContent = "S/ " + totalStandbyCost.toFixed(2) + " /mes";
  if (elKwh) elKwh.textContent = totalStandbyKwh.toFixed(2) + " kWh/mes";
  if (elWatts) elWatts.textContent = totalStandbyWatts.toFixed(1) + " W continuos";
  if (elSave) elSave.textContent = "S/ " + totalStandbyCost.toFixed(2) + " /mes";

  if (tb) {
    if (!vampires.length) {
      tb.innerHTML = '<tr><td colspan="7" style="text-align:center; color:var(--text-muted);">No hay equipos con corriente de reposo registrada.</td></tr>';
      return;
    }

    tb.innerHTML = vampires.map(o => {
      const x = o.x;
      const c = o.c;
      return `
        <tr>
          <td><b>${esc(x.n)}</b> (${esc(x.r)})</td>
          <td><b>${(+x.ir || 0).toFixed(2)} mA</b></td>
          <td>${c.wStandby.toFixed(2)} W</td>
          <td>${c.hStandby.toFixed(1)} h/día</td>
          <td>${c.kStandby.toFixed(2)} kWh/mes</td>
          <td style="font-weight:700; color:#0284c7; background:#f0f9ff;">S/ ${c.costStandby.toFixed(2)}</td>
          <td>
            <span class="tag warning" style="font-size:11px;">
              💡 Usar multitoma con interruptor o desenchufar. Ahorra S/ ${c.costStandby.toFixed(2)}/mes
            </span>
          </td>
        </tr>
      `;
    }).join("") +
    `
      <tr class="new-total" style="background:#e0f2fe;">
        <td><b>TOTAL CONSUMO VAMPIRO STANDBY</b></td>
        <td>—</td>
        <td><b>${totalStandbyWatts.toFixed(1)} W</b></td>
        <td>—</td>
        <td><b>${totalStandbyKwh.toFixed(2)} kWh/mes</b></td>
        <td style="font-weight:800; color:#0284c7; font-size:15px;">S/ ${totalStandbyCost.toFixed(2)} /mes</td>
        <td><b>Ahorro directo disponible al desconectar de noche</b></td>
      </tr>
    `;
  }
}

function add() {
  S.a.push({ r: "Piso 1", n: "", q: 1, w: "", v: S.p.v, f: "1F", pf: .9, fd: 1, h: "", ir: "", fixed: "", d: "NUEVO USUARIO", isAuditRecord: false });
  save();
  draw();
  showToast("Nuevo equipo en blanco agregado al cuadro");

  setTimeout(() => {
    const rows = document.querySelectorAll("#loadTable tbody tr");
    if (rows.length) {
      const lastRow = rows[rows.length - 1];
      const inputs = lastRow.querySelectorAll("input");
      const nameInput = inputs.length > 1 ? inputs[1] : inputs[0];
      if (nameInput) {
        nameInput.focus();
        lastRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, 60);
}

function backup() {
  let a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 2)], { type: "application/json" }));
  a.download = "respaldo_cuadro_cargas_hugo.json";
  a.click();
  showToast("Respaldo JSON descargado");
}

function exportXLSX() {
  if (!window.XLSX) {
    alert("Excel requiere conexión a Internet para cargar SheetJS.");
    return;
  }
  let rows = S.a.map(x => {
    let c = calc(x);
    return {
      Ambiente: x.r,
      Equipo: x.n,
      Cantidad: x.q,
      "W/u Activo": x.w,
      V: x.v,
      Fase: x.f,
      FP: x.pf,
      FD: x.fd,
      "h/día Activo": x.h,
      "mA Reposo (Standby)": +x.ir || 0,
      "kWh/mes Total": +c.k.toFixed(2),
      "Gasto S/mes Total": +(c.cost).toFixed(2),
      "Gasto S/mes Standby": +(c.costStandby).toFixed(2),
      "Demanda_kW": +c.demand.toFixed(2),
      "Corriente_A": +c.I.toFixed(2),
      Dato: x.d
    };
  });
  let wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), "Cuadro de cargas");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(S.m), "Mediciones");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(S.f), "Fugas a Tierra (mA)");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(S.agenda || []), "Agenda Mantenimiento CNE");
  XLSX.writeFile(wb, "Cuadro_Cargas_Hugo.xlsx");
  showToast("Excel exportado exitosamente con costos en S/");
}

/* PROFESSIONAL PDF REPORT GENERATOR */
function openPDFReportModal() {
  const modal = document.getElementById('pdfReportModal');
  if (!modal) return;

  const dateEl = document.getElementById('reportPrintDate');
  if (dateEl) dateEl.textContent = new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' });

  const sysEl = document.getElementById('pdfSys');
  const tarEl = document.getElementById('pdfTar');
  if (sysEl) sysEl.textContent = `${S.p.v || 220} V · ${S.p.sys || '3F'} (${S.p.sys === '1F' ? 'Monofásico' : 'Trifásico'})`;
  if (tarEl) tarEl.textContent = `S/ ${(S.p.tar || 0.6545).toFixed(4)} por kWh`;

  let t = S.a.reduce((acc, x) => {
    let c = calc(x);
    acc.i += c.inst;
    acc.k += c.k;
    acc.d += c.demand;
    acc.cost += c.cost;
    return acc;
  }, { i: 0, k: 0, d: 0, cost: 0 });

  const elInst = document.getElementById("pdfInst");
  const elDem = document.getElementById("pdfDem");
  const elKwh = document.getElementById("pdfKwh");
  const elCost = document.getElementById("pdfCost");
  const elBill = document.getElementById("pdfBill");
  const elDiff = document.getElementById("pdfDiff");

  if (elInst) elInst.textContent = (t.i / 1000).toFixed(2) + " kW";
  if (elDem) elDem.textContent = t.d.toFixed(2) + " kW";
  if (elKwh) elKwh.textContent = t.k.toFixed(2) + " kWh";
  if (elCost) elCost.textContent = "S/ " + t.cost.toFixed(2);
  if (elBill) elBill.textContent = (S.p.bill || 331).toFixed(2) + " kWh";
  if (elDiff) elDiff.textContent = (t.k - (S.p.bill || 331)).toFixed(2) + " kWh";

  const pdfLoadsTb = document.querySelector("#pdfLoadsTable tbody");
  if (pdfLoadsTb) {
    pdfLoadsTb.innerHTML = S.a.map(x => {
      let c = calc(x);
      return `
        <tr>
          <td><b>${esc(x.r)}</b></td>
          <td>${esc(x.n)}</td>
          <td>${x.q}</td>
          <td>${x.w} W</td>
          <td>${x.pf}</td>
          <td>${x.fd}</td>
          <td style="font-weight:700; color:#4c1d95;">${c.I.toFixed(2)} A</td>
          <td>${c.demand.toFixed(2)} kW</td>
          <td>${x.h} h</td>
          <td>${(+x.ir || 0).toFixed(1)} mA</td>
          <td>${c.k.toFixed(2)}</td>
          <td style="font-weight:700; color:#047857;">S/ ${c.cost.toFixed(2)}</td>
        </tr>
      `;
    }).join("");
  }

  const pdfMeasTb = document.querySelector("#pdfMeasTable tbody");
  if (pdfMeasTb) {
    pdfMeasTb.innerHTML = S.m.map(m => {
      return `
        <tr>
          <td><b>${esc(m.e)}</b> (${esc(m.p || 'Piso 1')})</td>
          <td>${esc(m.s)}</td>
          <td><b>${m.r} ${esc(m.u || 'mA')}</b></td>
          <td>${esc(m.u)}</td>
          <td>${esc(m.i)}</td>
          <td>${esc(m.o)}</td>
        </tr>
      `;
    }).join("");
  }

  const pdfLeakTb = document.querySelector("#pdfLeakTable tbody");
  if (pdfLeakTb) {
    pdfLeakTb.innerHTML = S.f.map(f => {
      const isTotal = (f.z || '').toLowerCase().includes('total') || (f.p || '').toLowerCase().includes('acometida');
      return `
        <tr style="${isTotal ? 'background:#fef2f2; font-weight:700;' : ''}">
          <td><b>${esc(f.p || 'Piso 1')} - ${esc(f.z)}</b></td>
          <td>${esc(f.c)}</td>
          <td style="color:#ef4444; font-weight:700;">${f.r} mA</td>
          <td>${esc(f.u || '30.0 mA')}</td>
          <td>${esc(f.o)}</td>
        </tr>
      `;
    }).join("");
  }

  modal.classList.add('active');
}

function closePDFReportModal() {
  const modal = document.getElementById('pdfReportModal');
  if (modal) modal.classList.remove('active');
}

function printPDFReport() {
  window.print();
}

/* MOBILE MODE HANDLERS */
function setMobileMode(mode) {
  const loadForm = document.getElementById('mobileLoadForm');
  const measForm = document.getElementById('mobileMeasForm');
  const btnL = document.getElementById('btnMobileTabLoad');
  const btnM = document.getElementById('btnMobileTabMeas');

  if (mode === 'LOAD') {
    if (loadForm) loadForm.style.display = 'grid';
    if (measForm) measForm.style.display = 'none';
    if (btnL) { btnL.className = 'sm'; }
    if (btnM) { btnM.className = 'sm light'; }
  } else {
    if (loadForm) loadForm.style.display = 'none';
    if (measForm) measForm.style.display = 'grid';
    if (btnL) { btnL.className = 'sm light'; }
    if (btnM) { btnM.className = 'sm'; }
  }
}

function stepInput(id, delta) {
  const input = document.getElementById(id);
  if (input) {
    const val = Math.max(1, (+input.value || 0) + delta);
    input.value = val;
  }
}

function saveMobileLoad() {
  const r = document.getElementById('mR')?.value || 'Piso 1';
  const n = document.getElementById('mN')?.value?.trim();
  if (!n) {
    showToast('Ingresa el nombre del equipo');
    return;
  }
  const q = +document.getElementById('mQ')?.value || 1;
  const w = +document.getElementById('mW')?.value || 100;
  const h = +document.getElementById('mH')?.value || 1;
  const ir = +document.getElementById('mIr')?.value || 0;
  const f = document.getElementById('mF')?.value || '1F';
  const d = document.getElementById('mD')?.value || 'PLACA + ESTIMADO';

  S.a.push({
    r, n, q, w, v: S.p.v, f, pf: 0.9, fd: 1, h, ir, fixed: "", d
  });
  save();
  draw();
  showToast(`Carga "${n}" agregada al cuadro`);

  if (document.getElementById('mN')) document.getElementById('mN').value = '';
  updateMobileRecentList(`⚡ Carga: ${n} (${w}W activo, ${ir}mA reposo)`);
}

function saveMobileMeasurement() {
  const e = document.getElementById('mMe')?.value?.trim();
  if (!e) {
    showToast('Ingresa el equipo medido');
    return;
  }
  const s = document.getElementById('mMs')?.value || 'Normal';
  const r = +document.getElementById('mMr')?.value || 0;
  const u = document.getElementById('mMu')?.value || 'mA';
  const i = document.getElementById('mMi')?.value || 'UT251C+';
  const t = document.getElementById('mMt')?.value || 'LECTURA PINZA';
  const o = document.getElementById('mMo')?.value || '';

  if (t.toLowerCase().includes('fuga') || u === 'mA') {
    S.f.push({ p: "Piso 1", z: e, c: s, r, i, u: "30.0 mA", n: r > 15 ? "ALTO" : "BAJO", o });
    showToast(`Lectura de fuga "${e}" registrada`);
  } else {
    S.m.push({ p: "Piso 1", e, s, r, u, i, t, c: "Prueba en caliente (Plena carga)", va: 0, pw: 0, o });
    showToast(`Medición "${e}" registrada`);
  }

  save();
  draw();

  if (document.getElementById('mMe')) document.getElementById('mMe').value = '';
  updateMobileRecentList(`📏 Medición/Fuga: ${e} (${r} ${u})`);
}

function updateMobileRecentList(text) {
  const box = document.getElementById('mobileRecentList');
  if (!box) return;
  const item = document.createElement('div');
  item.style.padding = '6px 0';
  item.style.borderBottom = '1px solid var(--border-color)';
  item.textContent = `${new Date().toLocaleTimeString('es-PE')} - ${text}`;
  box.prepend(item);
}

/* GOOGLE AUTH & SHEETS & CALENDAR LOGIC */
async function handleGoogleSignIn() {
  try {
    const user = getCurrentUser();
    if (user) {
      await logoutGoogle();
      showToast('Sesión cerrada');
    } else {
      showToast('Abriendo ventana de inicio de sesión con Google...');
      const res = await loginWithGoogle();
      showToast(`¡Hola ${res.user.displayName || 'Usuario'}!`);
      handleRefreshCalendarEvents();
    }
  } catch (err) {
    console.error(err);
    showToast(`Error al autenticar: ${err.message}`);
  }
}

function updateAuthUI(user) {
  const btnAuth = document.getElementById('btnGoogleAuth');
  const statusBadge = document.getElementById('googleAuthStatus');

  if (user) {
    if (btnAuth) {
      btnAuth.innerHTML = `👋 ${user.displayName || user.email} (Cerrar Sesión)`;
      btnAuth.className = 'light sm';
    }
    if (statusBadge) {
      statusBadge.style.display = 'inline-flex';
      statusBadge.innerHTML = `<img src="${user.photoURL || 'https://www.gstatic.com/images/branding/product/1x/avatar_square_blue_512dp.png'}" class="user-avatar"> ${user.displayName || user.email}`;
    }
  } else {
    if (btnAuth) {
      btnAuth.innerHTML = '🔐 Iniciar Sesión con Google';
      btnAuth.className = 'light';
    }
    if (statusBadge) {
      statusBadge.style.display = 'none';
    }
  }
}

async function handleExportToGoogleSheets() {
  try {
    const box = document.getElementById('sheetsLinkBox');
    if (box) box.innerHTML = '<p style="color:var(--primary); font-size:13px;">⏳ Creando hoja de cálculo en tu Google Drive...</p>';
    
    const result = await exportToGoogleSheets(S);
    showToast('¡Cuadro respaldado con éxito en Google Sheets!');
    
    if (box) {
      box.innerHTML = `
        <div style="padding:14px; background:var(--success-bg); border:1px solid #a7f3d0; border-radius:8px; margin-top:10px;">
          <b style="color:#047857; display:block; margin-bottom:4px;">✅ Hoja de Cálculo Creada</b>
          <a href="${result.spreadsheetUrl}" target="_blank" style="color:var(--primary); font-weight:700; text-decoration:underline;">
            🔗 Abrir Hoja en Google Sheets ↗
          </a>
        </div>
      `;
    }
  } catch (err) {
    console.error(err);
    const box = document.getElementById('sheetsLinkBox');
    if (box) {
      box.innerHTML = `<p style="color:var(--danger); font-size:13px;">❌ ${err.message}. ${!getCurrentUser() ? 'Debes Iniciar Sesión primero.' : ''}</p>`;
    }
    showToast(err.message);
  }
}

async function handleCreateCalendarEvent() {
  const summary = document.getElementById('calSummary')?.value?.trim() || '⚡ Inspección Eléctrica';
  const dateStr = document.getElementById('calDate')?.value;
  const timeStr = document.getElementById('calTime')?.value || '09:00';
  const location = document.getElementById('calLocation')?.value || 'Vivienda Unifamiliar';
  const description = document.getElementById('calDescription')?.value || '';

  if (!dateStr) {
    showToast('Por favor selecciona una fecha para la inspección');
    return;
  }

  const startDateTime = new Date(`${dateStr}T${timeStr}:00`).toISOString();
  const endDate = new Date(new Date(`${dateStr}T${timeStr}:00`).getTime() + 3600000);
  const endDateTime = endDate.toISOString();

  const confirmed = window.confirm(
    `¿Deseas agendar la inspección "${summary}" para el ${dateStr} a las ${timeStr} en tu Google Calendar?`
  );
  if (!confirmed) return;

  try {
    showToast('Agendando evento en Google Calendar...');
    await createCalendarEvent({
      summary,
      location,
      description,
      startDateTime,
      endDateTime
    });

    showToast('¡Inspección agendada exitosamente en Google Calendar!');
    handleRefreshCalendarEvents();
  } catch (err) {
    console.error(err);
    showToast(`Error al agendar: ${err.message}`);
  }
}

async function handleRefreshCalendarEvents() {
  const listEl = document.getElementById('calendarEventsList');
  if (!listEl) return;

  if (!getCurrentUser()) {
    listEl.innerHTML = '<p style="color:var(--text-muted);">Inicia sesión con Google arriba para consultar tus eventos próximos.</p>';
    return;
  }

  try {
    listEl.innerHTML = '<p style="color:var(--primary);">⏳ Consultando eventos de Google Calendar...</p>';
    const events = await fetchCalendarEvents();
    if (!events || !events.length) {
      listEl.innerHTML = '<p style="color:var(--text-muted);">No tienes eventos próximos agendados en Google Calendar.</p>';
      return;
    }

    listEl.innerHTML = events.map(ev => {
      const start = ev.start?.dateTime || ev.start?.date || '';
      const dateFormatted = start ? new Date(start).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' }) : 'Sin fecha';
      return `
        <div style="padding:10px 12px; border:1px solid var(--border-color); border-radius:6px; margin-bottom:8px; background:#fff;">
          <b style="color:var(--primary); display:block; font-size:13px;">${esc(ev.summary || 'Inspección')}</b>
          <span style="font-size:12px; color:var(--text-muted); display:block; margin-top:2px;">🕒 ${dateFormatted}</span>
          ${ev.location ? `<span style="font-size:11px; color:var(--text-light); display:block; margin-top:2px;">📍 ${esc(ev.location)}</span>` : ''}
        </div>
      `;
    }).join('');
  } catch (err) {
    console.error(err);
    listEl.innerHTML = `<p style="color:var(--danger);">Error al consultar Calendar: ${err.message}</p>`;
  }
}

function showAppsScriptModal() {
  const modal = document.getElementById('appsScriptModal');
  const pre = document.getElementById('appsScriptCode');
  if (pre) pre.textContent = generateAppsScriptCode(S);
  if (modal) modal.classList.add('active');
}

function closeAppsScriptModal() {
  const modal = document.getElementById('appsScriptModal');
  if (modal) modal.classList.remove('active');
}

function copyAppsScriptCode() {
  const pre = document.getElementById('appsScriptCode');
  if (pre) {
    navigator.clipboard.writeText(pre.textContent);
    showToast("Código Apps Script copiado al portapapeles");
  }
}

/* TOAST HELPER */
function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;
  toastMsg.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/* EXPOSE GLOBALS FOR INLINE ONCLICK HANDLERS */
window.tab = tab;
window.edit = edit;
window.mf = mf;
window.lf = lf;
window.add = add;
window.restore = restore;
window.backup = backup;
window.exportXLSX = exportXLSX;
window.filterLoads = filterLoads;
window.deleteLoad = deleteLoad;
window.addMeasurement = addMeasurement;
window.addLeakMeasurement = addLeakMeasurement;
window.deleteMeasurement = deleteMeasurement;
window.deleteLeakMeasurement = deleteLeakMeasurement;
window.exportMeasurements = exportMeasurements;
window.setRecPct = setRecPct;
window.setMobileMode = setMobileMode;
window.stepInput = stepInput;
window.saveMobileLoad = saveMobileLoad;
window.saveMobileMeasurement = saveMobileMeasurement;
window.handleGoogleSignIn = handleGoogleSignIn;
window.handleExportToGoogleSheets = handleExportToGoogleSheets;
window.handleCreateCalendarEvent = handleCreateCalendarEvent;
window.handleRefreshCalendarEvents = handleRefreshCalendarEvents;
window.showAppsScriptModal = showAppsScriptModal;
window.closeAppsScriptModal = closeAppsScriptModal;
window.copyAppsScriptCode = copyAppsScriptCode;
window.openPDFReportModal = openPDFReportModal;
window.closePDFReportModal = closePDFReportModal;
window.printPDFReport = printPDFReport;
window.drawAgenda = drawAgenda;
window.addAgendaItem = addAgendaItem;
window.deleteAgendaItem = deleteAgendaItem;
window.updateAgendaStatus = updateAgendaStatus;
window.scheduleAgendaToCalendar = scheduleAgendaToCalendar;

window.addEventListener("DOMContentLoaded", init);
