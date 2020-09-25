const {ec, cryptoHash} = require('../util');
const Report = require('../ReportPool/report');

class User {
    constructor({reportPool, blockchain,pubSub}) {
        this.reportPool = reportPool;
        this.blockchain = blockchain;
        this.pubSub = pubSub;
        this.keypair = ec.genKeyPair();

        this.publicKey = this.keypair.getPublic().encode('hex');
    }

    sign(data) {
        return this.keypair.sign(cryptoHash(data));
    }

    createReport({reportData}) {
        const reportDataFull = {
            timestamp: Date.now(),
            creatorAddress: this.publicKey,
            sign: this.sign(reportData),
            report_data: reportData
        }
        return new Report({data: reportDataFull});
    }

    castVote({report, voterInfo, voteBool}) {
        let voteInc = voteBool ? 1 : 0;
        let votersArray = report.reportData.voters;
        votersArray.push(voterInfo.publicKey);
        const updatedReport = {
            id: report.id,
            reportData: {
                votes: report.reportData.votes + voteInc,
                voters: votersArray,
                data: report.reportData.data
            }
        };
        this.reportPool.setReport(updatedReport);
        return updatedReport;
    }

    mineReports() {
        const reports = this.reportPool.validReports();
        if (reports.length < 1) {
            console.error('no valid reports to mine.');
        } else {
            this.reportPool.clearMinedReports(reports);
            this.pubSub.broadcastNewReportPoolMap(this.reportPool.reportPoolMap);
            this.blockchain.addBlock({data: reports});
        }
    }
}

module.exports = User;
