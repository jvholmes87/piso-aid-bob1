'use strict';
// No dependencies, no network calls, no telemetry. Coordinates in metres.

// Exact conversion factors; rounding is only applied when displaying values.
const LB_PER_KG=1/.45359237, MM_PER_IN=25.4, L_PER_US_GAL=3.785411784;
function number(value,places=1){return value.toLocaleString('en-US',{minimumFractionDigits:places,maximumFractionDigits:places});}
function pair(metric,imperial,mode='both'){return mode==='metric'?metric:mode==='imperial'?imperial:metric+' / '+imperial;}
function massLabel(kg,mode='both'){return pair(number(kg,2)+' kg',number(kg*LB_PER_KG,1)+' lb',mode);}
function lengthLabel(mm,mode='both'){return pair(number(mm,0)+' mm',number(mm/MM_PER_IN,2)+' in',mode);}
function dimsLabel(mm,mode='both'){return pair(mm.map(v=>number(v,0)).join(' × ')+' mm',mm.map(v=>number(v/MM_PER_IN,v<25.4?3:1)).join(' × ')+' in',mode);}
function volumeLabel(litres,mode='both'){return pair(number(litres,0)+' L',number(litres/L_PER_US_GAL,1)+' US gal',mode);}

const PARTS = {
 drums:{title:'Flotation drums',text:'Four nominal-capacity HDPE drums, arranged two by two. Actual outer profile and sealed displacement volume still need measurement.',spec:mode=>`Drawing 0002 · 4 × ${volumeLabel(60,mode)}. Display: ideal Ø${lengthLabel(360,mode)} cylinders; equivalent length ${lengthLabel(589.46,mode)}; illustrative spacing.`,color:'#a6a6a6'},
 pads:{title:'Pads & restraints',text:'Eight EPDM pads and eight stainless straps retain the drums. The display shows schematic saddle blocks and strap positions, not fabrication details.',spec:mode=>`Drawings 0002, 0005, 0006 · Pads: ${dimsLabel([200,100,25],mode)}; 16 M6 bolts (metric thread designation). Connection capacity remains unverified.`,color:'#595959'},
 frame:{title:'Steel frame',text:'The welded frame transfers deck and equipment loads to the drum supports. Rail positions in this explorer are illustrative.',spec:mode=>`Drawing 0003 · ${dimsLabel([20,20,2],mode)} tube; cut-list total ${pair('14 m','45.9 ft',mode)}. Transom: ${dimsLabel([120,40,3],mode)}, ${lengthLabel(800,mode)} long.`,color:'#ff6600'},
 deck:{title:'Plywood deck',text:'The platform surface provides an equipment mounting area. Its support grid and wet-service properties need verification.',spec:mode=>`Drawing 0004 · ${dimsLabel([1500,800,9],mode)} marine plywood. Modeled mass: ${massLabel(5.07,mode)}; not an as-built measurement.`,color:'#ffb380'}
};

