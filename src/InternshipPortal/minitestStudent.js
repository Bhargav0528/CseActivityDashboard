import React from 'react';
import {Link} from 'react-router-dom';
import './adminDashboard.css';
import firebase from '../config/firebase.js';



class MinitestConduct extends React.Component{
	constructor(){
		super();
		this.state={
			iid:""
		};
		this.setInternshipForTest=this.setInternshipForTest.bind(this);
	}
	setInternshipForTest(t){
		this.setState({iid:t});
	}
	componentDidMount(){
		//let uid1=firebase.auth().currentUser.uid;
		let uid1="u3"; //Remove after integration
		let sift=this.setInternshipForTest;
		firebase.database().ref("internships/students/"+uid1+"/notifications").once("value").then(function(snapshot){
			let tmp=snapshot.val();
			let testid="";
			for(var i in tmp){
				if(tmp[i].type){
				if(tmp[i].type=='minitest'){
					testid=tmp[i].internshipid;
				}
			}}
			if(testid==""){}
			else{
				sift(testid);
			}
		});
	}
	render(){
		return(
		<div>{this.state.iid?<MiniTest internship={this.state.iid}/>:""}</div>
		);
	}
}
class MiniTest extends React.Component{
	constructor(){
		super();
		this.state = {
		  q:[]
	  };
		this.loadQuestions=this.loadQuestions.bind(this);
		this.submitTest=this.submitTest.bind(this);	
		this.changedState=this.changedState.bind(this);
	}
	submitTest(){
		//let uid1=firebase.auth().currentUser.uid;
		let uid1="u3"; //Remove after integration
		let iid=this.props.internship;
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
		firebase.database().ref("internships/internship/"+iid+"/minitestscores").once("value").then(function(snapshot){
			let tmp=snapshot.val();
			for(var i in tmp){
				if(tmp[i].uid==uid1){
					tmp[i].marks=percent;
				}
			}
			firebase.database().ref("internships/internship/"+iid).update({minitestscores:tmp}).then(function(){
				document.getElementById("questions").innerHTML="<h1 class='scoreHeader'>Score:"+score+"/"+totalscore+"</h1><br/><p>Please wait while we save your score, you will be redirected automatically.</p>";
				document.getElementById("submitbtn").style.display="none";
				setTimeout(function(){window.location.href="/studentdashboard"},10000);
			});
		});	
	}
	changedState(e){
	  this.setState({
		[e.target.name]: e.target.value
	});	
	}
	loadQuestions(isnapshot,msnapshot,uid){
		let minitests=msnapshot.val();
		let u=uid;
		let allow=false;
		let mids=isnapshot.val().minitest;
		let mt=[];
		if(isnapshot.val().testEnable){
			for(var j in isnapshot.val().minitestscores){
				if(isnapshot.val().minitestscores[j].uid==u){
					if(isnapshot.val().minitestscores[j].marks==-1){
						allow=true;
					}
				}
		}}
		for(var i in mids){
			let tmp=minitests[mids[i]];
			for(var j=0;j<tmp.questions.length;j++){
				mt.push(tmp.questions[j]);
			}
		}
		if(allow){
		this.setState({q:mt});
		}
		else{
			setTimeout(function(){window.location.href="/studentdashboard";},1000);
		}
	}
	componentDidMount(){
		//let uid1=firebase.auth().currentUser.uid;
		let uid1="u3"; //Remove after integration
		let tmp=this.loadQuestions;
		console.log(this.props.internship);
		if(this.props.internship){
		firebase.database().ref("internships/internship/"+this.props.internship).once("value").then(function(snapshot){
			firebase.database().ref("internships/minitests").once("value").then(function(s){
				tmp(snapshot,s,uid1);
			});
		});}
	}
	render(){
		return(
		<div>
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
export default MinitestConduct;
