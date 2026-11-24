import { hydrateRoot } from "react-dom/client";
import Home from "./src/page";

const root = document.getElementById("portfolio")!;
hydrateRoot(root, <Home year={Number(root.dataset.year)} />);
