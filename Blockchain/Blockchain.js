const Block = require('./block');
const {cryptoHash} = require('../Util');

class Blockchain {
    constructor() {
        this.chain = [Block.genesisBlock()];
    }

    addBlock({data}) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length - 1],
            data
        });

        this.chain.push(newBlock);
    }

   static isValidChain(chain) {

        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesisBlock())) {
            return false;
        }

        for (let i = 1; i < chain.length; i++) {
            const {timestamp, lastHash, hash, data} = chain[i];

            const actualLastHash = chain[i - 1].hash;

            if (actualLastHash !== lastHash) {
                return false;
            }

            const actualHash = cryptoHash(timestamp, lastHash, data);

            if (actualHash !== hash) {
                return false;
            }
        }

        return true;
    }

    replaceChain(chain){
        if(this.chain.length>chain.length){
            console.error('Incomming chain must be longer');
            return;
        }

        if(!Blockchain.isValidChain(chain)){
            console.error('Incomming chain must be valid');
            return;
        }

       if (!this.validReportData({chain})){
           console.error('Incomming chain data must be valid');
           return;
       }
        this.chain = chain;
    }

    validReportData({data}){
        return true;
    }

}

module.exports = Blockchain;
