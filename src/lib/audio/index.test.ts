import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const engine = {
  applySettings: vi.fn(),
  playSfx: vi.fn(),
  sync: vi.fn(),
  dispose: vi.fn(),
  loaded: [] as string[],
};
const createEngine = vi.fn(async () => engine);
vi.mock("./engine", () => ({ createEngine }));

const audio = await import("./index");

beforeEach(() => {
  audio.__resetAudioForTests();
  vi.clearAllMocks();
});
afterEach(() => vi.useRealTimers());

describe("audio contract before unlock", () => {
  it("records scene and settings without loading the engine", () => {
    audio.setScene("editor");
    audio.applySettings({ muted: true, musicVolume: 2, sfxVolume: -1 });
    audio.playSfx("star");
    expect(createEngine).not.toHaveBeenCalled();
    expect(audio.getAudioState()).toEqual({
      unlocked: false,
      scene: "editor",
      settings: { muted: true, musicVolume: 1, sfxVolume: 0 },
      intensity: 0,
      world: "html",
      loaded: [],
    });
  });
});

describe("unlockAudio", () => {
  it("is idempotent and hands the engine the stored state", async () => {
    audio.applySettings({ muted: true, musicVolume: 0.3, sfxVolume: 0.4 });
    await Promise.all([audio.unlockAudio(), audio.unlockAudio()]);
    await audio.unlockAudio();
    expect(createEngine).toHaveBeenCalledTimes(1);
    const deps = (createEngine.mock.calls[0] as unknown as [unknown, { settings: () => unknown }])[1];
    expect(deps.settings()).toEqual({ muted: true, musicVolume: 0.3, sfxVolume: 0.4 });
    expect(audio.getAudioState().unlocked).toBe(true);
  });

  it("forwards settings after unlock", async () => {
    await audio.unlockAudio();
    audio.applySettings({ muted: false, musicVolume: 0.5, sfxVolume: 0.5 });
    expect(engine.applySettings).toHaveBeenCalledWith({ muted: false, musicVolume: 0.5, sfxVolume: 0.5 });
  });
});

describe("music controls", () => {
  it("records world and clamped intensity before unlock", () => {
    audio.setWorld("css-basics");
    audio.setIntensity(4);
    expect(audio.getAudioState()).toMatchObject({ world: "css", intensity: 1 });
    audio.setIntensity(Number.NaN);
    expect(audio.getAudioState().intensity).toBe(0);
  });

  it("re-syncs the engine on every change and hands it the celebration jingle", async () => {
    await audio.unlockAudio();
    audio.setScene("editor");
    audio.setIntensity(0.5);
    audio.setWorld("html-basics");
    audio.setScene("celebrate");
    expect(engine.sync.mock.calls).toEqual([[null], [], [], ["victory"]]);
    expect(audio.getAudioState().scene).toBe("celebrate");
  });
});

describe("playSfx", () => {
  it("stays silent while muted", async () => {
    audio.applySettings({ muted: true, musicVolume: 1, sfxVolume: 1 });
    await audio.unlockAudio();
    audio.playSfx("check", { step: 2 });
    expect(engine.playSfx).not.toHaveBeenCalled();
  });

  it("passes the step through", async () => {
    await audio.unlockAudio();
    audio.playSfx("check", { step: 2 });
    audio.playSfx("ui-tap");
    expect(engine.playSfx).toHaveBeenNthCalledWith(1, "check", 2);
    expect(engine.playSfx).toHaveBeenNthCalledWith(2, "ui-tap", 0);
  });

  it("throttles key ticks to one per ~40 ms", async () => {
    vi.useFakeTimers();
    audio.__resetAudioForTests();
    await audio.unlockAudio();
    audio.playSfx("key");
    audio.playSfx("key");
    vi.advanceTimersByTime(45);
    audio.playSfx("key");
    expect(engine.playSfx.mock.calls.filter((c) => c[0] === "key")).toHaveLength(2);
  });
});
