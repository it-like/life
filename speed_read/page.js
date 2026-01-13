import { SpeedReader } from "./SpeedReader.js";

const root = document.querySelector(".page");
// Root element is the page; the component queries its own ids.
new SpeedReader(root, { wpm: 300 });
