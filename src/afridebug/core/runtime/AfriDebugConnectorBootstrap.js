import Registry from "../registry/AfriDebugConnectorRegistry.js";
import WhatsApp from "../connectors/whatsapp/AfriDebugWhatsAppConnector.js";
import Commerce from "../connectors/commerce/AfriDebugCommerceConnector.js";
import Web from "../connectors/web/AfriDebugWebConnector.js";
import DesignStudio from "../connectors/designstudio/AfriDebugDesignStudioConnector.js";

const connectors={
AfriWhatsApp:WhatsApp,
AfriCommerce:Commerce,
AfriWeb:Web,
AfriDesignStudio:DesignStudio
};

const AfriDebugConnectorBootstrap={
boot(){
Object.entries(connectors).forEach(([name,connector])=>{
Registry.register(connector);
});
return Registry.stats();
},
health(){
return{
service:"AfriDebugConnectorBootstrap",
registered:Object.keys(connectors).length,
status:"healthy"
};
}
};

export default AfriDebugConnectorBootstrap;
