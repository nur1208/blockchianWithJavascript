const SHA256 = require("crypto-js/sha256");
class Transaction {
  constructor(fromAdders, toAdders, amount) {
    this.fromAdders = fromAdders;
    this.toAdders = toAdders;
    this.amount = amount;
  }
}
// 1 + 3 + 1 = 5
// timestamp + transaction + perviousHash + hash + nonce = "000kkjadafaaec"
class Block {
  constructor(timestamp, transaction, perviousHash) {
    this.timestamp = timestamp;
    this.transaction = transaction;
    this.perviousHash = perviousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.perviousHash +
        this.timestamp +
        JSON.stringify(this.transaction) +
        this.nonce
    ).toString();
  }

  minBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !==
      Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log("mined with hash:" + this.hash);
  }
}

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block("1/1/2017", "Genesis Block", "0");
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  //   addBlock(newBlock) {
  //     newBlock.perviousHash = this.getLastBlock().hash;
  //     newBlock.minBlock(this.difficulty);
  //     this.chain.push(newBlock);
  //   }

  minPendingTransactions(miningRewardAddress) {
    let block = new Block(Date.now(), this.pendingTransactions);
    block.minBlock(this.difficulty);

    console.log("Block successfully mined");

    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction(
        null,
        miningRewardAddress,
        this.miningReward
      ),
    ];
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const transaction of block.transaction) {
        if (transaction.fromAdders === address) {
          balance -= transaction.amount;
        }

        if (transaction.toAdders === address) {
          balance += transaction.amount;
        }
      }
    }

    return balance;
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
savjeCoin.createTransaction(
  new Transaction("address1", "address2", 100)
);
savjeCoin.createTransaction(
  new Transaction("address2", "address1", 50)
);
console.log("starting mining...");
savjeCoin.minPendingTransactions("nur");

console.log(savjeCoin.getBalanceOfAddress("nur"));

console.log("starting mining again...");
savjeCoin.minPendingTransactions("nur");

console.log(savjeCoin.getBalanceOfAddress("nur"));
console.log(savjeCoin.getBalanceOfAddress("address1"));
console.log(savjeCoin.getBalanceOfAddress("address2"));

// console.log("mining block 1...");

// savjeCoin.addBlock(new Block(2, "2/2/2017", { amount: 4 }));

// console.log("mining block 2...");
// savjeCoin.addBlock(new Block(3, "3/2/2017", { amount: 41 }));

// console.log(JSON.stringify(savjeCoin, null, 4));
// console.log(`is blockchain valid: ${savjeCoin.isChainValid()}`);

// console.log(savjeCoin.chain[2].hash);

// savjeCoin.chain[1].data = { amount: 4444 };
// savjeCoin.chain[1].hash = savjeCoin.chain[1].calculateHash();
// savjeCoin.chain[2].perviousHash = savjeCoin.chain[1].hash;
// savjeCoin.chain[2].hash = savjeCoin.chain[2].calculateHash();

// console.log(savjeCoin.chain[2].hash);

// console.log(`is blockchain valid: ${savjeCoin.isChainValid()}`);
