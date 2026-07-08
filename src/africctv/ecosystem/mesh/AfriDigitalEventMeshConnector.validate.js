import {
 afriDigitalEventMeshConnector
} from "./AfriDigitalEventMeshConnector.js";


afriDigitalEventMeshConnector.publish({
 source:"AFRICCTV",
 type:"camera_event"
});


const result =
afriDigitalEventMeshConnector.list();


if(result[0].source!=="AFRICCTV"){
 throw new Error("EVENT MESH FAILED");
}


console.log("🌍 Source:",result[0].source);
console.log("📡 Event:",result[0].type);
console.log("🔒 EVENT MESH CONNECTOR LOCKED");
