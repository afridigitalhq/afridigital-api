import EventAdapter from "../connectors/events/AfriDebugConnectorEventAdapter.js";

const AfriDebugExternalConnectorTest = {

  send(){

    const connector = {

      id:"external-github-test",

      name:"External GitHub Demo Project"

    };


    const event = {

      type:"runtime_error",

      payload:{

        repository:"demo-client-app",

        issue:"API_TIMEOUT",

        file:"payment-service.js",

        severity:"high"

      }

    };


    return EventAdapter.receive(
      connector,
      event
    );

  }

};


export default AfriDebugExternalConnectorTest;
