const PROFILES=Object.freeze({
  conversation:Object.freeze({maxOutputTokens:48,timeoutMs:60000,temperature:0.1}),
  planning:Object.freeze({maxOutputTokens:2048,timeoutMs:90000,temperature:0.1,responseFormat:"json"}),
  coding:Object.freeze({maxOutputTokens:8192,timeoutMs:180000,temperature:0.1,responseFormat:"text"}),
  design:Object.freeze({maxOutputTokens:8192,timeoutMs:180000,temperature:0.2}),
  preview:Object.freeze({maxOutputTokens:2048,timeoutMs:90000,temperature:0.2}),
  research:Object.freeze({maxOutputTokens:4096,timeoutMs:120000,temperature:0.1}),
  debugging:Object.freeze({maxOutputTokens:4096,timeoutMs:120000,temperature:0.1,responseFormat:"text"})
});
export function createAfriGenerationProfileRegistry(overrides={}){
  const profiles={...PROFILES,...overrides};
  return Object.freeze({
    get(name){
      const profile=profiles[name];
      return profile?Object.freeze({...profile}):null;
    },
    list(){return Object.keys(profiles)}
  });
}
export default createAfriGenerationProfileRegistry;
