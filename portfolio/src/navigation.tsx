"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { avatarUrl, githubProfile, searchIndex, sections } from "./content";
import { Icon } from "./icons";

function Search() {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [shortcut, setShortcut] = useState("Ctrl");
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const matches = searchIndex.filter(item => words.every(word => (item.title + " " + item.description + " " + item.words).toLowerCase().includes(word)));

  function open() {
    if (dialog.current?.open) return;
    setQuery("");
    setActive(0);
    dialog.current?.showModal();
    input.current?.focus();
  }
  useEffect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.platform)) setShortcut("⌘");
    function shortcutKey(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (dialog.current?.open) dialog.current.close();
        else open();
      }
    }
    window.addEventListener("keydown", shortcutKey);
    return () => window.removeEventListener("keydown", shortcutKey);
  }, []);

  function openResult(href: string) {
    dialog.current?.close();
    const anchor = document.getElementById(href.slice(1));
    if (window.location.hash !== href) window.location.hash = href;
    else anchor?.scrollIntoView({ block: "start" });
    const target = anchor?.dataset.focusTarget ? document.getElementById(anchor.dataset.focusTarget) : anchor;
    if (target instanceof HTMLElement) {
      if (!target.hasAttribute("tabindex") && target.tagName !== "BUTTON") target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
  }

  function navigate(event: KeyboardEvent<HTMLInputElement>) {
    if (!matches.length) return;
    if (event.key === "Enter") {
      event.preventDefault();
      openResult(matches[active].href);
      return;
    }
    const offset = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
    if (offset) {
      event.preventDefault();
      const index = (active + offset + matches.length) % matches.length;
      setActive(index);
      document.getElementById("search-result-" + index)?.scrollIntoView({ block: "nearest" });
    }
  }

  return <>
    <button className="search-trigger" type="button" aria-label="搜索本站" aria-haspopup="dialog" onClick={open}>
      <Icon name="search" size={16} /><span>搜索本站</span><kbd>{shortcut} K</kbd>
    </button>
    <dialog ref={dialog} className="search-dialog" aria-labelledby="search-title" onClick={event => {
      if (event.target === dialog.current) dialog.current.close();
    }}>
      <div className="dialog-shell">
        <h2 className="sr-only" id="search-title">搜索本站</h2>
        <div className="search-field">
          <Icon name="search" size={21} />
          <input ref={input} type="text" role="combobox" aria-label="输入项目或关键词" aria-autocomplete="list" aria-controls="search-results"
            aria-expanded="true" aria-activedescendant={matches.length ? "search-result-" + active : undefined}
            placeholder="搜索项目、模型或页面…" value={query} autoComplete="off" spellCheck={false}
            onChange={event => { setQuery(event.target.value); setActive(0); }} onKeyDown={navigate} />
          <button className="escape" type="button" aria-label="关闭搜索" onClick={() => dialog.current?.close()}>Esc</button>
        </div>
        <div className="search-caption">{query.trim() ? "搜索结果" : "快速访问"}</div>
        <ul id="search-results" role="listbox" aria-label="搜索结果">
          {matches.map((item, index) => <li key={item.href} id={"search-result-" + index} role="option" aria-selected={index === active}
            onMouseEnter={() => setActive(index)} onClick={() => openResult(item.href)}>
            <Icon name={item.icon} size={19} /><span><strong>{item.title}</strong><small>{item.description}</small></span>
          </li>)}
        </ul>
        {!matches.length && <p className="empty-search" role="status">没有匹配的内容。试试「双塔」「CT」或「壹钱包」。</p>}
        <div className="search-help"><span><kbd>↑</kbd><kbd>↓</kbd> 选择</span><span><kbd>Enter</kbd> 打开</span></div>
      </div>
    </dialog>
  </>;
}

function ThemeSwitch() {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("kemuling-color-mode") === "dark" ? "dark" : "light";
      setTheme(saved);
      document.documentElement.dataset.theme = saved;
    } catch { /* Browser storage is optional. */ }
  }, []);
  function apply(value: string) {
    setTheme(value);
    document.documentElement.dataset.theme = value;
    try { localStorage.setItem("kemuling-color-mode", value); } catch { /* Keep the choice for this visit. */ }
  }
  return <div className="theme-switch" role="group" aria-label="页面配色">
    {["light", "dark"].map((value, i) => <button key={value} type="button" aria-label={i ? "深色模式" : "浅色模式"}
      aria-pressed={theme === value} title={i ? "深色模式" : "浅色模式"} onClick={() => apply(value)}>
      <Icon name={i ? "moon" : "sun"} size={15} />
    </button>)}
  </div>;
}

export function Header() {
  return <header className="site-header">
    <div className="header-inner">
      <a className="brand" href="#top" aria-label="柯慕灵，回到首页"><img src={avatarUrl} alt="" width="24" height="24" /><strong>柯慕灵</strong></a>
      <nav className="top-nav" aria-label="主导航">
        {sections.slice(1).map(item => <a key={item.id} href={"#" + item.id}>{item.label}</a>)}
      </nav>
      <div className="header-tools">
        <Search /><ThemeSwitch />
        <a className="github-icon" href={githubProfile} target="_blank" rel="noreferrer" title="GitHub 主页" aria-label="GitHub 主页"><Icon name="github" size={20} /></a>
      </div>
    </div>
  </header>;
}

export function LocationBar() {
  const [active, setActive] = useState<string>("top");
  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      const threshold = Math.min(window.innerHeight * .35, 220);
      const current = [...sections].reverse().find(section => (document.getElementById(section.id)?.getBoundingClientRect().top ?? Infinity) <= threshold);
      const atBottom = Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 2;
      setActive(atBottom ? "research" : current?.id ?? "top");
    }
    function schedule() { if (!frame) frame = window.requestAnimationFrame(update); }
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); window.cancelAnimationFrame(frame); };
  }, []);
  const selected = sections.find(item => item.id === active) ?? sections[0];
  return <div className="location-bar"><div className="location-inner">
    <div className="location-path"><i aria-hidden="true" /><span>kemuling</span><span className="path-slash">/</span><span>{selected.label}</span></div>
    <nav aria-label="页面位置">{sections.map(item => <a key={item.id} href={"#" + item.id} aria-current={active === item.id ? "location" : undefined}>{item.label}</a>)}</nav>
  </div></div>;
}
