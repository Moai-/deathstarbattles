export const oneIn = (fraction: number) => Math.random() < 1 / fraction;

export const getRandomBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const randomFromArray = <T>(arr: Array<T>) =>
  arr[Math.floor(Math.random() * arr.length)];
