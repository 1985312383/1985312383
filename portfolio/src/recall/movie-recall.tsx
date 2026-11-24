"use client";

import { useCallback, useRef, useState } from "react";
import { Icon } from "../icons";
import { catalogueSize, componentScale, cosine, dimension, formatScore, movies, viewers } from "./movie-data";
import { drawMovieScene, movieDuration, movieProgress, slotNumber, statusText } from "./movie-scene";
import { SceneCanvas } from "./scene-canvas";

const notebook = "https://github.com/datawhalechina/easy-vecdb/blob/main/docs/projects/project1/project1.ipynb";
const dataset = "https://grouplens.org/datasets/movielens/1m/";
const firstSheet = movieProgress(movieDuration(true), true);

function VectorStrip({ values, name }: { values: number[]; name: string }) {
  return <div className="vector-readout">
    <div className="vector-caption"><span>{name}</span><span>{dimension} 维</span></div>
    <div className="vector-strip" role="img" aria-label={name + "，前三个分量为 " + values.slice(0, 3).map(value => formatScore(value)).join("、")}>
      {values.map((value, i) => <span key={i} title={"第 " + (i + 1) + " 维 · " + formatScore(value)}>
        <i style={{ [value < 0 ? "top" : "bottom"]: "50%", height: Math.max(2, 48 * Math.abs(value) / componentScale) + "%" }} />
      </span>)}
    </div>
  </div>;
}

