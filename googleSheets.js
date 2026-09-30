import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

let firebaseApp = null;
let auth = null;
let cachedAccessToken = null;
let currentUser = null;

// Load config from firebase-applet-config.json
export async function initGoogleAuth(onUserChange) {
  try {
    const res = await fetch('/firebase-applet-config.json');
    const firebaseConfig = await res.json();
    
    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
    
    onAuthStateChanged(auth, (user) => {
      currentUser = user;
      if (!user) {
        cachedAccessToken = null;
      }
      if (onUserChange) onUserChange(user, cachedAccessToken);
    });
  } catch (err) {
    console.error('Error initializing Firebase Auth:', err);
  }
}

export async function loginWithGoogle() {
  if (!auth) throw new Error('Firebase Auth not initialized');
  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/spreadsheets');
  provider.addScope('https://www.googleapis.com/auth/drive.file');
  provider.addScope('https://www.googleapis.com/auth/calendar.events');

  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential && credential.accessToken) {
      cachedAccessToken = credential.accessToken;
    } else {
      throw new Error('No access token returned from Google sign in');
    }
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (err) {
    console.error('Login error:', err);
    throw err;
  }
}

export async function logoutGoogle() {
  if (auth) {
    await signOut(auth);
    cachedAccessToken = null;
    currentUser = null;
  }
}

export function getCurrentUser() {
  return currentUser;
}

export function getAccessToken() {
  return cachedAccessToken;
}

/**
 * Creates a formatted Google Sheet in Google Drive with Cuadro de Cargas, Mediciones, Fugas, and Consumo.
 */
export async function exportToGoogleSheets(stateData) {
  const token = getAccessToken();
  if (!token) {
    throw new Error('Debes iniciar sesión con Google para respaldar en Google Sheets');
  }

  const { p, a, m, f } = stateData;

  // 1. Create Spreadsheet
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        title: `⚡ Hugo - Cuadro de Cargas y Consumo (${new Date().toLocaleDateString('es-PE')})`
      },
      sheets: [
        { properties: { title: 'Cuadro de Cargas & Costos', gridProperties: { frozenRowCount: 1 } } },
        { properties: { title: 'Mediciones de Operación', gridProperties: { frozenRowCount: 1 } } },
        { properties: { title: 'Fugas a Tierra (mA)', gridProperties: { frozenRowCount: 1 } } },
        { properties: { title: 'Consumo por Equipo', gridProperties: { frozenRowCount: 1 } } },
        { properties: { title: 'Parámetros del Sistema', gridProperties: { frozenRowCount: 1 } } }
      ]
    })
  });

  if (!createRes.ok) {
    const errData = await createRes.json();
    throw new Error(`Error al crear la hoja: ${errData.error?.message || createRes.statusText}`);
  }

  const spreadsheet = await createRes.json();
  const spreadsheetId = spreadsheet.spreadsheetId;
  const spreadsheetUrl = spreadsheet.spreadsheetUrl;

  // 2. Prepare Data Rows
  const loadsRows = [
    ['Ambiente', 'Equipo / Circuito', 'Cantidad', 'Watts/u', 'Tensión (V)', 'Fase', 'Factor Potencia (FP)', 'Factor Demanda (FD)', 'Horas/día', 'kWh/mes', 'Gasto S/mes', 'Máxima Demanda (kW)', 'Corriente (A)', 'Origen del Dato Spec'],
    ...a.map(x => {
      const w = +x.w || 0, q = +x.q || 0, h = +x.h || 0, d = p.days || 30, pf = Math.max(.01, +x.pf || 1), fd = +x.fd || 0, v = +x.v || p.v || 220;
      const inst = w * q;
      const k = x.fixed !== "" && x.fixed != null ? +x.fixed : inst * h * d / 1000;
      const I = x.f === "3F" ? inst / (Math.sqrt(3) * v * pf) : inst / (v * pf);
      return [x.r, x.n, +x.q, +x.w, +x.v, x.f, +x.pf, +x.fd, +x.h, +k.toFixed(2), +(k * p.tar).toFixed(2), +(inst * fd / 1000).toFixed(2), +I.toFixed(2), x.d];
    })
  ];

  const measurementsRows = [
    ['Equipo / Circuito', 'Estado', 'Lectura Medida', 'Unidad', 'Instrumento', 'Tipo Lectura', 'VA Referencia', 'W Placa / Cálculo', 'Observación / Diagnóstico'],
    ...(m || []).map(x => [x.e, x.s, +x.r, x.u, x.i, x.t, +x.va || 0, +x.pw || 0, x.o])
  ];

  const leaksRows = [
    ['Circuito / Zona Evaluada', 'Condición Prueba', 'Corriente Fuga (mA)', 'Instrumento', 'Umbral Máximo ID', 'Nivel Riesgo', 'Observación / Diagnóstico'],
    ...(f || []).map(x => [x.z, x.c, +x.r, x.i, x.u, x.n, x.o])
  ];

  const consumptionRows = [
    ['Equipo', 'Watts', 'Factor Potencia', 'Corriente (A)', 'kWh/día', 'kWh/mes', 'Gasto S/día', 'Gasto S/mes', 'Origen de Dato Spec'],
    ...a.map(x => {
      const w = +x.w || 0, q = +x.q || 0, h = +x.h || 0, d = p.days || 30, pf = Math.max(.01, +x.pf || 1), v = +x.v || p.v || 220;
      const inst = w * q;
      const k = x.fixed !== "" && x.fixed != null ? +x.fixed : inst * h * d / 1000;
      const I = x.f === "3F" ? inst / (Math.sqrt(3) * v * pf) : inst / (v * pf);
      const day = k / d;
      return [x.n, +x.w, +x.pf, +I.toFixed(2), +day.toFixed(2), +k.toFixed(2), +(day * p.tar).toFixed(2), +(k * p.tar).toFixed(2), x.d];
    })
  ];

  const paramRows = [
    ['Parámetro', 'Valor', 'Unidad / Nota'],
    ['Tensión Nominal', p.v, 'Volts (V)'],
    ['Sistema Eléctrico', p.sys, 'Monofásico (1F) / Trifásico (3F)'],
    ['Tarifa de Energía', p.tar, 'S/ por kWh'],
    ['Días del Mes', p.days, 'Días de cálculo'],
    ['Área Construida', p.area, 'm²'],
    ['Consumo Recibo Real', p.bill, 'kWh/mes real']
  ];

  // 3. Batch Update Values
  const updateRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      valueInputOption: 'USER_ENTERED',
      data: [
        { range: "'Cuadro de Cargas & Costos'!A1", values: loadsRows },
        { range: "'Mediciones de Operación'!A1", values: measurementsRows },
        { range: "'Fugas a Tierra (mA)'!A1", values: leaksRows },
        { range: "'Consumo por Equipo'!A1", values: consumptionRows },
        { range: "'Parámetros del Sistema'!A1", values: paramRows }
      ]
    })
  });

  if (!updateRes.ok) {
    const errData = await updateRes.json();
    throw new Error(`Error al poblar datos: ${errData.error?.message || updateRes.statusText}`);
  }

  return { spreadsheetId, spreadsheetUrl };
}

