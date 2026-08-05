import AfriDebugGitHubConnector from "./AfriDebugGitHubConnector.js";
import AfriDebugGitLabConnector from "./AfriDebugGitLabConnector.js";
import AfriDebugBitbucketConnector from "./AfriDebugBitbucketConnector.js";
import AfriDebugGitImporter from "./AfriDebugGitImporter.js";
import AfriDebugZipImporter from "./AfriDebugZipImporter.js";
import AfriDebugWorkspaceConnector from "./AfriDebugWorkspaceConnector.js";
import AfriDebugDockerConnector from "./AfriDebugDockerConnector.js";
import AfriDebugRenderConnector from "./AfriDebugRenderConnector.js";
import AfriDebugRuntimeCollector from "./AfriDebugRuntimeCollector.js";
import AfriDebugScreenshotImporter from "./AfriDebugScreenshotImporter.js";
import AfriDebugCameraCapture from "./AfriDebugCameraCapture.js";

const AfriDebugRepositoryIntake={
 receive(input={}){
  switch(input.type){
   case "github": return AfriDebugGitHubConnector.connect(input.repo);
   case "gitlab": return AfriDebugGitLabConnector.connect(input.repo);
   case "bitbucket": return AfriDebugBitbucketConnector.connect(input.repo);
   case "git": return AfriDebugGitImporter.connect(input.repo);
   case "zip": return AfriDebugZipImporter.import(input.file);
   case "workspace": return AfriDebugWorkspaceConnector.scan(input.path);
   case "docker": return AfriDebugDockerConnector.inspect(input.container);
   case "render": return AfriDebugRenderConnector.inspect(input.service);
   case "runtime": return AfriDebugRuntimeCollector.collect(input.app);
   case "screenshot": return AfriDebugScreenshotImporter.capture(input.image);
   case "camera": return AfriDebugCameraCapture.capture();
   default: return {status:"UNSUPPORTED_SOURCE",input};
  }
 }
};

export default AfriDebugRepositoryIntake;
