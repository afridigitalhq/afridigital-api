import React, { useEffect } from "react";
import DesktopShell from "./DesktopShell.jsx";
import Taskbar from "./Taskbar.jsx";
import { bootstrapOS } from "../../os/bootstrap.js";

export default function DesktopApp() {
  useEffect(() => {
    bootstrapOS();
  }, []);

  return (
    <>
      <DesktopShell />
      <Taskbar />
    </>
  );
}
