export class ONVIFDiscovery {
  constructor(){
    this.devices = [];
  }

  discover(){
    this.devices = [
      {
        id:"onvif-cam-01",
        protocol:"ONVIF",
        status:"DISCOVERED",
        address:"pending"
      }
    ];

    return this.devices;
  }
}

export const onvifDiscovery = new ONVIFDiscovery();
