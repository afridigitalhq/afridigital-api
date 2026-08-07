/**
 * AfriDesign Alignment Toolbar Container
 *
 * Purpose:
 * Provides selected component
 * to alignment controls.
 *
 * Rule:
 * Composition only.
 */

import { useEffect, useState } from "react";
import AlignmentToolbar from "./AlignmentToolbar";
import SelectionController from "../../../canvas/selection/SelectionController";
import WorkspaceEventBus from "../../../runtime/events/WorkspaceEventBus";
import WorkspaceEvents from "../../../runtime/events/WorkspaceEvents";

export default function AlignmentToolbarContainer() {

  const [selectedComponent, setSelectedComponent] =
    useState(
      SelectionController.current()
    );


  useEffect(() => {

    const syncSelection = (payload) => {

      setSelectedComponent(
        payload.component || null
      );

    };


    WorkspaceEventBus.subscribe(
      WorkspaceEvents.SELECTION_CHANGED,
      syncSelection
    );


  }, []);


  return (
    <AlignmentToolbar
      selectedComponent={
        selectedComponent
      }
    />
  );

}
