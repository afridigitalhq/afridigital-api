import AfriNativeAndroidGenerator from "../../generator/native/AfriNativeAndroidGenerator.js";

const NativeAndroidBuilderAdapter = {

  name:"native_android",

  capabilities:["generate","preview","export"],

  generate(request={}){

    const project = {
      name:request.name || "afritodo",
      packageName:request.packageName || "com.afridigital.afritodo",
      version:request.version || request.generatedVersion || "1.0.0",
      generatorVersion:String(request.generatorVersion || "2"),
      language:"kotlin"
    };

    const generatedProject = AfriNativeAndroidGenerator.generate(project);

    return {
      status:"GENERATED",
      provider:"native_android",
      buildType:"native_android",
      language:"kotlin",
      generatorVersion:project.generatorVersion,
      version:project.version,
      packageName:project.packageName,
      project:generatedProject
    };

  }

};

export default NativeAndroidBuilderAdapter;
