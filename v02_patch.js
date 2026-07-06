/* DUSK v0.2 incremental gameplay patch.
   Loaded into dusk_index_fixed.html by index.html before the player presses Deploy. */
(function(){
  'use strict';
  function patch(){
    if(typeof BDEF==='undefined'||typeof UDEF==='undefined'||typeof G==='undefined'||typeof THREE==='undefined'){
      setTimeout(patch,50);return;
    }
    if(window.__DUSK_V02_PATCHED__)return;
    window.__DUSK_V02_PATCHED__=true;

    Object.assign(BDEF,{
      airfield :{name:'Air Base',cost:2200,time:18,hp:1700,power:-35,size:13,sight:24,prereq:'factory'},
      dronebay :{name:'Drone Bay',cost:1200,time:12,hp:1000,power:-25,size:8,sight:24,prereq:'factory'},
      robotics :{name:'Robotics Lab',cost:1800,time:16,hp:1200,power:-30,size:9,sight:24,prereq:'dronebay'},
      ewcenter :{name:'EW Centre',cost:1400,time:14,hp:950,power:-40,size:7,sight:32,prereq:'dronebay'}
    });
    ['airfield','dronebay','robotics','ewcenter'].forEach(t=>{if(!BUILD_ORDER.includes(t))BUILD_ORDER.splice(BUILD_ORDER.indexOf('turret'),0,t);});

    Object.assign(UDEF,{
      mobilehq:{name:'Mobile HQ Rig',cost:2500,time:20,hp:950,speed:8.2,r:2.4,sight:30,armor:'veh',from:'factory',blurb:'Mobile base, deploys into a Construction Yard'},
      reconuav:{name:'Recon UAV',cost:350,time:6,hp:85,speed:18,r:0.9,sight:38,armor:'veh',from:'dronebay',domain:'air',blurb:'Fast unarmed aerial scout'},
      fpvdrone:{name:'FPV Strike Drone',cost:220,time:5,hp:55,speed:22,r:0.7,sight:22,armor:'veh',from:'dronebay',domain:'air',blurb:'Cheap single-use precision strike',weapon:{dmg:70,range:3,cd:0.7,type:'rocket',kamikaze:true}},
      interceptor:{name:'Counter-UAV Team',cost:450,time:8,hp:150,speed:8,r:1,sight:32,armor:'inf',from:'ewcenter',blurb:'EW and kinetic counter-drone team',weapon:{dmg:22,range:24,cd:0.75,type:'bullet'}},
      dogbot:{name:'5.56 Drone Dog',cost:500,time:9,hp:170,speed:12.5,r:1,sight:24,armor:'veh',from:'robotics',blurb:'Reusable quadruped infantry robot',weapon:{dmg:9,range:14,cd:0.45,type:'bullet'}},
      droneugv:{name:'Drone Tank UGV',cost:1100,time:13,hp:520,speed:9,r:1.8,sight:23,armor:'veh',from:'robotics',blurb:'Uncrewed ground combat vehicle',weapon:{dmg:34,range:18,cd:1.5,type:'shell'}},
      strikeuav:{name:'Strike UAV',cost:1300,time:14,hp:250,speed:17,r:1.3,sight:34,armor:'veh',from:'airfield',domain:'air',blurb:'Reusable loitering air support',weapon:{dmg:38,range:24,cd:2.8,type:'rocket',burst:2}}
    });
    ['mobilehq','reconuav','fpvdrone','interceptor','dogbot','droneugv','strikeuav'].forEach(t=>{if(!VEH_ORDER.includes(t))VEH_ORDER.push(t);});
    ['dronebay','robotics','ewcenter','airfield'].forEach(k=>{if(!G.queues[k])G.queues[k]=[];});

    const oldMakeBuildingMesh=makeBuildingMesh;
    makeBuildingMesh=function(type,team){
      if(type==='airfield')return oldMakeBuildingMesh('factory',team);
      if(type==='dronebay')return oldMakeBuildingMesh('barracks',team);
      if(type==='robotics')return oldMakeBuildingMesh('factory',team);
      if(type==='ewcenter')return oldMakeBuildingMesh('power',team);
      return oldMakeBuildingMesh(type,team);
    };

    const oldMakeUnitMesh=makeUnitMesh;
    makeUnitMesh=function(type,team){
      if(type==='mobilehq')return oldMakeUnitMesh('apc',team);
      if(type==='dogbot'||type==='interceptor')return oldMakeUnitMesh('rifleman',team);
      if(type==='droneugv')return oldMakeUnitMesh('tank',team);
      if(type==='reconuav'||type==='fpvdrone'||type==='strikeuav'){
        const g=new THREE.Group();
        const mat=new THREE.MeshLambertMaterial({color:team===0?0x37e0cf:0xff5148});
        const dark=new THREE.MeshLambertMaterial({color:0x1d1726});
        const big=type==='strikeuav';
        const body=new THREE.Mesh(new THREE.CylinderGeometry(big?0.22:0.12,big?0.22:0.12,big?2.1:1.1,8),mat);
        body.rotation.x=Math.PI/2;body.castShadow=true;g.add(body);
        const wing=new THREE.Mesh(new THREE.BoxGeometry(big?3.6:1.8,0.08,big?0.35:0.18),mat);wing.castShadow=true;g.add(wing);
        const tail=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.08,big?1.2:0.65),dark);tail.position.z=big?0.9:0.5;tail.castShadow=true;g.add(tail);
        const nose=new THREE.Mesh(new THREE.SphereGeometry(big?0.18:0.11,8,6),dark);nose.position.z=big?-1.1:-0.6;g.add(nose);
        if(type==='fpvdrone'){const warhead=new THREE.Mesh(new THREE.ConeGeometry(0.16,0.45,8),new THREE.MeshLambertMaterial({color:0xffb454}));warhead.rotation.x=-Math.PI/2;warhead.position.z=-0.78;g.add(warhead);}
        return g;
      }
      return oldMakeUnitMesh(type,team);
    };

    const oldSpawnUnit=spawnUnit;
    spawnUnit=function(type,x,z,team){
      const u=oldSpawnUnit(type,x,z,team);
      if(u.def.domain==='air')u.pos.y=12;
      return u;
    };

    const oldMoveUnit=moveUnit;
    moveUnit=function(u,dt){
      if(u.def.domain!=='air')return oldMoveUnit(u,dt);
      if(!u.dest)return true;
      let dx=u.dest.x-u.pos.x,dz=u.dest.z-u.pos.z;
      const dist=Math.hypot(dx,dz);
      if(dist<1.1){u.dest=null;return true;}
      dx/=dist;dz/=dist;
      u.pos.x=clamp(u.pos.x+dx*u.def.speed*dt,-HALF,HALF);
      u.pos.z=clamp(u.pos.z+dz*u.def.speed*dt,-HALF,HALF);
      u.pos.y=12+Math.sin(G.t*2+u.id)*0.7;
      const ty=Math.atan2(dx,dz)+Math.PI;
      let d=ty-u.mesh.rotation.y;while(d>Math.PI)d-=6.283;while(d<-Math.PI)d+=6.283;
      u.mesh.rotation.y+=d*Math.min(1,dt*7);u.moving=true;return false;
    };

    const oldFireWeapon=fireWeapon;
    fireWeapon=function(u,t){
      if(u.def.weapon&&u.def.weapon.kamikaze){applyDamage(t,u.def.weapon.dmg,u.def.weapon.type,u);explosion(u.pos,1.2);u.hp=0;killEnt(u);return;}
      return oldFireWeapon(u,t);
    };

    function deployMobileHQ(){
      const u=G.selected.length===1&&G.selected[0];
      if(!u||u.type!=='mobilehq')return;
      const x=Math.round(u.pos.x/GRID)*GRID,z=Math.round(u.pos.z/GRID)*GRID;
      if(!canPlace('conyard',x,z)){announce('Mobile HQ needs clear land to deploy');sfx.deny();return;}
      u.dead=true;scene.remove(u.mesh);G.ents=G.ents.filter(e=>e!==u);G.selected=[];
      const cy=spawnBuilding('conyard',x,z,0,true);setSelection([cy]);
      announce('Mobile HQ deployed: base online');sfx.place();refreshSidebar();
    }
    window.deployMobileHQ=deployMobileHQ;

    const rally=document.getElementById('cRally');
    if(rally&&!document.getElementById('cDeploy')){
      const b=document.createElement('button');b.className='cbtn';b.id='cDeploy';b.innerHTML='DEP<small>deploy</small>';rally.after(b);CB.cDeploy=b;
      b.onclick=deployMobileHQ;
    }
    const oldUpdateCmdbar=updateCmdbar;
    updateCmdbar=function(){
      oldUpdateCmdbar();
      const b=document.getElementById('cDeploy');
      if(b)b.classList.toggle('off',!(G.selected.length===1&&G.selected[0].type==='mobilehq'));
    };

    prodTick=function(dt){
      const rate=powerRatio(0)<1?0.5:1;
      if(powerRatio(0)<1&&G.t-G.lowPowerMsg>18){G.lowPowerMsg=G.t;announce('Low power: production slowed, turrets offline');sfx.alert();}
      if(G.prodStruct){const wasLeft=G.prodStruct.left;if(prodDrain(G.prodStruct,BDEF[G.prodStruct.type].cost,dt,rate)&&wasLeft>0){sfx.ready();announce(BDEF[G.prodStruct.type].name+' ready: select it to place');}}
      for(const from of ['barracks','factory','navalyard','dronebay','robotics','ewcenter','airfield']){
        const q=G.queues[from]; if(!q||!q.length||!hasBuilding(0,from))continue;
        if(prodDrain(q[0],UDEF[q[0].type].cost,dt,rate)){
          const item=q.shift(); const prod=G.ents.find(e=>!e.dead&&e.team===0&&e.type===from); if(!prod)continue;
          let sx=prod.pos.x+rand(-2,2),sz=prod.pos.z+prod.faceZ*(prod.def.size*0.5+2.5);
          if(from==='navalyard'){sx=prod.pos.x+prod.def.size*0.5+5;sz=prod.pos.z+rand(-3,3);let gg=0;while(!isWater(sx,sz)&&gg++<20)sx+=2;}
          const u=spawnUnit(item.type,sx,sz,0); const tgt=prod.rally||{x:prod.pos.x+rand(-6,6),z:prod.pos.z+prod.faceZ*9};
          u.order={mode:'amove'};u.dest={x:tgt.x+rand(-2,2),z:tgt.z+rand(-2,2)};
          if(item.type==='harvester'){u.order={mode:'idle'};u.dest=null;} sfx.ready();
        }
      }
      refreshSidebar();
    };

    const oldBuildWorld=buildWorld;
    buildWorld=function(){
      oldBuildWorld();
      G.credits[0]=Math.max(G.credits[0],8000);
      spawnUnit('mobilehq',-100,98,0);
      spawnOreField(118,52,12,1.25);spawnOreField(116,82,10,1.1);
      const ecy=G.ents.find(e=>!e.dead&&e.team===1&&e.type==='conyard');
      if(ecy){spawnBuilding('dronebay',119,-126,1);spawnBuilding('robotics',126,-114,1);}
      ['dogbot','droneugv'].forEach(t=>{if(!AI_COMP.includes(t))AI_COMP.push(t);});
      announce('v0.2: Mobile HQ, airbase and drone tech online');
    };

    const badge=document.createElement('div');badge.textContent='v0.2 mobile / drones';
    badge.style.cssText='position:fixed;left:10px;top:50px;z-index:80;font:10px system-ui;color:#37e0cf;background:rgba(13,10,22,.75);border:1px solid rgba(55,224,207,.35);padding:4px 7px;letter-spacing:.12em;text-transform:uppercase;pointer-events:none';
    document.body.appendChild(badge);
  }
  patch();
})();
