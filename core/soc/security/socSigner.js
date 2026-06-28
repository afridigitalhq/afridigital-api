import crypto from "crypto";

export class SOCSigner {
  sign(command) {
    return {
      ...command,
      signature: crypto.createHash("sha256")
        .update(JSON.stringify(command))
        .digest("hex")
    };
  }
}
