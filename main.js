const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(index, timestamp, data, perviousHash) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.perviousHash = perviousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.perviousHash +
        this.timestamp +
        JSON.stringify(this.data)
    ).toString();
  }
}

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, "1/1/2017", "Genesis Block", "0");
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.perviousHash = this.getLastBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const perviousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash())
        return false;

      if (currentBlock.perviousHash !== perviousBlock.hash)
        return false;
    }

    return true;
  }
}

let savjeCoin = new BlockChain();
savjeCoin.addBlock(new Block(2, "2/2/2017", { amount: 4 }));
savjeCoin.addBlock(new Block(3, "3/2/2017", { amount: 41 }));

console.log(JSON.stringify(savjeCoin, null, 4));
console.log(`is blockchain valid: ${savjeCoin.isChainValid()}`);

console.log(savjeCoin.chain[2].hash);

savjeCoin.chain[1].data = { amount: 4444 };
savjeCoin.chain[1].hash = savjeCoin.chain[1].calculateHash();
savjeCoin.chain[2].perviousHash = savjeCoin.chain[1].hash;
savjeCoin.chain[2].hash = savjeCoin.chain[2].calculateHash();

console.log(savjeCoin.chain[2].hash);

console.log(`is blockchain valid: ${savjeCoin.isChainValid()}`);
