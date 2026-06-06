export const signer = {
  sign(data) {
    const base = JSON.stringify(data);
    let hash = 7;

    for (let i = 0; i < base.length; i++) {
      hash = (hash * 31 + base.charCodeAt(i)) % 1000000000;
    }

    return String(hash);
  },

  verify(data, signature) {
    return this.sign(data) === signature;
  }
};
