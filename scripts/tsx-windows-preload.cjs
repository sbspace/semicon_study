// tsx names its cache directory with os.userInfo() on Windows. Some restricted
// release runners cannot resolve that account even though the project is fully
// readable. Supplying the Unix-compatible identity hook avoids that OS lookup.
if (process.platform === 'win32' && typeof process.geteuid !== 'function') {
  Object.defineProperty(process, 'geteuid', { value: () => 0 });
}
