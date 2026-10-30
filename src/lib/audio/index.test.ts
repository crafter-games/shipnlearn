import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const engine = {
  applySettings: vi.fn(),
  playSfx: vi.fn(),
  dispose: vi.fn(),
  scene: "map" as const,
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
