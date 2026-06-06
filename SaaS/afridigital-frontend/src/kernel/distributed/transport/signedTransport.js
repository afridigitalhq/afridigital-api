import { identity } from "../../identity/identity.js";

export const signedTransport = {
  sign(payload) {
    const id = identity.get();
    return {
      payload,
      identity: id,
      signature: btoa(JSON.stringify({ payload, id }))
    };
  },

  verify(packet) {
    try {
      const decoded = JSON.parse(atob(packet.signature));
      return JSON.stringify(decoded.payload) === JSON.stringify(packet.payload);
    } catch {
      return false;
    }
  }
};
