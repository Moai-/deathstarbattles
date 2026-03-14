export const degToRad = (deg: number) => deg * (Math.PI / 180);

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export const smoothstep = (edge0: number, edge1: number, x: number, eps: number) => {
  const t = clamp01((x - edge0) / Math.max(eps, edge1 - edge0));
  return t * t * (3 - 2 * t);
};