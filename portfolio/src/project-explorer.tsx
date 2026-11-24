"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, ReactNode } from "react";
import { modules, torchRepo } from "./content";
import { Icon } from "./icons";
import { moduleFrame } from "./module-scroll";

function goToModule(id: string) {
  document.getElementById("module-" + id)?.scrollIntoView({ block: "start", behavior: "instant" });
}

export function ProjectExplorer({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const rail = railRef.current!;
    const stage = stageRef.current!;
    const track = trackRef.current!;
    const panels = Array.from(track.children) as HTMLElement[];
    const stops = Array.from(rail.querySelectorAll<HTMLElement>(".module-stop"));
    const deck = rail.querySelector<HTMLElement>(".project-window")!;
    const bar = rail.querySelector<HTMLElement>(".window-bar")!;
    const footer = rail.querySelector<HTMLElement>(".module-footer")!;
    const locationBar = document.querySelector<HTMLElement>(".location-bar");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isPinned = true;
    let pinTop = 0;
    let travel = 0;
    let stopsY: number[] = [];
    let frame = 0;
    let previousOffset = -1;
    let previousActive = -1;
    let mounted = true;

    function update() {
      frame = 0;
      const distance = pinTop - rail.getBoundingClientRect().top;
      let nextActive = 0;
      if (isPinned) {
        const { offset, active } = moduleFrame(distance, travel, panels.length);
        const shift = reducedMotion.matches ? active : offset;
        if (shift !== previousOffset) {
          track.style.setProperty("--module-x", (-100 * shift) + "%");
          previousOffset = shift;
        }
        nextActive = active;
      } else {
        // A short landscape viewport can read each tall card in normal document flow.
        while (nextActive + 1 < stopsY.length && distance + 1 >= stopsY[nextActive + 1]) nextActive++;
      }
      if (nextActive !== previousActive) {
        setActive(nextActive);
        previousActive = nextActive;
      }
    }
    function onScroll() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }
    function measure() {
      const inset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const available = window.innerHeight - inset - (locationBar?.offsetHeight ?? 0) - 12;
      const panelHeight = Math.max(...panels.map(panel => panel.offsetHeight));
      isPinned = panelHeight + bar.offsetHeight + footer.offsetHeight + 2 <= available;
      rail.dataset.layout = isPinned ? "pinned" : "stacked";
      setPinned(isPinned);
      const space = available - stage.offsetHeight;
      const introHeight = deck.getBoundingClientRect().top - stage.getBoundingClientRect().top;
      pinTop = isPinned ? Math.round(inset + (space < 0 ? -introHeight : space / 2)) : inset;
      rail.style.setProperty("--pin-top", pinTop + "px");
      rail.style.setProperty("--anchor-inset", inset + "px");
      travel = rail.offsetHeight - stage.offsetHeight;
      const start = rail.getBoundingClientRect().top;
      stopsY = isPinned ? [] : panels.map(panel => panel.getBoundingClientRect().top - start);
      stops.forEach((stop, index) => { stop.style.top = isPinned ? "" : stopsY[index] + "px"; });
      if (frame) window.cancelAnimationFrame(frame);
      update();
    }
    function alignHash() {
      const current = modules.find(item => window.location.hash === "#module-" + item.id);
      if (current) goToModule(current.id);
    }

    measure();
    alignHash();
    const entryHash = window.location.hash;
    if (entryHash.startsWith("#module-")) {
      const entryScroll = window.scrollY;
      // Font swapping can change the height of the sections above a bookmarked card.
      void document.fonts.ready.then(() => {
        if (mounted && window.location.hash === entryHash && Math.abs(window.scrollY - entryScroll) < 2) {
          measure();
          alignHash();
        }
      });
    }
    const resize = new ResizeObserver(measure);
    resize.observe(stage);
    resize.observe(bar);
    if (locationBar) resize.observe(locationBar);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("hashchange", alignHash);
    reducedMotion.addEventListener("change", onScroll);
    return () => {
      mounted = false;
      resize.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      window.removeEventListener("hashchange", alignHash);
      reducedMotion.removeEventListener("change", onScroll);
    };
  }, []);

  function select(index: number) {
    const id = modules[index].id;
    goToModule(id);
    window.history.replaceState(window.history.state, "", "#module-" + id);
  }
  function moveTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = modules.length - 1;
    const keys: Record<string, number> = {
      ArrowRight: (index + 1) % modules.length, ArrowLeft: (index + last) % modules.length, Home: 0, End: last,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const next = keys[event.key];
    select(next);
    document.getElementById("tab-" + modules[next].id)?.focus({ preventScroll: true });
  }

  return <div ref={railRef} className="project-rail" style={{ "--module-gaps": modules.length - 1 } as CSSProperties}>
    {modules.map((item, index) => <span key={item.id} id={"module-" + item.id} className="module-stop"
      data-focus-target={"tab-" + item.id} aria-hidden="true" style={{ "--module-index": index } as CSSProperties} />)}
    <div className="rail-stage" ref={stageRef}>
      {children}
      <div className="project-window">
        <div className="window-bar">
          <div className="project-tabs" role="tablist" aria-label="查看 Torch-RecHub 模块" aria-describedby="module-scroll-help">
            {modules.map((item, index) => <button key={item.id} id={"tab-" + item.id} type="button" role="tab"
              aria-label={item.title} aria-selected={index === active} aria-controls={"panel-" + item.id} tabIndex={index === active ? 0 : -1}
              onClick={() => select(index)} onKeyDown={event => moveTab(event, index)}>
              <Icon name={item.icon} size={15} /><span className="tab-label">{item.label.map(part => <span key={part}>{part}</span>)}</span>
            </button>)}
          </div>
          <span className="title-stripes" aria-hidden="true" /><span className="window-corner" aria-hidden="true" />
        </div>
        <div className="module-viewport">
          <div className="module-track" ref={trackRef}>
            {modules.map((item, index) => <div key={item.id} className="project-body" id={"panel-" + item.id} role="tabpanel"
              aria-labelledby={"tab-" + item.id} inert={pinned && active !== index} tabIndex={active === index ? 0 : -1}>
              <div className="project-readme">
                <div className="file-caption"><Icon name="file" size={15} />README.md</div>
                <h4>{item.title}</h4><p className="body-copy">{item.overview}</p>
                <div className="project-links">
                  <a className="button-ink" href={torchRepo} target="_blank" rel="noreferrer"><Icon name="github" size={16} />项目仓库</a>
                  <a className="plain-link" href={torchRepo + "/tree/main/examples"} target="_blank" rel="noreferrer">训练示例</a>
                </div>
              </div>
              <div className="tree-backdrop">
                <div className="tree-window">
                  <div className="tree-title"><span className="tiny-window" aria-hidden="true" />{item.path}</div>
                  <ul className="tree-rows">{item.files.map(entry => <li key={entry.name}><a href={torchRepo + entry.href} target="_blank" rel="noreferrer">
                    <Icon name={entry.name.endsWith("/") ? "folder" : "file"} size={16} /><code>{entry.name}</code><span>{entry.note}</span>
                  </a></li>)}</ul>
                </div>
              </div>
            </div>)}
          </div>
        </div>
        <div className="module-footer">
          <span id="module-scroll-help"><b>{active + 1} / {modules.length}</b>
            <span>{active === modules.length - 1 ? "继续向下浏览实战" : "向下滚动浏览模块"}</span>
          </span>
          <a className="plain-link" href="#movie-recall">看双塔召回实战</a>
        </div>
      </div>
    </div>
  </div>;
}
