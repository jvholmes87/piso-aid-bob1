'use strict';
(async function(){
  const $=id=>document.getElementById(id);let renderer,baseline,model,audioContext,audioGain,audioPanner,audioSource;
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');let playing=!reducedMotion.matches,orbit=false,sound=false;
  function fail(message){$('fallback').hidden=false;$('errorMessage').textContent=message;$('renderStatus').textContent='Scene unavailable';for(const control of document.querySelectorAll('#controls button,#controls select,#controls input,.camera-tools button'))control.disabled=true;if(audioContext)audioContext.suspend().catch(()=>{});}
  $('retry').addEventListener('click',()=>location.reload());
  function toggle(id,on,label){$(id).setAttribute('aria-pressed',String(on));$(id).textContent=label;}
  toggle('motion',playing,playing?'Playing Ⅱ':'Paused ▶');
  try{
    const response=await fetch('model/bob1-baseline.json');if(!response.ok)throw new Error('The vessel baseline could not be loaded. Please reload the page.');
    baseline=await response.json();model=BobHydrostatics.resolveModel(baseline);
    try{renderer=new BobWaterRenderer($('scene'),baseline,fail);$('renderStatus').textContent='LIVE · WEBGL';}
    catch(error){
      console.warn('GPU scene unavailable; using Canvas:',error.message);
      const replacement=$('scene').cloneNode(false);$('scene').replaceWith(replacement);
      renderer=new BobCanvasRenderer(replacement,baseline,fail);$('renderStatus').textContent='LIVE · CANVAS';
    }
  }catch(error){console.error('Water Lab initialization:',error);fail(error.message||'The scene could not be started.');return;}
  const format=(metric,imperial)=>$('units').value==='metric'?metric:$('units').value==='imperial'?imperial:metric+'\n'+imperial;
  function refreshReference(){
    const config=$('configuration').value,total=BobHydrostatics.scenarioMass(baseline,config),result=BobHydrostatics.levelFlotation(model,total),p=baseline.parameters;
    $('deckValue').textContent=format(`${p.deckLength.value.toFixed(2)} × ${p.deckWidth.value.toFixed(2)} m`,`${(p.deckLength.value/.3048).toFixed(2)} × ${(p.deckWidth.value/.3048).toFixed(2)} ft`);
    $('massValue').textContent=format(`${total.toFixed(2)} kg`,`${(total/.45359237).toFixed(1)} lb`);
    $('draftValue').textContent=format(`${Math.round(result.draft*1000)} mm`,`${(result.draft/.0254).toFixed(2)} in`);
    $('drumValue').textContent=format(`${model.drumCount} × ${(model.volumePerDrum*1000).toFixed(0)} L`,`${model.drumCount} × ${(model.volumePerDrum*1000/3.785411784).toFixed(2)} US gal`);
    $('sceneConfiguration').textContent=config==='bareHull'?'BARE HULL':'COMPLETE CRAFT CONCEPT';
    renderer.setOptions({complete:config==='completeCraft',draft:result.draft});
  }
  $('configuration').addEventListener('change',refreshReference);$('units').addEventListener('change',refreshReference);refreshReference();
  $('lighting').addEventListener('change',()=>renderer.setOptions({lighting:$('lighting').value}));
  $('surface').addEventListener('input',()=>{$('surfaceValue').textContent=$('surface').value+'%';renderer.setOptions({detail:Number($('surface').value)/100});});
  $('quality').addEventListener('change',()=>renderer.setOptions({quality:$('quality').value}));
  async function syncAudio(){
    if(!audioContext)return;const active=sound&&playing&&!document.hidden;
    try{if(active)await audioContext.resume();else await audioContext.suspend();}catch(error){$('soundStatus').textContent='Audio could not start. Try toggling ambience again.';}
  }
  $('motion').addEventListener('click',()=>{playing=!playing;toggle('motion',playing,playing?'Playing Ⅱ':'Paused ▶');renderer.setOptions({playing});syncAudio();});
  $('orbit').addEventListener('click',()=>{orbit=!orbit;toggle('orbit',orbit,orbit?'On':'Off');renderer.setOptions({orbit});});
  $('zoomIn').addEventListener('click',()=>renderer.zoom(.85));$('zoomOut').addEventListener('click',()=>renderer.zoom(1.15));$('resetCamera').addEventListener('click',()=>renderer.reset());
  $('sound').addEventListener('click',async()=>{
    try{
      if(!audioContext){
        const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw new Error('Audio unavailable');audioContext=new Audio();
        const buffer=audioContext.createBuffer(1,audioContext.sampleRate*3,audioContext.sampleRate),samples=buffer.getChannelData(0);let previous=0;
        for(let i=0;i<samples.length;i++){previous=.96*previous+.04*(Math.random()*2-1);samples[i]=previous;}
        audioSource=audioContext.createBufferSource();audioSource.buffer=buffer;audioSource.loop=true;
        const filter=audioContext.createBiquadFilter();filter.type='lowpass';filter.frequency.value=700;
        audioGain=audioContext.createGain();audioGain.gain.value=.12;
        audioPanner=audioContext.createPanner();audioPanner.panningModel='HRTF';audioPanner.distanceModel='inverse';audioPanner.refDistance=2;audioPanner.maxDistance=20;audioPanner.rolloffFactor=.25;
        audioSource.connect(filter);filter.connect(audioGain);audioGain.connect(audioPanner);audioPanner.connect(audioContext.destination);audioSource.start();
      }
      sound=!sound;toggle('sound',sound,sound?'On':'Off');await syncAudio();$('soundStatus').textContent=sound?'Synthesized water ambience enabled.':'Water ambience disabled.';
    }catch(error){sound=false;toggle('sound',false,'Unavailable');$('soundStatus').textContent='This browser could not enable audio.';}
  });
  // Spatial position follows the camera; never requests microphone access.
  const spatial=setInterval(()=>{
    if(!audioContext||!sound||!playing||document.hidden)return;const c=renderer.lastCamera;if(!c)return;
    const listener=audioContext.listener;
    if(listener.positionX){for(const [i,axis]of ['X','Y','Z'].entries()){listener['position'+axis].value=c.eye[i];listener['forward'+axis].value=c.forward[i];listener['up'+axis].value=c.up[i];}}
    else{listener.setPosition(...c.eye);listener.setOrientation(...c.forward,...c.up);}
  },120);
  document.addEventListener('visibilitychange',syncAudio);
  reducedMotion.addEventListener('change',e=>{if(e.matches){playing=false;toggle('motion',false,'Paused ▶');renderer.setOptions({playing:false});syncAudio();}});
  window.addEventListener('pagehide',()=>{clearInterval(spatial);if(audioContext)audioContext.suspend().catch(()=>{});});
  window.bobWaterLab={getState:()=>({...renderer.diagnostics(),configuration:$('configuration').value,units:$('units').value,baselineId:baseline.id,sound}),getBaseline:()=>JSON.parse(JSON.stringify(baseline))};
})();
