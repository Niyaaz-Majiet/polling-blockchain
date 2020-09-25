import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

const POLL_INTERVAL_MS = 1000;

class OpenPolls extends Component {
    state = {
        reportPoolMap: {}
    };

    componentDidMount() {
        this.fetchOpenPolls();
        this.fetchPoolMapInterval = setInterval(() => {
            this.fetchOpenPolls();
        }, POLL_INTERVAL_MS);
    }

    componentWillUnmount() {
        clearInterval(this.fetchPoolMapInterval);
    }

    fetchOpenPolls = () => {
        fetch('http://localhost:3000/api/reportPoolMap',{mode : 'no-cors'})
            .then(res => res.json())
            .then(json => {
                this.setState({
                    reportPoolMap: json
                });
                console.log(json);
            });
    }

    castVoteOnPoll = (id, voteBool) => {
        fetch('http://localhost:3000/api/cast-vote', {
            method: 'POST',
            mode : 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reportId: id, voteBool })
        }).then((res => res.json))
            .then((json) => {
                console.log(json);
                alert(json.message || json.type);
                this.fetchOpenPolls();
            });
    }

    minePolls = () => {
        fetch('http://localhost:3000/api/mine-reports',{mode : 'no-cors'})
            .then(res => {
                if (res.status === 200) {
                    alert('Success');
                    this.fetchOpenPolls();
                     history.push('/blocks');
                } else {
                    alert('The mine-transactions block request did not complete .');
                }
            })
    }

    render() {
        return (
            <div>
                <h1>Open Polls</h1>
                <hr />
                {
                    Object.values(this.state.reportPoolMap).map(report => {
                        return (
                            <div key={report.id}>
                                <h4>Topic : {report.reportData.data.report_data.topic}</h4>
                                <h4>About : {report.reportData.data.report_data.about}</h4>
                                <h4>Total Votes : {report.reportData.voters.length}</h4>
                                <h4>Total Yes votes : {report.reportData.votes}</h4>
                                <Button id="btn-dark" variant="success" onClick={() => this.castVoteOnPoll(report.id, true)}>Vote Yes</Button>
                                <Button id="btn-dark-right" variant="danger" onClick={() => this.castVoteOnPoll(report.id, false)}>Vote No</Button>
                                <hr />
                            </div>
                        );
                    })
                }
                <Button id="btn-dark" variant="secondary" size="lg" block onClick={() => this.minePolls()}>Mine Polls</Button>
            </div>
        );
    }
}

export default OpenPolls;

