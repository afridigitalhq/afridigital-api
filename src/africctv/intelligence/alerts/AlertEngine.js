export class AlertEngine {

  constructor(){
    this.alerts=[];
  }

  evaluate(event){

    if(event.detected){

      const alert={
        level:"HIGH",
        type:event.type,
        cameraId:event.cameraId,
        createdAt:Date.now()
      };

      this.alerts.push(alert);

      return alert;
    }

    return null;
  }

  list(){
    return this.alerts;
  }
}

export const alertEngine = new AlertEngine();
