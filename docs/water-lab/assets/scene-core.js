/* Procedural geometry and camera math. No imported models or textures. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.BobSceneCore=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  const normalize=v=>{const n=Math.hypot(...v);if(!n)throw new Error('Zero direction');return v.map(x=>x/n);};
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
  function camera(azimuth,elevation,distance,aspect){
    if(![azimuth,elevation,distance,aspect].every(Number.isFinite)||distance<=0||aspect<=0)throw new Error('Invalid camera');
    const target=[0,.2,0], eye=[Math.cos(azimuth)*Math.cos(elevation)*distance,target[1]+Math.sin(elevation)*distance,Math.sin(azimuth)*Math.cos(elevation)*distance];
    const forward=normalize(target.map((v,i)=>v-eye[i])),right=normalize(cross(forward,[0,1,0])),up=cross(right,forward),back=forward.map(v=>-v);
    const view=[right[0],up[0],back[0],0,right[1],up[1],back[1],0,right[2],up[2],back[2],0,-dot(right,eye),-dot(up,eye),-dot(back,eye),1];
    const fov=Math.PI/4,near=.04,far=600,f=1/Math.tan(fov/2);
    const projection=[f/aspect,0,0,0,0,f,0,0,0,0,(far+near)/(near-far),-1,0,0,2*far*near/(near-far),0];
    const matrix=new Float32Array(16);
    for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)matrix[c*4+r]+=projection[k*4+r]*view[c*4+k];
    return {eye,forward,right,up,matrix,tanHalfFov:Math.tan(fov/2)};
  }
  function createGeometry(baseline,complete=false){
    const values=[], p=baseline.parameters;
    const color={drum:[.13,.24,.28],strap:[.2,.24,.23],frame:[.42,.46,.44],wood:[.62,.39,.21],orange:[1,.4,0],black:[.13,.16,.16],white:[.8,.84,.79]};
    function vertex(position,normal,c){values.push(...position,...normal,...c);}
    function quad(a,b,c,d,n,col){
      // Small planar patches avoid long-face ordering artifacts in the Canvas fallback.
      const columns=Math.max(1,Math.ceil(Math.hypot(...b.map((v,i)=>v-a[i]))/.12));
      const rows=Math.max(1,Math.ceil(Math.hypot(...d.map((v,i)=>v-a[i]))/.12));
      const point=(u,v)=>a.map((value,i)=>value+(b[i]-value)*u+(d[i]-value)*v);
      for(let row=0;row<rows;row++)for(let column=0;column<columns;column++){
        const p=point(column/columns,row/rows),q=point((column+1)/columns,row/rows),r=point((column+1)/columns,(row+1)/rows),s=point(column/columns,(row+1)/rows);
        for(const value of [p,q,r,p,r,s])vertex(value,n,col);
      }
    }
    function box(x,y,z,l,h,w,col){
      const X=[x-l/2,x+l/2],Y=[y,y+h],Z=[z-w/2,z+w/2];
      quad([X[0],Y[1],Z[0]],[X[1],Y[1],Z[0]],[X[1],Y[1],Z[1]],[X[0],Y[1],Z[1]],[0,1,0],col);
      quad([X[0],Y[0],Z[1]],[X[1],Y[0],Z[1]],[X[1],Y[0],Z[0]],[X[0],Y[0],Z[0]],[0,-1,0],col);
      quad([X[1],Y[0],Z[0]],[X[1],Y[0],Z[1]],[X[1],Y[1],Z[1]],[X[1],Y[1],Z[0]],[1,0,0],col);
      quad([X[0],Y[0],Z[1]],[X[0],Y[0],Z[0]],[X[0],Y[1],Z[0]],[X[0],Y[1],Z[1]],[-1,0,0],col);
      quad([X[1],Y[0],Z[1]],[X[0],Y[0],Z[1]],[X[0],Y[1],Z[1]],[X[1],Y[1],Z[1]],[0,0,1],col);
      quad([X[0],Y[0],Z[0]],[X[1],Y[0],Z[0]],[X[1],Y[1],Z[0]],[X[0],Y[1],Z[0]],[0,0,-1],col);
    }
    function cylinderX(x,y,z,r,l,col){
      const segments=40;
      for(let i=0;i<segments;i++){
        const a=i/segments*Math.PI*2,b=(i+1)/segments*Math.PI*2;
        const n1=[0,Math.cos(a),Math.sin(a)],n2=[0,Math.cos(b),Math.sin(b)];
        const p1=[x-l/2,y+r*n1[1],z+r*n1[2]],p2=[x+l/2,p1[1],p1[2]],p3=[x+l/2,y+r*n2[1],z+r*n2[2]],p4=[x-l/2,p3[1],p3[2]];
        for(const [point,n]of [[p1,n1],[p2,n1],[p3,n2],[p1,n1],[p3,n2],[p4,n2]])vertex(point,n,col);
        for(const [point,n]of [[[x-l/2,y,z],[-1,0,0]],[p4,[-1,0,0]],[p1,[-1,0,0]],[[x+l/2,y,z],[1,0,0]],[p2,[1,0,0]],[p3,[1,0,0]]])vertex(point,n,col);
      }
    }
    const radius=p.idealDrumRadius.value,length=p.nominalDrumVolume.value/(Math.PI*radius*radius),deck=p.schematicDeckBottomZ.value;
    for(const [x,z]of p.drumCentersXY.value){
      cylinderX(x,radius,z,radius,length,color.drum);
      for(const offset of [-.16,.16])cylinderX(x+offset,radius,z,radius+.003,.014,color.strap);
    }
    for(const z of [-.38,.38])box(0,.38,z,p.deckLength.value,.02,.02,color.frame);
    for(const x of [-.74,-.39,0,.39,.74])box(x,.38,0,.02,.02,.78,color.frame);
    box(.74,.38,0,.04,.12,.8,color.frame);
    box(0,deck,0,p.deckLength.value,p.deckThickness.value,p.deckWidth.value,color.wood);
    // Thin seams are surface detailing, not a change to the plywood construction.
    for(let i=-3;i<=3;i++)box(0,deck+.0091,i*.1,1.49,.0004,.001,[.34,.24,.16]);
    for(const x of [-.65,.65])for(const z of [-.3,.3])box(x,deck+.01,z,.045,.012,.035,color.frame);
    box(.72,deck+.011,0,.025,.004,.68,color.orange);
    if(complete){
      box(-.1,deck+.01,0,.42,.25,.28,color.black);box(-.1,deck+.26,0,.44,.025,.3,color.black);
      box(-.1,deck+.29,0,.035,.008,.3,color.orange);
      box(.3,deck+.01,0,.24,.12,.16,color.frame);
      for(const [x,z]of [[-.55,-.3],[-.55,.3],[.55,-.3],[.55,.3]]){box(x,deck+.01,z,.018,.36,.018,color.frame);box(x,deck+.37,z,.08,.06,.07,color.black);}
      box(-.63,deck+.01,0,.018,.7,.018,color.frame);box(-.63,deck+.71,0,.1,.075,.1,color.white);
      box(.55,deck+.01,0,.022,.76,.022,color.frame);box(.55,deck+.77,0,.07,.04,.06,color.white);
      box(.55,deck+.59,0,.2,.025,.025,color.frame);box(.48,deck+.62,.04,.1,.08,.025,color.orange);
      box(.83,.08,0,.018,.65,.018,color.frame);box(.8,deck+.15,0,.19,.06,.1,color.black);box(.91,.055,0,.01,.02,.13,color.black);
    }
    return new Float32Array(values);
  }
  return {clamp,normalize,cross,dot,camera,createGeometry};
});
