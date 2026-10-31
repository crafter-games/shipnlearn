import { Composition, Folder } from "remotion";
import { Promo, TOTAL } from "./Promo";
import { S1Hook } from "./scenes/S1Hook";
import { S2Code } from "./scenes/S2Code";
import { S3Ship } from "./scenes/S3Ship";
import { S4Cards } from "./scenes/S4Cards";
import { S5Islands } from "./scenes/S5Islands";
import { S6Cast } from "./scenes/S6Cast";
import { S7Topics } from "./scenes/S7Topics";
import { S8Cta } from "./scenes/S8Cta";

const vertical = { fps: 30, width: 1080, height: 1920 } as const;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Promo" component={Promo} durationInFrames={TOTAL} {...vertical} />
      <Folder name="Escenas">
        <Composition id="S1-Gancho" component={S1Hook} durationInFrames={110} {...vertical} />
        <Composition id="S2-Codigo" component={S2Code} durationInFrames={130} {...vertical} />
        <Composition id="S3-Ship" component={S3Ship} durationInFrames={120} {...vertical} />
        <Composition id="S4-Fichas" component={S4Cards} durationInFrames={110} {...vertical} />
        <Composition id="S5-Islas" component={S5Islands} durationInFrames={130} {...vertical} />
        <Composition id="S6-Personajes" component={S6Cast} durationInFrames={95} {...vertical} />
        <Composition id="S7-Temas" component={S7Topics} durationInFrames={100} {...vertical} />
        <Composition id="S8-Final" component={S8Cta} durationInFrames={140} {...vertical} />
      </Folder>
    </>
  );
};
