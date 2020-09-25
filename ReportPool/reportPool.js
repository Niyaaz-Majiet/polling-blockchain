const Report = require('./report');

class ReportPool {
    constructor() {
        this.reportPoolMap = {};
    }

    clear(){
        this.reportPoolMap = {};
    }

    setReport(report){
        this.reportPoolMap[report.id] = report;
    }

    setMap(reportPoolMap){
        this.reportPoolMap = reportPoolMap;
    }

    validReports() {
        return Object.values(this.reportPoolMap).filter(
            report => report.reportData.votes > 1
        );
    }

    clearMinedReports(reports){
        for(let i =0;i<reports.length;i++){
            if (this.reportPoolMap[reports[i].id]) {
                delete this.reportPoolMap[reports[i].id];
            }
        }
    }
}

module.exports = ReportPool;
