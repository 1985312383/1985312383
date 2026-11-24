import { atStops, between, block, board, circle, drawArm, ease, lettering, mix, palette, path, rail, rect, unit } from "./drawing";
import type { Ink, Palette, Point } from "./drawing";

const INDEX_SETUP = 1000;
const SEARCH_END = 1120;
const DELIVERY = 1460;
const GRAB = .32;
const RELEASE = .78;
const HOME: Point = [337, 110];
const OUTPUT: Point = [574, 160];
const USER: Point = [81, 179];
const FILM: Point = [138, 179];
const SLOTS = 18;

export type TicketJob = { movie: { titleZh: string }; position: number };
type Stage = "index" | "viewer" | "search" | "locate" | "carry" | "release" | "done";
export type Progress = { stage: Stage; rank: number; issued: number };

export function movieDuration(firstRun: boolean) {
  return (firstRun ? INDEX_SETUP : 0) + SEARCH_END + 3 * DELIVERY;
}

export function movieProgress(time: number, firstRun: boolean): Progress {
  const query = time - (firstRun ? INDEX_SETUP : 0);
  if (query < 0) return { stage: "index", rank: -1, issued: 0 };
  if (query < 500) return { stage: "viewer", rank: -1, issued: 0 };
  if (query < SEARCH_END) return { stage: "search", rank: -1, issued: 0 };
  const cycle = (query - SEARCH_END) / DELIVERY;
  if (cycle >= 3) return { stage: "done", rank: -1, issued: 3 };
  const rank = Math.floor(cycle);
  const t = cycle - rank;
  const stage = t < GRAB ? "locate" : t < RELEASE ? "carry" : "release";
  return { stage, rank, issued: rank + (stage === "release" ? 1 : 0) };
}

export function slotNumber(position: number) {
  return String(position + 1).padStart(2, "0");
}

export function statusText(progress: Progress, jobs: TicketJob[]) {
  const { stage, rank } = progress;
  if (stage === "index") return "电影塔离线编码，建立影片索引";
  if (stage === "viewer") return "用户塔正在编码当前观众";
  if (stage === "search") return "Annoy 正在生成三部电影的取票单";
  if (stage === "done") return "取票单已完成，三张电影票已送达";
  const { position, movie } = jobs[rank];
  const name = "《" + movie.titleZh + "》";
  if (stage === "locate") return "前往 " + slotNumber(position) + " 号槽取" + name;
  if (stage === "carry") return "从 " + slotNumber(position) + " 号槽取出" + name + "，送往出票口";
  return "第 " + (rank + 1) + " 张已送达 · " + name;
}

function bench(ctx: Ink, p: Palette) {
  path(ctx, [[27,261],[59,242],[636,242],[621,267],[605,274],[24,274]], p.grid, null);
  block(ctx, 25, 245, 576, 18, 40, p.metal, p.plate, p.shadow, p.outline, 1.9);
  for (const x of [42, 574]) {
    block(ctx, x, 264, 18, 7, 7, p.base, p.metal, p.side, p.outline);
    circle(ctx, x, 253, 2.1, p.plate, p.outline, 1);
  }
  for (let x = 66; x <= 548; x += 11) rect(ctx, x, 252, 4, 2, p.side);
  for (const x of [154, 507]) {
    block(ctx,x,134,7,91,6,p.side,p.plate,p.shadow,p.outline,1.3);
    for (let y=150; y<219; y+=16) circle(ctx,x+3.5,y,1.2,p.base);
  }
  rail(ctx,144,516,134,p);
  for (const [x] of [USER,FILM]) block(ctx,x-24,233,48,6,6,p.base,p.metal,p.side,p.outline);
}

function tower(ctx: Ink, top: Point, user: boolean, p: Palette) {
  const [x,y] = top;
  const signal = user ? p.orange : p.glass;
  rect(ctx, x-4, y, 8, 9, p.metal, p.outline);
  block(ctx, x-20, y+13, 38, 39, 8, p.plate, p.white, p.side, p.outline, 1.7);
  rect(ctx, x-15, y+18, 28, 17, p.screen, p.outline, 1.1);
  if (user) {
    rect(ctx,x-5,y+20,6,5,p.mint);
    rect(ctx,x-8,y+28,12,4,p.mint);
  } else {
    rect(ctx,x-11,y+22,21,10,p.mint);
    for (const dx of [-8, -2, 4]) {
      rect(ctx, x+dx, y+23, 2, 2, p.screen);
      rect(ctx, x+dx, y+29, 2, 2, p.screen);
    }
  }
  rect(ctx, x-16, y+39, 4, 6, signal, p.outline, .8);
  for (let i=0; i<3; i++) rect(ctx, x-8, y+39+i*3, 17, 1, p.side);
  rect(ctx, x-20, y+49, 38, 3, p.base);
}

