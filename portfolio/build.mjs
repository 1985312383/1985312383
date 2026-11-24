import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";

const here = fileURLToPath(new URL("./", import.meta.url));
const docs = fileURLToPath(new URL("../docs/", import.meta.url));
const staging = await mkdtemp(join(here, ".render-"));
const common = {
  absWorkingDir: here,
  bundle: true,
  jsx: "automatic",
  format: "esm",
  define: { "process.env.NODE_ENV": '"production"' },
};

function version(bytes) {
  return createHash("sha256").update(bytes).digest("hex").slice(0, 12);
}

try {
  const renderer = join(staging, "render.mjs");
  await build({ ...common, entryPoints: ["render.tsx"], outfile: renderer, platform: "node", packages: "external" });
  const { renderPage, avatarUrl } = await import(pathToFileURL(renderer).href);
  const client = await build({
    ...common, entryPoints: ["client.tsx"], platform: "browser", target: "es2020",
    minify: true, charset: "utf8", legalComments: "eof", write: false,
  });
  const script = client.outputFiles[0].contents;
  const [template, style, bench] = await Promise.all([
    readFile(join(here, "index.html"), "utf8"),
    readFile(join(docs, "style.css")),
    readFile(join(docs, "workbench.css")),
  ]);
  const year = new Date().getUTCFullYear();
  const html = template
    .replace("__AVATAR__", avatarUrl.replaceAll("&", "&amp;"))
    .replace("__STYLE_VERSION__", version(style))
    .replace("__BENCH_VERSION__", version(bench))
    .replace("__SCRIPT_VERSION__", version(script))
    .replace("__YEAR__", String(year))
    .replace("<!--PROFILE-->", () => renderPage(year));
  await writeFile(join(docs, "site.js"), script);
  await writeFile(join(docs, "index.html"), html);
} finally {
  await rm(staging, { recursive: true, force: true });
}
