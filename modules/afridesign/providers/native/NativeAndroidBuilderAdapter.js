import AfriNativeAndroidGenerator from "../../generator/native/AfriNativeAndroidGenerator.js";

const NativeAndroidBuilderAdapter = {

  name:"native_android",

  generate(request={}){

    const project = {
      name:request.name || "afritodo",
      packageName:request.packageName || "com.afridigital.afritodo",
      version:request.version || "1.0.0",
      generatorVersion:String(request.generatorVersion || "2"),
      language:"kotlin"
    };

    return {
      status:"GENERATED",
      provider:"native_android",
      buildType:"native_android",
      language:"kotlin",
      generatorVersion:project.generatorVersion,
      project:AfriNativeAndroidGenerator.generate(project)
    };

  }

};

export default NativeAndroidBuilderAdapter;
