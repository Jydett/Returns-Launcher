export function konami(kode: number[], callback: () => void) {
  const length = kode.length;
  let pos = 0;
  document.addEventListener('keydown', function (event) {
    if (event.keyCode === kode[pos++]) {
      if (length === pos) {
        callback();
        pos = 0; // ability to start over
        return false;
      }
    } else {
      pos = 0;
    }
  }, false);
}