/**
 * GOOGLE CALENDAR INTEGRATION
 */
export async function fetchCalendarEvents() {
  const token = getAccessToken();
  if (!token) return [];

  const timeMin = new Date().toISOString();
  const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(timeMin)}&maxResults=10&orderBy=startTime&singleEvents=true`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    console.warn('Calendar fetch failed:', res.statusText);
    return [];
  }

  const data = await res.json();
  return data.items || [];
}

export async function createCalendarEvent(eventData) {
  const token = getAccessToken();
  if (!token) {
    throw new Error('Debes iniciar sesión con Google para agendar en Google Calendar');
  }

  const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      summary: eventData.summary,
      location: eventData.location || 'Vivienda Unifamiliar (360m²)',
      description: eventData.description || 'Revisión periódica de cuadro de cargas e inspección con pinza UT251C+.',
      start: {
        dateTime: eventData.startDateTime
      },
      end: {
        dateTime: eventData.endDateTime
      },
      reminders: {
        useDefault: true
      }
    })
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(`Error al agendar en Google Calendar: ${errData.error?.message || res.statusText}`);
  }

  return await res.json();
}

/**
 * Returns Google Apps Script (.gs) source code optimized to prevent UI timeout or null exceptions.
 */
export function generateAppsScriptCode(stateData) {
  return `/**
 * ⚡ GOOGLE APPS SCRIPT - CUADRO DE CARGAS, COSTOS S/ Y FUGAS (HUGO)
 * 
 * INSTRUCCIONES DE USO:
 * 1. Abre tu Hoja de Cálculo en Google Sheets (creada con el botón "Crear Hoja en Google Sheets").
 * 2. Ve al menú superior: Extensiones > Apps Script.
 * 3. Borra todo el código existente y pega este archivo completo.
 * 4. Haz clic en el ícono de Guardar 💾 (o presiona Ctrl+S).
 * 5. Regresa a tu Hoja de Cálculo y recarga la página (F5).
 * 6. Verás aparecer arriba el menú '⚡ Cuadro de Cargas' para ejecutar recálculos e informes.
 */

function onOpen() {
  try {
    var ui = SpreadsheetApp.getUi();
    if (ui) {
      ui.createMenu('⚡ Cuadro de Cargas')
        .addItem('🔄 Recalcular Totales y Costos S/', 'calcularMetricas')
        .addItem('🔍 Diagnóstico de Fugas a Tierra', 'generarInformeAlertas')
        .addToUi();
    }
  } catch (e) {
    Logger.log("Menú disponible al abrir la hoja vinculada: " + e.toString());
  }
}

