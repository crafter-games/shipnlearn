# ShipNLearn promo

Vertical (1080×1920) promotional video, 27.8 s at 30 fps, made with Remotion.

```bash
npm i
npx remotion studio            # preview and edit
npx remotion render Promo out/raw.mp4 --codec=h264 --crf=18
# Master the audio to -14 LUFS / -1.5 dBTP (social platforms), two-pass loudnorm:
J=$(ffmpeg -i out/raw.mp4 -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
M=$(echo "$J" | python3 -c "import sys,json;d=json.load(sys.stdin);print(':'.join(f'measured_{k}={d[\"input_\"+k]}' for k in ['i','tp','lra','thresh'])+f':offset={d[\"target_offset\"]}')")
ffmpeg -i out/raw.mp4 -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11:${M}:linear=true" -ar 48000 -c:a aac -b:a 192k out/shipnlearn-promo.mp4
```

- `src/Promo.tsx` — timeline: 8 scenes joined by transitions, music and SFX.
- `src/scenes/` — one file per scene (also registered on their own under "Escenas").
- `public/img`, `public/screens` — portraits, islands and real app screens captured from the game with Playwright.
- `src/sfx.ts` — every sound effect cue, in frames, next to the animation it marks.
- `public/audio` — upbeat CC0 chiptune ("Stage 2") and the victory jingle; `public/sfx` — Kenney CC0 interface, digital and impact sounds (see the root `CREDITS.md`). The whoosh on cuts comes from `remotion.media`.