function terminal(ctx: Ink, p: Palette, presenting: boolean) {
  const x = 15, y = 202;
  rect(ctx, x+4, y+32, 8, 8, p.base, p.outline, 1.6);
  rect(ctx, x+23, y+32, 7, 8, p.base, p.outline, 1.6);
  rect(ctx, x+1, y+39, 12, 4, p.metal, p.outline, 1.3);
  rect(ctx, x+22, y+39, 12, 4, p.metal, p.outline, 1.3);
  block(ctx, x, y-1, 33, 27, 6, p.plate, p.white, p.side, p.outline, 1.9);
  rect(ctx, x+4, y+3, 24, 17, p.screen, p.outline, 1);
  rect(ctx, x+9, y+8, 2.5, 5, p.mint);
  rect(ctx, x+20, y+8, 2.5, 5, p.mint);
  rect(ctx, x+14, y+14, 5, 1.5, p.glass);
  rect(ctx, x+5, y+26, 24, 5, p.orange, p.outline);
  path(ctx, [[x+11,y+30],[x+17,y+30],[x+12,y+37],[x+7,y+35]], p.orange,p.outline,1.1);
  path(ctx, [[x+28,y+33],[x+33,y+34],[x+39,y+(presenting?21:29)]], null,p.outline,3);
  circle(ctx, x+39, y+(presenting?21:29), 2.3, p.metal, p.outline);
}

function viewerCard(ctx: Ink, pos: Point, p: Palette) {
  const [x,y] = pos;
  ctx.save();
  ctx.translate(x,y); ctx.rotate(-.15);
  rect(ctx,-10,-6,21,13,p.white,p.outline,1.4);
  rect(ctx,-8,-4,5,8,p.orange);
  rect(ctx,0,-2,8,1.6,p.base); rect(ctx,0,2,6,1.6,p.base);
  ctx.restore();
}

function indexReader(ctx: Ink, p: Palette, query: number) {
  block(ctx, 175,192,50,43,7,p.metal,p.plate,p.shadow,p.outline);
  rect(ctx,180,197,40,18,p.screen,p.outline,1);
  for (let n=0; n<3; n++) {
    const active = query >= 600 + n*110;
    rect(ctx,185,200+n*4,active?20+n*3:7,1.6,active?p.mint:p.glass);
  }
  lettering(ctx,"Annoy",199,224,10,p.outline,"center",true);
  rect(ctx,187,189,23,3,p.rail);
}

function socket(position: number): Point {
  return [261 + (position % 6) * 42, 164 + Math.floor(position / 6) * 24];
}

function filmCabinet(ctx: Ink, p: Palette, jobs: TicketJob[], progress: Progress, lifted: boolean) {
  block(ctx,237,146,262,91,10,p.metal,p.plate,p.shadow,p.outline,1.8);
  rect(ctx,243,150,250,10,p.base,p.outline,.8);
  lettering(ctx,"电影票槽",251,155,8,p.white,"left",true);
  path(ctx,[[300,155],[482,155]],null,p.side,.8);
  for (let n=0; n<SLOTS; n++) {
    const [cx,cy] = socket(n);
    const rank = jobs.findIndex(job => job.position === n);
    const marked = rank >= 0 && (progress.rank >= 0 || progress.stage === "done");
    const now = marked && rank === progress.rank;
    const empty = marked && (rank < progress.issued || (now && lifted));
    const face = now && !empty ? p.high : marked ? p.mint : p.plate;
    rect(ctx,cx-16,cy,34,18,face,now?p.ochre:p.outline,now?2:1.1);
    rect(ctx,cx-13,cy+2,27,3,p.screen);
    if (!empty) rect(ctx,cx-8,cy+1,17,2,marked?p.yellow:p.side);
    lettering(ctx,slotNumber(n),cx,cy+11,10,p.outline,"center",true);
    if (marked) circle(ctx,cx+11.5,cy+11,1.7,empty?p.glass:p.orange,p.outline,.6);
  }
}

