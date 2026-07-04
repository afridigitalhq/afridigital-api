export class ConfigImplementation {
  constructor() {
    this.name = "ConfigImplementation";
    this.config = {};
  }
  set(k,v){ this.config[k]=v; return true; }
  get(k){ return this.config[k]; }
}
