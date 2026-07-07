# DUSK Roadmap

DUSK is moving from a single-file RTS demo into a persistent combined-arms strategy prototype.

## Design pillars

1. **Modern battlefield, not classic RTS reskin**
   - Recon, drones, EW, logistics, terrain and concealment matter as much as tanks.
   - Artillery and missiles require spotting to be effective.
   - Cheap drones are powerful but counterable.

2. **Mobile starts and amphibious strategy**
   - Players begin with a Mobile HQ rather than a fixed Construction Yard.
   - Naval access must be viable from the opening phase.
   - Landing craft, ports and coastal resources become strategic objectives.

3. **Logistics as gameplay**
   - Fuel, ammunition, drones, missiles and spare parts should become physical supply chains.
   - Convoys, depots, ports and airlift create meaningful targets.

4. **Expandable persistent world**
   - Start with single-player skirmish.
   - Grow into regional multiplayer shards.
   - Eventually support persistent territories, alliances and live front lines.

## Version plan

### v0.5: Dawn Convoy (SHIPPED, native)

The v0.2 to v0.5 goals below were originally scoped as separate runtime patches. They are now
delivered together, natively, inside `index.html`. The patch loader has been retired.

Delivered:
- Mobile HQ start: base arrives as a convoy and deploys into a Construction Yard (DEP button).
- Tech buildings: Drone Bay, Robotics Lab, EW Centre, Air Base.
- Units: Recon UAV, FPV strike drone, Strike UAV, Drone Dog, Drone UGV, Counter UAS team.
- Naval: Landing Craft (carries 8, beaches troops on nearest land) and Coastal Frigate.
- Systems: air movement over water with hover, FPV kamikaze with area damage, seaward naval
  production, generic transport board/unload for any unit with a cargo capacity.
- Map: coastal ore fields, enemy tech camps and picket ships, conforming roads, ridge rocks,
  wrecks, and a subtle screen vignette.
- Tested with a headless smoke test covering boot, move orders, deploy, production, kamikaze,
  air flight, naval unload and a 130 second AI raid sim, with zero console errors.

Still open from these themes, deferred to later versions:
- EW jamming zones and drone command-and-control links as a real vulnerability.
- Aircraft fuel and maintenance instead of unlimited loiter.
- Destroyable bridges and true chokepoint terrain (moves into v0.6).

### v0.6: Terrain as a weapon

Goals:
- Larger, more varied maps.
- Rivers, bridges, cliffs, forests, mud, roads and chokepoints.
- Destroyable bridges.
- Roads improve logistics and movement.
- Weather and time-of-day affect sensors and air operations.

### v0.7: Logistics layer

Goals:
- Ammunition/fuel depots.
- Convoys and supply trucks.
- Units consume ammo/fuel.
- Ports, railheads and airlift.
- Front-line collapse when supply is cut.

### v1.0: Persistent online world prototype

Goals:
- Server-authoritative simulation.
- Player accounts and progression.
- Regional shards or cells.
- Persistent territory and alliances.
- Spawn protection and level-weighted neighbouring regions.
- Offline production balanced by logistics vulnerability.

## Technical direction

Short term:
- Keep the current HTML playable.
- Add patch files for gameplay changes.
- Document systems before rewriting.

Medium term:
- Split the monolith into modules.
- Define data-driven unit/building/weapon schemas.
- Replace hard-coded globals with a game state module.
- Add automated smoke tests for startup and Deploy button.

Long term:
- Move to a dedicated client/server architecture.
- Use Cloudflare Pages for static hosting.
- Use Cloudflare Workers or another backend for accounts, persistence and matchmaking.
