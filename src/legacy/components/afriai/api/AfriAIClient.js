const API_BASE="https://afridigital-api.onrender.com";
export async function sendCommand(payload){
  return fetch(API_BASE+"/api/afriai/command",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(payload)
  });
}
