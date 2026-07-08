import {
 sessionScaler
} from "./SessionScaler.js";


sessionScaler.start("cam01");
sessionScaler.start("cam02");
sessionScaler.start("cam03");


const total =
sessionScaler.count();


if(total!==3){
 throw new Error("SCALING LAYER FAILED");
}


console.log("📡 Sessions:",total);
console.log("🎥 Cameras: 3");
console.log("🔒 SCALING LAYER LOCKED");
