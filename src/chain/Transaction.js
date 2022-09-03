

import { SHA256 } from "crypto-js";
import { ec as EC } from "elliptic";
const ec = new EC("secp256k1");

class Transaction {
  constructor(sender, receivers, data) {
    this.sender = sender;
    this.receivers = receivers;
    this.data = data;
    this.date = new Date().toLocaleString();
  }
  calculateHash() {
    return SHA256(this.sender, this.receivers, this.data, this.date).toString();
  }

  signTransaction(signingKey) {
    if (signingKey.getPublic("hex") !== this.sender) {
      throw new Error("Gecersiz islem");
    }
    const hashTx = this.calculateHash();

    const sig = signingKey.sign(hashTx, "base64");
    this.signature = sig.toDER("hex");
  }

  isValid() {
    if (this.sender === null) {
      return true;
    }

    if (!this.signature || this.signature.length === 0) {
      throw new Error("There is no signature in this transaction!");
    }
    
    const publicKey = ec.keyFromPublic(this.sender, "hex");
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}
export default Transaction;
