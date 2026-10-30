import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// ---- A tiny fake of the Tone.js surface the engine uses --------------------
type Call = [string, ...unknown[]];
const log: Call[] = [];

class FakeParam {
  constructor(
    public name: string,
    public value: number,
  ) {}
  rampTo(v: number, s: number) {
    log.push([`${this.name}.rampTo`, v, s]);
    this.value = v;
  }
  getValueAtTime() {
    return this.value;
  }
  cancelAndHoldAtTime() {}
  setValueCurveAtTime(values: number[], _t: number, s: number) {
    log.push([`${this.name}.curve`, values[0], values[values.length - 1], s]);
    this.value = values[values.length - 1];
  }
}

let nodeId = 0;
class FakeNode {
  id = nodeId++;
  connect() {
    return this;
  }
  toDestination() {
    return this;
  }
  dispose() {}
}
class Volume extends FakeNode {
  volume: FakeParam;
  constructor(db = 0) {
    super();
    this.volume = new FakeParam(`vol${this.id}`, db);
  }
}
class Gain extends FakeNode {
  gain: FakeParam;
  constructor(g = 1) {
    super();
    this.gain = new FakeParam(`gain${this.id}`, g);
  }
}
class Filter extends FakeNode {
  frequency: FakeParam;
  constructor(o: { frequency: number }) {
    super();
    this.frequency = new FakeParam("lowpass", o.frequency);
  }
}
class Limiter extends FakeNode {}
class ToneAudioBuffer {
  url = "";
  duration = 0;
  sampleRate = 44100;
  async load(url: string) {
    this.url = url;
    this.duration = url.includes("jingle") ? 4 : 60;
    return this;
  }
  getChannelData() {
    return Float32Array.from([0.5]);
  }
}
class Player extends FakeNode {
  state: "started" | "stopped" = "stopped";
  loopStart = 0;
  buffer: ToneAudioBuffer;
  constructor(arg?: ToneAudioBuffer | object) {
    super();
    this.buffer = arg instanceof ToneAudioBuffer ? arg : new ToneAudioBuffer();
  }
  setLoopPoints(start: number) {
    this.loopStart = start;
  }
  start() {
    this.state = "started";
    log.push(["start", this.buffer.url]);
  }
  stop() {
    this.state = "stopped";
    log.push(["stop", this.buffer.url]);
  }
}

vi.mock("tone", () => ({
  Volume,
  Gain,
  Filter,
  Limiter,
  Player,
  ToneAudioBuffer,
  now: () => 0,
  start: async () => {},
  setContext: () => {},
  getContext: () => ({ rawContext: { suspend: async () => {}, resume: async () => {} } }),
}));
vi.mock("./sfx", () => ({ createSfxKit: () => ({ play: vi.fn(), dispose: vi.fn() }) }));

const audio = await import("./index");
const { CROSSFADE_S, DUCK_DB, INTENSITY } = await import("./mix");

const flush = async () => {
  for (let i = 0; i < 20; i++) await Promise.resolve();
};
const calls = (name: string) => log.filter((c) => c[0] === name);

beforeEach(() => {
  vi.useFakeTimers();
  audio.__resetAudioForTests();
  log.length = 0;
});
afterEach(() => vi.useRealTimers());

describe("engine (mocked Tone)", () => {
  it("loads the current track first and fades it in, then the rest", async () => {
    await audio.unlockAudio();
    await flush();
    expect(calls("start")[0]).toEqual(["start", "/audio/music-map.mp3"]);
    expect(audio.getAudioState().loaded).toEqual(expect.arrayContaining(["map", "html", "css", "jingle:victory"]));
  });

  it("crossfades over ~1 s on a scene change and stops the old loop afterwards", async () => {
    await audio.unlockAudio();
    await flush();
    log.length = 0;
    audio.setScene("editor");
    const curves = log.filter((c) => String(c[0]).endsWith(".curve"));
    expect(curves).toHaveLength(2);
    expect(curves[0].slice(1)).toEqual([1, 0, CROSSFADE_S]); // map out
    expect(curves[1][1]).toBeCloseTo(0, 6); // html in
    expect(curves[1].slice(2)).toEqual([1, CROSSFADE_S]);
    expect(calls("start")).toEqual([["start", "/audio/music-html.mp3"]]);
    vi.advanceTimersByTime(CROSSFADE_S * 1000 + 200);
    expect(calls("stop")).toEqual([["stop", "/audio/music-map.mp3"]]);
  });

  it("picks the CSS track for the CSS world", async () => {
    audio.setWorld("css-basics");
    audio.setScene("editor");
    await audio.unlockAudio();
    await flush();
    expect(calls("start")[0]).toEqual(["start", "/audio/music-css.mp3"]);
  });

  it("opens the low-pass as intensity rises in the editor", async () => {
    audio.setScene("editor");
    await audio.unlockAudio();
    await flush();
    log.length = 0;
    audio.setIntensity(1);
    const lp = calls("lowpass.rampTo");
    expect(lp.at(-1)?.[1]).toBeCloseTo(INTENSITY.maxHz, 3);
    audio.setIntensity(0);
    expect(calls("lowpass.rampTo").at(-1)?.[1]).toBeCloseTo(INTENSITY.minHz, 3);
  });

  it("celebrate ducks the loop, plays a jingle, then un-ducks and returns", async () => {
    audio.setScene("editor");
    await audio.unlockAudio();
    await flush();
    log.length = 0;
    audio.setScene("celebrate");
    const duck = log.filter((c) => String(c[0]).endsWith(".rampTo") && c[1] === DUCK_DB);
    expect(duck).toHaveLength(1);
    expect(calls("start")).toEqual([["start", "/audio/jingle-victory.mp3"]]);
    expect(audio.getAudioState().scene).toBe("celebrate");
    vi.advanceTimersByTime(5000);
    expect(audio.getAudioState().scene).toBe("editor");
    expect(log.filter((c) => c[0] === duck[0][0] && c[1] === 0)).toHaveLength(1);
    expect(calls("stop")).toEqual([]); // the editor loop never stopped
  });
});
