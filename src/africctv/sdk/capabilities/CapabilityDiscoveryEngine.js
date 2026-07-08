export class CapabilityDiscoveryEngine{

 inspect(plugin){

  return {
   plugin:plugin.id,
   capabilities:plugin.capabilities
  };

 }

}

export const capabilityDiscoveryEngine =
new CapabilityDiscoveryEngine();
