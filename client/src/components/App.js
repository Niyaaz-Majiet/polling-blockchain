import React, { Component } from 'react';
import OpenPolls from './OpenPolls';
import { Link } from 'react-router-dom';

class App extends Component {
    render() {
        return (
            <div className="app-component">
                <h1 className = "header">Vote Here ... </h1>
                <hr />
                <div><Link to='/blocks'>Polling Records</Link>
                    <Link to='/create-poll'>Create New Poll</Link></div>
                <hr />
                <OpenPolls />
            </div>
        );
    }
}

export default App;