const CoreSecurityRequest={create(input){return {input,timestamp:new Date().toISOString(),status:"RECEIVED"};}};
export default CoreSecurityRequest;
