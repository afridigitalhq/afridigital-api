import fs from "fs";
import path from "path";

export class AfriNucCapabilityRegistry {

  constructor(){

    this.component = "AfriNucChain Capability Registry";

    this.file =
      "modules/afrinucchain/.data/runtime-capabilities.json";

    this.ensure();
  }

  ensure(){

    const dir = path.dirname(this.file);

    if(!fs.existsSync(dir)){
      fs.mkdirSync(dir,{recursive:true});
    }

    if(!fs.existsSync(this.file)){
      fs.writeFileSync(
        this.file,
        JSON.stringify({
          capabilities:[
            "RecoveryPipeline",
            "LifecyclePersistence",
            "AuditVerification",
            "CertificateGeneration",
            "DeliveryPackaging",
            "ClientHandoff",
            "JobClosure",
            "LifecycleArchive",
            "ExecutionPipeline"
          ]
        },null,2)
      );
    }
  }

  load(){

    return JSON.parse(
      fs.readFileSync(this.file,"utf8")
    );
  }

  save(data){

    fs.writeFileSync(
      this.file,
      JSON.stringify(data,null,2)
    );
  }

  register(capability){

    const data=this.load();

    if(!data.capabilities.includes(capability)){
      data.capabilities.push(capability);
      this.save(data);
    }

    return {
      component:this.component,
      status:"REGISTERED",
      capability,
      totalCapabilities:data.capabilities.length
    };
  }

  list(){

    const data=this.load();

    return {
      component:this.component,
      status:"ACTIVE",
      capabilities:data.capabilities,
      totalCapabilities:data.capabilities.length
    };
  }
}
