const uuid = require('uuid/v1');

class Report {
    constructor({data}) {
        this.id = uuid();
        this.reportData = {
            votes: 0,
            voters: [],
            data,
        }
    }
}

module.exports = Report;
