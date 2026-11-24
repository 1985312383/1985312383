import type { ReactNode } from "react";

const shapes: Record<string, ReactNode> = {
  cycle: <><path d="M3 10a9 9 0 0 1 15-5l2 2m0-5v5h-5M21 14a9 9 0 0 1-15 5l-2-2m0 5v-5h5" /></>,
  school: <><path d="m2 8 10-5 10 5-10 5L2 8Zm4 3v5c4 3 8 3 12 0v-5m4-3v7" /></>,
  case: <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M8 7V4h8v3M2 12c6 3 14 3 20 0m-10 1v3" /></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
  copy: <><rect x="8" y="7" width="12" height="14" rx="1.5" /><path d="M15 7V3H4v13h4" /></>,
  check: <path d="m4 12 5 5L20 6" />,
  sun: <><circle cx="12" cy="12" r="3.7" /><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2" /></>,
  moon: <path d="M20.5 14.7A8.6 8.6 0 0 1 9.3 3.5a8.9 8.9 0 1 0 11.2 11.2Z" />,
  github: <path stroke="none" fill="currentColor" d="M12 .9A11.1 11.1 0 0 0 8.5 22.5c.55.1.76-.24.76-.54v-2.1c-3.1.68-3.75-1.31-3.75-1.31-.51-1.28-1.24-1.62-1.24-1.62-1.01-.7.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 1.71 2.61 1.22 3.25.94.1-.72.39-1.21.71-1.49-2.48-.28-5.08-1.24-5.08-5.49 0-1.21.44-2.2 1.15-2.97-.11-.28-.5-1.41.11-2.94 0 0 .94-.3 3.06 1.14a10.7 10.7 0 0 1 5.56 0c2.12-1.44 3.05-1.14 3.05-1.14.61 1.53.22 2.66.11 2.94.72.77 1.15 1.76 1.15 2.97 0 4.26-2.61 5.2-5.1 5.48.4.35.75 1.02.75 2.06v3.06c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />,
  terminal: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m6 9 3 3-3 3m6 0h5" /></>,
  folder: <path d="M2 6V4h7l2 3h11v13H2V6Z" />,
  book: <><path d="M3 4h6c2 0 3 1 3 2.5C12 5 13 4 15 4h6v15h-6c-2 0-3 .5-3 2-1-1.5-2-2-4-2H3Z" /><path d="M12 7v13" /></>,
  branch: <><circle cx="6" cy="5" r="2" /><circle cx="6" cy="19" r="2" /><circle cx="18" cy="6" r="2" /><path d="M6 7v10m0-3c7 0 12-1 12-6" /></>,
  layers: <><path d="m12 2 10 5-10 5L2 7l10-5Zm-9 10 9 5 9-5M3 17l9 5 9-5" /></>,
  file: <><path d="M5 2h9l5 5v15H5zM14 2v6h5" /><path d="M8 13h8m-8 4h6" /></>,
  sliders: <><path d="M3 7h6m4 0h8M3 17h11m4 0h3" /><circle cx="11" cy="7" r="2" /><circle cx="16" cy="17" r="2" /></>,
  chip: <><rect x="5" y="5" width="14" height="14" rx="2" /><rect x="9" y="9" width="6" height="6" rx="1" /><path d="M9 2v3m6-3v3M9 19v3m6-3v3M2 9h3m-3 6h3m14-6h3m-3 6h3" /></>,
};

export function Icon({ name, size = 18 }: { name: string; size?: number }) {
  return <svg aria-hidden="true" focusable="false" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">{shapes[name]}</svg>;
}
