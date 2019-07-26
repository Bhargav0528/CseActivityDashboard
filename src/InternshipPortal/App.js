import React from 'react';
import logo from './logo.svg';
import firebase,{auth,provider} from './firebase.js';

class App extends React.Component{
	constructor(){
		super();
		this.state={
		user:null};
		this.loginStudent=this.loginStudent.bind(this);
		this.loginAdmin=this.loginAdmin.bind(this);
	}
	loginStudent(){
		window.location.href="/studentdashboard";
	}
	loginAdmin(){
		window.location.href="/admindashboard";
	}
	render(){
		console.log(this.state.user);
		return(
		<div>
		<h1 className="warning">WARNING!</h1><p className="warning">This site is under development and security measures are disabled.<br/>Do not leave any personal details on this site.</p>
		<br/><br/>
		<button onClick={this.loginStudent}>Login as Student</button><br/>
		<button onClick={this.loginAdmin}>Login as Admin</button>
		<br/><br/>
		<p><b>To the team working on this:</b> If you find anything missing let me know</p>
		</div>
		);
	}
}

export default App;
