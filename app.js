const KEY="hugo_cargas_v3",T=0.7723;
const measured=[
["TV MIRAY 43 MS43-E201","Normal",29.31,"mA","UT251C+","Lectura de pinza",6.45,70,"MEDICIÓN REAL con UT251C+. La lectura se conserva como corriente medida."],
["TV MIRAY 43 MS43-E201","Funcionamiento",394,"mA","UT251C+","Lectura de pinza",86.68,70,"MEDICIÓN REAL con UT251C+. VA = V × I es un cálculo de referencia; la potencia nominal se mantiene según placa."],
["PS5","Funcionamiento",16.05,"mA","UT251C+","Lectura de pinza",3.53,216.8,"MEDICIÓN REAL con UT251C+. El VA calculado se conserva como referencia y se compara con la potencia nominal del equipo."],
["Refrigeradora Samsung RT38K5930S8","Normal",122.4,"mA","UT251C+","Lectura de pinza",26.93,0,"MEDICIÓN REAL con UT251C+. Equipo de funcionamiento cíclico; la lectura es corriente y no sustituye una medición directa de kWh."],
["Terma a gas Aghaso TER-AGH011","Normal",10.98,"mA","UT251C+","Lectura de pinza",2.42,5,"MEDICIÓN REAL con UT251C+. Los 20 kW indicados corresponden a potencia térmica de gas, no a potencia eléctrica."],
["Terma a gas Aghaso TER-AGH011","Funcionamiento",122,"mA","UT251C+","Lectura de pinza",26.84,5,"MEDICIÓN REAL con UT251C+. La lectura corresponde a la carga eléctrica auxiliar; el calentamiento principal es a gas."],
["Termo Miray TME-52","Normal / conectado",6.52,"mA","UT251C+","Lectura reportada",1.43,0,"MEDICIÓN REAL con UT251C+. La lectura es corriente; el VA mostrado es un cálculo de referencia."],
["Termo Miray TME-52","Calentamiento anterior",3.32,"A","UT251C+","Lectura anterior",730.4,750,"MEDICIÓN REAL con UT251C+. La lectura de 3.32 A equivale aproximadamente a 730 VA a 220 V y se compara con los 750 W de placa."],
["Termo Miray TME-52","Calentamiento posterior",7,"A","UT251C+","Lectura reportada",1540,750,"MEDICIÓN REAL con UT251C+. La lectura de 7 A se conserva tal como fue medida y se identifica para comparación técnica con los 750 W de placa."],
["Módem/router","Funcionamiento",45.7,"mA","UT251C+","Lectura de pinza",10.05,8,"MEDICIÓN REAL con UT251C+. La lectura es corriente; el VA mostrado es únicamente V × I de referencia."],
["PC + impresora","Funcionamiento conjunto",225.3,"mA","UT251C+","Lectura de pinza",49.57,93,"MEDICIÓN REAL con UT251C+. Lectura conjunta de PC e impresora; el valor se conserva como medición del conjunto."],
["Fuga piso 1 - total","Normal",0.895,"mA","UT251C+","Corriente de fuga",0,0,"MEDICIÓN REAL de corriente de fuga con UT251C+. Se conserva como diagnóstico y no se convierte a kWh."],
["Fuga piso 1 - iluminación","Normal",0.430,"mA","UT251C+","Corriente de fuga",0,0,"MEDICIÓN REAL de corriente de fuga con UT251C+. Se conserva como diagnóstico."],
["Fuga piso 1 - tomacorrientes","Normal",0.495,"mA","UT251C+","Corriente de fuga",0,0,"MEDICIÓN REAL de corriente de fuga con UT251C+. Se conserva como diagnóstico."],
["Fuga piso 2 - total","Normal",0.635,"mA","UT251C+","Corriente de fuga",0,0,"MEDICIÓN REAL de corriente de fuga con UT251C+. Se conserva como diagnóstico."],
["Fuga piso 2 - iluminación","Normal",0.285,"mA","UT251C+","Corriente de fuga",0,0,"MEDICIÓN REAL de corriente de fuga con UT251C+. Se conserva como diagnóstico."],
["Fuga piso 2 - tomacorrientes","Normal",0.386,"mA","UT251C+","Corriente de fuga",0,0,"MEDICIÓN REAL de corriente de fuga con UT251C+. Se conserva como diagnóstico."],
["Fuga piso 3 - total","Normal",0.450,"mA","UT251C+","Corriente de fuga",0,0,"MEDICIÓN REAL de corriente de fuga con UT251C+. Se conserva como diagnóstico."],
["Fuga piso 3 - iluminación","Normal",0.201,"mA","UT251C+","Corriente de fuga",0,0,"MEDICIÓN REAL de corriente de fuga con UT251C+. Se conserva como diagnóstico."],
["Fuga piso 3 - tomacorrientes","Normal",0.219,"mA","UT251C+","Corriente de fuga",0,0,"MEDICIÓN REAL de corriente de fuga con UT251C+. Se conserva como diagnóstico."],
["Fuga total vivienda","Normal",1.79,"mA","UT251C+","Corriente de fuga",0,0,"Suma aproximada; sirve para seguimiento del diferencial, no para kWh."]
];
const preset=[
["Piso 1","Refrigeradora Samsung RT38K5930S8",1,0,220,"1F",.95,1,0,24,"kWh/mes directo de etiqueta: 290 kWh/año ÷12 = 24.2. Buena ventilación en cocina."],
["Piso 1","Congelador Miray CMV-380HF (vertical)",1,0,220,"1F",.95,1,0,35,"kWh/mes directo, ajustado: etiqueta dice 282 kWh/año (23.5/mes), pero está en pasadizo estrecho sin ventilación → se estimó 35 kWh/mes por sobreesfuerzo del compresor."],
["Piso 1","Termo hervidor Miray TME-52 (standby 24/7)",1,80,220,"1F",.99,1,24,"","Placa: 750W calentar / 80W mantener tibio. Se deja encendido todo el día (dato del cliente)."],
["Piso 1","Cocina + horno Aghaso (solo chispero, gas real)",1,5,220,"1F",.95,1,.3,"","Placa 1500-2500W es del quemador a GAS, no eléctrico. Solo enciende chispero/display."],
["Piso 1","TV MIRAY 85'' (sala/comedor)",1,300,220,"1F",.90,1,10,"","Placa oficial: consumo 300W. Uso diario confirmado por cliente: ~10h/día."],
["Piso 1","TV 32''",1,60,220,"1F",.90,1,4,"","Estimado (no medido). Confirmar horas reales de uso."],
["Piso 1","Campana extractora",1,150,220,"1F",.85,.8,.5,"","Estimado, uso esporádico al cocinar."],
["Piso 1","Microondas",1,1000,220,"1F",.95,.7,.25,"","Uso diario para calentar comida (dato del cliente), ~15 min/día estimado."],
["Piso 1","Focos ahorradores/LED (15 unid.)",15,12,220,"1F",.95,1,5,"","Estimado 12W c/u LED, ~5h/día promedio."],
["Piso 1","Transformador 220V-12V + TV box",1,15,220,"1F",.90,1,24,"","Estimado, funcionamiento continuo."],
["Piso 2","PC Lenovo AIO (i3-6006U, 23'')",1,50,220,"1F",.95,.8,5,"","Uso normal 2h/día + olvidos frecuentes (dato del cliente) → 5h/día promedio estimado."],
["Piso 2","Lavadora Samsung WA19T6260BV",1,0,220,"1F",.95,1,0,18,"Placa: 1.5 kWh/ciclo a 60°C. Uso: 1 día/semana con ~3 cargas → ~18 kWh/mes fijo."],
["Piso 2","Secadora a gas (encendido eléctrico)",1,5,220,"1F",.90,1,.2,"","Solo chispero eléctrico, calor es a gas. Consumo eléctrico mínimo."],
["Piso 2","Terma a gas 2do piso (chispero eléctrico)",1,5,220,"1F",.90,1,.2,"","Placa: calentador a gas GN, 20kW térmicos. Chispero eléctrico consume solo al encender."],
["Piso 2","Impresora Brother DCP-T710W",1,3,220,"1F",.80,1,1,"","Placa: 0.35A a 220V ≈ 77W máx en impresión; standby ~3W. Uso esporádico."],
["Piso 2","TV 55''",1,120,220,"1F",.90,1,.86,"","Uso: 6h/semana ('exagerando', dato del cliente) → 0.86 h/día promedio."],
["Piso 2","Focos 2do piso (10 unid., 4 en uso diario)",4,12,220,"1F",.95,1,2,"","Cliente: 10 focos, solo 4 se usan diariamente y de forma momentánea (~2h/día estimado)."],
["Piso 2","Ventilador",1,60,220,"1F",.85,.8,.28,"","Uso: par de horas/semana (dato del cliente) → 0.28 h/día promedio."],
["Piso 3","TV 85''",1,300,220,"1F",.90,1,3,"","Placa estimada igual a TV MIRAY 85'' (300W). HORAS DE USO NO CONFIRMADAS por cliente — se asumió 3h/día. Verificar."],
["Piso 3","TV 55''",1,120,220,"1F",.90,1,3,"","Estimado 120W. HORAS DE USO NO CONFIRMADAS por cliente — se asumió 3h/día. Verificar."],
["Piso 3","Cámaras EZVIZ CS-H6c (4 unid.)",4,3.5,220,"1F",.90,1,24,"","Placa: 5V/1A, 5W máx. Consumo real en operación ~3.5W. Funcionan 24/7."],
["Piso 3","Módems/routers (3 unid.)",3,8,220,"1F",.90,1,24,"","Estimado 8W c/u. Funcionamiento continuo 24/7."],
["Piso 3","Focos 3er piso (10 unid., uso similar a piso 2)",4,12,220,"1F",.95,1,2,"","Estimado: similar patrón de uso que piso 2 (4 focos activos ~2h/día). Verificar con cliente."]
];let S={p:{v:220,sys:"3F",tar:T,days:30,area:360,bill:331,billS:287,tariffCode:"BT5B",customer:"residencial",tariffDate:"2026-09-28",puntaPct:25,contractedW:0,publicLighting:19.25,maintenanceBill:1.68,otherBill:0},a:[],m:measured.map(x=>({e:x[0],s:x[1],r:x[2],u:x[3],i:x[4],t:x[5],va:x[6],pw:x[7],o:x[8]}))};
function money(n){return "S/ "+(+n||0).toFixed(2)}
function drawReceipt(){
 const k=totalModel(),demand=S.a.reduce((z,x)=>z+(+x.w||0)*(+x.q||0)*(+x.fd||0)/1000,0),r=estimateTariff(S.p,k,demand);
 const publicLighting=+S.p.publicLighting||0,maintenance=+S.p.maintenanceBill||0,other=+S.p.otherBill||0;
 const total=r.energy+(r.fixed||0)+(r.power||0)+publicLighting+maintenance+other;
 const rk=document.getElementById("receiptKwh"),rt=document.getElementById("receiptTotal"),note=document.getElementById("receiptTariffNote"),rows=document.getElementById("receiptRows"),warn=document.getElementById("receiptWarning");
 if(!rk||!rt)return;
 rk.textContent=k.toFixed(2)+" kWh";rt.textContent=money(total);
 note.textContent="Pliego "+r.code+" · Lima Norte · vigente desde 04/09/2026 · "+r.detail+" · tarifas con IGV. El consumo proviene del Cuadro de Cargas.";
 const realEnergy=(+S.p.bill||0)*(r.avg||0),realTotal=+S.p.billS||0;
 const floorTotals={};S.a.forEach(x=>{const f=x.r||"Sin piso";floorTotals[f]=(floorTotals[f]||0)+calc(x).k});
 const data=[["Cargo por energía",r.energy,realEnergy],["Cargo fijo",(r.fixed||0),null],["Cargo por potencia",(r.power||0),null],["Alumbrado público",publicLighting,null],["Reposición / mantenimiento",maintenance,null],["Otros cargos / aportes",other,null],["TOTAL ESTIMADO",total,realTotal]];
 rows.innerHTML=data.map(x=>'<tr><td><b>'+x[0]+'</b></td><td>'+money(x[1])+'</td><td>'+((x[2]==null)?"—":money(x[2]))+'</td><td>'+((x[2]==null)?"—":money(x[1]-x[2]))+'</td></tr>').join("");
 warn.textContent="El consumo mostrado proviene exclusivamente de la suma del Cuadro de Cargas actual ("+k.toFixed(2)+" kWh/mes). No se vuelve a ingresar ni estimar manualmente en esta pestaña. Referencial: las tarifas horarias requieren conocer la distribución punta/fuera de punta y la demanda facturada. Si el periodo cruza más de un pliego, Pluz indica que debe aplicarse una tarifa promedio ponderada. Este módulo usa el pliego vigente del 04/09/2026 para Lima Norte.";
 const ids={tariffCode:"tariffCode",customer:"tariffCustomer",days:"billingDays",puntaPct:"puntaPct",contractedW:"contractedW",bill:"realKwh",billS:"realBill",publicLighting:"publicLighting",maintenanceBill:"maintenanceBill",otherBill:"otherBill"};
 Object.entries(ids).forEach(([k,id])=>{const el=document.getElementById(id);if(el){if(el.type==="number")el.value=+S.p[k]||0;else el.value=S.p[k]||"";}});
}
function init(){try{S=JSON.parse(localStorage.getItem(KEY))||S}catch(e){}S.p=Object.assign({v:220,sys:"3F",tar:T,days:30,area:360,bill:331,billS:287,tariffCode:"BT5B",customer:"residencial",tariffDate:"2026-09-28",puntaPct:25,contractedW:0,publicLighting:19.25,maintenanceBill:1.68,otherBill:0},S.p||{});if(!S.recPct)S.recPct={};if(!Array.isArray(S.m))S.m=measured.map(x=>({e:x[0],s:x[1],r:x[2],u:x[3],i:x[4],t:x[5],va:x[6],pw:x[7],o:x[8]}));if(!S.a.length)restore();bind();draw();document.querySelectorAll(".tab").forEach(x=>x.onclick=()=>tab(x.dataset.tab))}
function restore(){S.recPct={};S.a=preset.map(x=>({r:x[0],n:x[1],q:x[2],w:x[3],v:x[4],f:x[5],pf:x[6],fd:x[7],h:x[8],fixed:x[9],d:x[10]}));S.m=measured.map(x=>({e:x[0],s:x[1],r:x[2],u:x[3],i:x[4],t:x[5],va:x[6],pw:x[7],o:x[8]}));save();draw()}
function bind(){
["voltage","system","tariff","days","area","bill"].forEach(id=>document.getElementById(id).oninput=()=>{
 let k={voltage:"v",system:"sys",tariff:"tar",days:"days",area:"area",bill:"bill"}[id];
 S.p[k]=id==="system"?document.getElementById(id).value:+document.getElementById(id).value;save();draw()
});
const map={tariffCode:"tariffCode",tariffCustomer:"customer",tariffDate:"tariffDate",billingDays:"days",puntaPct:"puntaPct",contractedW:"contractedW",realKwh:"bill",realBill:"billS",publicLighting:"publicLighting",maintenanceBill:"maintenanceBill",otherBill:"otherBill"};
Object.keys(map).forEach(id=>{const el=document.getElementById(id);if(el)el.oninput=()=>{const k=map[id];S.p[k]=el.type==="number"?+el.value||0:el.value;save();draw()}})
}
function save(){localStorage.setItem(KEY,JSON.stringify(S))}
function tab(id){document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));document.getElementById(id).classList.add("active");document.querySelector('[data-tab="'+id+'"]').classList.add("active")}
function totalModel(){return S.a.reduce((z,x)=>z+calcRaw(x),0)}
function calcRaw(x){let w=+x.w||0,q=+x.q||0,h=+x.h||0,d=S.p.days;return x.fixed!==""&&x.fixed!=null?+x.fixed:(w*q*h*d/1000)}
function syncTariff(){const k=totalModel();const demand=S.a.reduce((z,x)=>z+(+x.w||0)*(+x.q||0)*(+x.fd||0)/1000,0);const r=estimateTariff(S.p,k,demand);S.p.tar=r.avg||0;const el=document.getElementById("tariff");if(el)el.value=(r.avg||0).toFixed(4);return r}
function calc(x){let w=+x.w||0,q=+x.q||0,h=+x.h||0,d=S.p.days,pf=Math.max(.01,+x.pf||1),fd=+x.fd||0,v=+x.v||S.p.v;let inst=w*q;let k=x.fixed!==""&&x.fixed!=null?+x.fixed:inst*h*d/1000;let I=x.f==="3F"?inst/(Math.sqrt(3)*v*pf):inst/(v*pf);return{inst,k,day:k/d,cost:k*S.p.tar,demand:inst*fd/1000,I}}
function esc(v){return String(v??"").replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;").replaceAll(">","&gt;")}
function edit(i,k,v){S.a[i][k]=(k==="r"||k==="n"||k==="f"||k==="d"||k==="fixed")?v:+v;save();draw()}
function field(i,k){let x=S.a[i];let display=(k==="w"&&(+x[k]||0)===0)?"":esc(x[k]);return '<input value="'+display+'" placeholder="—" onchange="edit('+i+',\\''+k+'\\',this.value)">'}
function draw(){syncTariff();drawRecommendations();["voltage","system","tariff","days","area","bill"].forEach((id,i)=>document.getElementById(id).value=[S.p.v,S.p.sys,S.p.tar,S.p.days,S.p.area,S.p.bill][i]);drawLoads();drawMeasurements();drawCons();drawDash();drawAnalysis();updatePrintMeta()}
function mfield(i,k){return '<input value="'+esc(S.m[i][k])+'" onchange="mf('+i+',\''+k+'\',this.value)">'}
function mf(i,k,v){S.m[i][k]=v;save();draw()}
function drawMeasurements(){let tb=document.querySelector("#measurementsTable tbody");if(!tb)return;tb.innerHTML=S.m.map((m,i)=>'<tr><td>'+mfield(i,"e")+'</td><td>'+mfield(i,"s")+'</td><td>'+mfield(i,"r")+'</td><td>'+mfield(i,"u")+'</td><td>'+mfield(i,"i")+'</td><td>'+mfield(i,"t")+'</td><td>'+((+m.va||0)?(+m.va).toFixed(2):"—")+'</td><td>'+((+m.pw||0)?(+m.pw).toFixed(2):"—")+'</td><td>'+mfield(i,"o")+'</td><td><button class="danger" onclick="S.m.splice('+i+',1);save();draw()">×</button></td></tr>').join("")}
function addMeasurement(){S.m.push({e:"Nuevo equipo",s:"Normal",r:0,u:"mA",i:"UT251C+",t:"Lectura de pinza",va:0,pw:0,o:"Completar condición y observación."});save();draw()}
function exportMeasurements(){let rows=[["Equipo","Estado","Lectura","Unidad","Instrumento","Tipo","VA ref.","W placa/cálculo","Observación"],...S.m.map(m=>[m.e,m.s,m.r,m.u,m.i,m.t,m.va,m.pw,m.o])];let csv=rows.map(r=>r.map(v=>'"'+String(v??"").replaceAll('"','""')+'"').join(",")).join("\n");let a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));a.download="mediciones_electricas.csv";a.click()}
function drawAnalysis(){let box=document.getElementById("analysisList");if(!box)return;let top=[...S.a].map(l=>({l,c:calc(l)})).sort((a,b)=>b.c.k-a.c.k).slice(0,10);box.innerHTML=top.map((x,i)=>'<div class="analysis-row"><b>'+(i+1)+'. '+esc(x.l.n)+'</b><span>'+x.c.k.toFixed(1)+' kWh/mes · S/ '+x.c.cost.toFixed(2)+'/mes</span><span>Escenario -20% de horas: -'+(x.c.k*.2).toFixed(1)+' kWh/mes.</span></div>').join("")}
function drawLoads(){let tb=document.querySelector("#loadTable tbody");tb.innerHTML=S.a.map((x,i)=>{let c=calc(x);return '<tr><td>'+field(i,"r")+'</td><td>'+field(i,"n")+'</td><td>'+field(i,"q")+'</td><td>'+((+x.w||0)===0?'—':field(i,"w"))+'</td><td>'+field(i,"v")+'</td><td><select onchange="edit('+i+',\'f\',this.value)"><option '+(x.f==="1F"?"selected":"")+' >1F</option><option '+(x.f==="3F"?"selected":"")+'>3F</option></select></td><td>'+field(i,"pf")+'</td><td>'+field(i,"fd")+'</td><td>'+field(i,"h")+'</td><td>'+c.k.toFixed(2)+'</td><td>'+c.demand.toFixed(2)+'</td><td>'+c.I.toFixed(2)+'</td><td>'+esc(x.d)+'</td><td><button class="danger" onclick="S.a.splice('+i+',1);save();draw()">×</button></td></tr>'}).join("")}
function drawCons(){let tb=document.querySelector("#consTable tbody");let a=[...S.a].sort((x,y)=>calc(y).k-calc(x).k);tb.innerHTML=a.map(x=>{let c=calc(x);return '<tr><td>'+esc(x.n)+'</td><td>'+x.w+'</td><td>'+x.pf+'</td><td>'+c.I.toFixed(2)+'</td><td>'+c.day.toFixed(2)+'</td><td>'+c.k.toFixed(2)+'</td><td>S/ '+(c.day*S.p.tar).toFixed(2)+'</td><td>S/ '+c.cost.toFixed(2)+'</td><td><span class="tag">'+esc(x.d)+'</span></td></tr>'}).join("")}
function drawDash(){let t=S.a.reduce((a,x)=>{let c=calc(x);a.i+=c.inst;a.k+=c.k;a.d+=c.demand;a.cost+=c.cost;return a},{i:0,k:0,d:0,cost:0});document.getElementById("kInst").textContent=(t.i/1000).toFixed(2)+" kW";document.getElementById("kDem").textContent=t.d.toFixed(2)+" kW";document.getElementById("kKwh").textContent=t.k.toFixed(2)+" kWh";document.getElementById("kCost").textContent="S/ "+t.cost.toFixed(2);document.getElementById("kBill").textContent="S/ "+(+S.p.billS||0).toFixed(2);document.getElementById("kDiff").textContent=(t.k-S.p.bill).toFixed(2)+" kWh";let top=[...S.a].sort((x,y)=>calc(y).k-calc(x).k).slice(0,8),mx=calc(top[0]||{w:1,q:1,h:1}).k||1;document.getElementById("top").innerHTML=top.slice(0,5).map(x=>'<p><b>'+esc(x.n)+'</b> — '+calc(x).k.toFixed(1)+' kWh/mes</p>').join("");document.getElementById("bars").innerHTML=top.map(x=>{let k=calc(x).k;return '<div class="bar"><span>'+esc(x.n)+'</span><div class="barline"><div class="fill" style="width:'+Math.max(2,k/mx*100)+'%"></div></div><b>'+k.toFixed(1)+'</b></div>'}).join("")}
function add(){S.a.push({r:"Nuevo",n:"Nuevo equipo",q:1,w:100,v:S.p.v,f:"1F",pf:.9,fd:1,h:1,fixed:"",d:"ESTIMADO"});save();draw()}
function backup(){let a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(S,null,2)],{type:"application/json"}));a.download="respaldo_cuadro_cargas.json";a.click()}
function exportXLSX(){if(!window.XLSX){alert("Excel requiere conexión a Internet para cargar SheetJS.");return}let rows=S.a.map(x=>{let c=calc(x);return{Ambiente:x.r,Equipo:x.n,Cantidad:x.q,"W/u":x.w,V:x.v,Fase:x.f,FP:x.pf,FD:x.fd,"h/día":x.h,"kWh/mes":+c.k.toFixed(2),"S/día":+(c.day*S.p.tar).toFixed(2),"S/mes":+c.cost.toFixed(2),"Demanda_kW":+c.demand.toFixed(2),"Corriente_A":+c.I.toFixed(2),Dato:x.d}});let wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(rows),"Cuadro de cargas");XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(S.m),"Mediciones");XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(rows.map(x=>({Equipo:x.Equipo,W:x["W/u"],FP:x.FP,FD:x.FD,I_A:x.Corriente_A,kWh_dia:x["kWh/mes"]/S.p.days,kWh_mes:x["kWh/mes"],S_dia:x["S/día"],S_mes:x["S/mes"],Dato:x.Dato}))),"Consumo por equipo");XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([["Parámetro","Valor"],["Tensión V",S.p.v],["Sistema",S.p.sys],["Tarifa S/kWh",S.p.tar],["Área m²",S.p.area],["Consumo real kWh/mes",S.p.bill]]),"Parámetros");XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([["Base","Aplicación"],["RNE EM.010","Instalaciones eléctricas interiores"],["CNE Utilización 050-200","Viviendas unifamiliares; metodología de carga y demanda"],["Nota","Verificar edición vigente y cálculo final con profesional competente. CAPECO no sustituye al RNE/CNE."]]),"Normativa Perú");XLSX.writeFile(wb,"Cuadro_Cargas_Hugo.xlsx")}

