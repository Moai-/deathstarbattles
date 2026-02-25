import { addComponent, addEntity, createWorld, getComponent } from "bitecs";

// https://stackoverflow.com/questions/1349404/generate-a-string-of-random-characters
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