import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import history from '../history';

class CreatePoll extends Component {
    state = {
        topic: '',
        about: ''
    }

    updateInput = (e) => {
       const {value,name} = e.target;

       this.setState({
           [name]:value
       });
    }

    addPoll = () => {
        const {topic,about} = this.state;

        fetch('http://localhost:3000/api/create-report',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({"data":{topic,about}})
        }).then(res=>res.json())
        .then((json)=>{
            alert(json.message || json.type);
            history.push('/');
        });
    }

    render() {
        return (
            <div className="create-poll">
                <h1>Create Voting Poll</h1>
                <div><Link id="single-link" to='/'>Home</Link></div>
                <br />
                <FormGroup>
                    <FormControl
                        input='text'
                        placeholder='Topic'
                        value={this.state.topic}
                        name='topic'
                        onChange={(e) => this.updateInput(e)}
                    />
                </FormGroup>
                <FormGroup>
                    <FormControl
                        input='text'
                        placeholder='about'
                        name='about'
                        value={this.state.about}
                        onChange={(e) => this.updateInput(e)}
                    />
                </FormGroup>
                <div>
                    <Button
                        onClick={this.addPoll}
                        size="lg"
                    >
                        Submit
                    </Button>
                </div>
            </div>
        );
    }
}

export default CreatePoll;