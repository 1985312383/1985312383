export type Point = readonly [number, number];
export type Ink = CanvasRenderingContext2D;

const daylight = {
  outline: "#302d26", plate: "#f5edd4", white: "#fff9e8", side: "#ada793",
  shadow: "#8d8675", metal: "#c8c2ac", base: "#686955", rail: "#353b33",
  yellow: "#f5ba43", high: "#ffe38a", ochre: "#b17623", orange: "#e98449",
  screen: "#243d35", glass: "#75a892", mint: "#b8e5a6", wire: "#7a7b67",
  backdrop: "#f3efdf", grid: "#dcd6c4", axis: "#b4ad97", caption: "#525548",
};
const night = {
  outline: "#191d19", plate: "#c2beab", white: "#f4e9c9", side: "#888977",
  shadow: "#595b50", metal: "#a4a692", base: "#777d69", rail: "#525e51",
  yellow: "#ebb24b", high: "#f9d981", ochre: "#a66e28", orange: "#ec925b",
  screen: "#1b352e", glass: "#72aa92", mint: "#c6e8a8", wire: "#999b80",
  backdrop: "#292c25", grid: "#393c33", axis: "#626657", caption: "#d0cfb8",
};
export type Palette = typeof daylight;
export const palette = (dark: boolean) => dark ? night : daylight;
export const unit = (n: number) => Math.min(1, Math.max(0, n));
export const ease = (t: number) => { const k = unit(t); return k * k * (3 - 2 * k); };
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export function between(a: Point, b: Point, t: number): Point {
  return [mix(a[0], b[0], t), mix(a[1], b[1], t)];
}
export function atStops(stops: readonly (readonly [number, Point])[], time: number): Point {
  for (let i = 1; i < stops.length; i++) {
    const [end, position] = stops[i];
    if (time <= end) {
      const [start, from] = stops[i - 1];
      return between(from, position, ease((time - start) / (end - start)));
    }
  }
  return stops[stops.length - 1][1];
}

export function path(ctx: Ink, points: readonly Point[], fill: string | null, edge: string | null, weight = 1.5) {
  if (!points.length) return;
  ctx.beginPath();
  ctx.moveTo(...points[0]);
  for (const pair of points.slice(1)) ctx.lineTo(...pair);
  if (fill) { ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); }
  if (edge) { ctx.strokeStyle = edge; ctx.lineWidth = weight; ctx.stroke(); }
}
export function circle(ctx: Ink, x: number, y: number, radius: number, fill: string, edge?: string, weight = 1.3) {
  ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = fill; ctx.fill();
  if (edge) { ctx.strokeStyle = edge; ctx.lineWidth = weight; ctx.stroke(); }
}
export function rect(ctx: Ink, x: number, y: number, w: number, h: number, fill: string, edge?: string, weight = 1.5) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
  if (edge) { ctx.strokeStyle = edge; ctx.lineWidth = weight; ctx.strokeRect(x, y, w, h); }
}
export function block(ctx: Ink, x: number, y: number, w: number, h: number, depth: number,
                      front: string, top: string, side: string, edge: string, weight = 1.6) {
  const rise = depth * .52;
  path(ctx, [[x,y],[x+depth,y-rise],[x+w+depth,y-rise],[x+w,y]], top, edge, weight);
  path(ctx, [[x+w,y],[x+w+depth,y-rise],[x+w+depth,y+h-rise],[x+w,y+h]], side, edge, weight);
  rect(ctx, x, y, w, h, front, edge, weight);
}
export function lettering(ctx: Ink, word: string, x: number, y: number, size: number, color: string,
                          align: CanvasTextAlign = "left", bold = false) {
  ctx.fillStyle = color;
  ctx.textAlign = align; ctx.textBaseline = "middle";
  ctx.font = (bold ? "600 " : "500 ") + size + 'px "Geist Mono", "KML CJK", monospace';
  ctx.fillText(word, x, y);
}
export function board(ctx: Ink, width: number, height: number, p: Palette) {
  ctx.fillStyle = p.backdrop; ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = p.grid;
  for (let x = 11; x < width; x += 15) {
    for (let y = 11; y < height; y += 15) ctx.fillRect(x, y, 1.2, 1.2);
  }
  for (const x of [13, width - 13]) {
    for (const y of [13, height - 13]) {
      path(ctx, [[x-3,y],[x+3,y]], null, p.axis, 1);
      path(ctx, [[x,y-3],[x,y+3]], null, p.axis, 1);
    }
  }
}
export function rail(ctx: Ink, start: number, end: number, y: number, p: Palette) {
  block(ctx, start, y, end - start, 8, 8, p.base, p.metal, p.shadow, p.outline);
  path(ctx, [[start+3,y+3],[end-2,y+3]], null, p.white, 1);
  for (let x = start + 6; x < end - 2; x += 12) rect(ctx, x, y + 5, 3.5, 2, p.rail);
}

