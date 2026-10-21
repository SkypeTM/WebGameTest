import test from "node:test";
import assert from "node:assert/strict";
import { requestAudioPreferences } from "../lib/audio-sync";

test("audio sync preserves mute and zero in the outgoing patch", async (t) => {
  t.mock.method(globalThis, "fetch", async (_url: unknown, init: RequestInit) => {
    assert.equal(init.method, "PATCH");
    assert.deepEqual(JSON.parse(init.body as string), { music: false, musicVolume: 0 });
    return Response.json({ initialized: true, audio: { music: false, musicVolume: 0 } });
  });
  const result = await requestAudioPreferences({ music: false, musicVolume: 0 }, new AbortController().signal);
  assert.deepEqual(result.audio, { music: false, musicVolume: 0 });
});

test("stalled audio requests time out and subsequent requests can succeed", async (t) => {
  t.mock.method(globalThis, "fetch", async (_url: unknown, init: RequestInit) =>
    new Promise<Response>((_resolve, reject) => {
      init.signal!.addEventListener("abort", () => reject(init.signal!.reason), { once: true });
    }),
  );
  // AbortSignal.timeout does not keep Node's event loop alive by itself.
  const keepAlive = setInterval(() => {}, 1000);
  try {
    await assert.rejects(requestAudioPreferences({}, new AbortController().signal, 10), { name: "TimeoutError" });
  } finally { clearInterval(keepAlive); }
  t.mock.restoreAll();
  t.mock.method(globalThis, "fetch", async () => Response.json({ initialized: true, audio: { sfx: false } }));
  assert.equal((await requestAudioPreferences({}, new AbortController().signal)).audio.sfx, false);
});

test("account cleanup cancels an outstanding audio request", async (t) => {
  t.mock.method(globalThis, "fetch", async (_url: unknown, init: RequestInit) =>
    new Promise<Response>((_resolve, reject) => {
      init.signal!.addEventListener("abort", () => reject(init.signal!.reason), { once: true });
    }),
  );
  const controller = new AbortController();
  const request = requestAudioPreferences({}, controller.signal);
  controller.abort();
  await assert.rejects(request, { name: "AbortError" });
});

test("invalid server audio never replaces local settings", async (t) => {
  t.mock.method(globalThis, "fetch", async () => Response.json({ initialized: true, audio: { music: "false" } }));
  await assert.rejects(requestAudioPreferences({}, new AbortController().signal));
});
