const notifications=[];

const AfriDebugNotificationRuntime={

  send(input={}){

    const notification={

      id:`NOTIFY-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,

      clientId:input.clientId||null,

      investigationId:input.investigationId||null,

      title:input.title||"AfriDebug Notification",

      message:input.message||"",

      status:"DELIVERED",

      createdAt:Date.now()

    };

    notifications.push(notification);

    return notification;

  },

  list(){

    return notifications;

  },

  stats(){

    return{

      notifications:notifications.length

    };

  }

};

export default AfriDebugNotificationRuntime;
