"use client";

import { useEffect, useRef, useState } from "react";
import { installCommand } from "./content";
import { Icon } from "./icons";

export function CopyCommand() {
  const [status, setStatus] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const command = useRef<HTMLElement>(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy() {
    try {
      await navigator.clipboard.writeText(installCommand);
      setStatus("已复制");
    } catch {
      const selection = window.getSelection();
      if (command.current && selection) {
        const range = document.createRange();
        range.selectNodeContents(command.current);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      let copied = false;
      try { copied = document.execCommand("copy"); } catch { /* Leave the selected command for manual copying. */ }
      if (copied) selection?.removeAllRanges();
      setStatus(copied ? "已复制" : "请复制选中的命令");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(""), 2600);
  }
  return <div className="command-unit">
    <div className="command-box"><span aria-hidden="true" className="prompt-dollar">$</span><code ref={command}>{installCommand}</code>
      <button type="button" title="复制安装命令" aria-label="复制安装命令" onClick={copy}><Icon name={status === "已复制" ? "check" : "copy"} size={16} /></button>
    </div>
    <span className={"copy-feedback" + (status ? " visible" : "")} role="status">{status}</span>
  </div>;
}
