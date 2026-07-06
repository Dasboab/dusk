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

### v0.2: Tactical technology expansion

Status: first patch framework added.

Goals:
- Mobile HQ unit that can deploy into a Construction Yard.
- Air Base, Drone Bay, Robotics Lab and EW Centre.
- Recon UAV, FPV drone, Strike UAV, Drone Dog, Drone UGV and Counter-UAV team.
- Preserve the current demo while enabling rapid iteration through patch files.

### v0.3: Mobile-base opening and naval viability

Goals:
- Replace fixed starting base with Mobile HQ start.
- Better spawn locations near deployable coastline.
- Coastal resource fields.
- Landing craft and transport ships.
- Naval Yard placement clarity.
- Basic amphibious assault loop.

### v0.4: Air power

Goals:
- Functional airfield with runway logic.
- Hangars, fuel and radar dependencies.
- Helicopter scout and gunship units.
- Strike aircraft and air defence.
- Aircraft require maintenance/fuel rather than acting like flying tanks.

### v0.5: Drone and counter-drone warfare

Goals:
- Drone swarm mechanics.
- FPV drones as cheap single-use weapons.
- Recon drones as spotters for artillery/MLRS.
- EW jamming zones.
- Anti-drone infantry, vehicles and static defences.
- Drone command-and-control vulnerabilities.

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
