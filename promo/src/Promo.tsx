import { Audio } from "@remotion/media";
import { linearTiming, springTiming, TransitionSeries } from "@remotion/transitions";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { fade } from "@remotion/transitions/fade";
import { flip } from "@remotion/transitions/flip";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { AbsoluteFill, interpolate, Sequence, staticFile } from "remotion";
import { S1Hook } from "./scenes/S1Hook";
import { S2Code } from "./scenes/S2Code";
import { S3Ship } from "./scenes/S3Ship";
import { S4Cards } from "./scenes/S4Cards";
import { S5Islands } from "./scenes/S5Islands";
import { S6Cast } from "./scenes/S6Cast";
import { S7Topics } from "./scenes/S7Topics";
import { S8Cta } from "./scenes/S8Cta";
import { H, W } from "./theme";

/**
 * Timeline (30 fps). Scene lengths and transition lengths are inline so they
 * stay editable; TOTAL and CUTS below must be kept in sync with them.
 * Scenes: 110 130 120 110 130 95 100 140 = 935; transitions: 14 14 16 18 14 12 14 = 102.
 */
export const TOTAL = 833;
/** Frame where each transition starts (= start of the next scene). */
const CUTS = [96, 212, 316, 408, 524, 607, 693];
const SHIP = 212;

const WHOOSH = "https://remotion.media/whoosh.wav";

export const Promo: React.FC = () => {
  return (
    <AbsoluteFill style={{ width: W, height: H, backgroundColor: "#1E90FF" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={110} name="Gancho">
          <S1Hook />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 14 })}
        />
        <TransitionSeries.Sequence durationInFrames={130} name="Código a web">
          <S2Code />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={linearTiming({ durationInFrames: 14 })} />
        <TransitionSeries.Sequence durationInFrames={120} name="Ship it">
          <S3Ship />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={flip({ direction: "from-right" })} timing={linearTiming({ durationInFrames: 16 })} />
        <TransitionSeries.Sequence durationInFrames={110} name="Fichas">
          <S4Cards />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={clockWipe({ width: W, height: H })} timing={linearTiming({ durationInFrames: 18 })} />
        <TransitionSeries.Sequence durationInFrames={130} name="Islas">
          <S5Islands />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 14 })}
        />
        <TransitionSeries.Sequence durationInFrames={95} name="Personajes">
          <S6Cast />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence durationInFrames={100} name="Temas">
          <S7Topics />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-top-right" })} timing={linearTiming({ durationInFrames: 14 })} />
        <TransitionSeries.Sequence durationInFrames={140} name="Llamada final">
          <S8Cta />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Music: CC0 chiptune from the game, faded in and out, ducked under the jingle. */}
      <Audio
        src={staticFile("audio/music-map.mp3")}
        loop
        loopVolumeCurveBehavior="extend"
        volume={(f) =>
          interpolate(f, [0, 12, SHIP + 40, SHIP + 50, SHIP + 130, SHIP + 150, TOTAL - 45, TOTAL - 1], [0, 0.75, 0.75, 0.35, 0.35, 0.75, 0.75, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
      {CUTS.filter((_, i) => i !== 5).map((cut) => (
        <Sequence key={cut} from={cut - 2} durationInFrames={30} layout="none">
          <Audio src={WHOOSH} volume={0.45} />
        </Sequence>
      ))}
      <Sequence from={SHIP + 34} durationInFrames={20} layout="none">
        <Audio src="https://remotion.media/mouse-click.wav" volume={0.8} />
      </Sequence>
      <Sequence from={SHIP + 44} durationInFrames={150} layout="none">
        <Audio src={staticFile("audio/jingle-victory.mp3")} volume={0.9} />
      </Sequence>
      <Sequence from={CUTS[6] + 30} durationInFrames={40} layout="none">
        <Audio src="https://remotion.media/ding.wav" volume={0.6} />
      </Sequence>
    </AbsoluteFill>
  );
};
