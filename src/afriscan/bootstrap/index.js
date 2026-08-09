import {renderStatus} from "../../core/observability/index.js";

export function init(server){
  console.log(renderStatus("AFRISCAN", "INFO", "initialized"));
}
