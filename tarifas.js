// Pluz / Osinergmin — Pliego vigente desde 04/09/2026.
// Valores del PDF oficial de Pluz. Los importes publicados incluyen IGV.
// Primera columna del pliego = Lima Norte.
const TARIFAS_PLUZ_2026_09 = {
  vigencia:"2026-09-04", sistema:"Lima Norte", moneda:"PEN", incluyeIGV:true,
  BT2:{tipo:"2E2P",fijo:5.96,hp:.4265,hfp:.3685,potGenHP:73.88,potRedHP:75.34,excesoHFP:54.89,reactiva:.0573},
  BT3:{tipo:"2E1P",fijo:5.11,hp:.4265,hfp:.3685,potGenHP:69.14,potGenHFP:41.16,potRedHP:77.82,potRedHFP:67.76,reactiva:.0573},
  BT4:{tipo:"1E1P",fijo:5.11,energia:.3815,potGenHP:69.14,potGenHFP:41.16,potRedHP:77.82,potRedHFP:67.76,reactiva:.0573},
  BT5A:{tipo:"2E",fijo:5.11,hp:.21776,hfp:.3685,hp20:.22717,demandaHP20:20,demandaHFP20:20},
  BT5B:{tipo:"1E",residencial:true,tiers:[
    {max:30,fijo:2.68,energia:.5285},
    {max:140,fijo:2.68,primeros30:15.86,exceso:.7550},
    {min:140.0001,fijo:2.74,energia:.7723}
  ],noResidencial:{fijo:2.74,energia:.7723}},
  BT5C_AP:{tipo:"1E",fijo:5.02,energia:.8389},
  BT5D:{tipo:"1E",residencial:true,tiers:[
    {max:30,fijo:2.68,energia:.4294},
    {max:140,fijo:2.68,primeros30:12.89,exceso:.6135},
    {min:140.0001,fijo:2.74,energia:.6276}
  ]},
  BT5E:{tipo:"1E",tiers:[
    {max:30,fijo:3.14,energia:.5272},
    {max:140,fijo:3.14,primeros30:15.81,exceso:.7532},
    {min:140.0001,fijo:3.21,energia:.7705}
  ]},
  BT5F:{tipo:"2E",residencial:true,fijo:5.11,hp:1.2706,hfp:.5690,hp30:.8694,hfp30:.3894,hpExceso:1.2421,hfpExceso:.5563},
  BT5I:{tipo:"3E",residencial:true,fijo:5.11,hp:.8297,media:.6292,base:.6301,hp30:.5677,media30:.4305,base30:.4312,hpExceso:.8110,mediaExceso:.6150,baseExceso:.6160},
  BT6:{tipo:"1P",fijo:2.74,potenciaW:.3391}
};

function clampNum(n,min=0){n=Number(n);return Number.isFinite(n)?Math.max(min,n):0}
function simpleTier(code,kwh,customer){
  const t=TARIFAS_PLUZ_2026_09[code];
  if(code==="BT5B" && customer!=="residencial") return {fixed:t.noResidencial.fijo,energy:kwh*t.noResidencial.energia,avg:t.noResidencial.energia};
  const tier=t.tiers.find(x=>(x.max==null||kwh<=x.max)&&(x.min==null||kwh>=x.min))||t.tiers[t.tiers.length-1];
  let energy=0;
  if(tier.energia!=null) energy=kwh*tier.energia;
  else energy=tier.primeros30+Math.max(0,kwh-30)*tier.exceso;
  return {fixed:tier.fijo,energy,avg:kwh?energy/kwh:0};
}
function estimateTariff(p,totalKwh,demandKw){
  const code=p.code||"BT5B", customer=p.customer||"residencial", t=TARIFAS_PLUZ_2026_09[code];
  const k=clampNum(totalKwh), d=clampNum(demandKw);
  if(!t) return {code,energy:k*(p.manualRate||0),fixed:0,avg:p.manualRate||0,detail:"Tarifa no configurada"};
  if(["BT5B","BT5D","BT5E"].includes(code)) return {...simpleTier(code,k,customer),code,detail:"Tarifa simple por energía"};
  if(code==="BT5C_AP") return {code,energy:k*t.energia,fixed:t.fijo,avg:t.energia,detail:"Alumbrado público"};
  if(code==="BT6") return {code,energy:0,fixed:t.fijo+clampNum(p.contractedW)*t.potenciaW,avg:0,detail:"Cargo por potencia contratada"};
  const puntaPct=Math.min(100,Math.max(0,Number(p.puntaPct??25)))/100;
  const hp=k*puntaPct,hfp=k-hp;
  if(code==="BT2"||code==="BT3"){
    const energy=hp*t.hp+hfp*t.hfp;
    const gen=code==="BT2"?d*t.potGenHP:d*(puntaPct*t.potGenHP+(1-puntaPct)*t.potGenHFP);
    const red=code==="BT2"?d*t.potRedHP:d*(puntaPct*t.potRedHP+(1-puntaPct)*t.potRedHFP);
    return {code,energy,fixed:t.fijo,avg:k?energy/k:0,power:gen+red,detail:"Energía HP/HFP + potencia"};
  }
  if(code==="BT4"){
    const energy=k*t.energia;
    const gen=d*(puntaPct*t.potGenHP+(1-puntaPct)*t.potGenHFP);
    const red=d*(puntaPct*t.potRedHP+(1-puntaPct)*t.potRedHFP);
    return {code,energy,fixed:t.fijo,avg:t.energia,power:gen+red,detail:"Energía + potencia"};
  }
  if(code==="BT5A"){
    const hpRate=d<=20?t.hp:t.hp20,hpEnergy=hp*hpRate,hfpEnergy=hfp*t.hfp;
    return {code,energy:hpEnergy+hfpEnergy,fixed:t.fijo,avg:k?(hpEnergy+hfpEnergy)/k:0,power:Math.max(0,d-20)*(t.exceso||63.78),detail:"Doble medición HP/HFP"};
  }
  if(code==="BT5F"){
    const hpRate=k<=30?t.hp30:t.hpExceso,hfpRate=k<=30?t.hfp30:t.hfpExceso;
    const energy=hp*hpRate+hfp*hfpRate;
    return {code,energy,fixed:k>140?t.fijo:4.99,avg:k?energy/k:0,detail:"Doble medición residencial"};
  }
  if(code==="BT5I"){
    const hpRate=k<=30?t.hp30:t.hpExceso, mRate=k<=30?t.media30:t.mediaExceso,bRate=k<=30?t.base30:t.baseExceso;
    const media=hfp*.5,base=hfp*.5;
    const energy=hp*hpRate+media*mRate+base*bRate;
    return {code,energy,fixed:k>140?t.fijo:4.99,avg:k?energy/k:0,detail:"Triple medición; media/base 50/50 estimada"};
  }
  return {code,energy:0,fixed:t.fijo,avg:0,detail:"Sin cálculo automático"};
}