function bearing(ctx: Ink, x: number, y: number, r: number, p: Palette) {
  circle(ctx, x+2.5, y+2, r, p.ochre, p.outline, 2);
  circle(ctx, x, y, r, p.high, p.outline, 2);
  circle(ctx, x, y, r*.62, p.plate, p.outline);
  circle(ctx, x, y, r*.32, p.side, p.outline, 1);
  path(ctx, [[x-2,y+1.5],[x+2,y-1.5]], null, p.outline, 1.2);
}

function armLink(ctx: Ink, start: Point, end: Point, wide: number, p: Palette) {
  const length = Math.hypot(end[0] - start[0], end[1] - start[1]);
  const shape: Point[] = [[-3,-wide*.56],[12,-wide*.72],[length-13,-wide*.37],[length+2,-wide*.30],
    [length+2,wide*.27],[length-10,wide*.38],[13,wide*.65],[-3,wide*.48]];
  ctx.save();
  ctx.translate(...start); ctx.rotate(Math.atan2(end[1]-start[1],end[0]-start[0]));
  ctx.lineJoin = "round"; ctx.lineCap = "round";
  ctx.save(); ctx.translate(2,3); path(ctx, shape, p.ochre, p.outline, 2.3); ctx.restore();
  path(ctx, shape, p.yellow, p.outline, 2.2);
  path(ctx, [[13,-wide*.53],[length-14,-wide*.24]], null, p.high, 2.3);
  path(ctx, [[19,-2],[length-21,-2],[length-25,2],[20,3]], p.ochre, p.outline, .9);
  for (let i=0; i<3; i++) path(ctx, [[20+i*5,-wide*.42],[23+i*5,-wide*.21]], null,p.outline,1.1);
  // A sliding hydraulic rod parallels each jointed link.
  path(ctx, [[13,wide*.72],[length-12,wide*.59]], null,p.outline,5);
  path(ctx, [[13,wide*.72],[length-12,wide*.59]], null,p.metal,2.6);
  path(ctx, [[13,wide*.72],[length*.50,wide*.65]], null,p.outline,6.4);
  path(ctx, [[13,wide*.72],[length*.50,wide*.65]], null,p.plate,3.6);
  ctx.restore();
}

// Solve the two joints from the tool position. The carriage follows on its own rail.
export function drawArm(ctx: Ink, grip: Point, closed: boolean, p: Palette, baseY = 199) {
  const base: Point = [Math.max(54, Math.min(496, grip[0] - 98)), baseY];
  const wrist: Point = [grip[0], grip[1] - 18];
  const dx = wrist[0] - base[0], dy = wrist[1] - base[1];
  const upper = 106, lower = 102;
  const distance = Math.min(upper + lower - .01, Math.max(Math.abs(upper-lower)+.01,Math.hypot(dx,dy)));
  const cosine = (upper*upper + distance*distance - lower*lower) / (2*upper*distance);
  const angle = Math.atan2(dy,dx) - Math.acos(Math.max(-1,Math.min(1,cosine)));
  const elbow: Point = [base[0]+upper*Math.cos(angle),base[1]+upper*Math.sin(angle)];

  block(ctx, base[0]-24, baseY+11, 51, 8, 9, p.metal, p.plate, p.base, p.outline);
  path(ctx, [[base[0]-15,baseY+10],[base[0]-11,baseY-5],[base[0]-5,baseY-12],
    [base[0]+8,baseY-12],[base[0]+17,baseY+10]], p.ochre, p.outline, 2);
  armLink(ctx,base,elbow,20,p);
  armLink(ctx,elbow,wrist,15,p);
  bearing(ctx,...base,13,p); bearing(ctx,...elbow,11,p); bearing(ctx,...wrist,7.3,p);
  rect(ctx, wrist[0]-6, wrist[1]+5,12,8,p.base,p.outline,1.4);
  const jaw = closed ? 6 : 11;
  for (const side of [-1,1]) {
    const fingers: Point[] = [[wrist[0]+side*4,wrist[1]+12],[wrist[0]+side*jaw,grip[1]-3],
      [wrist[0]+side*jaw,grip[1]+3],[wrist[0]+side*(jaw-3),grip[1]+4]];
    path(ctx, fingers, null, p.outline, 3.8);
    path(ctx, fingers, null, p.metal, 1.3);
  }
}
