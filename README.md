# DUSK: Operation First Light

Static GitHub Pages build for the DUSK HTML game.

## GitHub Pages setup

1. In this repository, open **Settings → Pages**.
2. Set **Build and deployment → Source** to **Deploy from a branch**.
3. Choose `main` and `/root`, then Save.
4. Open the published Pages URL in Safari on iPad, then **Share → Add to Home Screen**.

## Patch included

The iPad build is intended to make the Deploy button respond to `click`, `pointerup`, and `touchend`, and to surface startup errors on the landing screen rather than silently trapping the UI.

## Backend

The uploaded backend is a Cloudflare Worker API for accounts, scores, saves and shop functionality. It is not required just to start the local game. Add it later once the static game is running.
