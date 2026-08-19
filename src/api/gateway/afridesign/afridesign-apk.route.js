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
        const range=req.headers.range;
        res.setHeader("Accept-Ranges","bytes");
        if(range){
          const match=/^bytes=(\d*)-(\d*)$/.exec(range);
          if(!match){ return res.status(416).setHeader("Content-Range",`bytes */${stat.size}`).end(); }
          let start=match[1] ? Number(match[1]) : 0;
          let end=match[2] ? Number(match[2]) : stat.size-1;
          if(!match[1] && match[2]){ const suffix=Number(match[2]); start=Math.max(stat.size-suffix,0); end=stat.size-1; }
          if(!Number.isInteger(start)||!Number.isInteger(end)||start<0||end<start||start>=stat.size){ return res.status(416).setHeader("Content-Range",`bytes */${stat.size}`).end(); }
          end=Math.min(end,stat.size-1);
          const length=end-start+1;
          res.status(206);
          res.setHeader("Content-Range",`bytes ${start}-${end}/${stat.size}`);
          res.setHeader("Content-Length",String(length));
          res.setHeader("Content-Type","application/vnd.android.package-archive");
          res.setHeader("Content-Disposition",`attachment; filename="${fileName}"`);
          res.setHeader("Cache-Control","private, no-store, max-age=0");
          res.setHeader("X-Content-Type-Options","nosniff");
          const rangeBuffer=fs.readFileSync(filePath).subarray(start,end+1);
          return res.end(rangeBuffer);
        }

    if(!stat.isFile()){
      return res.status(404).json({
        status:"DOWNLOAD_BLOCKED",
        reason:"APK_NOT_FILE"
      });
    }

    res.setHeader("Content-Type","application/vnd.android.package-archive");
    res.setHeader("Content-Length",String(stat.size));
    res.setHeader("Content-Disposition",`attachment; filename="${fileName}"`);
    res.setHeader("Cache-Control","private, no-store, max-age=0");
    res.setHeader("X-Content-Type-Options","nosniff");

    try {
      const apkBuffer=fs.readFileSync(filePath);
      return res.end(apkBuffer);
    } catch(err) {
      console.error("[AfriDesign APK] read error:",err);
      if(!res.headersSent){
        return res.status(500).json({
          status:"DOWNLOAD_FAILED",
          reason:"APK_READ_ERROR"
        });
      }
      return res.destroy(err);
    }
  });

}
