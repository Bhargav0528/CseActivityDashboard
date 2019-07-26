import React, { Component } from 'react';
import './feedbackForm.css';
import firebase from './firebase.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentItem: '',
      username: '',
      comment: '',
      usn: '',
      items: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    const itemsRef = firebase.database().ref('internships/internship/feedback');
    const item = {
      usn: this.state.usn,
      content: this.state.comment,
      email: this.state.currentItem,
      user: this.state.username
    }
    itemsRef.push(item);
    this.setState({
      usn: '',
      comment: '',
      currentItem: '',
      username: ''
    });
  }
  
  componentDidMount() {
    const itemsRef = firebase.database().ref('internships/internship/feedback');
    itemsRef.on('value', (snapshot) => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          id: item,
          email: items[item].email,
          content: items[item].comment,
          user: items[item].user
          
        });
      }
      this.setState({
        items: newState
      });
    });
  }

  
  
  render() {
    return (
      <div className="container">
        <div className="imagebg"></div>
      <div className="col-md-6 col-md-offset-3 form-container">
      <h1 id="font">Feedback</h1>
      <p> Please provide your feedback below: </p>
      <form method="post" id="reused_form" onSubmit={this.handleSubmit}>
    <div className="row">
      <div className="col-sm-12 form-group">
      <label htmlFor="content" ><h3> Comments:</h3></label>
      
      
      <textarea type="textarea" name="comment" id="h2" placeholder="Your Comments" maxLength="6000" rows="7" onChange={this.handleChange} value={this.state.comment} required ></textarea>
      </div>
      </div>
      <br></br>
      <div className="row">
      <div className="col-sm-6 form-group">
      <label htmlFor="user"> Your Name:</label>
      <br></br>
      <textarea type="textarea" id="h4" name="username" onChange={this.handleChange} value={this.state.username} required ></textarea>
      </div>
      <br></br>
      <div className="col-sm-6 form-group">
      <label htmlFor="email"> Email:</label>
      <br></br>
      <textarea type="textarea" id="h5" name="currentItem" onChange={this.handleChange} value={this.state.currentItem} required ></textarea>
      </div>
      </div>
      <br></br>
      <div className="col-sm-6 form-group">
      <label htmlFor="user"> USN:</label>
      <br></br>
      <textarea type="textarea" id="h6" name="usn" onChange={this.handleChange} value={this.state.usn} required ></textarea>
      </div>
      <div className="row">
      <div className="col-sm-12 form-group">
      <button type="submit" id="h1" ><span>Submit </span></button>

      </div>
      </div>
        </form> 
       
      </div>
      </div>
    );
  }
}
export {App as FeedbackForm};