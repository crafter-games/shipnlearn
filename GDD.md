# ShipNLearn

> Eres un shipper en un archipiélago: cada isla te pide webs, tú las construyes y las lanzas, y la isla cobra vida. Aprendes HTML y CSS haciendo.

| | |
| --- | --- |
| Engine | Next.js 16 (App Router) + TypeScript + Tailwind v4 — DOM/SVG, sin engine de juego |
| Platform | Web, mobile first y desktop first (ambos de primera clase) |
| View | 2D flat vector: mapa de islas + pantalla de nivel (editor + preview) |
| Scope | v1 = motor completo + 2 mundos (HTML fundamental, CSS fundamental) |
| References | Duolingo (mapa de progreso), Flexbox Froggy (tu código mueve el mundo), Brawl Stars / Clash Royale (UI chunky y jugosa) |
| Deploy | `crafter-games/shipnlearn` → Dokploy (VPS) → https://shipnlearn.crafter.games |

## Principios validados (ver `docs/research.md`)

1. Cada nivel es **hacer** (recuperación activa), nunca leer. Feedback inmediato que explica el *porqué*.
2. Fading: ejemplo → fichas (Parsons) → huecos → desde cero.
3. Mastery gating: no avanzas sin ⭐ en el nivel previo; reintentos ilimitados sin castigo.
4. Narrativa del mundo como mecánica principal; XP/estrellas como **información**, no premio.
5. Repaso espaciado + intercalado (Mareas). Sin rachas punitivas, sin leaderboards.
6. Música instrumental adaptativa: enérgica en mapa/celebración, atenuada en el editor.

## Core loop

Un habitante pide algo (1–2 líneas) → ves el **objetivo fantasma** → editas código con preview en vivo → el **checklist** se enciende condición por condición → **¡Ship it!** → validadores → celebración, estrellas, XP, la isla cambia → siguiente nivel. 60–180 s por nivel (tune).

## First 30 seconds

1. Abres la web: isla gris y vacía en el océano, música suave (arranca al primer toque). Sin registro.
2. Octo (pulpo cartero) dice: *"Esta isla no tiene ni nombre. Ponle uno."* Un botón grande "¡Vamos!".
3. Editor con `<h1></h1>` a medio hacer; escribes `Isla Tuya`. El cartel aparece en el mundo en vivo.
4. Ship it → partículas, capa de música sube, ⭐⭐⭐, *"Acabas de escribir tu primer elemento HTML: `<h1>` es el título principal."*

## Controls

| Acción | Desktop | Touch |
| --- | --- | --- |
| Editar código | teclado en CodeMirror | teclado + barra de teclas rápidas `< > / = " { } : ;` + autocompletado |
| Fichas (niveles tempranos) | click / drag | tap / drag |
| Ship it | botón o `Ctrl/Cmd+Enter` | botón fijo abajo |
| Pista | botón `?` o `Ctrl/Cmd+H` | botón `?` |
| Reiniciar nivel | botón ↺ | botón ↺ |
| Mute / ajustes | `M` / botón ⚙ | botón 🔊 / ⚙ |

## Mechanics

### Niveles
- Definidos como datos TS: `id, world, title, story (pedido), concept, mode (tiles|fill|code), starter, solution, checks[], hints[3], mdn`.
- Modos: `tiles` (fichas Parsons), `fill` (huecos editables dentro de código fijo), `code` (editor libre, HTML y/o CSS).
- Preview en `<iframe srcdoc sandbox>`; validación dentro del iframe con DOM, `getComputedStyle`, `getBoundingClientRect`, axe-core. Se mide resultado, no texto → toda solución válida pasa.
- Checklist en vivo (debounce 300 ms, tune); "Ship it" corre la validación completa.

### Estrellas (1–3)
- ⭐ todas las checks requeridas pasan.
- ⭐⭐ + accesibilidad/semántica (checks `a11y` + axe sin `serious`/`critical`).
- ⭐⭐⭐ + sin pistas usadas.

### Pistas
- 3 niveles: concepto → fragmento de código → enlace MDN. Usar pista solo quita la 3ª estrella.

### XP y nivel de shipper
- XP = 10 por estrella nueva (tune); nivel shipper cada 100 XP (tune). Desbloquea cosméticos de isla (palmeras, faro, colores de bandera).

### Mareas (repaso espaciado)
- Al completar un nivel se programan repasos a +1, +3, +7 días. Aparecen como botellas en la playa: reto corto que mezcla conceptos ya vistos. Opcional, +XP. Sin rachas.

## Win, fail, restart

