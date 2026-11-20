import { pathToFileURL } from "node:url";
import { main } from "./AfriREACommand.js";

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = await main();
}
