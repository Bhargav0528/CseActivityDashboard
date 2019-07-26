import React from 'react';
import {Link} from 'react-router-dom';
import './adminDashboard.css';
import firebase from '../config/firebaseConfig';

class Header extends React.Component{
	constructor(){
		super();
		this.openSideBar=this.openSideBar.bind(this);
	}
	openSideBar(){
		document.getElementById("sidebar").style.display="block";
		document.getElementById("sidebar").style.visibility="visible";
	}
	render(){
		return(
		<div className="header">
		<button className="sidebar" onClick={this.openSideBar}><img src="menu-icon.png" className="sidebar" alt="Menu"/></button><Link to="/admindashboard"><img className="icon" src='icon.png' alt="Logo"/><span className="header1">{this.props.pageTitle}</span></Link>
		<button className="login">{this.props.userName}</button>
		</div>
	);}
}

class MinitestDemo extends React.Component{
	//Requires student usn to be checked with database for enrollment and then stored accordingly, also check testEnable
	render(){
		return(<div>
		<MiniTest internship="internship1"/>
		</div>
		);
	}
}
class MiniTest extends React.Component{
	constructor(){
		super();
		this.state = {
		  q:[]
	  }
		this.loadQuestions=this.loadQuestions.bind(this);
		this.submitTest=this.submitTest.bind(this);	
		this.changedState=this.changedState.bind(this);
	}
	submitTest(){
		document.getElementById("submitbtn").disabled="disabled";
		document.getElementById("submitbtn").style.backgroundColor="darkgray";
		let score=0,totalscore=0;
		for(var i in this.state){
			if(i=="q"){}
			else{
				let tmp2=this.state.q[i].answer-1;
				let tmp1=this.state.q[i].answers[tmp2];
				if(tmp1==this.state[i]){
					score+=1;
				}
			}
		}
		totalscore=this.state.q.length;
		let percent=(score/totalscore)*100;
		firebase.database().ref("internships/internship/"+this.props.internship+"/minitestscores").once("value").then(function(snapshot){
			let tmp;
			if(snapshot.val()==null){	tmp=[];		}
			else{	tmp=snapshot.val();}
			tmp.push({usn:"1DS16CS000",marks:percent});
			firebase.database().ref("internships/internship/"+this.props.internship).update({minitestscores:tmp}).then(function(){
				document.getElementById("questions").innerHTML="<h1 class='scoreHeader'>Score:"+score+"/"+totalscore+"</h1><br/>";
				document.getElementById("submitbtn").style.display="none";
			});
		});	
	}
	changedState(e){
	  this.setState({
		[e.target.name]: e.target.value
	});	
	}
	loadQuestions(isnapshot,msnapshot){
		let minitests=msnapshot.val();
		let mids=isnapshot.val().minitest;
		let q1=[];
		for(var i in minitests){
			var tmp=minitests[i].questions;
			for(var j in tmp){
				q1.push(tmp[j]);
			}
		}
		this.setState({q:q1});
	}
	componentDidMount(){
		let tmp=this.loadQuestions;
		firebase.database().ref("internships/internship/"+this.props.internship).once("value").then(function(snapshot){
			firebase.database().ref("internships/minitests").once("value").then(function(s){
				tmp(snapshot,s);
			});
		});
	}
	render(){
		return(
		<div>
		<Header pageTitle="Test" userName="Sample Username" linkto={false}/>
		<div className="questions" id="questions">
		<ul className="questions">
		{this.state.q.map((item,index) =>{
			return(
			<li key={index}>
			<div className="questionFilled">
			<b>{item.question}</b><br/>
			<p><input type="radio" name={index} value={item.answers[0]}onChange={this.changedState}/> {item.answers[0]}<br/><input type="radio" name={index} value={item.answers[1]} onChange={this.changedState}/> {item.answers[1]}<br/><input type="radio" name={index} value={item.answers[2]} onChange={this.changedState}/> {item.answers[2]}<br/><input type="radio" name={index} value={item.answers[3]} onChange={this.changedState}/> {item.answers[3]}</p>
			</div>
		</li>);
		})}
		</ul>
		</div>
		<button className="btn" id="submitbtn" onClick={this.submitTest}>End Test</button>
		</div>
		);
	}
}
export default MinitestDemo;