/* WebGL2 environment: procedural water/sky and source-based vessel geometry. */
(function(root){
  'use strict';
  const C=root.BobSceneCore;
  const fullscreenVertex=`#version 300 es
  in vec2 aPosition; out vec2 vScreen;
  void main(){vScreen=aPosition;gl_Position=vec4(aPosition,0.,1.);}`;
  const environmentFragment=`#version 300 es
  precision highp float;
  in vec2 vScreen;out vec4 outColor;
  uniform vec3 uEye,uForward,uRight,uUp,uSun;
  uniform mat4 uVP;
  uniform float uAspect,uTan,uTime,uDetail,uGolden,uOvercast,uQuality;
  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
  float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
  vec3 sky(vec3 ray){
    float height=max(ray.y,0.);
    vec3 horizon=mix(vec3(.77,.86,.86),vec3(.93,.66,.43),uGolden);
    vec3 zenith=mix(vec3(.20,.47,.64),vec3(.37,.43,.51),uGolden);
    vec3 color=mix(horizon,zenith,pow(height,.5));
    float sun=max(dot(ray,uSun),0.);
    color+=vec3(1.,.79,.47)*pow(sun,36.)*.28;
    color+=vec3(1.,.91,.71)*smoothstep(.99935,.9997,sun)*1.8*(1.-uOvercast);
    vec2 cloud=ray.xz/(max(ray.y,.05)+.14)*1.1+vec2(uTime*.003,0.);
    float c=noise(cloud)*.65+noise(cloud*2.8)*.25+noise(cloud*7.2)*.1;
    float clouds=smoothstep(.51,.75,c)*smoothstep(.02,.22,height)*.6;
    color=mix(color,vec3(.91,.92,.89),clouds);
    color=mix(color,mix(vec3(.78,.81,.79),vec3(.58,.66,.69),height),uOvercast*.8);
    float angle=atan(ray.z,ray.x);
    float ridge=.016+.008*sin(angle*5.)+.006*sin(angle*13.)+.003*sin(angle*29.);
    if(ray.y>-.015&&ray.y<ridge){float haze=smoothstep(0.,ridge,ray.y);color=mix(vec3(.33,.46,.45),horizon,.35+haze*.25);}
    return color;
  }
  vec3 wave(vec2 p){
    float a=uDetail*.018;
    float q1=dot(p,vec2(1.8,.7))+uTime*.8,q2=dot(p,vec2(-2.2,3.1))-uTime*1.15,q3=dot(p,vec2(6.,1.7))+uTime*1.5;
    float h=a*(sin(q1)+.48*sin(q2)+.17*sin(q3));
    vec2 d=a*(cos(q1)*vec2(1.8,.7)+.48*cos(q2)*vec2(-2.2,3.1)+.17*cos(q3)*vec2(6.,1.7));
    return vec3(h,d);
  }
  void main(){
    vec3 ray=normalize(uForward+uRight*vScreen.x*uAspect*uTan+uUp*vScreen.y*uTan);
    vec3 color;gl_FragDepth=1.;
    if(ray.y>=-.0005){color=sky(ray);}else{
      float distance=-uEye.y/ray.y;vec3 p=uEye+distance*ray;
      for(int i=0;i<3;i++){distance=(wave(p.xz).x-uEye.y)/ray.y;p=uEye+distance*ray;}
      if(distance<0.||distance>500.){color=sky(ray);}else{
        vec3 w=wave(p.xz);vec2 micro=vec2(0.);
        if(uQuality>.5)micro=vec2(sin(p.x*43.+p.z*28.+uTime*1.2),cos(p.x*31.-p.z*37.+uTime))*.015*uDetail*exp(-distance*.025);
        vec3 n=normalize(vec3(-w.y-micro.x,1.,-w.z-micro.y));
        float fresnel=.07+.93*pow(1.-max(dot(-ray,n),0.),4.);
        vec3 reflection=sky(reflect(ray,n));
        vec3 water=mix(vec3(.065,.24,.25),vec3(.07,.18,.20),uOvercast);
        float caustic=pow(max(0.,sin(p.x*12.+sin(p.z*8.+uTime*.3))*sin(p.z*14.-uTime*.4)),10.);
        water+=vec3(.055,.10,.075)*caustic*.22*uDetail;
        float shadow=exp(-pow(p.x/.82,6.)-pow(p.z/.48,6.))*.23;
        water*=1.-shadow;
        color=mix(water,reflection,clamp(fresnel,.08,.95));
        float glitter=pow(max(dot(reflect(-uSun,n),-ray),0.),mix(160.,450.,uQuality));
        color+=vec3(1.,.82,.52)*glitter*(1.-uOvercast)*1.2;
        color=mix(color,sky(vec3(ray.x,.001,ray.z)),1.-exp(-distance*.008));
        vec4 clip=uVP*vec4(p,1.);gl_FragDepth=clip.z/clip.w*.5+.5;
      }
    }
    outColor=vec4(clamp(color,0.,1.),1.);
  }`;
  const vesselVertex=`#version 300 es
  precision highp float;
  in vec3 aPosition,aNormal,aColor;out vec3 vPosition,vNormal,vColor;
  uniform mat4 uVP;uniform float uDraft;
  void main(){vPosition=aPosition-vec3(0.,uDraft,0.);vNormal=aNormal;vColor=aColor;gl_Position=uVP*vec4(vPosition,1.);}`;
  const vesselFragment=`#version 300 es
  precision highp float;
  in vec3 vPosition,vNormal,vColor;out vec4 outColor;
  uniform vec3 uSun,uEye;uniform float uOvercast;
  void main(){
    vec3 n=normalize(vNormal),view=normalize(uEye-vPosition);
    float diffuse=max(dot(n,uSun),0.);
    vec3 linear=pow(vColor,vec3(2.2))*(.35+diffuse*.75)*(1.-uOvercast*.16);
    float spec=pow(max(dot(n,normalize(uSun+view)),0.),50.)*.10;
    linear+=vec3(spec)+vec3(.015,.025,.025)*max(-n.y,0.);
    outColor=vec4(pow(max(linear,vec3(0.)),vec3(1./2.2)),1.);
  }`;
  function compile(gl,type,source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){const message=gl.getShaderInfoLog(shader);gl.deleteShader(shader);throw new Error(message);}return shader;}
  function program(gl,vert,frag){const p=gl.createProgram(),v=compile(gl,gl.VERTEX_SHADER,vert),f=compile(gl,gl.FRAGMENT_SHADER,frag);gl.attachShader(p,v);gl.attachShader(p,f);gl.linkProgram(p);gl.deleteShader(v);gl.deleteShader(f);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));return p;}
  class WaterRenderer{
    constructor(canvas,baseline,onError){
      this.canvas=canvas;this.baseline=baseline;this.onError=onError;this.gl=canvas.getContext('webgl2',{alpha:false,antialias:true,powerPreference:'low-power'});
      if(!this.gl)throw new Error('WebGL 2 is unavailable. Try a current browser with hardware graphics enabled.');
      this.azimuth=.82;this.elevation=.34;this.distance=3.6;this.time=0;this.last=0;this.frame=0;this.drawCount=0;
      this.options={playing:!matchMedia('(prefers-reduced-motion: reduce)').matches,orbit:false,detail:.35,lighting:'day',quality:'auto',complete:false,draft:0};
      const gl=this.gl;this.env=program(gl,fullscreenVertex,environmentFragment);this.boat=program(gl,vesselVertex,vesselFragment);
      this.locations=new Map();for(const p of [this.env,this.boat]){const map={};for(const name of ['uEye','uForward','uRight','uUp','uSun','uVP','uAspect','uTan','uTime','uDetail','uGolden','uOvercast','uQuality','uDraft'])map[name]=gl.getUniformLocation(p,name);this.locations.set(p,map);}
      this.quad=gl.createVertexArray();gl.bindVertexArray(this.quad);this.quadBuffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.quadBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);let loc=gl.getAttribLocation(this.env,'aPosition');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
      this.vessel=gl.createVertexArray();this.vesselBuffer=gl.createBuffer();gl.bindVertexArray(this.vessel);gl.bindBuffer(gl.ARRAY_BUFFER,this.vesselBuffer);
      for(const [i,name]of ['aPosition','aNormal','aColor'].entries()){loc=gl.getAttribLocation(this.boat,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,36,i*12);}this.rebuildVessel();gl.bindVertexArray(null);
      this.pointerCleanup=this.setupCamera();this.resizeObserver=new ResizeObserver(()=>this.requestFrame());this.resizeObserver.observe(canvas);
      this.visibility=()=>{this.last=0;if(document.hidden){cancelAnimationFrame(this.frame);this.frame=0;}else this.requestFrame();};document.addEventListener('visibilitychange',this.visibility);
      this.contextLost=e=>{e.preventDefault();cancelAnimationFrame(this.frame);this.frame=0;this.lost=true;onError('The graphics context was interrupted. Select Try again to reload the scene.');};canvas.addEventListener('webglcontextlost',this.contextLost);
      this.requestFrame();
    }
    rebuildVessel(){const vertices=C.createGeometry(this.baseline,this.options.complete);this.vertexCount=vertices.length/9;this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.vesselBuffer);this.gl.bufferData(this.gl.ARRAY_BUFFER,vertices,this.gl.STATIC_DRAW);}
    setOptions(values){const rebuild='complete'in values&&values.complete!==this.options.complete;Object.assign(this.options,values);if(rebuild)this.rebuildVessel();this.last=0;this.requestFrame();}
    reset(){this.azimuth=.82;this.elevation=.34;this.distance=3.6;this.requestFrame();}
    zoom(factor){this.distance=C.clamp(this.distance*factor,1.8,9);this.requestFrame();}
    setupCamera(){
      const canvas=this.canvas,pointers=new Map();let previousDistance=0;
      const distance=()=>{const p=[...pointers.values()];return p.length===2?Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y):0;};
      const down=e=>{canvas.focus({preventScroll:true});canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});previousDistance=distance();};
      const move=e=>{const previous=pointers.get(e.pointerId);if(!previous)return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===1){this.azimuth-=(e.clientX-previous.x)*.007;this.elevation=C.clamp(this.elevation+(e.clientY-previous.y)*.006,.10,1.47);}else{const d=distance();if(previousDistance&&d)this.zoom(previousDistance/d);previousDistance=d;}this.requestFrame();};
      const up=e=>{pointers.delete(e.pointerId);previousDistance=distance();};
      const wheel=e=>{e.preventDefault();this.zoom(Math.exp(C.clamp(e.deltaY,-100,100)*.002));};
      const keyboard=e=>{let handled=true;switch(e.key){case'ArrowLeft':this.azimuth-=.12;break;case'ArrowRight':this.azimuth+=.12;break;case'ArrowUp':this.elevation=C.clamp(this.elevation+.08,.1,1.47);break;case'ArrowDown':this.elevation=C.clamp(this.elevation-.08,.1,1.47);break;case'+':case'=':this.zoom(.9);break;case'-':case'_':this.zoom(1.1);break;case'Home':this.reset();break;default:handled=false;}if(handled){e.preventDefault();this.requestFrame();}};
      const listeners=[['pointerdown',down],['pointermove',move],['pointerup',up],['pointercancel',up],['lostpointercapture',up],['wheel',wheel],['keydown',keyboard]];
      for(const [type,handler]of listeners)canvas.addEventListener(type,handler,type==='wheel'?{passive:false}:undefined);
      return()=>{for(const [type,handler]of listeners)canvas.removeEventListener(type,handler);};
    }
    requestFrame(){if(!this.frame&&!document.hidden&&!this.lost)this.frame=requestAnimationFrame(t=>{try{this.render(t);}catch(error){console.error('Water Lab rendering:',error);this.lost=true;this.onError('The scene was interrupted. Select Try again to reload, or use the visual explorer.');}});}
    render(timestamp){
      this.frame=0;const gl=this.gl,o=this.options;
      const dt=this.last?Math.min((timestamp-this.last)/1000,.05):0;this.last=timestamp;
      if(o.playing){this.time+=dt;if(o.orbit)this.azimuth+=dt*.10;}
      const rect=this.canvas.getBoundingClientRect();const reduced=o.quality==='low'||(o.quality==='auto'&&rect.width<740);
      const scale=Math.min(devicePixelRatio||1,reduced?1: o.quality==='high'?2:1.5);
      const width=Math.max(1,Math.round(rect.width*scale)),height=Math.max(1,Math.round(rect.height*scale));
      if(this.canvas.width!==width||this.canvas.height!==height){this.canvas.width=width;this.canvas.height=height;}
      gl.viewport(0,0,width,height);gl.clearDepth(1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);
      const camera=C.camera(this.azimuth,this.elevation,this.distance,width/height);const sun=o.lighting==='golden'?C.normalize([-.7,.16,-.5]):C.normalize([-.3,.8,-.4]);
      for(const p of [this.env,this.boat]){gl.useProgram(p);const u=this.locations.get(p);gl.uniform3fv(u.uEye,camera.eye);gl.uniform3fv(u.uForward,camera.forward);gl.uniform3fv(u.uRight,camera.right);gl.uniform3fv(u.uUp,camera.up);gl.uniform3fv(u.uSun,sun);gl.uniformMatrix4fv(u.uVP,false,camera.matrix);gl.uniform1f(u.uAspect,width/height);gl.uniform1f(u.uTan,camera.tanHalfFov);gl.uniform1f(u.uTime,this.time);gl.uniform1f(u.uDetail,o.detail);gl.uniform1f(u.uGolden,o.lighting==='golden'?1:0);gl.uniform1f(u.uOvercast,o.lighting==='overcast'?1:0);gl.uniform1f(u.uQuality,reduced?0:1);gl.uniform1f(u.uDraft,o.draft);
        if(p===this.env){gl.depthFunc(gl.ALWAYS);gl.bindVertexArray(this.quad);gl.drawArrays(gl.TRIANGLES,0,6);}else{gl.depthFunc(gl.LESS);gl.bindVertexArray(this.vessel);gl.drawArrays(gl.TRIANGLES,0,this.vertexCount);}}
      gl.bindVertexArray(null);this.drawCount++;this.lastCamera=camera;
      if(o.playing)this.requestFrame();
    }
    diagnostics(){return{mode:'webgl',frames:this.drawCount,vertices:this.vertexCount,width:this.canvas.width,height:this.canvas.height,contextLost:!!this.lost,glError:this.gl.getError(),camera:{distance:this.distance,azimuth:this.azimuth,elevation:this.elevation},options:{...this.options}};}
  }
  root.BobWaterRenderer=WaterRenderer;
})(globalThis);