export function MovieRecall() {
  const [play, setPlay] = useState({ viewer: 0, run: 0 });
  const [movieIndex, setMovieIndex] = useState(0);
  const [progress, setProgress] = useState(firstSheet);
  const rig = useRef<HTMLDivElement>(null);
  const last = useRef(firstSheet);
  const viewer = viewers[play.viewer];
  const selected = movies[movieIndex];
  const score = cosine(viewer.vector, selected.vector);
  const rank = viewer.top3.indexOf(selected.movieId);
  const disposition = viewer.rated.includes(selected.movieId) ? "观众已评过，召回时过滤" :
    rank >= 0 ? "本次召回第 " + (rank + 1) + " 名" : "未进入本次前三名";
  const firstRun = play.run === 0;
  const draw = useCallback((ctx: CanvasRenderingContext2D, time: number, dark: boolean) => {
    drawMovieScene(ctx, time, firstRun, viewer.results, dark);
  }, [firstRun, viewer]);
  const onTime = useCallback((time: number) => {
    const next = movieProgress(time, firstRun);
    if (next.stage !== last.current.stage || next.rank !== last.current.rank || next.issued !== last.current.issued) {
      last.current = next;
      setProgress(next);
    }
  }, [firstRun]);

  function playTickets(changeViewer: boolean) {
    const next = movieProgress(0, false);
    last.current = next;
    setProgress(next);
    setPlay(old => ({ viewer: changeViewer ? (old.viewer + 1) % viewers.length : old.viewer, run: old.run + 1 }));
  }

  return <section className="movie-recall" id="movie-recall" aria-labelledby="movie-recall-title">
    <header className="recall-heading">
      <p className="case-path"><Icon name="branch" size={14} /><span lang="en">Torch-RecHub</span><i aria-hidden="true">/</i>召回实战</p>
      <h4 id="movie-recall-title">下一部电影，是怎么选出来的？</h4>
    </header>
    <div className="recall-rig" ref={rig}>
      <div className="recall-illustration">
        <div className="machine-header"><span><Icon name="terminal" size={15} />电影召回工作台</span><span className="machine-format">Annoy · {catalogueSize.toLocaleString("en-US")} 部电影</span></div>
        <div className="movie-camera">
          <SceneCanvas key={play.run} width={660} height={312} duration={movieDuration(firstRun)} draw={draw} onTime={onTime} visibilityRef={rig} />
        </div>
        <div className="machine-status" aria-hidden="true">
          <span className="machine-light" data-ready={progress.issued === 3} /><span>{statusText(progress,viewer.results)}</span>
          <span className="issue-count">{progress.issued} / 3</span>
        </div>
      </div>
      <div className="ticket-rack">
        <div className="audience-line"><span>取票单 <b>#{String(viewer.userId).padStart(4, "0")}</b></span><span aria-hidden="true" className="ticket-perf" /></div>
        <p className="past-rating">这位观众最近给{viewer.history.map(title => "《" + title + "》").join("和")}打过高分。</p>
        <ol className="film-tickets" aria-label="这位观众的三部推荐电影">
          {viewer.results.map(({ movie, position, score: ticketScore }, index) => {
            const known = progress.rank >= 0 || progress.stage === "done";
            const ready = index < progress.issued;
            const picking = known && !ready && index === progress.rank;
            const state = ready ? "已出票" : picking ? (progress.stage === "locate" ? "取票中" : "运送中") : "待取";
            return <li key={index} className="film-ticket" data-ready={ready} data-active={picking}>
              <span className="ticket-rank" aria-label={"第 " + (index + 1) + " 名"}>0{index + 1}</span>
              {known ? <div className="ticket-details" key={movie.movieId}>
                <strong>{movie.titleZh}</strong><small><b>{slotNumber(position)} 号槽</b><i aria-hidden="true">·</i><span>{movie.year}</span></small>
              </div> : <span className="ticket-wait">检索中</span>}
              <div className="ticket-score">{known && <><b><span className="sr-only">余弦相似度 </span>{formatScore(ticketScore, 4)}</b><small>{state}</small></>}</div>
              <span aria-hidden="true" className="ticket-code" />
            </li>;
          })}
        </ol>
        <div className="ticket-actions">
          <button type="button" className="button-sun" onClick={() => playTickets(true)}><Icon name="cycle" size={16} />换一位观众</button>
          <button type="button" className="replay-tickets plain-link" onClick={() => playTickets(false)}>重播取票</button>
        </div>
      </div>
    </div>
    <details className="tower-details">
      <summary>查看取票单的计算过程</summary>
      <p className="tower-explanation">训练时，两座塔学习让观众向量接近其好评影片，远离批内负样本。召回时，电影索引可复用。换观众只需更新用户向量，换对照影片可以比较它与同一观众的余弦相似度。</p>
      <div className="tower-console">
        <div className="tower-input tower-user">
          <div className="tower-label"><h5>用户塔</h5><span>按请求编码</span></div>
          <div className="encoder-control"><b>观众 #{String(viewer.userId).padStart(4, "0")}</b></div>
          <p className="encoder-input">最近 {viewer.historySize} 部好评影片包括{viewer.history.map(title => "《" + title + "》").join("、")}。</p>
          <VectorStrip values={viewer.vector} name="用户向量 u" />
        </div>
        <div className="tower-input tower-film">
          <div className="tower-label"><h5>电影塔</h5><span>离线编码</span></div>
          <div className="encoder-control"><select aria-label="选择对照影片" value={movieIndex} onChange={event => setMovieIndex(Number(event.target.value))}>
            {movies.map((film, index) => <option key={film.movieId} value={index}>{film.titleZh}</option>)}
          </select></div>
          <p className="encoder-input">输入影片 ID <b>{selected.movieId}</b> 与类型「{selected.genre}」。换观众时复用同一份影片索引。</p>
          <VectorStrip values={selected.vector} name="电影向量 v" />
        </div>
        <div className="match-readout">
          <div className="tower-label"><h5>余弦相似度</h5><code>cos(u, v)</code></div>
          <output aria-label="所选观众与对照影片的余弦相似度" className="match-value">{formatScore(score)}</output>
          <div className="similarity-gauge" aria-hidden="true"><i style={{ left: (score + 1) * 50 + "%" }} /></div>
          <div className="similarity-axis" aria-hidden="true"><span>−1</span><span>0</span><span>+1</span></div>
          <p className="match-disposition">{disposition}</p>
        </div>
      </div>
    </details>
    <div className="recall-source"><p><a href={dataset} target="_blank" rel="noreferrer">MovieLens 1M</a> 公开评分子集 · 片单由 DSSM 和 Annoy 离线计算，已过滤观众评过分的影片。票仓展示六份片单对应的 18 部电影。</p>
      <a className="plain-link" href={notebook} rel="noreferrer" target="_blank">阅读 easy-vecdb 实战 Notebook</a></div>
    <span className="sr-only" role="status">{play.run > 0 && progress.issued === 3
      ? "观众 " + viewer.userId + " 的推荐电影为" + viewer.results.map(({ movie }) => "《" + movie.titleZh + "》").join("、") : ""}</span>
  </section>;
}
