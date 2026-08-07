/**
 * AfriDesign Platform Workspace Switcher
 *
 * Coordinates workspace routing only.
 *
 * Visual ownership belongs to StudioLayout.
 */

import { useEffect, useState } from "react";

import PlatformWorkspaceController from "./PlatformWorkspaceController";

import PlatformWorkspaceRouter from "../router/PlatformWorkspaceRouter";

export default function PlatformWorkspaceSwitcher(){

  const [workspace,setWorkspace] =
    useState(
      PlatformWorkspaceController.current()
    );


  useEffect(()=>{

    const unsubscribe =
      PlatformWorkspaceController.subscribe(
        nextWorkspace=>{
          setWorkspace(nextWorkspace);
        }
      );

    return unsubscribe;

  },[]);


  return(

    <PlatformWorkspaceRouter
      workspace={workspace}
    />

  );

}