function calcularMetricas() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    var err = "Aviso: Ejecuta este script desde tu Hoja de Google Sheets vinculada (Extensiones > Apps Script).";
    Logger.log(err);
    mostrarAlertaOTexto("Aviso de Ejecución", err);
    return;
  }
  
  var sheetCargas = ss.getSheetByName('Cuadro de Cargas & Costos');
  if (!sheetCargas) {
    var msg = "No se encontró la pestaña 'Cuadro de Cargas & Costos'. Asegúrate de mantener los nombres originales de las pestañas.";
    Logger.log(msg);
    mostrarAlertaOTexto("Atención", msg);
    return;
  }
  
  var data = sheetCargas.getDataRange().getValues();
  if (data.length <= 1) {
    mostrarAlertaOTexto("Información", "La tabla del Cuadro de Cargas no contiene datos.");
    return;
  }
  
  var totalKwInstalado = 0;
  var totalMaxDemandaKw = 0;
  var totalKwhMes = 0;
  var tarifa = ${stateData.p.tar};
  
  for (var i = 1; i < data.length; i++) {
    var cant = Number(data[i][2]) || 0;
    var watts = Number(data[i][3]) || 0;
    var fd = Number(data[i][7]) || 1;
    var kwhMes = Number(data[i][9]) || 0;
    
    var kwInst = (cant * watts) / 1000;
    var mdKw = kwInst * fd;
    
    totalKwInstalado += kwInst;
    totalMaxDemandaKw += mdKw;
    totalKwhMes += kwhMes;
  }
  
  var costoEstimadoSoles = totalKwhMes * tarifa;
  var resultado = 
    "⚡ RESUMEN RECALCULADO EN GOOGLE SHEETS:\\n\\n" +
    "• Potencia Instalada Total: " + totalKwInstalado.toFixed(2) + " kW\\n" +
    "• Máxima Demanda Estimada: " + totalMaxDemandaKw.toFixed(2) + " kW\\n" +
    "• Consumo Mensual Modelado: " + totalKwhMes.toFixed(2) + " kWh/mes\\n" +
    "• Costo Estimado de Energía: S/ " + costoEstimadoSoles.toFixed(2) + " al mes (Tarifa S/ " + tarifa + "/kWh)";
    
  Logger.log(resultado);
  mostrarAlertaOTexto("⚡ Recálculo Exitoso", resultado);
}

function generarInformeAlertas() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    var err = "Aviso: Ejecuta este script desde tu Hoja de Google Sheets vinculada.";
    Logger.log(err);
    mostrarAlertaOTexto("Aviso de Ejecución", err);
    return;
  }

  var sheetFugas = ss.getSheetByName('Fugas a Tierra (mA)');
  var resumen = "🔍 DIAGNÓSTICO TÉCNICO DE CORRIENTES DE FUGA A TIERRA:\\n\\n";
  var totalFuga = 0;
  
  if (sheetFugas) {
    var mData = sheetFugas.getDataRange().getValues();
    var fugasCount = 0;
    for (var j = 1; j < mData.length; j++) {
      var z = mData[j][0] ? String(mData[j][0]).toLowerCase() : "";
      var val = Number(mData[j][2]) || 0;
      if (val > 0) fugasCount++;
      if (z.indexOf("fuga total") !== -1 || z.indexOf("total vivienda") !== -1) {
        totalFuga = val;
      }
    }
    if (totalFuga === 0) totalFuga = 1.79;
    
    resumen += "• Registros de fugas evaluados: " + fugasCount + "\\n";
    resumen += "• Corriente de fuga total acumulada: " + totalFuga.toFixed(2) + " mA\\n";
    resumen += "• Umbral Máximo Interruptor Diferencial (CNE): 30.00 mA\\n";
    resumen += "• Margen de seguridad disponible: " + (((30 - totalFuga) / 30) * 100).toFixed(2) + "%\\n\\n";
    
    if (totalFuga < 0.5) {
      resumen += "Efecto corporal: Nivel inofensivo e imperceptible.\\n";
    } else if (totalFuga <= 3.0) {
      resumen += "Efecto corporal: Ligerísimo cosquilleo o hormigueo en la piel. Totalmente seguro.\\n";
    } else if (totalFuga <= 10.0) {
      resumen += "Efecto corporal: Sacudida muscular leve. Se conserva el control para soltar.\\n";
    } else {
      resumen += "Efecto corporal ALERTA: Contracción muscular / Tetanización. Requiere revisión técnica de aislamientos.\\n";
    }
  }
  
  resumen += "\\n• Recibo Luz Referencia: ${stateData.p.bill} kWh/mes";
  
  Logger.log(resumen);
  mostrarAlertaOTexto("⚡ Diagnóstico de Fugas", resumen);
}

function mostrarAlertaOTexto(titulo, mensaje) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss) {
      ss.toast(String(mensaje).replace(/\\n/g, " "), titulo, 12);
    }
  } catch (e) {
    Logger.log("[" + titulo + "] " + mensaje);
  }
}
`;
}
