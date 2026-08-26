import fs from "fs";

const ARTIFACT_FILE="modules/core/.data/afri-artifact-registry.json";
const RELEASE_FILE="modules/core/.data/afri-releases.json";

function load(file){
  if(!fs.existsSync(file)) return [];
  try{
    const value=JSON.parse(fs.readFileSync(file,"utf8"));
    return Array.isArray(value) ? value : [];
  }catch{
    return [];
  }
}

function parseVersion(version){
  const match=String(version || "").match(/^(\d+)\.(\d+)\.(\d+)$/);
  return match ? {
    major:Number(match[1]),
    minor:Number(match[2]),
    patch:Number(match[3])
  } : null;
}

function compareVersions(a,b){
  if(a.major!==b.major) return a.major-b.major;
  if(a.minor!==b.minor) return a.minor-b.minor;
  return a.patch-b.patch;
}

const AfriBuildVersionResolver={

  resolve(request={}){

    if(request.version) return String(request.version);
    if(request.generatedVersion) return String(request.generatedVersion);

    const application=String(
      request.application ||
      request.name ||
      request.appName ||
      ""
    ).trim();

    if(!application) return "1.0.0";

    const records=[
      ...load(ARTIFACT_FILE),
      ...load(RELEASE_FILE)
    ];

    const versions=records
      .filter(record=>{
        const recordApplication=String(
          record.application ||
          record.appName ||
          record.name ||
          ""
        ).trim();

        return recordApplication===application;
      })
      .map(record=>parseVersion(record.version))
      .filter(Boolean)
      .sort(compareVersions);

    if(!versions.length) return "1.0.0";

    const latest=versions[versions.length-1];

    return `${latest.major}.${latest.minor}.${latest.patch}`;
  }

};

export default AfriBuildVersionResolver;
