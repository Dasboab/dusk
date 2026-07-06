/* DUSK v0.3: mobile start + coastal opening.
   This intentionally layers on top of the original game and v0.2 patch. */
(function(){
  'use strict';
  function ready(){
    return typeof G!=='undefined' && typeof UDEF!=='undefined' && typeof BDEF!=='undefined' &&
      typeof spawnUnit==='function' && typeof spawnBuilding==='function' && typeof buildWorld==='function' &&
      typeof scene!=='undefined' && typeof THREE!=='undefined';
  }
  function addBrief(){
    if(document.getElementById('duskV03Panel'))return;
    const panel=document.createElement('div');
    panel.id='duskV03Panel';
    panel.innerHTML='<b>DUSK v0.3</b><br>Mobile HQ start active.<br>Deploy the HQ near clear land, secure coastal ore, then build naval/air/drone tech.<br><button id="duskV03Hide">hide</button>';
    panel.style.cssText='position:fixed;left:10px;top:72px;z-index:85;max-width:245px;padding:8px 10px;background:rgba(13,10,22,.86);border:1px solid rgba(255,180,84,.35);color:#e9dfcf;font:11px/1.45 system-ui,-apple-system,sans-serif;box-shadow:0 0 18px rgba(0,0,0,.35)';
    const st=document.createElement('style');st.textContent='#duskV03Panel b{color:#ffb454;letter-spacing:.12em}#duskV03Panel button{margin-top:6px;background:transparent;border:1px solid rgba(255,180,84,.35);color:#ffb454;text-transform:uppercase;font-size:9px;letter-spacing:.12em;padding:3px 7px}';
    document.head.appendChild(st);document.body.appendChild(panel);
    document.getElementById('duskV03Hide').onclick=()=>panel.style.display='none';
  }
  function patch(){
    if(!ready()){setTimeout(patch,60);return;}
    if(window.__DUSK_V03_PATCHED__)return; window.__DUSK_V03_PATCHED__=true;

    // Make the Mobile HQ deploy anywhere clear, so it can truly replace a fixed starting base.
    window.deployMobileHQ=function(){
      const u=G.selected.length===1&&G.selected[0];
      if(!u||u.type!=='mobilehq')return;
      const x=Math.round(u.pos.x/GRID)*GRID,z=Math.round(u.pos.z/GRID)*GRID;
      const clear = Math.abs(x)<HALF-8 && Math.abs(z)<HALF-8 && !isWater(x,z) && G.ents.every(e=>e.dead||e===u||d2(x,z,e.pos.x,e.pos.z)>80);
      if(!clear){announce('Mobile HQ needs clear dry ground to deploy');sfx.deny();return;}
      u.dead=true;scene.remove(u.mesh);G.ents=G.ents.filter(e=>e!==u);G.selected=[];
      const cy=spawnBuilding('conyard',x,z,0,true);setSelection([cy]);
      announce('Mobile HQ deployed: command network online');sfx.place();refreshSidebar();
    };
    const dep=document.getElementById('cDeploy'); if(dep)dep.onclick=window.deployMobileHQ;

    // Add a light amphibious transport. It uses gunboat visuals for now but creates the gameplay role.
    if(!UDEF.landingcraft){
      UDEF.landingcraft={name:'Landing Craft',cost:900,time:10,hp:520,speed:11.5,r:2.7,sight:24,armor:'veh',from:'navalyard',domain:'sea',blurb:'Amphibious troop carrier, prototype transport',cap:8,weapon:{dmg:6,range:12,cd:0.6,type:'bullet'}};
      if(typeof NAV_ORDER!=='undefined'&&!NAV_ORDER.includes('landingcraft'))NAV_ORDER.unshift('landingcraft');
    }
    if(!UDEF.coastalfrigate){
      UDEF.coastalfrigate={name:'Coastal Frigate',cost:1800,time:16,hp:850,speed:9.2,r:3.1,sight:32,armor:'veh',from:'navalyard',domain:'sea',blurb:'Air/naval screen with missile reach',weapon:{dmg:34,range:32,minRange:5,cd:3.6,type:'rocket',burst:2}};
      if(typeof NAV_ORDER!=='undefined'&&!NAV_ORDER.includes('coastalfrigate'))NAV_ORDER.push('coastalfrigate');
    }
    const oldMakeUnitMesh=makeUnitMesh;
    makeUnitMesh=function(type,team){
      if(type==='landingcraft')return oldMakeUnitMesh('gunboat',team);
      if(type==='coastalfrigate')return oldMakeUnitMesh('corvette',team);
      return oldMakeUnitMesh(type,team);
    };

    // v0.3 world setup: remove the prebuilt player Construction Yard and start as a convoy near the coast.
    const prevBuildWorld=buildWorld;
    buildWorld=function(){
      prevBuildWorld();
      const playerCY=G.ents.find(e=>!e.dead&&e.team===0&&e.type==='conyard');
      if(playerCY){playerCY.dead=true;scene.remove(playerCY.mesh);G.ents=G.ents.filter(e=>e!==playerCY);}
      // Clear any duplicate v0.2 Mobile HQs, then create a deliberate starting convoy.
      G.ents.filter(e=>!e.dead&&e.team===0&&e.type==='mobilehq').forEach(e=>{e.dead=true;scene.remove(e.mesh);});
      G.ents=G.ents.filter(e=>!e.dead);
      const hq=spawnUnit('mobilehq',-76,72,0);
      const escort1=spawnUnit('apc',-82,78,0);
      const escort2=spawnUnit('rifleman',-86,74,0);
      const escort3=spawnUnit('rocketeer',-84,69,0);
      const boat=spawnUnit('gunboat',132,70,0);
      const craft=spawnUnit('landingcraft',130,77,0);
      [hq,escort1,escort2,escort3].forEach((u,i)=>{u.dest={x:-58+i*2,z:58-i*2};u.order={mode:'move'};});
      boat.dest={x:124,z:58};boat.order={mode:'guard'};craft.dest={x:126,z:68};craft.order={mode:'guard'};
      // Stronger coastal economy temptation.
      spawnOreField(104,48,14,1.45);spawnOreField(90,66,10,1.2);spawnOreField(120,94,8,1.2);
      G.credits[0]=Math.max(G.credits[0],9500);
      cam.x=-70;cam.z=68;if(typeof applyCam==='function')applyCam();
      setSelection([hq]);
      addBrief();
      announce('v0.3: mobile start. Deploy HQ, then secure the coast.');
    };

    // Harder AI pacing for the demo.
    if(G.ai){G.ai.waveTimer=Math.min(G.ai.waveTimer||170,125);G.ai.prodTimer=Math.min(G.ai.prodTimer||6,4);}
    const oldAiTick=aiTick;
    aiTick=function(dt){
      oldAiTick(dt);
      if(G.t>240&&G.ai&&G.ai.v03Boost!==true){
        G.ai.v03Boost=true;G.credits[1]+=3500;
        const ecy=G.ents.find(e=>!e.dead&&e.team===1&&e.type==='conyard');
        if(ecy){spawnUnit('droneugv',ecy.pos.x-10,ecy.pos.z+8,1);spawnUnit('dogbot',ecy.pos.x-13,ecy.pos.z+10,1);}
        announce('Enemy drone reserve detected');
      }
    };

    addBrief();
    const badge=document.createElement('div');badge.textContent='v0.3 mobile start';
    badge.style.cssText='position:fixed;left:10px;top:50px;z-index:86;font:10px system-ui;color:#37e0cf;background:rgba(13,10,22,.82);border:1px solid rgba(55,224,207,.35);padding:4px 7px;letter-spacing:.12em;text-transform:uppercase;pointer-events:none';
    document.body.appendChild(badge);
  }
  patch();
})();
