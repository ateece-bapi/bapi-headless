// Lightweight structured JSON logger used in server routes.
// Keep dependency-free and simple so it works in CI and Node 20.
function timestamp() {
  return new Date().toISOString();
}

function safeStringify(obj) {
  try {
    return JSON.stringify(obj);
  } catch {
    return JSON.stringify({ error: 'serialization_failed' });
  }
}

function log(level, message, meta = {}) {
  const entry = { ts: timestamp(), level, message };
  if (meta && Object.keys(meta).length) entry.meta = meta;
  // Print single-line JSON to stdout/stderr depending on level.
  const out = safeStringify(entry);
  if (level === 'error') {
    // Keep using console.error for errors so they appear in stderr in CI logs
    console.error(out);
  } else {
    console.log(out);
  }
}

export function info(message, meta) {
  log('info', message, meta);
}

export function warn(message, meta) {
  log('warn', message, meta);
}

export function error(message, meta) {
  log('error', message, meta);
}

export function debug(message, meta) {
  log('debug', message, meta);
}

// Convenience: record a metric-like event (implemented as info with metric field)
export function metric(name, value, meta = {}) {
  info(`metric:${name}`, { value, ...meta });
}

const logger = { info, warn, error, debug, metric };
export default logger;
