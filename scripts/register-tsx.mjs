import "./node-user-shim.mjs";

// Import after the Windows user shim so tsx can create its temporary directory.
await import("tsx");