const fullParts={
 battery:{title:'Battery & enclosure',text:'NOCO Snap-Top BG31 enclosure, battery pad and LiFePO4 battery. The lid is lifted in exploded view to reveal the schematic battery.',spec:mode=>`Drawing 0001 items 5–7 · battery centre X ${lengthLabel(650,mode)}, Y ${lengthLabel(400,mode)}. Mechanical BOM: 12 V, 100 Ah; electrical sources conflict. Envelope is illustrative.`,color:'#595959'},
 motor:{title:'Motor & clamp',text:'One rear brushless motor and clamping pad, matching the mechanical drawing. The head, shaft, lower unit and propeller are schematic.',spec:mode=>`Drawing 0001 items 3–4 · centre X ${lengthLabel(1500,mode)}, Y ${lengthLabel(400,mode)}. Mechanical BOM names a 12 V Protruar Genius motor; earlier references specify alternatives.`,color:'#2e2e2e'},
 gps:{title:'GPS / IMU post',text:'Front post, enclosure, flange, pad and cable gland. The enclosure represents GPS/IMU equipment; internal boards are not separately detailed in this model.',spec:mode=>`Drawings 0001 & 0007 · centre X ${lengthLabel(120,mode)}, Y ${lengthLabel(400,mode)}. Box ${dimsLabel([100,100,75],mode)}.`,color:'#a6a6a6'},
 cameras:{title:'Four corner cameras',text:'Four posts with all-weather Raspberry Pi camera housings, flanges, pads, covers and schematic lenses. The two forward mounts also support floodlights.',spec:mode=>`Drawings 0001, 0012–0013 · X ${pair('200 / 1,300 mm','7.9 / 51.2 in',mode)}; Y ${pair('100 / 700 mm','3.9 / 27.6 in',mode)}. Four instances.`,color:'#595959'},
 ultrasonic:{title:'Ultrasonic sensors',text:'Three ultrasonic distance sensors on the forward bent mount. The sensor shape and mounting angles are illustrative.',spec:mode=>`Drawing 0001 items 13–14 & drawing 0032 · three sensors; mount centre X ${lengthLabel(45,mode)}, Y ${lengthLabel(400,mode)}. Protocol/model require reconciliation.`,color:'#ffb380'},
 control:{title:'Control enclosure',text:'Control/sensor/communications enclosure, pad and cable glands. The model shows the housing, not verified controller or ESC internals.',spec:mode=>`Drawings 0001 & 0020 · centre X ${lengthLabel(1050,mode)}, Y ${lengthLabel(400,mode)}; enclosure ${dimsLabel([240,160,120],mode)}.`,color:'#a6a6a6'},
 mast:{title:'Control-post structure',text:'Rear post assembly, accessory arms, mount plates, pad and glands. The arms are simplified from the drawing reference.',spec:mode=>`Drawings 0001 & 0022–0024 · rear assembly anchored near X ${lengthLabel(1300,mode)}, Y ${lengthLabel(400,mode)}. Heights and accessory offsets are illustrative.`,color:'#595959'},
 camera360:{title:'360° camera',text:'Insta360 X4 and case on the rear control-post assembly, represented by a schematic upright camera body and lens.',spec:mode=>`Drawing 0022 item 3 · one camera/case. Attachment fit-up remains dependent on the actual case.`,color:'#2e2e2e'},
 allround:{title:'All-round navigation lamp',text:'Navi LED 360 PRO all-round lamp and mount on the rear control-post assembly.',spec:mode=>`Drawing 0022 item 4 & drawing 0026 · one lamp. Display height is illustrative.`,color:'#ffb380'},
 infrared:{title:'Infrared illuminators',text:'Two CM-IR130-850 illuminators and accessory mounts on the rear structure.',spec:mode=>`Drawing 0022 items 7–8 & drawing 0027 · two illuminators. Their rendered envelopes and attachment offsets are schematic.`,color:'#a6a6a6'},
 lte:{title:'LTE antenna & mount',text:'AN GSM 046 MIMO Wi-Fi/LTE antenna and mount. The schematic panel is attached to the rear accessory structure.',spec:mode=>`Drawing 0022 items 13–14 & drawings 0028–0029 · one antenna and mount.`,color:'#ffb380'},
 nav:{title:'Forward navigation lights',text:'Two forward 12 V LED lamps. Port/starboard labels conflict between the drawing and coordinate reference, so the view uses neutral lamp colours.',spec:mode=>`Drawing 0001 items 17–18 · X ${lengthLabel(40,mode)}; Y ${pair('50 / 750 mm','2.0 / 29.5 in',mode)}. Sidedness requires reconciliation.`,color:'#ffb380'},
 flood:{title:'Two floodlights',text:'Two Lampo Fatek 10 W LED floodlights on the forward corner-camera mounting plates.',spec:mode=>`Drawing 0001 items 20–21 & drawing 0019 · two lights. Exact drilling/fit-up is deferred in the source.`,color:'#a6a6a6'},
 padeyes:{title:'Four pad-eye plates',text:'Four attachment plates at the deck corners. Loops are schematic; connection capacity is not established.',spec:mode=>`Drawing 0001 item 2 · X ${pair('100 / 1,400 mm','3.9 / 55.1 in',mode)}; Y ${pair('100 / 700 mm','3.9 / 27.6 in',mode)}.`,color:'#a6a6a6'},
 conduit:{title:'Six conduit runs',text:'Six flexible conduit runs link the battery, enclosure, cameras, ultrasonic mount and GPS/post equipment. Routes are schematic rather than cable-installation drawings.',spec:mode=>`Drawing 0001 items 24–29 & drawing 0033 · total nominal length ${pair('3.680 m','12.07 ft',mode)}. Gland sizes: M12, M16 and M20.`,color:'#595959'},
 hardware:{title:'Mounting hardware',text:'Top-level screws and subassembly bolts, nuts, washers, plugs and glands are indexed and grouped with their assemblies. Orange/charcoal markers show representative hardware, not every fastener.',spec:mode=>`Drawing 0001 items 19, 22, 23, 30 · quantities 6, 16, 26, 4. Item 23 pairs an M8 identifier with an M6 description; reconcile before procurement. Metric thread names are preserved.`,color:'#ff6600'}
};
Object.assign(PARTS,fullParts);
const BOM=[
[1,'Pontoon assembly',1,'drums','Hull groups: drums, pads, frame, deck'],[2,'Pad-eye rectangle plates',4,'padeyes','Four schematic plates/loops'],[3,'12 V brushless motor',1,'motor','Single-motor mechanical baseline; model conflict'],[4,'Motor clamping pad',1,'motor','Grouped with motor'],[5,'NOCO BG31 battery box',1,'battery','Box and exploded lid'],[6,'LiFePO4 12 V 100 Ah battery',1,'battery','Schematic battery; electrical conflict'],[7,'Battery pad',1,'battery','Grouped with enclosure'],[8,'GPS / IMU post assembly',1,'gps','Post, enclosure and supports'],[9,'Front-left camera + lamp mount',1,'cameras','Camera group plus floodlight'],[10,'Front-right camera + lamp mount',1,'cameras','Camera group plus floodlight'],[11,'Rear-left camera assembly',1,'cameras','Camera group'],[12,'Rear-right camera assembly',1,'cameras','Camera group'],[13,'Ultrasonic mount',1,'ultrasonic','Bent mounting bar simplified'],[14,'Ultrasonic distance sensors',3,'ultrasonic','Three schematic sensors'],[15,'Control / sensors / comms enclosure',1,'control','Housing, pad and glands; internals not detailed'],[16,'Control post assembly',1,'mast','Includes camera, lamp, illuminators and LTE'],[17,'Drawing-labelled starboard lamp',1,'nav','Neutral display; sidedness conflict'],[18,'Drawing-labelled port lamp',1,'nav','Neutral display; sidedness conflict'],[19,'M2 × 20 lamp screws',6,'hardware','Grouped; source type/identifier needs review'],[20,'10 W LED floodlight',1,'flood','Front-left schematic lamp'],[21,'10 W LED floodlight',1,'flood','Front-right schematic lamp'],[22,'ST2.9 × 6.5 pad-eye screws',16,'hardware','Grouped; source description needs review'],[23,'Corner-camera / GPS / post screws',26,'hardware','Source M8 identifier / M6 description conflict'],[24,'Conduit 1: control → rear post',1,'conduit','Schematic route; M20 gland'],[25,'Conduit 2: control → rear-left camera',1,'conduit','Schematic route; M12 gland'],[26,'Conduit 3: control → rear-right camera',1,'conduit','Schematic route; M12 gland'],[27,'Conduit 4: forward sensors / camera',1,'conduit','Schematic route; M12 gland'],[28,'Conduit 5: control → front-left camera',1,'conduit','Schematic route; M12 gland'],[29,'Conduit 6: battery → control',1,'conduit','Schematic route; M16 gland'],[30,'M8 × 12 control-box screws',4,'hardware','Grouped; source type/identifier needs review']
];