function dispenser(ctx: Ink, issued: number, p: Palette) {
  block(ctx, 543, 182, 59, 54, 9, p.plate,p.white,p.shadow,p.outline,1.8);
  rect(ctx,547,177,48,4,p.rail,p.outline,1);
  rect(ctx,549,191,46,21,p.screen,p.outline,1.4);
  lettering(ctx,"0"+issued,554,201,12,p.mint,"left",true);
  for (let i=0;i<3;i++) rect(ctx,575+i*5,198,3,7,i<issued?p.high:p.base);
  rect(ctx,550,218,44,5,p.rail,p.outline,1);
  if (issued) {
    path(ctx,[[555,220],[582,220],[579,233],[552,233]],p.high,p.outline,1);
    for (let n=0;n<6;n++) path(ctx,[[560+n*3,223],[559+n*3,229]],null,p.base,.9);
  }
}

function taggedTicket(ctx: Ink, grip: Point, job: TicketJob, rank: number, p: Palette) {
  const title = job.movie.titleZh;
  const width = Math.max(68, title.length * 13 + 17);
  const [x,y] = grip;
  const left = x-width/2, top=y+3;
  const shade = [p.high,p.plate,p.mint][rank];
  block(ctx,left,top,width,27,2,shade,p.white,p.side,p.outline,1.5);
  lettering(ctx,slotNumber(job.position)+"  /  TOP "+(rank+1),x,top+6.5,8,p.outline,"center",true);
  path(ctx,[[left+4,top+11],[left+width-4,top+11]],null,p.side,.7);
  lettering(ctx,title,x,top+19,12.5,p.outline,"center",true);
}

function gripAt(pick: Point, t: number) {
  const above: Point = [pick[0],100];
  return atStops([[0,HOME],[.13,above],[.27,pick],[.35,pick],[.46,above],[.54,above],
    [.65,[OUTPUT[0],102]],[.75,OUTPUT],[.84,OUTPUT],[.92,[OUTPUT[0],102]],[1,HOME]],t);
}

function lead(ctx: Ink, first: Point, last: Point, y: number, pulse: number, color: string, p: Palette) {
  const track: Point[] = [first,[first[0],y],[last[0],y],last];
  path(ctx,track,null,p.outline,2.7);
  path(ctx,track,null,color,1.45);
  if (pulse < 0 || pulse >= 1) return;
  const t=pulse*3, i=Math.floor(t);
  circle(ctx,...between(track[i],track[i+1],t-i),3,color,p.outline,1);
}

export function drawMovieScene(ctx: Ink, time: number, firstRun: boolean, jobs: TicketJob[], dark: boolean) {
  const p = palette(dark);
  const query = time - (firstRun ? INDEX_SETUP : 0);
  const progress = movieProgress(time,firstRun);
  const t = progress.rank >= 0 ? (query-SEARCH_END)/DELIVERY-progress.rank : 0;
  const held = progress.stage === "carry";
  const active = progress.rank < 0 ? null : jobs[progress.rank];
  const grip = active ? gripAt(socket(active.position), t) : HOME;
  ctx.lineJoin = "round"; ctx.lineCap = "round";
  board(ctx,660,312,p);
  bench(ctx,p);
  lead(ctx,[USER[0]+17,231],[184,228],241,(query-340)/415,p.orange,p);
  lead(ctx,[FILM[0]+13,231],[211,229],237,query<0 ? time/INDEX_SETUP : -1,p.glass,p);
  tower(ctx, USER, true, p);
  tower(ctx, FILM, false, p);
  terminal(ctx,p,query>=0 && query<500);
  if (query >= 0 && query < 500) {
    const k = ease(query/500);
    viewerCard(ctx,[mix(52,USER[0],k),mix(218,202,k)-Math.sin(k*Math.PI)*15],p);
  }
  indexReader(ctx,p,query);
  filmCabinet(ctx,p,jobs,progress,held);
  dispenser(ctx,progress.issued,p);
  if (active && held) taggedTicket(ctx,grip,active,progress.rank,p);
  drawArm(ctx,grip,held,p,115);
  for (const [x,label] of [[81,"用户塔"],[138,"电影塔"],[201,"向量检索"],[366,"电影票仓"],[574,"出票口"]] as const) {
    path(ctx,[[x,267],[x,277]],null,p.axis,1);
    lettering(ctx,label,x,287,12,p.caption,"center",true);
  }
}
