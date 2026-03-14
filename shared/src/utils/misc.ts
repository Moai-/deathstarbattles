// https://stackoverflow.com/questions/1349404/generate-a-string-of-random-characters
// Phaser technically has its own makeId function, but I'd rather use this, because
// this can be used outside of Phaser context
export function makeId(length = 5) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const noop = () => {};

export const wait = (ms?: number) => new Promise<void>((resolve) => {
  if (ms) {
    setTimeout(resolve, ms)
  } else {
    queueMicrotask(resolve);
  }
})

export function isTypedArray(v: any): v is ArrayBufferView {
  return ArrayBuffer.isView(v) && !(v instanceof DataView);
}