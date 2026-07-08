export class FleetMetricsCollector{

 collect(devices){

  return {
   totalUsers:devices.length,
   online:devices.filter(d=>d.state==="ONLINE").length,
   offline:devices.filter(d=>d.state==="OFFLINE").length,
   idle:devices.filter(d=>d.state==="IDLE").length
  };

 }

}

export const fleetMetricsCollector =
new FleetMetricsCollector();
