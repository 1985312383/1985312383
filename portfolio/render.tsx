import { renderToString } from "react-dom/server";
import Home from "./src/page";
export { avatarUrl } from "./src/content";

export function renderPage(year: number) {
  return renderToString(<Home year={year} />);
}
