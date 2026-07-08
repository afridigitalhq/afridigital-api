export class USBIPAdapter{
  constructor(){
    this.devices=[];
  }

  attach(device){
    const item={
      id:device.id,
      type:"USB/IP",
      status:"ATTACHED"
    };

    this.devices.push(item);
    return item;
  }

  list(){
    return this.devices;
  }
}

export const usbipAdapter=new USBIPAdapter();
