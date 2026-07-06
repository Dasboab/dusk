/* DUSK v0.4: deploy search, friendlier movement, richer terrain dressing, multi-outpost opposition. */
(function(){
  'use strict';
  function ready(){
    return typeof G!=='undefined'&&typeof THREE!=='undefined'&&typeof spawnUnit==='function'&&typeof spawnBuilding==='function'&&typeof buildWorld==='function'&&typeof canPlace==='function';
  }
  function findNearbyDeploy(x,z){
    const step=2;
    for(let r=0;r<=30;r+=step){
      for(let a=0;a<Math.PI*2;a+=Math.PI/12){
        const nx=Math.round((x+Math.cos(a)*r)/GRID)*GRID;
        const nz=Math.round((z+Math.sin(a)*r)/GRID)*GRID;
        if(Math.abs(nx)>HALF-10||Math.abs(nz)>HALF-10||isWater(nx,nz))continue;
        const clearEnt=G.ents.every(e=>e.dead||e.type==='mobilehq'||d2(nx,nz,e.pos.x,e.pos.z)>95);
        const clearOre=G.ore.every(o=>o.amount<=0||d2(nx,nz,o.x,o.z)>70);
        const slope=Math.abs(groundH(nx+3,nz)-groundH(nx-3,nz))+Math.abs(groundH(nx,nz+3)-groundH(nx,nz-3));
        if(clearEnt&&clearOre&&slope<2.8)return {x:nx,z:nz};
      }
    }
    return null;
  }
  function addTerrainDressing(){
    if(window.__DUSK_V04_TERRAIN__)return;window.__DUSK_V04_TERRAIN__=true;
    const roadMat=new THREE.MeshLambertMaterial({color:0x3b3130,transparent:true,opacity:.82});
    const makeRoad=(x,z,w,h,rot)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),roadMat);m.rotation.x=-Math.PI/2;m.rotation.z=rot||0;m.position.set(x,groundH(x,z)+.18,z);scene.add(m);};
    makeRoad(-72,68,62,5,-.55);makeRoad(-20,20,110,4,-.75);makeRoad(56,-46,95,4,-.8);
    const ridgeMat=new THREE.MeshLambertMaterial({color:0x5d4a5f});
    for(let i=0;i<18;i++){
      const x=-20+i*6,z=-78+Math.sin(i*.7)*10;
      const r=new THREE.Mesh(new THREE.DodecahedronGeometry(1.8+Math.random()*1.8,0),ridgeMat);
      r.position.set(x,groundH(x,z)+1,z);r.scale.y=.55+Math.random()*.6;r.castShadow=true;scene.add(r);
    }
    const wreckMat=new THREE.MeshLambertMaterial({color:0x22202a});
    for(const p of [{x:2,z:12},{x:45,z:-10},{x:-42,z:-38},{x:82,z:34}]){
      const w=new THREE.Mesh(new THREE.BoxGeometry(6,1.2,2.4),wreckMat);w.position.set(p.x,groundH(p.x,p.z)+.8,p.z);w.rotation.y=Math.random()*6.28;w.castShadow=true;scene.add(w);
    }
  }
  function patch(){
    if(!ready()){setTimeout(patch,60);return;}
    if(window.__DUSK_V04_PATCHED__)return; window.__DUSK_V04_PATCHED__=true;

    // More reliable mobile HQ deployment: find the nearest usable patch rather than failing on the exact tap/position.
    window.deployMobileHQ=function(){
      const u=G.selected.length===1&&G.selected[0];
      if(!u||u.type!=='mobilehq')return;
      const spot=findNearbyDeploy(u.pos.x,u.pos.z);
      if(!spot){announce('No suitable deployment ground nearby. Move the HQ to flatter open terrain.');sfx.deny();return;}
      u.dead=true;scene.remove(u.mesh);G.ents=G.ents.filter(e=>e!==u);G.selected=[];
      const cy=spawnBuilding('conyard',spot.x,spot.z,0,true);setSelection([cy]);
      announce('Mobile HQ deployed at nearest clear ground');sfx.place();refreshSidebar();
    };
    const dep=document.getElementById('cDeploy'); if(dep)dep.onclick=window.deployMobileHQ;

    // Friendlier tap-to-move. If the user has units selected and taps ground, just move/attack-move even if no command is armed.
    const oldSmartOrder=smartOrder;
    smartOrder=function(w){
      if(!w||!G.selected.length)return;
      const units=G.selected.filter(e=>e.cat==='u');
      if(units.length){
        formation(units,w.x,w.z).forEach((p,i)=>{units[i].dest=p;units[i].order={mode:'amove'};});
        announce('Moving '+units.length+' unit'+(units.length>1?'s':''));sfx.click();
        return;
      }
      return oldSmartOrder(w);
    };

    // Additional opposition within current engine limits: multiple enemy outposts and patrols.
    const prevBuildWorld=buildWorld;
    buildWorld=function(){
      prevBuildWorld();
      addTerrainDressing();
      const camps=[
        {x:55,z:52,name:'Northern firebase'},
        {x:-58,z:-70,name:'Western drone post'},
        {x:104,z:18,name:'Coastal missile post'}
      ];
      camps.forEach((c,idx)=>{
        spawnBuilding('turret',c.x,c.z,1);
        if(idx===1&&BDEF.dronebay)spawnBuilding('dronebay',c.x+8,c.z+7,1);
        if(idx===2&&BDEF.navalyard)spawnBuilding('navalyard',126,c.z+4,1);
        spawnUnit('tank',c.x+5,c.z-5,1);spawnUnit('rocketeer',c.x-4,c.z+4,1);spawnUnit('rifleman',c.x+2,c.z+6,1);
        if(UDEF.dogbot)spawnUnit('dogbot',c.x-8,c.z-3,1);
      });
      // More neutral/contested ore to make the map feel less tiny.
      spawnOreField(-32,88,12,1.1);spawnOreField(34,82,12,1.1);spawnOreField(-96,-20,10,1.15);spawnOreField(94,-2,10,1.25);
      announce('v0.4: expanded outposts, click-to-move, smarter HQ deploy');
    };

    // Make enemy waves more varied without needing true extra teams yet.
    const oldAiTick=aiTick;
    aiTick=function(dt){
      oldAiTick(dt);
      if(G.t>120&&!G.ai.v04Raid1){G.ai.v04Raid1=true;[['apc',62,48],['rifleman',60,51],['rocketeer',58,49]].forEach(a=>{const u=spawnUnit(a[0],a[1],a[2],1);u.order={mode:'amove'};u.dest={x:-60,z:60};});announce('Enemy raiding party moving');}
      if(G.t>360&&!G.ai.v04Raid2){G.ai.v04Raid2=true;[['droneugv',-58,-70],['dogbot',-61,-67],['dogbot',-55,-73]].forEach(a=>{if(UDEF[a[0]]){const u=spawnUnit(a[0],a[1],a[2],1);u.order={mode:'amove'};u.dest={x:-56,z:58};}});announce('Robotics raid detected');}
    };

    // Graphics quality nudge: stronger fog contrast and subtle vignette overlay.
    const vignette=document.createElement('div');vignette.style.cssText='position:fixed;inset:0;z-index:2;pointer-events:none;background:radial-gradient(ellipse at 50% 42%,rgba(255,180,84,.05),rgba(8,6,14,.18) 70%,rgba(0,0,0,.28));mix-blend-mode:screen';document.body.appendChild(vignette);
    const badge=document.createElement('div');badge.textContent='v0.4 expanded prototype';badge.style.cssText='position:fixed;left:10px;top:30px;z-index:87;font:10px system-ui;color:#ffb454;background:rgba(13,10,22,.82);border:1px solid rgba(255,180,84,.35);padding:4px 7px;letter-spacing:.12em;text-transform:uppercase;pointer-events:none';document.body.appendChild(badge);
  }
  patch();
})();
