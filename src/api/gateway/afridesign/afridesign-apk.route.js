import fs from "fs";
import path from "path";

export default function afriDesignAPKRoute(app){

  app.get("/api/afridesign/apk/download/:application/:version",(req,res)=>{

    const application=String(req.params.application || "");
    const version=String(req.params.version || "");

    if(!/^[A-Za-z0-9._-]+$/.test(application) || !/^[A-Za-z0-9._-]+$/.test(version)){
      return res.status(400).json({
        status:"DOWNLOAD_BLOCKED",
        reason:"INVALID_APK_IDENTIFIER"
      });
    }

    const fileName=`${application}-${version}.apk`;
    const artifactsRoot=path.resolve("modules/afridesign/.artifacts");
    const filePath=path.resolve(artifactsRoot,fileName);

    if(!filePath.startsWith(artifactsRoot + path.sep)){
      return res.status(400).json({
        status:"DOWNLOAD_BLOCKED",
        reason:"INVALID_APK_PATH"
      });
    }

    if(!fs.existsSync(filePath)){
      return res.status(404).json({
        status:"DOWNLOAD_BLOCKED",
        reason:"APK_NOT_FOUND",
        application,
        version
      });
    }

    const stat=fs.statSync(filePath);

    if(!stat.isFile()){
      return res.status(404).json({
        status:"DOWNLOAD_BLOCKED",
        reason:"APK_NOT_FILE"
      });
    }

    res.setHeader("Content-Type","application/vnd.android.package-archive");
    res.setHeader("Content-Length",stat.size);
    res.setHeader("Content-Disposition",`attachment; filename="${fileName}"`);
    res.setHeader("Cache-Control","private, no-store");

    return fs.createReadStream(filePath).on("error",()=>{ if(!res.headersSent) res.status(500).json({status:"DOWNLOAD_FAILED",reason:"APK_STREAM_ERROR"}); }).pipe(res);
  });

}
