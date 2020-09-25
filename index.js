const express = require('express');
const request = require('request');
const path = require('path');
const bodyParser = require('body-parser');
const Blockchain = require('./Blockchain/Blockchain');
const ReportPool = require('./ReportPool/reportPool');
const User = require('./User');
const { PubSub } = require('./Util')

const app = express();

const blockchain = new Blockchain();
const reportPool = new ReportPool();
const pubSub = new PubSub({ blockchain, reportPool });
const user = new User({ reportPool, blockchain, pubSub });



app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/dist')));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});


const DEFAULT_PORT = 3000;

let PEER_PORT;

const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;


app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.get('/api/reportPoolMap', (req, res) => {
    res.json(reportPool.reportPoolMap);
});

app.get('/api/mine-reports', (req, res) => {
    user.mineReports();

    res.redirect('/api/blocks');
});

app.post('/api/mine-block', (req, res) => {
    const { data } = req.body;
    blockchain.addBlock({ data });

    pubSub.broadcastChain();

    res.redirect('/api/blocks');
});

app.post('/api/create-report', (req, res) => {
    const { data } = req.body;

    try {
        const report = user.createReport({ reportData: data });

        reportPool.setReport(report);

        pubSub.broadcastReportPoolMap(report);

        res.json({ type: 'success',report });

        res.redirect('/api/reportPoolMap');
    } catch (error) {
        return res.status(400).json({ type: 'error', message: error.message });
    }
});

app.post('/api/cast-vote', (req, res) => {
    const { reportId, voteBool } = req.body;
    try {
        const updatedReport = user.castVote({ report: reportPool.reportPoolMap[reportId], voterInfo: user, voteBool })

        pubSub.broadcastReportPoolMap(updatedReport);

        res.json({ type: 'success' ,updatedReport});

        res.redirect('/api/reportPoolMap');
    } catch (error) {
        return res.status(400).json({ type: 'error', message: error.message });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/dist/index.html'))
});

if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;

const syncRootState = () => {
    request(`${ROOT_NODE_ADDRESS}/api/blocks`, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootBlockchain = JSON.parse(body);
            console.log('replace chain on a sync with', rootBlockchain);
            blockchain.replaceChain(rootBlockchain);
        }
    });
    request(`${ROOT_NODE_ADDRESS}/api/reportPoolMap`, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootReportPoolMap = JSON.parse(body);
            console.log('replace reportPoolMap on a sync with', rootReportPoolMap);
            reportPool.setMap(rootReportPoolMap);
        }
    });
}

app.listen(PORT, () => {
    console.log(`Listening at port localhost:${PORT}`);
    if (PORT !== DEFAULT_PORT) {
        syncRootState();
    }
});

