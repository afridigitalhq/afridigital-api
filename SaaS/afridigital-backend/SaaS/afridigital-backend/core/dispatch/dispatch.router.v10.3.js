const whatsapp =
require('./whatsapp.sender.v10.3');

const email =
require('./email.sender.v10.3');

class DispatchRouterV10_3 {

  route(type, payload={}) {

    switch(type) {

      case "whatsapp":

        return whatsapp.send(
          payload.to,
          payload.message
        );

      case "email":

        return email.send(
          payload.to,
          payload.subject,
          payload.body
        );

      default:

        return {
          ok: false,
          error: "unsupported_dispatch_type"
        };
    }
  }

  snapshot() {

    return {

      ok: true,

      whatsapp:
        whatsapp.snapshot(),

      email:
        email.snapshot()
    };
  }
}

module.exports = new DispatchRouterV10_3();
