const PubNub = require('pubnub');

const CHANNELS = {
    BLOCKCHAIN: 'BLOCKCHAIN',
    REPORTPOOL:'REPORTPOOL',
    REPORTPOOLMAP:'REPORTPOOLMAP'
}

const credentials = {
    publishKey: 'pub-c-67ecdaa8-02df-46ef-b5d8-ffee960babef',
    subscribeKey: 'sub-c-977a2210-426a-11ea-afe9-722fee0ed680',
    secretKey: 'sec-c-NTM2MThmNTEtYzgyZC00MzY1LWJlNjMtNTQ0YmQ5NmIxYjBm'
}

class PubSub {
    constructor({blockchain,reportPool}) {
        this.blockchain = blockchain;
        this.reportPool = reportPool;

        this.pubNub = new PubNub(credentials);

        this.pubNub.subscribe({channels: [Object.values(CHANNELS)]});

        this.pubNub.addListener(this.listener());
    }

    listener() {
        return {
            message: (messageObject) => {
                const {channel, message} = messageObject;

                const parsedMessage = JSON.parse(message);

                switch (channel) {
                    case CHANNELS.BLOCKCHAIN: {
                        this.blockchain.replaceChain(parsedMessage);
                        break;
                    }
                    case CHANNELS.REPORTPOOL:{
                        this.reportPool.setReport(parsedMessage);
                        break;
                    }
                    case CHANNELS.REPORTPOOLMAP:{
                        this.reportPool.setMap(parsedMessage);
                        break;
                    }
                    default: {
                        break
                    }
                }

                console.log(`Message Recieved. Channel : ${channel} . Message: ${message}`);
            }
        }
    }


    publish({channel,message}){
        try {
            this.pubNub.publish({message,channel})
        }catch (e) {
            console.error(e);
        }

    }

    broadcastChain(){
        this.publish({channel:CHANNELS.BLOCKCHAIN , message:JSON.stringify(this.blockchain.chain)});
    }

    broadcastReportPoolMap(report){
        this.publish({channel: CHANNELS.REPORTPOOL,message:JSON.stringify(report)})
    }

    broadcastNewReportPoolMap(reportPoolMap){
        this.publish({channel: CHANNELS.REPORTPOOLMAP,message:JSON.stringify(reportPoolMap)})
    }

}

module.exports = PubSub;