- **Fail**: no existe. Ship con checks fallidos → el checklist marca qué falla en coral, SFX suave, nada se pierde.
- **Win**: todas las checks requeridas → celebración → vuelta al mapa con la isla actualizada y el siguiente nivel desbloqueado.
- **Restart**: botón ↺ restaura el código inicial (con confirmación).

## Challenge and progression

- Mundo 1 **Isla Marcado** (HTML fundamental): 8 niveles + jefe *Página de receta*.
- Mundo 2 **Isla Estilo** (CSS fundamental): 10 niveles + jefe *Tarjeta de perfil*.
- Dentro de cada mundo: modo `tiles` → `fill` → `code`. Cada mundo abre con un reto trampa "se ve bien pero no es accesible".
- Futuro: HTML intermedio/avanzado, CSS intermedio/avanzado (curriculum en `docs/curriculum.md`), JS, TS.

## Game feel

- Botones con sombra inferior que se hunden al pulsar (translateY 4 px, 80 ms).
- Check cumplido: pop (scale 1→1.15→1, spring) + nota ascendente.
- Ship OK: confeti de partículas, estrellas que entran una a una sincronizadas al beat, la isla se ilumina.
- Ship fallido: shake horizontal suave (6 px, 250 ms) del checklist, nunca de pantalla completa.
- Todo respeta `prefers-reduced-motion` (sin shake, sin partículas, fades cortos).

## Art direction

- **Style**: flat vector chunky, bordes de 3 px en tinta, esquinas redondeadas 16–24 px, sombras sólidas hacia abajo.
- **Palette**: `#1E90FF` océano · `#FFD66B` arena · `#FF5D73` coral (error) · `#7ED957` lima (éxito) · `#1B1F3B` tinta · `#F4F7FF` espuma.
- **Tipografía**: Lilita One (títulos), Nunito (texto), JetBrains Mono (código).
- **Readability**: contraste AA en todo texto; error nunca solo por color (icono + texto).
- **Layout móvil**: preview + objetivo arriba (~45 %), editor abajo, Ship it fijo. **Desktop**: 3 columnas: pedido/checklist | editor | preview.
- **Mapa**: camino vertical (móvil) / horizontal (desktop) de nodos-nivel sobre islas SVG.
- **HUD**: arriba XP + nivel shipper, estrellas del mundo, 🔊, ⚙.

## Audio

- **Music**: procedural con Tone.js, 110 BPM (tune), instrumental, tonalidad mayor. Capas: `pad`, `bass`, `drums`, `lead`.
  - Mapa: todas. Editor: pad + bass a −15 dB (tune). Éxito: + drums + stinger. Volumen por buses en dB.
- **SFX**: `key` (sutil, pitch ±6 %), `check` (nota ascendente en escala), `error` (suave), `ship`, `star`, `levelup`, `ui-tap`. Cuantizados al beat cuando son celebración.
- Ajustes: mute, slider música, slider SFX (persistidos).

## Assets

| Key | Description | Source | Status |
| --- | --- | --- | --- |
| islands | Islas, mar, palmeras, faro en SVG | code (SVG inline) | todo |
| octo | Pulpo cartero (guía) | code (SVG inline) | todo |
| fonts | Lilita One, Nunito, JetBrains Mono | next/font/google | todo |
| music | Capas pad/bass/drums/lead | generate (Tone.js) | todo |
| sfx | key, check, error, ship, star, levelup, ui-tap | generate (Tone.js) | todo |

## Milestones

1. **M1: Fundaciones** — scaffold, contratos de tipos, deploy en shipnlearn.crafter.games, nivel `<h1>` jugable.
2. **M2: Motor de niveles** — modos tiles/fill/code, validadores, checklist, estrellas, pistas.
3. **M3: Mapa y progreso** — mapa de islas, persistencia, XP, isla que evoluciona.
4. **M4: Audio** — música adaptativa y SFX.
5. **M5: Mundo HTML** — 8 niveles + jefe.
6. **M6: Mundo CSS** — 10 niveles + jefe.
7. **M7: Mareas y pulido** — repaso espaciado, game feel, QA en móvil.

M2–M6 se construyen en paralelo por subagentes sobre contratos definidos en M1.

## Out of scope for v1

- Cuentas, sincronización, backend (v2: Clerk + Postgres en VPS).
- Leaderboards y social.
- JS, TypeScript, mundos intermedio/avanzado.
- i18n a inglés; sandbox libre.

## Changelog

- 2026-10-30: GDD creado tras investigación (gamificación + currículo MDN) y 2 rondas de entrevista.
