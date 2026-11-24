// Leave a short reading interval around each full card while the page keeps moving.
export function moduleFrame(distance: number, travel: number, count: number) {
  if (travel <= 0 || count < 2) return { offset: 0, active: 0 };
  const position = Math.max(0, Math.min(1, distance / travel)) * (count - 1);
  const index = Math.floor(position);
  const phase = Math.max(0, Math.min(1, (position - index - 0.18) / 0.64));
  const blend = phase * phase * (3 - 2 * phase);
  return { offset: index + blend, active: Math.round(position) };
}
