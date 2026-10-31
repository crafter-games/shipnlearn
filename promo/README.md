# ShipNLearn promo

Vertical (1080×1920) promotional video, 27.8 s at 30 fps, made with Remotion.

```bash
npm i
npx remotion studio            # preview and edit
npx remotion render Promo out/shipnlearn-promo.mp4 --codec=h264 --crf=18
```

- `src/Promo.tsx` — timeline: 8 scenes joined by transitions, music and SFX.
- `src/scenes/` — one file per scene (also registered on their own under "Escenas").
- `public/img`, `public/screens` — portraits, islands and real app screens captured from the game with Playwright.
- `public/audio` — CC0 music from the game (see the root `CREDITS.md`). Whoosh, click and ding come from `remotion.media`.