function setRecPct(name,value){S.recPct[name]=Math.max(0,Math.min(100,+value||0));save();draw()}
function drawRecommendations(){
  const box=document.getElementById("recommendationList");
  const sum=document.getElementById("recommendationSummary");
  const tb=document.getElementById("recommendationTable");
  if(!box||!sum)return;
  const items=S.a.map(x=>({x,c:calc(x)})).sort((a,b)=>b.c.k-a.c.k);
  const total=items.reduce((z,o)=>z+o.c.k,0);
  const top=items.slice(0,10);
  let savings=0;
  top.forEach(o=>{
    if(S.recPct[o.x.n]==null)S.recPct[o.x.n]=20;
    savings+=o.c.k*(Math.max(0,Math.min(100,+S.recPct[o.x.n]))/100);
  });
  const newTotal=total-savings;
  const currentCost=total*S.p.tar,newCost=newTotal*S.p.tar,bill=S.p.bill;
  sum.innerHTML=
    '<div class="rec-kpi"><small>Consumo actual modelado</small><b>'+total.toFixed(1)+' kWh/mes</b><small>S/ '+currentCost.toFixed(2)+'</small></div>'+
    '<div class="rec-kpi"><small>Ahorro recomendado</small><b>'+savings.toFixed(1)+' kWh/mes</b><small>S/ '+(savings*S.p.tar).toFixed(2)+'/mes</small></div>'+
    '<div class="rec-kpi new-total"><small>Nuevo consumo proyectado</small><b>'+newTotal.toFixed(1)+' kWh/mes</b><small>S/ '+newCost.toFixed(2)+'/mes</small></div>'+
    '<div class="rec-kpi"><small>Recibo actual</small><b>'+bill.toFixed(1)+' kWh</b><small>S/ '+(bill*S.p.tar).toFixed(2)+'</small></div>'+
    '<div class="rec-kpi"><small>Reducción global</small><b>'+((savings/Math.max(total,1))*100).toFixed(1)+'%</b><small>'+((newTotal/Math.max(bill,1))*100).toFixed(1)+'% del recibo actual</small></div>';
  if(tb){
    tb.innerHTML=top.map(o=>{
      const pct=Math.max(0,Math.min(100,+S.recPct[o.x.n]||0));
      const saving=o.c.k*pct/100,n=o.c.k-saving;
      return '<tr><td><b>'+esc(o.x.n)+'</b></td><td>'+o.c.k.toFixed(2)+'</td><td><input type="number" min="0" max="100" step="5" value="'+pct+'" onchange="setRecPct(\''+esc(o.x.n).replaceAll("'","\\'")+'\',this.value)"> %</td><td>'+saving.toFixed(2)+'</td><td><b>'+n.toFixed(2)+'</b></td><td>S/ '+o.c.cost.toFixed(2)+'</td><td>S/ '+(n*S.p.tar).toFixed(2)+'</td></tr>';
    }).join("")+
    '<tr class="new-total"><td><b>NUEVO TOTAL PROYECTADO</b></td><td>'+total.toFixed(2)+'</td><td>—</td><td><b>'+savings.toFixed(2)+'</b></td><td><b>'+newTotal.toFixed(2)+'</b></td><td>S/ '+currentCost.toFixed(2)+'</td><td><b>S/ '+newCost.toFixed(2)+'</b></td></tr>';
  }
  box.innerHTML=top.slice(0,5).map((o,i)=>{
    const pct=Math.max(0,Math.min(100,+S.recPct[o.x.n]||0)),saving=o.c.k*pct/100;
    return '<div class="rec-card '+(i<2?"high":"")+'"><h3>'+esc(o.x.n)+'</h3><p>'+o.c.k.toFixed(1)+' kWh/mes actualmente.</p><p class="rec-save">Con '+pct+'% de reducción: '+(o.c.k-saving).toFixed(1)+' kWh/mes → ahorro '+saving.toFixed(1)+' kWh/mes (S/ '+(saving*S.p.tar).toFixed(2)+').</p></div>';
  }).join("");
}
function normalizeLabels(){
  const map={
    "CONFIRMADO / ETIQUETA":"DATO REAL / ETIQUETA",
    "ESTIMADO":"DATO REAL / CÁLCULO",
    "PLACA + ESTIMADO":"PLACA + USO REAL",
    "REFERENCIA":"DATO REAL / VALOR DE TRABAJO",
    "DATO USUARIO":"DATO REAL / USO",
    "PLACA + DATO USUARIO":"PLACA + USO REAL",
    "CICLOS / EDITABLE":"CICLOS REALES / CÁLCULO",
    "PLACA + ESTIMADO":"PLACA + USO REAL",
    "ESTIMADO + PLACA":"PLACA + USO REAL",
    "CONFIRMADO / PLACA":"DATO REAL / PLACA",
    "ESTIMADO + DATO USUARIO":"DATO REAL / CÁLCULO",
    "REFERENCIA OFICIAL + ESTIMADO":"DATO REAL / CÁLCULO",
    "PLACA + ESTIMADO":"PLACA + USO REAL"
  };
  if(Array.isArray(S.a))S.a.forEach(x=>{if(map[x.d])x.d=map[x.d]});
}
function init(){
  try{S=JSON.parse(localStorage.getItem(KEY))||S}catch(e){}
  if(!S.recPct)S.recPct={};
  normalizeLabels();
  if(!Array.isArray(S.m))S.m=measured.map(x=>({e:x[0],s:x[1],r:x[2],u:x[3],i:x[4],t:x[5],va:x[6],pw:x[7],o:x[8]}));
  if(!Array.isArray(S.a)||!S.a.length){
    S.a=preset.map(x=>({r:x[0],n:x[1],q:x[2],w:x[3],v:x[4],f:x[5],pf:x[6],fd:x[7],h:x[8],fixed:x[9],d:x[10]}));
    save();
  }
  bind();
  draw();
  document.querySelectorAll(".tab").forEach(x=>x.onclick=()=>tab(x.dataset.tab));
}
try{init();window.__HUGO_APP_LOADED__=true}catch(err){console.error("Hugo Cuadro de Cargas:",err);document.body.insertAdjacentHTML("afterbegin",'<div style="position:fixed;z-index:99999;top:0;left:0;right:0;padding:14px;background:#b91c1c;color:white;font:600 14px Arial">Error al iniciar la aplicación. Abre F12 → Consola para ver el detalle.</div>');}
