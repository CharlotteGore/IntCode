export type Vector2d = [number, number];
export type UnitVector2d = Vector2d;

export const dot = (a: Vector2d, b: Vector2d): number =>
  a[0] * b[0] + a[1] * b[1];
export const normal = (a: Vector2d, b: Vector2d): UnitVector2d => {
  const v: Vector2d = [a[0] - b[0], a[1] - b[1]];
  const l = length(v);
  return [
    parseFloat((v[0] / l).toFixed(12)),
    parseFloat((v[1] / l).toFixed(12))
  ];
};
export const length = (a: Vector2d): number => {
  return Math.sqrt(dot(a, a));
};

export const angleTo = (a: Vector2d, b: Vector2d): number => {
  const n = normal(a, b);
  const radians = Math.atan2(n[1], n[0]);
  var degrees = (180 * radians) / Math.PI;
  return (360 + degrees - 90) % 360;
};

export const distance = (a: Vector2d, b: Vector2d): number => {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
};

export const subtract = (a: Vector2d, b: Vector2d): Vector2d => {
  return [a[0] - b[0], a[1] - b[1]];
};

export const add = (a: Vector2d, b: Vector2d): Vector2d => {
  return [a[0] + b[0], a[1] + b[1]];
};

export const trueDistance = (a: Vector2d, b: Vector2d): number => {
  return length(subtract(a, b));
};
