import React, { Component } from 'react';
import Block from './Block';
import { Link } from 'react-router-dom';

const POLL_INTERVAL_MS = 10000;

class Blocks extends Component {
    state = { blocks: [] };

    componentDidMount() {
        this.fetchBlockChainData();
        this.fetchBlocksInterval = setInterval(() => {
            this.fetchBlockChainData();
        }, POLL_INTERVAL_MS);
    }

    componentWillUnmount() {
        clearInterval(this.fetchBlocksInterval);
    }

    fetchBlockChainData = () => {
        fetch('http://localhost:3000/api/blocks')
            .then(res => res.json())
            .then(json => {
                this.setState({
                    blocks: json
                });
            });
    }

    render() {
        return (
            <div>
                <h1>Records of mined voting results</h1>
                <div><Link id="single-link" to='/'>Home</Link></div>
                {
                    this.state.blocks.map((block) => {
                        return (
                            <Block key={block.hash} block={block} />
                        )
                    })
                }
            </div>
        );
    }
}

export default Blocks;