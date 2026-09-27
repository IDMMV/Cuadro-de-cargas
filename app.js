const KEY="hugo_cargas_v2",T=0.6545;
const measured=[
["TV MIRAY 43 MS43-E201","Normal",29.31,"mA","UT251C+","Lectura de pinza",6.45,70,"Lectura reportada; no convertir directamente a W."],
["TV MIRAY 43 MS43-E201","Funcionamiento",394,"mA","UT251C+","Lectura de pinza",86.68,70,"VA de referencia; potencia activa de diseño sigue siendo 70 W de placa."],
["PS5","Funcionamiento",16.05,"mA","UT251C+","Lectura de pinza",3.53,216.8,"No coincide con el consumo esperado; revisar punto y método de medición."],
["Refrigeradora Samsung RT38K5930S8","Normal",122.4,"mA","UT251C+","Lectura de pinza",26.93,0,"El compresor trabaja por ciclos; validar con medidor de energía."],
["Terma a gas Aghaso TER-AGH011","Normal",10.98,"mA","UT251C+","Lectura de pinza",2.42,5,"Los 20 kW de placa son térmicos de gas, no eléctricos."],
["Terma a gas Aghaso TER-AGH011","Funcionamiento",122,"mA","UT251C+","Lectura de pinza",26.84,5,"Carga eléctrica auxiliar; calentamiento principal a gas."],
["Termo Miray TME-52","Normal / conectado",6.52,"mA","UT251C+","Lectura reportada",1.43,0,"Corriente reportada; no es potencia real."],
["Termo Miray TME-52","Calentamiento anterior",3.32,"A","UT251C+","Lectura anterior",730.4,750,"Aproximadamente coherente con 750 W a 220 V."],
["Termo Miray TME-52","Calentamiento posterior",7,"A","UT251C+","Lectura reportada",1540,750,"REVISAR: no coincide con placa de 750 W; repetir medición."],
["Módem/router","Funcionamiento",45.7,"mA","UT251C+","Lectura de pinza",10.05,8,"Comparación orientativa; validar con medidor de energía."],
["PC + impresora","Funcionamiento conjunto",225.3,"mA","UT251C+","Lectura de pinza",49.57,93,"Medición conjunta; separar PC e impresora."],
["Fuga piso 1 - total","Normal",0.895,"mA","UT251C+","Corriente de fuga",0,0,"Diagnóstico de fuga; no convertir a kWh."],
["Fuga piso 1 - iluminación","Normal",0.430,"mA","UT251C+","Corriente de fuga",0,0,"Diagnóstico de fuga."],
["Fuga piso 1 - tomacorrientes","Normal",0.495,"mA","UT251C+","Corriente de fuga",0,0,"Diagnóstico de fuga."],
["Fuga piso 2 - total","Normal",0.635,"mA","UT251C+","Corriente de fuga",0,0,"Diagnóstico de fuga."],
["Fuga piso 2 - iluminación","Normal",0.285,"mA","UT251C+","Corriente de fuga",0,0,"Diagnóstico de fuga."],
["Fuga piso 2 - tomacorrientes","Normal",0.386,"mA","UT251C+","Corriente de fuga",0,0,"Diagnóstico de fuga."],
["Fuga piso 3 - total","Normal",0.450,"mA","UT251C+","Corriente de fuga",0,0,"Diagnóstico de fuga."],
["Fuga piso 3 - iluminación","Normal",0.201,"mA","UT251C+","Corriente de fuga",0,0,"Diagnóstico de fuga."],
["Fuga piso 3 - tomacorrientes","Normal",0.219,"mA","UT251C+","Corriente de fuga",0,0,"Diagnóstico de fuga."],
["Fuga total vivienda","Normal",1.79,"mA","UT251C+","Corriente de fuga",0,0,"Suma aproximada; sirve para seguimiento del diferencial, no para kWh."]
];
const preset=[
["Piso 1","Refrigeradora Samsung RT38K5930S8",1,0,220,"1F",.95,1,24.0,24.17,"CONFIRMADO / ETIQUETA"],
["Piso 1","Congelador Miray CMV-380HF",1,0,220,"1F",.95,1,24,35,"ESTIMADO"],
["Piso 1","Termo hervidor Miray TME-52",1,750,220,"1F",.99,1,.5,"","PLACA + ESTIMADO"],
["Piso 1","Cocina + horno Aghaso (chispero/display)",1,5,220,"1F",.95,1,.3,"","ESTIMADO"],
["Piso 1","TV MIRAY QLED 85 MQ85-E2000GBT",1,300,220,"1F",.90,1,10,"","ESTIMADO"],
["Piso 1","TV MIRAY 32",1,55,220,"1F",.90,1,4,"","REFERENCIA"],
["Piso 1","Campana extractora",1,150,220,"1F",.85,.8,.5,"","ESTIMADO"],
["Piso 1","Microondas",1,1000,220,"1F",.95,.7,.25,"","ESTIMADO"],
["Piso 1","Iluminación sala/comedor",4,12,220,"1F",.95,1,5.5,"","DATO USUARIO"],
["Piso 1","Transformador + TV box",1,15,220,"1F",.90,1,24,"","ESTIMADO"],
["Piso 2","PC Lenovo AIO",1,90,220,"1F",.95,.8,3,"","PLACA + DATO USUARIO"],
["Piso 2","Lavadora Samsung WA19T6260BV",1,900,220,"1F",.85,1,.38,15.6,"CICLOS / EDITABLE"],
["Piso 2","Secadora a gas",1,5,220,"1F",.90,1,.57,"","ESTIMADO"],
["Piso 2","Terma a gas Aghaso TER-AGH011",1,5,220,"1F",.90,1,.2,"","PLACA + ESTIMADO"],
["Piso 2","Impresora Brother DCP-T710W",1,3,220,"1F",.80,1,1,"","ESTIMADO + PLACA"],
["Piso 2","TV LG 55 55UM7100PSA",1,140,220,"1F",.90,1,.86,"","CONFIRMADO / PLACA"],
["Piso 2","Focos 2do piso",4,12,220,"1F",.95,1,2,"","DATO USUARIO"],
["Piso 2","Ventilador",1,60,220,"1F",.85,.8,.28,"","ESTIMADO"],
["Piso 3","TV MIRAY QLED 85 MQ85-E2000GBT",1,300,220,"1F",.90,1,3,"","ESTIMADO"],
["Piso 3","TV MIRAY 43 MS43-E201",1,70,220,"1F",.90,1,3,"","CONFIRMADO / PLACA"],
["Piso 3","Cámaras EZVIZ CS-H6c",4,5,220,"1F",.90,1,24,"","CONFIRMADO / PLACA"],
["Piso 3","Módems/routers",5,8,220,"1F",.90,1,24,"","ESTIMADO + DATO USUARIO"],
["Piso 3","Focos 3er piso",4,12,220,"1F",.95,1,2,"","ESTIMADO"],
["Piso 3","PS5",1,216.8,220,"1F",.95,1,2,"","REFERENCIA OFICIAL + ESTIMADO"],
["Piso 3","Plancha Oster GCSTC5000-053",1,2200,220,"1F",.98,1,.107,"","PLACA + ESTIMADO"],
["Piso 3","Lámpara emergencia LED HALUX",1,3,220,"1F",.90,1,24,"","ESTIMADO"],
["Piso 3","Reloj de pared LED",1,3,220,"1F",.90,1,24,"","ESTIMADO"]
];
let S={p:{v:220,sys:"3F",tar:T,days:30,area:360,bill:331},a:[],m:measured.map(x=>({e:x[0],s:x[1],r:x[2],u:x[3],i:x[4],t:x[5],va:x[6],pw:x[7],o:x[8]}))};
function init(){try{S=JSON.parse(localStorage.getItem(KEY))||S}catch(e){}if(!S.a.length)restore();bind();draw();document.querySelectorAll(".tab").forEach(x=>x.onclick=()=>tab(x.dataset.tab))}
function restore(){S.a=preset.map(x=>({r:x[0],n:x[1],q:x[2],w:x[3],v:x[4],f:x[5],pf:x[6],fd:x[7],h:x[8],fixed:x[9],d:x[10]}));S.m=measured.map(x=>({e:x[0],s:x[1],r:x[2],u:x[3],i:x[4],t:x[5],va:x[6],pw:x[7],o:x[8]}));save();draw()}
function bind(){["voltage","system","tariff","days","area","bill"].forEach(id=>document.getElementById(id).oninput=()=>{let k={voltage:"v",system:"sys",tariff:"tar",days:"days",area:"area",bill:"bill"}[id];S.p[k]=id==="system"?document.getElementById(id).value:+document.getElementById(id).value;save();draw()})}
function save(){localStorage.setItem(KEY,JSON.stringify(S))}
function tab(id){document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));document.getElementById(id).classList.add("active");document.querySelector('[data-tab="'+id+'"]').classList.add("active")}
function calc(x){let w=+x.w||0,q=+x.q||0,h=+x.h||0,d=S.p.days,pf=Math.max(.01,+x.pf||1),fd=+x.fd||0,v=+x.v||S.p.v;let inst=w*q;let k=x.fixed!==""&&x.fixed!=null?+x.fixed:inst*h*d/1000;let I=x.f==="3F"?inst/(Math.sqrt(3)*v*pf):inst/(v*pf);return{inst,k,day:k/d,cost:k*S.p.tar,demand:inst*fd/1000,I}}
function esc(v){return String(v??"").replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;").replaceAll(">","&gt;")}
function edit(i,k,v){S.a[i][k]=(k==="r"||k==="n"||k==="f"||k==="d"||k==="fixed")?v:+v;save();draw()}
function field(i,k){let x=S.a[i];return '<input value="'+esc(x[k])+'" onchange="edit('+i+',\''+k+'\',this.value)">'}
function draw(){["voltage","system","tariff","days","area","bill"].forEach((id,i)=>document.getElementById(id).value=[S.p.v,S.p.sys,S.p.tar,S.p.days,S.p.area,S.p.bill][i]);drawLoads();drawMeasurements();drawCons();drawDash();drawAnalysis()}
function mfield(i,k){return '<input value="'+esc(S.m[i][k])+'" onchange="mf('+i+',\''+k+'\',this.value)">'}
function mf(i,k,v){S.m[i][k]=v;save();draw()}
function drawMeasurements(){let tb=document.querySelector("#measurementsTable tbody");if(!tb)return;tb.innerHTML=S.m.map((m,i)=>'<tr><td>'+mfield(i,"e")+'</td><td>'+mfield(i,"s")+'</td><td>'+mfield(i,"r")+'</td><td>'+mfield(i,"u")+'</td><td>'+mfield(i,"i")+'</td><td>'+mfield(i,"t")+'</td><td>'+((+m.va||0)?(+m.va).toFixed(2):"—")+'</td><td>'+((+m.pw||0)?(+m.pw).toFixed(2):"—")+'</td><td>'+mfield(i,"o")+'</td><td><button class="danger" onclick="S.m.splice('+i+',1);save();draw()">×</button></td></tr>').join("")}
function addMeasurement(){S.m.push({e:"Nuevo equipo",s:"Normal",r:0,u:"mA",i:"UT251C+",t:"Lectura de pinza",va:0,pw:0,o:"Completar condición y observación."});save();draw()}
function exportMeasurements(){let rows=[["Equipo","Estado","Lectura","Unidad","Instrumento","Tipo","VA ref.","W placa/cálculo","Observación"],...S.m.map(m=>[m.e,m.s,m.r,m.u,m.i,m.t,m.va,m.pw,m.o])];let csv=rows.map(r=>r.map(v=>'"'+String(v??"").replaceAll('"','""')+'"').join(",")).join("\n");let a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));a.download="mediciones_electricas.csv";a.click()}
function drawAnalysis(){let box=document.getElementById("analysisList");if(!box)return;let top=[...S.a].map(l=>({l,c:calc(l)})).sort((a,b)=>b.c.k-a.c.k).slice(0,10);box.innerHTML=top.map((x,i)=>'<div class="analysis-row"><b>'+(i+1)+'. '+esc(x.l.n)+'</b><span>'+x.c.k.toFixed(1)+' kWh/mes · S/ '+x.c.cost.toFixed(2)+'/mes</span><span>Escenario -20% de horas: -'+(x.c.k*.2).toFixed(1)+' kWh/mes.</span></div>').join("")}
function drawLoads(){let tb=document.querySelector("#loadTable tbody");tb.innerHTML=S.a.map((x,i)=>{let c=calc(x);return '<tr><td>'+field(i,"r")+'</td><td>'+field(i,"n")+'</td><td>'+field(i,"q")+'</td><td>'+field(i,"w")+'</td><td>'+field(i,"v")+'</td><td><select onchange="edit('+i+',\'f\',this.value)"><option '+(x.f==="1F"?"selected":"")+' >1F</option><option '+(x.f==="3F"?"selected":"")+'>3F</option></select></td><td>'+field(i,"pf")+'</td><td>'+field(i,"fd")+'</td><td>'+field(i,"h")+'</td><td>'+c.k.toFixed(2)+'</td><td>'+c.demand.toFixed(2)+'</td><td>'+c.I.toFixed(2)+'</td><td>'+esc(x.d)+'</td><td><button class="danger" onclick="S.a.splice('+i+',1);save();draw()">×</button></td></tr>'}).join("")}
function drawCons(){let tb=document.querySelector("#consTable tbody");let a=[...S.a].sort((x,y)=>calc(y).k-calc(x).k);tb.innerHTML=a.map(x=>{let c=calc(x);return '<tr><td>'+esc(x.n)+'</td><td>'+x.w+'</td><td>'+x.pf+'</td><td>'+c.I.toFixed(2)+'</td><td>'+c.day.toFixed(2)+'</td><td>'+c.k.toFixed(2)+'</td><td>S/ '+(c.day*S.p.tar).toFixed(2)+'</td><td>S/ '+c.cost.toFixed(2)+'</td><td><span class="tag">'+esc(x.d)+'</span></td></tr>'}).join("")}
function drawDash(){let t=S.a.reduce((a,x)=>{let c=calc(x);a.i+=c.inst;a.k+=c.k;a.d+=c.demand;a.cost+=c.cost;return a},{i:0,k:0,d:0,cost:0});document.getElementById("kInst").textContent=(t.i/1000).toFixed(2)+" kW";document.getElementById("kDem").textContent=t.d.toFixed(2)+" kW";document.getElementById("kKwh").textContent=t.k.toFixed(2)+" kWh";document.getElementById("kCost").textContent="S/ "+t.cost.toFixed(2);document.getElementById("kBill").textContent=S.p.bill+" kWh";document.getElementById("kDiff").textContent=(t.k-S.p.bill).toFixed(2)+" kWh";let top=[...S.a].sort((x,y)=>calc(y).k-calc(x).k).slice(0,8),mx=calc(top[0]||{w:1,q:1,h:1}).k||1;document.getElementById("top").innerHTML=top.slice(0,5).map(x=>'<p><b>'+esc(x.n)+'</b> — '+calc(x).k.toFixed(1)+' kWh/mes</p>').join("");document.getElementById("bars").innerHTML=top.map(x=>{let k=calc(x).k;return '<div class="bar"><span>'+esc(x.n)+'</span><div class="barline"><div class="fill" style="width:'+Math.max(2,k/mx*100)+'%"></div></div><b>'+k.toFixed(1)+'</b></div>'}).join("")}
function add(){S.a.push({r:"Nuevo",n:"Nuevo equipo",q:1,w:100,v:S.p.v,f:"1F",pf:.9,fd:1,h:1,fixed:"",d:"ESTIMADO"});save();draw()}
function backup(){let a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(S,null,2)],{type:"application/json"}));a.download="respaldo_cuadro_cargas.json";a.click()}
function exportXLSX(){if(!window.XLSX){alert("Excel requiere conexión a Internet para cargar SheetJS.");return}let rows=S.a.map(x=>{let c=calc(x);return{Ambiente:x.r,Equipo:x.n,Cantidad:x.q,"W/u":x.w,V:x.v,Fase:x.f,FP:x.pf,FD:x.fd,"h/día":x.h,"kWh/mes":+c.k.toFixed(2),"S/día":+(c.day*S.p.tar).toFixed(2),"S/mes":+c.cost.toFixed(2),"Demanda_kW":+c.demand.toFixed(2),"Corriente_A":+c.I.toFixed(2),Dato:x.d}});let wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(rows),"Cuadro de cargas");XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(S.m),"Mediciones");XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(rows.map(x=>({Equipo:x.Equipo,W:x["W/u"],FP:x.FP,FD:x.FD,I_A:x.Corriente_A,kWh_dia:x["kWh/mes"]/S.p.days,kWh_mes:x["kWh/mes"],S_dia:x["S/día"],S_mes:x["S/mes"],Dato:x.Dato}))),"Consumo por equipo");XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([["Parámetro","Valor"],["Tensión V",S.p.v],["Sistema",S.p.sys],["Tarifa S/kWh",S.p.tar],["Área m²",S.p.area],["Consumo real kWh/mes",S.p.bill]]),"Parámetros");XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([["Base","Aplicación"],["RNE EM.010","Instalaciones eléctricas interiores"],["CNE Utilización 050-200","Viviendas unifamiliares; metodología de carga y demanda"],["Nota","Verificar edición vigente y cálculo final con profesional competente. CAPECO no sustituye al RNE/CNE."]]),"Normativa Perú");XLSX.writeFile(wb,"Cuadro_Cargas_Hugo.xlsx")}
init();function renderAnalysis(){const box=document.getElementById("analysisList");if(!box)return;const top=[...state.loads].map(l=>({l,c:calc(l)})).sort((a,b)=>b.c.kwh-a.c.kwh).slice(0,10);box.innerHTML=top.map((x,i)=>'<div class="analysis-row"><b>'+(i+1)+'. '+esc(x.l.name)+'</b><span>'+x.c.kwh.toFixed(1)+' kWh/mes<br>S/ '+x.c.cost.toFixed(2)+'/mes</span><span>Escenario -20% de horas: -'+(x.c.kwh*.2).toFixed(1)+' kWh/mes. Ajusta las horas en el cuadro para simular.</span></div>').join("")}