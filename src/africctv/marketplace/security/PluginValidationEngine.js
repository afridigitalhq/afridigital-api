export class PluginValidationEngine{

 validate(plugin){

  return {
   plugin:plugin.id,
   approved:true
  };

 }

}

export const pluginValidationEngine =
new PluginValidationEngine();