function flotation(base,payload,growth=0){
 const mass=base*(1+growth/100)+payload, capacity=240, r=.18, length=.060/(Math.PI*r*r);
 if(mass>capacity)return {mass,capacity,fraction:mass/capacity,draft:null,clearance:null};
 if(mass===0)return {mass,capacity,fraction:0,draft:0,clearance:2*r};
 if(mass===capacity)return {mass,capacity,fraction:1,draft:2*r,clearance:0};
 let lo=0,hi=2*r;
 for(let i=0;i<70;i++){const d=(lo+hi)/2,q=Math.sqrt(Math.max(0,2*r*d-d*d));const area=r*r*Math.acos(Math.max(-1,Math.min(1,(r-d)/r)))-(r-d)*q; if(1000*4*length*area<mass)lo=d;else hi=d;}
 const draft=(lo+hi)/2;return {mass,capacity,fraction:mass/capacity,draft,clearance:2*r-draft};
}
// Exposed for repeatable arithmetic tests; DOM setup runs only in a browser.
if(typeof module!=='undefined')module.exports={PARTS,BOM,flotation,massLabel,lengthLabel,dimsLabel,volumeLabel};
if(typeof document!=='undefined'){
 const $=id=>document.getElementById(id);let selected='drums',unitMode='both';
 $('components').innerHTML=Object.entries(PARTS).map(([key,p])=>`<button data-part="${key}" aria-pressed="false">${p.title}</button>`).join('');
 function selectPart(key){selected=key;const p=PARTS[key];$('componentTitle').textContent=p.title;$('componentText').textContent=p.text;$('componentSpec').textContent=p.spec(unitMode);for(const button of $('components').children)button.setAttribute('aria-pressed',String(button.dataset.part===key));renderModel();}
 $('components').addEventListener('click',e=>{if(e.target.dataset.part)selectPart(e.target.dataset.part);});
 function renderModel(){
 const angle=Number($('angle').value)*Math.PI/180,e=Number($('explode').value)/100;const c=Math.cos(angle),s=Math.sin(angle);const faces=[];
 $('angleValue').textContent=$('angle').value+'°';$('explodeValue').textContent=$('explode').value+'%';
 function project(p){const x=p[0]*c-p[1]*s,y=p[0]*s+p[1]*c;return [x*330,y*155-p[2]*330,y+p[2]*.55];}
 function polygon(points,part,shade=1){const pp=points.map(project);faces.push({points:pp.map(p=>`${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' '),depth:pp.reduce((a,p)=>a+p[2],0)/pp.length,part,shade});}
 function box(x,y,z,l,w,h,part){let p=[[x-l/2,y-w/2,z],[x+l/2,y-w/2,z],[x+l/2,y+w/2,z],[x-l/2,y+w/2,z]];let t=p.map(v=>[v[0],v[1],z+h]);polygon(p,part,.55);polygon(t,part,1);for(let k=0;k<4;k++)polygon([p[k],p[(k+1)%4],t[(k+1)%4],t[k]],part,.65+k*.05);}
 function cylinder(x,y){const l=.060/(Math.PI*.18*.18),r=.18,z=.18;let rings=[-l/2,l/2].map(dx=>Array.from({length:32},(_,i)=>{const t=i/32*2*Math.PI;return[x+dx,y+Math.cos(t)*r,z+Math.sin(t)*r];}));polygon(rings[0],'drums',.7);polygon(rings[1],'drums',.8);for(let i=0;i<32;i++)polygon([rings[0][i],rings[0][(i+1)%32],rings[1][(i+1)%32],rings[1][i]],'drums',.65+.3*(Math.sin(i/32*2*Math.PI)+1)/2);}
 for(const x of [-.39,.39])for(const y of [-.24,.24]){cylinder(x,y);for(const dx of [-.16,.16]){box(x+dx,y,.345+e*.17,.1,.2,.025,'pads');box(x+dx,y-.18,.18+e*.17,.012,.012,.18,'pads');box(x+dx,y+.18,.18+e*.17,.012,.012,.18,'pads');box(x+dx,y,.36+e*.17,.012,.36,.008,'pads');}}
 const fz=.38+e*.38;for(const y of [-.38,.38])box(0,y,fz,1.5,.02,.02,'frame');for(const x of [-.74,-.39,0,.39,.74])box(x,0,fz,.02,.78,.02,'frame');box(.74,0,fz,.04,.8,.12,'frame');if($('deckToggle').checked)box(0,0,.505+e*.62,1.5,.8,.009,'deck');

 if($('fullToggle').checked){
 const dz=.514+e*.62;
 const at=(X,Y)=>[(X-750)/1000,(Y-400)/1000];
 function equipment(X,Y,z,l,w,h,part){const [x,y]=at(X,Y);box(x,y,z,l,w,h,part);}
 function post(X,Y,height,part){equipment(X,Y,dz,.1,.1,.018,part);equipment(X,Y,dz+.018,.025,.025,height,part);}
 // Battery enclosure/body/pad: illustrative envelope. Lid separates to reveal battery in exploded view.
 equipment(650,400,dz,.4,.2,.025,'battery');equipment(650,400,dz+.025,.42,.28,.24,'battery');equipment(650,400,dz+.27+e*.18,.44,.3,.028,'battery');if(e>.1)equipment(650,400,dz+.10+e*.12,.32,.17,.19,'battery');
 equipment(1050,400,dz,.267,.211,.009,'control');equipment(1050,400,dz+.009,.24,.16,.12,'control');equipment(1050,400,dz+.129+e*.1,.24,.16,.008,'control');
 post(120,400,.7,'gps');equipment(120,400,dz+.718,.1,.1,.075,'gps');
 for(const X of [200,1300])for(const Y of [100,700]){post(X,Y,.36,'cameras');equipment(X,Y,dz+.378,.08,.09,.065,'cameras');equipment(X-42,Y,dz+.395,.012,.04,.025,'cameras');if(X===200){equipment(X,Y+ (Y===100?-50:50),dz+.28,.16,.04,.08,'flood');equipment(X-3,Y+(Y===100?-50:50),dz+.295,.17,.008,.05,'flood');}}
 equipment(45,400,dz+.04,.018,.51,.1,'ultrasonic');for(const Y of [230,400,570]){equipment(25,Y,dz+.08,.025,.07,.055,'ultrasonic');equipment(9,Y,dz+.085,.014,.018,.04,'ultrasonic');}
 post(1300,400,.72,'mast');equipment(1300,400,dz+.74,.17,.035,.035,'mast');equipment(1170,400,dz+.65,.28,.025,.025,'mast');equipment(1380,400,dz+.57,.18,.025,.025,'mast');
 equipment(1300,400,dz+.745+e*.18,.045,.035,.115,'camera360');equipment(1280,400,dz+.78+e*.18,.013,.025,.035,'camera360');
 equipment(1400,400,dz+.60,.022,.022,.23,'allround');equipment(1400,400,dz+.83+e*.16,.06,.06,.055,'allround');
 equipment(1200,400,dz+.52,.025,.025,.12,'lte');equipment(1200,400,dz+.63+e*.12,.18,.035,.09,'lte');
 for(const Y of [250,550])equipment(1300,Y,dz+.53+e*.10,.10,.07,.09,'infrared');
 for(const Y of [50,750])equipment(40,Y,dz,.04,.04,.035,'nav');
 for(const X of [100,1400])for(const Y of [100,700]){equipment(X,Y,dz,.05,.035,.006,'padeyes');equipment(X,Y,dz+.006,.027,.012,.025,'padeyes');equipment(X-21,Y,dz+.006,.006,.006,.006,'hardware');equipment(X+21,Y,dz+.006,.006,.006,.006,'hardware');}
 equipment(1480,400,dz+.04,.03,.12,.11,'motor');equipment(1560,400,dz+.22,.22,.10,.045,'motor');equipment(1580,400,.05,.021,.021,dz+.22-.05,'motor');equipment(1580,400,.025,.14,.065,.05,'motor');equipment(1670,400,.045,.01,.14,.022,'motor');
 // Each routed conduit is represented by connected rectangular sections at deck height.
 const runs=[[[1050,400],[1180,400],[1300,400]],[[1050,400],[1120,400],[1120,100],[1300,100]],[[1050,400],[1120,400],[1120,700],[1300,700]],[[1050,400],[1050,600],[120,600],[120,400],[45,400],[45,700],[200,700]],[[1050,400],[1050,180],[200,180],[200,100]],[[650,400],[840,400],[840,480],[1050,480],[1050,400]]];
 for(const run of runs)for(let i=1;i<run.length;i++){const a=run[i-1],b=run[i];equipment((a[0]+b[0])/2,(a[1]+b[1])/2,dz+.016+e*.04,Math.max(.012,Math.abs(a[0]-b[0])/1000),Math.max(.012,Math.abs(a[1]-b[1])/1000),.012,'conduit');}
 }
 // Fit the projected geometry to the canvas at every rotation and explosion state.
 const all=faces.flatMap(f=>f.points.split(' ').map(x=>x.split(',').map(Number)));const xs=all.map(v=>v[0]),ys=all.map(v=>v[1]);const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);const fit=Math.min(740/(maxX-minX),395/(maxY-minY));for(const f of faces)f.points=f.points.split(' ').map(v=>{const [x,y]=v.split(',').map(Number);return `${(450+(x-(minX+maxX)/2)*fit).toFixed(2)},${(280+(y-(minY+maxY)/2)*fit).toFixed(2)}`;}).join(' ');

 faces.sort((a,b)=>a.depth-b.depth);let svg='<g stroke="#cccccc" stroke-width="1"><path d="M90 410L450 230L810 410L450 530Z" fill="#eeeeee"/><path d="M180 455L540 275M270 500L630 320M270 320L630 500M360 275L720 455" opacity=".5"/></g>';
 for(const f of faces){const col=PARTS[f.part].color;const rgb=col.match(/\w\w/g).map(x=>Math.round(parseInt(x,16)*f.shade));svg+=`<polygon points="${f.points}" fill="rgb(${rgb})" stroke="${f.part===selected?'#2e2e2e':'#595959'}" data-part="${f.part}" stroke-width="${f.part===selected?1.3:.7}" opacity="${f.part===selected?1:.78}"/>`;}
 svg+='<text x="26" y="36" fill="#595959" font-size="13" font-family="Scandia, Arial, sans-serif">SCHEMATIC / NOT TO FABRICATION SCALE</text><text x="26" y="520" fill="#2e2e2e" font-size="13" font-family="Scandia, Arial, sans-serif">'+PARTS[selected].title.toUpperCase()+' HIGHLIGHTED</text>';$('model').innerHTML=svg;
 }
 function updateLoad(){const p=Number($('payload').value),g=Number($('growth').value),result=flotation(Number($('base').value),p,g);$('payloadValue').textContent=massLabel(p,unitMode);$('payload').setAttribute('aria-valuetext',massLabel(p,unitMode));$('growthValue').textContent=g+'%';$('mass').textContent=massLabel(result.mass,unitMode);$('immersion').textContent=(result.fraction*100).toFixed(1)+'%';$('draft').textContent=result.draft===null?'No equilibrium':lengthLabel(result.draft*1000,unitMode);$('clearance').textContent=result.clearance===null?'—':lengthLabel(result.clearance*1000,unitMode);
 $('loadNote').classList.toggle('exceeded',result.draft===null);$('loadNote').textContent=result.draft===null?`Total mass exceeds the ${massLabel(240,unitMode)} nominal full-immersion displacement. No level floating equilibrium exists in this model.`:result.fraction>=.999?'Nominal full immersion: no remaining drum crown clearance. This is not an operating condition or payload rating.':'This is a load scenario, not a safe payload rating. Crown clearance describes the drum, not the deck. Structure and stability are not evaluated.';
 const y=result.draft===null?48:228-result.draft/ .36*180;$('water').innerHTML=`<defs><clipPath id="drumClip"><circle cx="210" cy="138" r="90"/></clipPath></defs><path d="M20 228H460" stroke="#cccccc"/><circle cx="210" cy="138" r="90" fill="#f5f5f5" stroke="#2e2e2e" stroke-width="2"/><rect x="120" y="${y}" width="180" height="${228-y}" fill="#ff6600" clip-path="url(#drumClip)" opacity=".7"/><path d="M35 ${y}H430" stroke="#2e2e2e" stroke-width="2" stroke-dasharray="6 5"/><text x="320" y="${Math.max(26,y-12)}" fill="#595959" font-size="13" font-family="Scandia, Arial, sans-serif">${result.draft===null?'Full immersion':'Waterline'}</text><text x="30" y="266" fill="#595959" font-size="13" font-family="Scandia, Arial, sans-serif">Ideal drum · Ø${lengthLabel(360,unitMode)}</text>`;
 }
 for(const id of ['angle','explode','deckToggle','fullToggle'])$(id).addEventListener('input',renderModel);for(const id of ['base','payload','growth'])$(id).addEventListener('input',updateLoad);
 $('assembly').onclick=()=>{$('explode').value=0;renderModel();};$('exploded').onclick=()=>{$('explode').value=100;renderModel();};$('reset').onclick=()=>{$('angle').value=-35;$('explode').value=0;$('deckToggle').checked=true;$('fullToggle').checked=true;renderModel();};

 function updateUnits(){
 unitMode=$('units').value;
 const current=$('base').value;
 $('base').innerHTML=[['49.28','Bare hull'],['80.4','Complete craft']].map(([value,label])=>`<option value="${value}">${label} · ${massLabel(Number(value),unitMode)} CAD</option>`).join('');$('base').value=current;
 $('drumChip').textContent=`4 × ${volumeLabel(60,unitMode)} drums · drawing basis`;
 $('deckChip').textContent=`${dimsLabel([1500,800],unitMode)} deck · drawing basis`;
 $('calculationBasis').textContent=`Freshwater density: ${pair('1,000 kg/m³','62.4 lb/ft³',unitMode)}. Four drums: ${volumeLabel(60,unitMode)} each. Assumed diameter: ${lengthLabel(360,unitMode)}. Equivalent cylinder length: ${lengthLabel(589.46,unitMode)}.`;
 selectPart(selected);updateLoad();
 }
 $('units').addEventListener('change',updateUnits);
 $('bomRows').innerHTML=BOM.map(([item,name,quantity,group,note])=>`<tr><td>${item}</td><td><button data-part="${group}">${name}</button></td><td>${quantity}</td><td>${note}</td></tr>`).join('');
 $('bomRows').addEventListener('click',e=>{if(e.target.dataset.part){$('fullToggle').checked=true;selectPart(e.target.dataset.part);$('componentTitle').scrollIntoView({block:'nearest',behavior:'auto'});}});
 $('model').addEventListener('click',e=>{if(e.target.dataset.part)selectPart(e.target.dataset.part);});

 const steps=[['01 / DRAWING BASIS','Reconcile the design','Drawings and analysis exist. Resolve configuration differences and confirm the build baseline.'],['02 / REPORTED PHASE 1 FOCUS','Build the bare hull','Source drums, dry-fit supports, fabricate and inspect. Latest physical completion is unverified.'],['03 / PLANNED VERIFICATION','Weigh & float','Record measured hull mass, seals, unloaded draft, trim, and drum clearances. No test results entered.'],['04 / PLANNED VERIFICATION','Test staged loads','Define reviewed load steps and abort criteria; capture observations before setting a payload rating.']];
 $('timeline').innerHTML=steps.map(([label,title,text])=>`<article class="step"><span>${label}</span><h3>${title}</h3><p>${text}</p></article>`).join('');updateUnits();
}
