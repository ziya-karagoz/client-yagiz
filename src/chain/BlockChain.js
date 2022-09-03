import Block from './Block'
class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.pendingTransactions = [];
  }

  createGenesisBlock() {
    return new Block(new Date().toLocaleString(), [], "none");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions() {
    let block = new Block(
      new Date().toLocaleString(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );
    this.chain.push(block);
    this.pendingTransactions = [];
  }

  addTransaction(transaction) {
    if (!transaction.sender || !transaction.receivers) {
      throw new Error("Transaction must contain fromAdress and toAdress!");
    }
    if (!transaction.isValid()) {
      throw new Error("Cannot add transaction to chain!");
    }
    this.pendingTransactions.push(transaction);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];

      if (!currentBlock.hasValidTransaction()) {
        return false;
      }

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
    }
    return true;
  }
}
export default BlockChain;
