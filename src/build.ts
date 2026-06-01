import { futureDayContent } from "./content";
import { renderPage } from "./render";

await Bun.write("dist/index.html", renderPage(futureDayContent));
await Bun.write("dist/styles.css", await Bun.file("src/styles.css").text());
await Bun.write("dist/app.js", await Bun.file("src/app.js").text());
await Bun.write("dist/daily-variation.js", await Bun.file("src/daily-variation.js").text());
