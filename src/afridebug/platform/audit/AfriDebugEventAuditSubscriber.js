import Bus from "../events/AfriDebugEventBus.js";
import Ledger from "./AfriDebugImmutableAuditLedger.js";

const EVENTS = [
  "investigation.started",
  "stage.started",
  "stage.completed",
  "stage.failed",
  "execution.completed",
  "INVESTIGATION_CREATED",
  "REPOSITORY_INTAKE_COMPLETED",
  "ANALYSIS_COMPLETED",
  "PATCH_READY",
  "VERIFICATION_PASSED",
  "DELIVERY_READY"
];


const AfriDebugEventAuditSubscriber = {

  bind(){

    EVENTS.forEach(type=>{

      Bus.subscribe(
        type,
        event=>{

          Ledger.record({

            type:"LIFECYCLE_EVENT",

            eventType:
              event.type,

            data:
              event,

            timestamp:
              Date.now()

          });

        }
      );

    });


    return {

      subscribed:
        EVENTS.length

    };

  },


  health(){

    return {

      service:
        "AfriDebugEventAuditSubscriber",

      status:
        "healthy"

    };

  }

};


export default AfriDebugEventAuditSubscriber;
