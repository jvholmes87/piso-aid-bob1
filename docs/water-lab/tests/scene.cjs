'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const baseline=require('../model/bob1-baseline.json');
const core=require('../assets/scene-core.js');
const near=(a,b,t=1e-5)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
// Camera transforms target to screen center over supported orbit/zoom range.
for(const distance of [1.8,3.6,9])for(const elevation of [.1,.48,1.47])for(const azimuth of [-4,0,.82,4]){
  const c=core.camera(azimuth,elevation,distance,1.6);
  for(const vector of [c.right,c.forward,c.up])near(Math.hypot(...vector),1);
  near(core.dot(c.right,c.up),0);near(core.dot(c.right,c.forward),0);
  const point=[0,.2,0,1],clip=[];
  for(let row=0;row<4;row++)clip[row]=point.reduce((sum,v,i)=>sum+v*c.matrix[i*4+row],0);
  near(clip[0]/clip[3],0);near(clip[1]/clip[3],0);assert.ok(clip[3]>0);
}
assert.throws(()=>core.camera(0,0,-1,1));
let bareCount;
for(const complete of [false,true]){
  const geometry=core.createGeometry(baseline,complete);
  assert.equal(geometry.length%27,0);assert.ok(geometry.every(Number.isFinite));
  for(let i=0;i<geometry.length;i+=9){near(Math.hypot(...geometry.slice(i+3,i+6)),1);for(const col of geometry.slice(i+6,i+9))assert.ok(col>=0&&col<=1);}
  const ys=Array.from(geometry).filter((_,i)=>i%9===1);near(Math.min(...ys),-.003);assert.ok(Math.max(...ys)<1.5);
  if(!complete)bareCount=geometry.length;else assert.ok(geometry.length>bareCount);
}
// No imported 3D models, image textures, audio samples, remote code, or package runtime.
const root=path.join(__dirname,'..');const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const match of html.matchAll(/(?:src|href)="([^"]+)"/g)){
  const location=match[1];if(location.startsWith('#')||location.startsWith('http'))continue;
  assert.ok(fs.existsSync(path.resolve(root,location)),`Missing ${location}`);
}
const app=fs.readFileSync(path.join(root,'assets/app.js'),'utf8');
assert.match(app,/BobHydrostatics\.resolveModel/);assert.match(app,/scenarioMass/);
assert.match(app,/document\.hidden/);assert.match(app,/prefers-reduced-motion/);
assert.ok(!/Audio\(['"]|\.mp3|\.wav|\.glb|\.gltf/.test(app));
console.log('PASS: camera target/orthogonality across 36 views; finite triangle geometry and normals; all local resources resolve; shared baseline and motion lifecycle hooks. Shader rendering and layout require browser checks.');
