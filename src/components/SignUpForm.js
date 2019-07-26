import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import fire from '../config/firebaseConfig';
import {Button} from 'semantic-ui-react';

class SignUpForm extends Component {
    constructor() {
        super();

        this.state = {
            email: '',
            password: '',
            name: '',
            usn:'',
            sem:'',
            sec:'',
            loading:false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        let target = e.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        let name = target.name;

        this.setState({
          [name]: value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log(this.state)
        this.setState({loading:true})
        fire.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(()=>{
          fire.database().ref(`users/${fire.auth().currentUser.uid}`).set(
            {
              fullName: this.state.name,
              email: this.state.email,
              usn:this.state.usn,
              sem: this.state.sem,
              sec: this.state.sec,
              usn: this.state.usn
            },()=>{
              fire.database().ref(`internships/students/${fire.auth().currentUser.uid}`).set(
                {
                  fullName: this.state.name,
                  email: this.state.email,
                  usn:this.state.usn,
                  sem: this.state.sem,
                  sec: this.state.sec,
                  usn: this.state.usn,
                  doingInternship:false,
                  notifications:[{internshipid:"Admin",notifText:"Welcome to Internship Portal"}]
                },()=>{
                  this.props.history.push('/projects/');
                }
              )
            }
          )
        }
        )
    }

    loadButton()
    {
      if(this.state.loading)
      {
        return <Button loading>Loading</Button>
      }
      else
      {
       return <div className="FormField">
                  <button className="FormField__Button mr-20">Sign Up</button>
              </div>
      }
    }


    render() {
        return (
        <div className="FormCenter">
            <form onSubmit={this.handleSubmit} className="FormFields">
              <div className="FormField">
                <label className="FormField__Label" htmlFor="name">Full Name</label>
                <input type="text" id="name" className="FormField__Input" placeholder="Enter your full name" name="name" value={this.state.name} onChange={this.handleChange} />
              </div>
              <div className="FormField">
                <label className="FormField__Label" htmlFor="email">E-Mail Address</label>
                <input type="email" id="email" className="FormField__Input" placeholder="Enter your email" name="email" value={this.state.email} onChange={this.handleChange} />
              </div>
              <div className="FormField">
                <label className="FormField__Label" htmlFor="password">Password</label>
                <input type="password" id="password" className="FormField__Input" placeholder="Enter your password" name="password" value={this.state.password} onChange={this.handleChange} />
              </div>
              <div className="FormField">
                <label className="FormField__Label" htmlFor="usn">USN</label>
                <input type="text" id="usn" className="FormField__Input" placeholder="Enter your USN" name="usn" value={this.state.usn} onChange={this.handleChange} />
              </div>
              <div className="FormField">
                <label className="FormField__Label" htmlFor="sem">Semester</label>
                <input type="text" id="sem" className="FormField__Input" placeholder="Enter your Semester" name="sem" value={this.state.sem} onChange={this.handleChange} />
              </div>
              <div className="FormField">
                <label className="FormField__Label" htmlFor="sec">Section</label>
                <input type="text" id="sec" className="FormField__Input" placeholder="Enter your Section" name="sec" value={this.state.sec} onChange={this.handleChange} />
              </div>

              {this.loadButton()}
            
            </form>
          </div>
        );
    }
}
export default SignUpForm;