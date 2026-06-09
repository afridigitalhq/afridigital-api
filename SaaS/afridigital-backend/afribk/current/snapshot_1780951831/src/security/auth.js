const crypto require("crypto");

const SECRET = process.env.JWT_SECRET || "dev_secret";

export const Auth = {
  sign(payload) {
    return crypto
      .createHmac("sha256", SECRET)
      .update(JSON.stringify(payload))
      .digest("hex");
  },

  verify(payload, signature) {
    return this.sign(payload) === signature;
  }
};
