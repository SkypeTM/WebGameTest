// tsx asks libuv for a POSIX user id before loading. Some Windows hosts return
// ENOMEM for that lookup, so provide a stable process-local id there.
if (process.platform === "win32" && typeof process.geteuid !== "function") {
  Object.defineProperty(process, "geteuid", { value: () => 1000 });
}
