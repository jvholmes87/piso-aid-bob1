/* Accessible-device fallback: procedural Canvas water and projected vessel triangles. */
(function(root){
  'use strict';const C=root.BobSceneCore;
  const mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
  function clipWater(polygon){
    const result=[];for(let i=0;i<polygon.length;i++){const a=polygon[i],b=polygon[(i+1)%polygon.length],inside=a[1]>=0,next=b[1]>=0;if(inside)result.push(a);if(inside!==next)result.push(mix(a,b,-a[1]/(b[1]-a[1])));}return result;
  }
  class CanvasRenderer{
    constructor(canvas,baseline,onError){
      this.canvas=canvas;this.context=canvas.getContext('2d',{alpha:false});if(!this.context)throw new Error('Neither GPU nor Canvas rendering is available in this browser.');
      this.baseline=baseline;this.onError=onError;this.azimuth=.82;this.elevation=.34;this.distance=3.6;this.time=0;this.last=0;this.frame=0;this.drawCount=0;
      this.options={playing:!matchMedia('(prefers-reduced-motion: reduce)').matches,orbit:false,detail:.35,lighting:'day',quality:'auto',complete:false,draft:0};
      this.rebuildVessel();this.pointerCleanup=this.setupCamera();this.resizeObserver=new ResizeObserver(()=>this.requestFrame());this.resizeObserver.observe(canvas);
      this.visibility=()=>{this.last=0;if(document.hidden){cancelAnimationFrame(this.frame);this.frame=0;}else this.requestFrame();};document.addEventListener('visibilitychange',this.visibility);this.requestFrame();
    }
    rebuildVessel(){this.geometry=C.createGeometry(this.baseline,this.options.complete);this.vertexCount=this.geometry.length/9;}
    render(timestamp){
      this.frame=0;if(this.last&&timestamp-this.last<1000/30&&this.options.playing){this.requestFrame();return;}
      const o=this.options,ctx=this.context,rect=this.canvas.getBoundingClientRect();
      const dt=this.last?Math.min((timestamp-this.last)/1000,.05):0;this.last=timestamp;if(o.playing){this.time+=dt;if(o.orbit)this.azimuth+=dt*.1;}
      const scale=Math.min(devicePixelRatio||1,o.quality==='high'?1.5:1);const w=Math.max(1,Math.round(rect.width*scale)),h=Math.max(1,Math.round(rect.height*scale));
      if(this.canvas.width!==w||this.canvas.height!==h){this.canvas.width=w;this.canvas.height=h;}
      const c=C.camera(this.azimuth,this.elevation,this.distance,w/h);this.lastCamera=c;
      const golden=o.lighting==='golden',overcast=o.lighting==='overcast';
      const horizon=C.clamp((1+Math.tan(-this.elevation)/c.tanHalfFov)/2*h,-h,h*.48);
      const sky=ctx.createLinearGradient(0,0,0,Math.max(1,horizon));sky.addColorStop(0,golden?'#7b858f':overcast?'#a2b5ba':'#6896aa');sky.addColorStop(1,golden?'#ebc5a0':'#d6e3df');ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
      if(horizon>0){ctx.fillStyle=overcast?'#8fa5a0':'#769690';ctx.beginPath();ctx.moveTo(0,horizon);for(let x=0;x<=w;x+=6)ctx.lineTo(x,horizon-8-Math.sin(x*.012)*5-Math.sin(x*.035)*2);ctx.lineTo(w,horizon+4);ctx.closePath();ctx.fill();}
      const water=ctx.createLinearGradient(0,Math.max(0,horizon),0,h);water.addColorStop(0,golden?'#b9bbaa':overcast?'#718f92':'#8db4b8');water.addColorStop(.5,golden?'#477b7d':'#477f83');water.addColorStop(1,overcast?'#244d57':'#235a64');ctx.fillStyle=water;ctx.fillRect(0,Math.max(0,horizon),w,h);
      ctx.save();ctx.beginPath();ctx.rect(0,Math.max(0,horizon),w,h);ctx.clip();
      const rows=o.quality==='low'?55:85;
      for(let i=0;i<rows;i++){
        const f=i/rows,y=Math.max(0,horizon)+(h-Math.max(0,horizon))*f*f;
        ctx.strokeStyle=`rgba(214,239,222,${(.025+.09*f)*o.detail})`;ctx.lineWidth=(.6+f*1.3)*scale;ctx.beginPath();
        for(let x=-10;x<w+15;x+=12){const py=y+Math.sin(x*.012+i*2+this.time*(.3+f))*(1+f*4)*o.detail+Math.cos(x*.033+i+this.time*.7)*f*o.detail;if(x===-10)ctx.moveTo(x,py);else ctx.lineTo(x,py);}ctx.stroke();
      }
      // Soft highlight/reflections are visual texture, independent of hydrostatics.
      for(let i=0;i<95*o.detail;i++){
        const f=((i*73)%97)/97,x=((i*193.7+Math.sin(this.time*.3+i)*8)%w),y=Math.max(0,horizon)+(h-Math.max(0,horizon))*f;
        ctx.fillStyle=`rgba(255,235,184,${(golden?.12:.04)*(1-f)})`;ctx.fillRect(x,y,8+f*25,1+f);
      }
      ctx.restore();
      const project=p=>{
        const v=[...p,1],clip=[];for(let row=0;row<4;row++)clip[row]=v.reduce((sum,value,i)=>sum+value*c.matrix[i*4+row],0);
        return{x:(clip[0]/clip[3]*.5+.5)*w,y:(.5-clip[1]/clip[3]*.5)*h,depth:clip[3]};
      };
      const shadow=project([0,0,0]);ctx.save();ctx.translate(shadow.x,shadow.y+10);ctx.scale(w/800,h/580);const gradient=ctx.createRadialGradient(0,0,4,0,0,125);gradient.addColorStop(0,'rgba(8,35,38,.30)');gradient.addColorStop(1,'rgba(8,35,38,0)');ctx.fillStyle=gradient;ctx.fillRect(-140,-70,280,140);ctx.restore();
      const faces=[],sun=C.normalize(golden?[-.7,.16,-.5]:[-.3,.8,-.4]),g=this.geometry;
      for(let i=0;i<g.length;i+=27){
        const vertices=[0,9,18].map(offset=>[g[i+offset],g[i+offset+1]-o.draft,g[i+offset+2]]),clipped=clipWater(vertices);if(clipped.length<3)continue;
        const points=clipped.map(project);if(points.some(p=>p.depth<=.04))continue;
        const normal=C.normalize([g[i+3]+g[i+12]+g[i+21],g[i+4]+g[i+13]+g[i+22],g[i+5]+g[i+14]+g[i+23]]);
        const center=[0,1,2].map(axis=>vertices.reduce((sum,v)=>sum+v[axis],0)/3);
        if(C.dot(normal,c.eye.map((v,axis)=>v-center[axis]))<=0)continue;
        const lighting=.64+Math.max(0,C.dot(normal,sun))*.42;const rgb=[g[i+6],g[i+7],g[i+8]].map(v=>Math.round(C.clamp(v*lighting,0,1)*255));
        faces.push({points,depth:points.reduce((sum,p)=>sum+p.depth,0)/points.length,color:`rgb(${rgb.join(',')})`});
      }
      faces.sort((a,b)=>b.depth-a.depth);
      for(const face of faces){ctx.fillStyle=face.color;ctx.strokeStyle=face.color;ctx.lineWidth=.5;ctx.beginPath();face.points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fill();ctx.stroke();}
      this.drawCount++;if(o.playing)this.requestFrame();
    }
    diagnostics(){return{mode:'canvas',frames:this.drawCount,vertices:this.vertexCount,width:this.canvas.width,height:this.canvas.height,contextLost:false,glError:null,camera:{distance:this.distance,azimuth:this.azimuth,elevation:this.elevation},options:{...this.options}};}
  }
  for(const name of ['setupCamera','setOptions','reset','zoom','requestFrame'])CanvasRenderer.prototype[name]=root.BobWaterRenderer.prototype[name];
  root.BobCanvasRenderer=CanvasRenderer;
})(globalThis);
