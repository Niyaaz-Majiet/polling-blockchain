const {GENESIS_BLOCK} = require('../config');
const {cryptoHash} = require('../Util');

class Block {
    constructor({timestamp, lastHash, data, hash}) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.data = data;
        this.hash = hash;
    }

    static genesisBlock() {
        return new Block(GENESIS_BLOCK);
    }

    static mineBlock({lastBlock,data}){
        const timestamp = Date.now();
        const lastHash = lastBlock.hash;
        const hash = cryptoHash(timestamp,lastHash,data);


        return new this({
            timestamp,
            lastHash,
            data,
            hash
        });
    }
}

module.exports = Block;
