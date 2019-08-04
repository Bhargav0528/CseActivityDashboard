import React from 'react';
import {Link} from 'react-router-dom';
import './adminDashboard.css';
import firebase from '../config/firebaseConfig.js';
import Select from 'react-select';
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";


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
		<button className="sidebar" onClick={this.openSideBar}><img src="menu-icon.png" className="sidebar" alt="Menu"/></button><Link to="/admindashboard"><img className="icon" src="https://img.collegepravesh.com/2018/10/DSI-Bangalore-Logo.png" alt="Logo"/><span className="header">{this.props.pageTitle}</span></Link>
		</div>
	);}
}

class ActionsDiv extends React.Component{
	constructor(){
		super();
		this.contactFirebase = this.contactFirebase.bind(this);
		this.gotoApplications=this.gotoApplications.bind(this);
		this.gotoOngoing=this.gotoOngoing.bind(this);
		this.gotoNewInternship=this.gotoNewInternship.bind(this);
		this.gotoNewInternshipLink=this.gotoNewInternshipLink.bind(this);
		this.gotoCompletedInternship=this.gotoCompletedInternship.bind(this);
		this.gotoOpenInternship=this.gotoOpenInternship.bind(this);
		this.gotoSendNotification=this.gotoSendNotification.bind(this);
	}
	static defaultProps = { onGoingLoc:"/admindashboard#ongoing", applicationsLoc:"/admindashboard#toselect", newInternshipLoc:"/newInternship", miniTestLoc:"/createminitest"}
	contactFirebase(){
		firebase.database().ref('/.info/serverTimeOffset')
  .once('value')
  .then(function stv(data) {
	  let dt=new Date(data.val() + Date.now());
    console.log(dt,data.val(),Date.now());
  }, function (err) {
    return err;
  });
	}
	gotoOngoing(){				window.location.href=this.props.onGoingLoc;	}
	gotoApplications(){			window.location.href=this.props.applicationsLoc;	}
	gotoNewInternship(){		window.location.href=this.props.newInternshipLoc;	}
	gotoNewInternshipLink(){	window.location.href="/newinternshiplink";	}
	gotoCompletedInternship(){	window.location.href="/completedinternship"; 	}
	gotoOpenInternship(){		window.location.href="/openinternship";		}
	gotoSendNotification(){	window.location.href="/sendnotification";	}
	render(){
		return(
		<div className="actionsdiv">
		<h3 className="actionsdiv">Actions</h3>
		<button className="actionsdiv1" onClick={this.gotoApplications}>Manage Applications</button>
		<button className="actionsdiv1" onClick={this.gotoOngoing}>Manage Ongoing Internships</button>
		<button className="actionsdiv" onClick={this.gotoNewInternship}>New Internship</button>
		<button className="actionsdiv" onClick={this.gotoNewInternshipLink}>New Internship Link</button>
		<button className="actionsdiv" onClick={this.gotoOpenInternship}>Manage Open Internships</button>
		<button className="actionsdiv" onClick={this.gotoCompletedInternship}>Manage Ended Internships</button>
		<Link to={this.props.miniTestLoc}><button className="actionsdiv">New Mini Test</button></Link>
		<button className="actionsdiv" onClick={this.gotoSendNotification}>Send Notification</button>
		</div>
		);
	}
}

class MainPage extends React.Component{
	constructor(){
		super();
		this.state={
			internship:"",
			type:"",
			userValid:false,
			internshipdata:null,
			userdata:null,
			studentdata:null,
			loaded:false
		}
		this.closeSideBar=this.closeSideBar.bind(this);
		this.setInternshipId=this.setInternshipId.bind(this);
		this.getState=this.getState.bind(this);
		this.setStateMethod=this.setStateMethod.bind(this);
	}

	closeSideBar(){
		document.getElementById("sidebar").style.visibility="hidden";
		document.getElementById("sidebar").style.display="none";
	}
	setInternshipId(id1,type){
		let newState=Object.assign({},this.state);
		newState.internship=id1;
		newState.type=type;
		this.setState(newState);
	}
	getState(){
		return this.state;
	}
	setStateMethod(st){
		this.setState(st);
	}
	componentDidMount(){
		let newState=new Object();
		let updateState=this.setStateMethod;
		newState.internship=null;
		newState.type="";
		/*let uid=firebase.auth().currentUser.uid;
		firebase.database().ref("users/"+uid+"/teacher").once("value").then(function(snapshot){
			if(snapshot.val()){ newState.userValid=true; }
		});*/
		newState.userValid=true; //Remove after integration
		firebase.database().ref("internships/students").once("value").then(function(s){
			newState.studentdata=s.val();
			firebase.database().ref("internships/internship").once("value").then(function(s1){
			newState.internshipdata=s1.val();
			firebase.database().ref("users").once("value").then(function(s2){
			newState.userdata=s2.val();
			newState.loaded=true;
			updateState(newState);
		});
		});
		});
		this.setState(newState);
	}

	render(){
		console.log(this.state);
		return(
		<div className="mainPageInternshipPortal">
		{this.state.userValid?<div>
		<Header pageTitle="Admin Dashboard" linkto={true}/>
		<div className="sidebar" id="sidebar">
		<button className="sidebarclose" onClick={this.closeSideBar}>&times;</button>
		<ActionsDiv onGoingLoc="/admindashboard#ongoing" applicationsLoc="/admindashboard#toselect"/>
		</div>
		<div className="actiondiv">
		<ActionsDiv/></div>
		{this.state.loaded?<div>
			{this.state.internship?
			<Internship getStateMethod={this.getState} setInternshipIdMethod={this.setInternshipId}/>:""}
		<InternshipApplications getStateMethod={this.getState} setInternshipIdMethod={this.setInternshipId} setStateMethod={this.setStateMethod}/><OngoingInternships getStateMethod={this.getState} setInternshipIdMethod={this.setInternshipId} setStateMethod={this.setStateMethod}/>
		<div className="popup" id="popup"></div></div>:<div><br/><br/><h1>Loading</h1></div>}
		</div>:<div><p className="unauthorisedAccess">Access Denied</p><span className="unauthorisedAccess">You are not allowed access to this page. If you are supposed to be able to access this page, try logging in again.</span></div>}
		</div>
		);
	}
}

class InternshipApplications extends React.Component{
	constructor(){
		super();
		this.state={
			internships:[]
		}
		this.gotoInternship=this.gotoInternship.bind(this);
		this.stopProp=this.stopProp.bind(this);
		this.animateProgress=this.animateProgress.bind(this);
	}
	animateProgress(){
		let newState=this.state.internships;
		for(var i=0;i<newState.length;i++){
			if(newState[i].progress>=10){
				newState[i].progress=newState[i].progress+20;
			}
			else if(newState[i].progress==1){
				newState[i].progress=20;
			}
		}
		this.setState({internships:newState});
	}
	gotoInternship(id1){
		let tmp=this.props.setInternshipIdMethod;
		tmp(id1,"application");
	}
	stopProp(e){
		e.stopPropagation();
	}
	componentDidMount(){
		let dt=new Date();
		dt=dt.valueOf();
		let getStateMethod=this.props.getStateMethod;
		let t=getStateMethod();
		let newState=Object.assign({},t);
		newState.internships=[];
		for(var i in newState.internshipdata){
			if(newState.internshipdata[i].applicationdt<=dt && newState.internshipdata[i].startdt>dt && newState.internshipdata[i].isComplete==false){
				let item=newState.internshipdata[i];
				item.duration=(item.duration%7==0)?((item.duration/7)+" week(s)"):((item.duration/30)+" month(s)");
				item.appliedcount=(item.applied?item.applied.length:0);
				item.id=i;
				let tmp=0;
				if(item.progress==1)		tmp=1;
				else if(item.progress==2)	tmp=20;
				else if(item.progress==3)	tmp=40;
				else if(item.progress==4)	tmp=80;
				else if(item.progress==5)	tmp=80;
				else						tmp=0;
				item.progress=tmp;
				let dt1=new Date(item.startdt);
				item.startdt=dt1.getDate()+"/"+(dt1.getMonth()+1)+"/"+dt1.getFullYear();
				newState.internships.push(item);
			}
		}
		this.setState(newState);
		let animateProgress=this.animateProgress;
		setTimeout(function(){
			animateProgress();
		},1000);
	}
	render(){
		return(
		<div className="closedDiv" id="toselect">
		<h3 className="closedDiv">Internship Applications</h3>
		{this.state.internships.map((item) =>{
			return(
			<div key={item.id} className="internship" onClick={()=>{this.gotoInternship(item.id)}}>
			<h3 className="internship">{item.title}</h3>
			<p className="internshipCompany">{item.companyName}</p>
			<p className="internship"><span className="internship">No. of students applied: {item.appliedcount}</span><span className="internship">Duration: {item.duration}</span><span className="internship">Starts On: {item.startdt}</span></p>
			<a href={"tel:"+item.companyPhone} onClick={this.stopProp}><button className="internship">Call Company</button></a>
			<a href={"mailto:"+item.companyMail} onClick={this.stopProp}><button className="internship">Email Company</button></a>
			<h3 className="internshipStatus">Status: </h3>
			<div className="internshipStatus">
			<ProgressBar percent={item.progress}  filledBackground="linear-gradient(90deg,yellow,green)">
				<Step transition="scale">
				  {({ accomplished }) => (
					<img style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}  width="20" src="circle.png"/>
				  )}
				</Step>
				<Step transition="scale">
				  {({ accomplished }) => (
					<img style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}  width="20" src="circle.png"/>
				  )}
				</Step>
				<Step transition="scale">
				  {({ accomplished }) => (
					<img style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}  width="20" src="circle.png"/>
				  )}
				</Step>
				<Step transition="scale">
				  {({ accomplished }) => (
					<img style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}  width="20" src="circle.png"/>
				  )}
				</Step>
				<Step transition="scale">
				  {({ accomplished }) => (
					<img style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}  width="20" src="circle.png"/>
				  )}
				</Step>
				<Step transition="scale">
				  {({ accomplished }) => (
					<img style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}  width="20" src="circle.png"/>
				  )}
				</Step>
		</ProgressBar>
		</div>
			</div>);
		})}
		</div>
		);
	}	
}

class OngoingInternships extends React.Component{
	constructor(){
		super();
		this.state={
			internships:[]
		}
		this.gotoInternship=this.gotoInternship.bind(this);
		this.stopProp=this.stopProp.bind(this);
	}
	gotoInternship(id1){
		let tmp=this.props.setInternshipIdMethod;
		tmp(id1,"ongoing");
	}
	stopProp(e){
		e.stopPropagation();
	}
	componentDidMount(){
		let dt=new Date();
		dt=dt.valueOf();
		let getStateMethod=this.props.getStateMethod;
		let t=getStateMethod();
		let newState=Object.assign({},t);
		newState.internships=[];
		for(var i in newState.internshipdata){
			if(newState.internshipdata[i].applicationdt<dt && newState.internshipdata[i].startdt<=dt && newState.internshipdata[i].isComplete==false){
				let item=newState.internshipdata[i];
				let days=item.duration;
				item.duration=(item.duration%7==0)?((item.duration/7)+" week(s)"):((item.duration/30)+" month(s)");
				item.appliedcount=(item.applied?item.applied.length:0);
				item.id=i;
				let tmp=((Date.now()-item.startdt)/(days*86400000))*100;
				item.progress=tmp;
				let dt1=new Date(item.startdt);
				item.startdt=dt1.getDate()+"/"+(dt1.getMonth()+1)+"/"+dt1.getFullYear();
				newState.internships.push(item);
			}
		}
		this.setState(newState);
	}
	render(){
		return(
		<div className="closedDiv" id="ongoing">
		<h3 className="closedDiv">Ongoing Internships</h3>
		{this.state.internships.map((item) =>{
			return(
			<div key={item.id} className="internship" onClick={()=>{this.gotoInternship(item.id)}}>
			<h3 className="internship">{item.title}</h3>
			<p className="internshipCompany">{item.companyName}</p>
			<p className="internship"><span className="internship">No. of students applied: {item.appliedcount}</span><span className="internship">Duration: {item.duration}</span><span className="internship">Started On: {item.startdt}</span></p>
			<a href={"tel:"+item.companyPhone} onClick={this.stopProp}><button className="internship">Call Company</button></a>
			<a href={"mailto:"+item.companyMail} onClick={this.stopProp}><button className="internship">Email Company</button></a>
			<h3 className="internshipStatus">Status: </h3>
			<div className="internshipStatus">
			<ProgressBar percent={item.progress}  filledBackground="linear-gradient(90deg,yellow,green)">
			<Step transition="scale">
				  {({ accomplished }) => (
					<img style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}  width="20" src="circle.png"/>
				  )}
				</Step>
				<Step transition="scale">
				  {({ accomplished }) => (
					<img style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}  width="20" src="circle.png"/>
				  )}
				</Step>
			</ProgressBar>
		</div>
			</div>);
		})}
		</div>
		);
	}
	
}

class Internship extends React.Component{
	constructor(){
		super();
		this.state={
			skillSet:[],
			approved:false,
			feedback:[],
			isComplete:false,
			members:[],
			minitest:[],
			minitestscores:[],
			shortlisted:[],
			stipend:0,
			minitests:[],
			loading:false,
			remarks:""
		}
		this.clearInternship=this.clearInternship.bind(this);
		this.approveInternship=this.approveInternship.bind(this);
		this.getInternshipState=this.getInternshipState.bind(this);
		this.deleteInternship=this.deleteInternship.bind(this);
		this.updateRemarks=this.updateRemarks.bind(this);
		this.changedState=this.changedState.bind(this);
		this.markInternshipComplete=this.markInternshipComplete.bind(this);
	}
	changedState(e){
	  this.setState({
		[e.target.name]: e.target.value
	});	
	}
	clearInternship(){
		if(this.state.type=="application" || this.state.type=="ongoing"){
			document.getElementById("toselect").style.display="block";
			document.getElementById("ongoing").style.display="block";
		}
		else if(this.state.type=="open"){
			document.getElementById("open").style.display="block";
		}
		else if(this.state.type=="completed"){
			document.getElementById("completed").style.display="block";
		}
		let clearMethod=this.props.setInternshipIdMethod;
		clearMethod("","");
	}
	deleteInternship(){
		let ans=window.confirm("Do you want to delete this Internship?","");
		let ans2=false;
		if(ans){
			ans2=window.confirm("Are you sure, this cannot be undone, all students will be unenrolled","");
			if(ans2){
				firebase.database().ref("internships/internship/"+this.state.id).set({}).then(function(){window.location.href="/admindashboard";});
			}
			else{ return; }
		}
		else{
			return;
		}
	}
	componentDidMount(){
		document.getElementById("internshipBody").style.display="block";
		let tmp=this.props.getStateMethod;
		let temp=tmp();
		let stateCopy=Object.assign({},temp);
		let internship=stateCopy.internshipdata[stateCopy.internship];
		internship.type=stateCopy.type;
		internship.id=stateCopy.internship;
		internship.appliedLength=0;
		if(internship.applied){	internship.appliedLength=internship.applied.length;		}
		let dt=new Date(internship.applicationdt);
		internship.applicationdt1=dt.getDate()+"/"+(dt.getMonth()+1)+"/"+dt.getFullYear();
		if(internship.type=="application" || internship.type=="ongoing"){
			document.getElementById("toselect").style.display="none";
			document.getElementById("ongoing").style.display="none";
		}
		else if(internship.type=="open"){
			document.getElementById("open").style.display="none";
		}
		else if(internship.type=="completed"){
			document.getElementById("completed").style.display="none";
		}
		internship.internshipdata=stateCopy.internshipdata;
		internship.userdata=stateCopy.userdata;
		internship.studentdata=stateCopy.studentdata;
		internship.userValid=stateCopy.userValid;
		let appliedUserdata=[];
		if(internship.applied){
		for(var i in internship.studentdata){
			if(internship.applied.includes(i)){
				let m=-1;
				for(var j=0;j<internship.minitestscores.length;j++){
					if(internship.minitestscores[j].uid==i){
						m=internship.minitestscores[j].marks;
					}
				}
				let item={email:internship.studentdata[i].email,
				name:internship.studentdata[i].fullName,
				sem:internship.studentdata[i].sem,
				sec:internship.studentdata[i].sec,
				usn:internship.studentdata[i].usn,
				skills:internship.studentdata[i].skills,
				uid:i,
				phone:internship.studentdata[i].phone,
				resumeloc:internship.studentdata[i].resume,
				marks:m,
				shortlisted:true
			};
			appliedUserdata.push(item);
		}}}
		internship.appliedUserData=appliedUserdata;
		if(internship.remarks==" "){internship.remarks=""; }
		internship.loading=true;
		this.setState(internship);
	}
	approveInternship(){
		let tmp=this.state.id;
		firebase.database().ref("internships/internship/"+tmp).update({approved:true});
		this.setState({approved:true});
	}
	getInternshipState(){
		let st=this.state;
		return st;
	}
	updateRemarks(){
		firebase.database().ref("internships/internship/"+this.state.id+"/remarks").set(this.state.remarks);
	}
	markInternshipComplete(){
		let ans=window.confirm("Do you want to mark this internship as completed?");
		if(ans){
			firebase.database().ref("internships/internship/"+this.state.id+"/isComplete").set(true).then(function(){
				window.location.href="/admindashboard";
			});
		}
	}
	render(){
		console.log(this.state);
		return(
		<div className="internship1" id="internshipBody">
		<button onClick={this.clearInternship} className="internship1">&times;</button>
		<h3 className="internship1">{this.state.title}</h3>
		<h4 className="internship1">{this.state.companyName}</h4>
		{(this.state.approved)?<span className="statusText">Approved</span>:<button className="statusText" onClick={this.approveInternship}>Approve</button>}
		<p className="internship1"><b>Internship Description: </b> {this.state.description}</p>
		<b className="internship1">Skills Required: </b>
		<ul className="internship1">
		{((this.state.skillSet)?(this.state.skillSet.map((item,index)=>{
			return(<li key={index}>{item}</li>);
		})):"None")}</ul>
		<table className="internship1"><tbody>
		<tr><td><b>Work Hours: </b> {((this.state.workCategory=="full-time")?"Full Time":((this.state.workCategory=="part-time")?"Part Time":"Work From Home"))} - {((this.state.workTimings!="-")?(this.state.workTimings):"Timings Not Mentioned")}</td>
		<td><b>Stipend:</b> {this.state.stipend}</td><td><b>No. of Students Applied: </b>{this.state.appliedLength}</td></tr>
		<tr><td><b>Start Date: </b>{this.state.startdt}</td>
		<td><b>Last Date to apply: </b>{this.state.applicationdt1}</td><td><b>Duration:</b> {this.state.duration}</td></tr></tbody></table>
		{this.state.applied?
		<div><b>Applied Students:</b><table className="internship1StudentApplied"><tbody>
		<tr className="internship1StudentApplied"><th>USN</th><th>Name</th><th>Sem &amp; Sec</th><th>Email</th><th>Phone</th></tr>
		{this.state.appliedUserData.map((item,index)=>{
			return(<tr key={index} className="internship1StudentApplied">
			<td>{item.usn}</td>
			<td>{item.name}</td>
			<td>{item.sem} {item.sec}</td>
			<td><a className="internship1StudentApplied" href={"mailto:"+item.email}>{item.email}</a></td>
			<td><a className="internship1StudentApplied" href={"tel:"+item.phone}>{item.phone}</a></td>
			</tr>);
		})}</tbody></table></div>:""}
		{(this.state.type=="completed" || this.state.type=="open")?"":(<p className="internship1"><b>Status: </b>{this.state.progress==0 && this.state.type=="application"?"Applications Closed":(this.state.progress==1?"Test Taken":(this.state.progress==2?"Shortlist Sent":(this.state.progress==3?"Students Finalised":(this.state.progress==4?"Undertaking Signed":"Ready to Start"))))}</p>)}
		{(this.state.type!="open" && this.state.type!="application")?<div><b>Progress Remarks:</b><br/><textarea name="remarks" onChange={this.changedState} value={this.state.remarks} className="remarks"></textarea><br/><button className="remarks" onClick={this.updateRemarks}>Update</button></div>:""}
		<a href={"tel:"+this.state.companyPhone}><button className="btn">Call Company</button></a><a href={"mailto:"+this.state.companyMail}><button className="btn">Email Company</button></a><button className="btn" onClick={this.deleteInternship}>Delete Internship</button>
		{this.state.type=="ongoing"?<button className="btn" onClick={this.markInternshipComplete}>Internship Completed</button>:""}
		{(this.state.type!="open" && this.state.loading)?<div><InternshipMiniTest getStateMethod={this.getInternshipState}/><InternshipShortlist getStateMethod={this.getInternshipState}/><InternshipUndertaking getStateMethod={this.getInternshipState}/></div>:""}
		</div>
		);
	}
}

class InternshipMiniTest extends React.Component{
	constructor(){
		super();
		this.state={};
		this.shortlistCutoffApply=this.shortlistCutoffApply.bind(this);
		this.removeShortlist=this.removeShortlist.bind(this);
		this.applyShortlist=this.applyShortlist.bind(this);
		this.resetShortlist=this.resetShortlist.bind(this);
		this.toggleTest=this.toggleTest.bind(this);
		this.sendMiniTestNotif=this.sendMiniTestNotif.bind(this);
		this.completeMinitestNotif=this.completeMinitestNotif.bind(this);
	}
	toggleTest(){
		if(!(this.state.testEnable)){
			let ans=window.prompt("Set time limit in minutes for the test (0 for none):","");
			if(ans!=""){
				ans=parseInt(ans);
				if(ans==0 || isNaN(ans)){}
				else{
					console.log(ans);
					firebase.database().ref("internships/internship/"+this.state.id+"/testDuration").set(ans);
				}
			}
		firebase.database().ref("internships/internship/"+this.state.id).update({testEnable:true}).then(function(){
			document.getElementById("testtoggle").classList="btn1";;
		});}
		else{
			firebase.database().ref("internships/internship/"+this.state.id).update({testEnable:false}).then(function(){
			document.getElementById("testtoggle").classList="btn";});
		}
		if(this.state.progress<=20){
		firebase.database().ref("internships/internship/"+this.state.id+"/progress").set(1);
		this.setState({progress:20});}
		this.setState({testEnable:!(this.state.testEnable)});
	}
	sendMiniTestNotif(){
		let str="Test for internship "+this.state.title+" will be held on DATE";
		str+=". You are required to attend the test in the department at TIME.";
		document.getElementById("minitestNotifContent").value=str;
		if(document.getElementById("popupMinitestNotif").style.display=="block"){
		document.getElementById("popupMinitestNotif").style.display="none";}
		else{
		document.getElementById("popupMinitestNotif").style.display="block";}
	}
	completeMinitestNotif(){
		let str="Test for internship "+this.state.title+" will be held on ";
		str+=document.getElementById("minitestNotifDate").value;
		str+=". You are required to attend the test in the department at ";
		str+=document.getElementById("minitestNotifTime").value;
		str+=".";
		document.getElementById("minitestNotifContent").value=str;
		let iid=this.state.id;
		let appliedusers=this.state.appliedUserData;
		for(var i=0;i<appliedusers.length;i++){
			let uid=appliedusers[i].uid;
			firebase.database().ref("internships/students/"+uid+"/notifications").once("value").then(function(snapshot){
				let tmp=snapshot.val();
				if(tmp){
				let item={internshipid:iid,notifText:str, type:"minitest"};
				tmp.push(item);}
				else{
					tmp=[];
					let item={internshipid:iid,notifText:str, type:"minitest"};
				tmp.push(item);}
				firebase.database().ref("internships/students/"+uid+"/notifications").set(tmp);
			});
		}
		document.getElementById("popupMinitestNotif").style.display="none";
	}
	shortlistCutoffApply(){
		document.getElementById("applyMtestShortlistChanges").style.backgroundColor="orange";
		document.getElementById("applyMtestShortlistChanges").style.color="white";
		let cutoff=document.getElementById("cutoff").value;
		let tmp=this.state.appliedUserData;
		for(var i=0;i<tmp.length;i++){
			if(tmp[i].marks<cutoff){
				if(tmp[i].shortlisted){
					tmp[i].shortlisted=false;
				}
			}
		}
		this.setState({appliedUserData:tmp});		
	}
	resetShortlist(){
		document.getElementById("applyMtestShortlistChanges").style.backgroundColor="#006cb4";
		document.getElementById("applyMtestShortlistChanges").style.color="white";
		let tmp=Object.assign({},this.state);
		for(var i=0;i<tmp.appliedUserData.length;i++){
			tmp.appliedUserData[i].shortlisted=true;
		}
		this.setState(tmp);
	}
	removeShortlist(index){
		document.getElementById("applyMtestShortlistChanges").style.backgroundColor="orange";
		document.getElementById("applyMtestShortlistChanges").style.color="white";
		let tmp=this.state.appliedUserData;
		tmp[index].shortlisted=false;
		this.setState({appliedUserData:tmp});
	}
	applyShortlist(){
		let ref=this.props.refreshMethod;
		document.getElementById("applyMtestShortlistChanges").style.backgroundColor="#006cb4";
		document.getElementById("applyMtestShortlistChanges").style.color="white";
		let id=this.state.id;
		let title=this.state.title;
		let shortlist=[];
		let list=this.state.appliedUserData;
		for(var i=0;i<list.length;i++){
			if(list[i].shortlisted){
				shortlist.push(list[i].uid);
			}
		}
		firebase.database().ref("internships/internship/"+id+"/shortlisted").set(shortlist);
		for(var i=0;i<shortlist.length;i++){
			firebase.database().ref("internships/students/"+shortlist[i]+"/notifications").once("value").then(function(s){
				let notifs=s.val();
				let notif={internshipid:id,notifText:"You have been shortlisted for the internship "+title+". You may be contacted for further selection process."};
				notifs.push(notif);
				firebase.database().ref("internships/students/"+shortlist[i]+"/notifications").set(notifs);
			});
		}
	}
	componentDidMount(){
		let method=this.props.getStateMethod;
		let resp=method();
		let newState=Object.assign({},resp);
		this.setState(newState);
	}
	render(){
		return(
		<div>
{this.state.minitest?<div>
		<hr/>
		<h3 className="internship1">Test</h3>
		<b>Scores (%):</b><br/>
		<table className="internship1StudentApplied"><tbody>
		<tr className="internship1StudentApplied"><th>USN</th><th>Name</th><th>Sem & Sec</th><th>Email</th><th>Phone</th><th>Marks (%)</th><th></th></tr>
		{this.state.appliedUserData.map((item,index)=>{return(
			<tr key={index} className="internship1StudentApplied">
			<td>{item.shortlisted?item.usn:<del>{item.usn}</del>}</td>
			<td>{item.shortlisted?item.name:<del>{item.name}</del>}</td>
			<td>{item.shortlisted?item.sem+" "+item.sec:<del>{item.sem+" "+item.sec}</del>}</td>
			<td><a className="internship1StudentApplied" href={"mailto:"+item.email}>{item.email}</a></td>
			<td><a className="internship1StudentApplied" href={"tel:"+item.phone}>{item.phone}</a></td>
			<td>{item.shortlisted?(item.marks==-1?"Not Taken":item.marks):<del>{item.marks==-1?"Not Taken":item.marks}</del>}</td><td><button onClick={()=>{this.removeShortlist(index);}}>&times;</button></td></tr>
		);})}</tbody></table>
		<input type="number" max="100" min="0" placeholder="Cutoff Score" id="cutoff" className="internshipMiniTest"/><button onClick={this.shortlistCutoffApply}>Apply Cutoff</button>
		<button onClick={this.resetShortlist} className="internshipMiniTest">Reset</button>
		<button onClick={this.applyShortlist} id="applyMtestShortlistChanges" className="internshipMiniTest">Apply Changes</button><br/>
		<button className="internshipMiniTest" onClick={this.sendMiniTestNotif}>Call students for test</button>
		<button className={this.state.testEnable?"btn1":"btn"} onClick={this.toggleTest} id="testtoggle">Enable/Disable Test</button>
		<div id="popupMinitestNotif" className="popupMinitestNotif">
		<input type="text" id="minitestNotifContent" placeholder="Notification Text" className="popupMinitestNotif"/>
		<input type="date" id="minitestNotifDate" required="required"/>
		<input type="time" id="minitestNotifTime" required="required"/>
		<button onClick={this.completeMinitestNotif} className="popupMinitestNotif">Send</button><br/><br/>
		</div>	
</div>:""}
		</div>
		);
	}
}

class InternshipShortlist extends React.Component{
	constructor(){
		super();
		this.state={
			shortlisted:[],
			studentdata:{}
		};
		this.updateShortlist=this.updateShortlist.bind(this);
		this.sendShortlist=this.sendShortlist.bind(this);
		this.removeFromShortlist=this.removeFromShortlist.bind(this);
		this.updateResumeLink=this.updateResumeLink.bind(this);
		this.closeOnSend=this.closeOnSend.bind(this);
		this.finaliseShortlist=this.finaliseShortlist.bind(this);
	}
	updateResumeLink(url,i){
		let s=this.state.shortlisted;
		for(var j=0;j<s.length;j++){
			if(s[j].uid==i){
				s[j].resume=url;
			}
		}
		this.setState({shortlisted:s});		
	}
	updateShortlist(val){
		let s=val;
		let shortlistUserdata=[];
		let uresl=this.updateResumeLink;
		for(var i=0;i<s.length;i++){
			let item=this.state.studentdata[s[i]];
			item.uid=s[i];
			shortlistUserdata.push(item);
		}
		this.setState({shortlisted:shortlistUserdata});
		for(var j=0;j<s.length;j++){
			let item=this.state.studentdata[s[j]];
			if(item.resume.startsWith("resumes")){
			firebase.storage().ref(item.resume).getDownloadURL().then(function(url){
				uresl(url,item.uid);
			});	
			}
		}
	}
	componentDidMount(){
		let method=this.props.getStateMethod;
		let resp1=method();
		let resp=Object.assign({},resp1);
		this.setState(resp);
		
		let update=this.updateShortlist;
		firebase.database().ref("internships/internship/"+resp.id+"/shortlisted").once("value").then(function(snapshot){
			if(snapshot.val()!=null){
				update(snapshot.val());
			}
			else{update([]);}
		});		
	}
	componentWillUnmount(){
		firebase.database().ref("internships/internship/"+this.state.id+"/shortlisted").off();
	}
	sendShortlist(){
		document.getElementById("mailText").style.display="block";
		document.getElementById("confirmSend").style.display="block";
		let htmlcontent="<b>To: </b>"+this.state.companyMail+"<br/><b>Subject: </b>DSCE:Internship Shortlist for "+this.state.title+"<br/><br/>Hello, <br/>The following students were shortlisted for the internship "+this.state.title+" posted on the DSCE Internship Portal.<br/>Please go through their skill sets and confirm your requirement for the internship.<br/>Name - Skills - Email<br/>";
		let mailcontent="mailto:"+this.state.companyMail+"?subject=DSCE:Internship%20Shortlist%20for%20"+encodeURIComponent(this.state.title)+"&body=";
		let str="Hello, The following students were shortlisted for the internship '"+this.state.title+"' posted on the DSCE Internship Portal.\nPlease go through their skill sets and confirm your requirement for the internship.\nName - Skills - Email\n";
		for(var i in this.state.shortlisted){
			str+=this.state.shortlisted[i].fullName+" ("+this.state.shortlisted[i].sem+"Sem) - ";
			htmlcontent+=this.state.shortlisted[i].fullName+" ("+this.state.shortlisted[i].sem+"Sem) - ";
			for(var j=0;j<this.state.shortlisted[i].skills.length;j++){
				str+=this.state.shortlisted[i].skills[j]+", ";
				htmlcontent+=this.state.shortlisted[i].skills[j]+", ";
			}
			str+=" - "+this.state.shortlisted[i].email;
			htmlcontent+=" - "+this.state.shortlisted[i].email;
			str+="\n";
			htmlcontent+="<br/>";
		}
		str+="\nFrom, \nDSCE Internship Portal (Auto Generated)";
		htmlcontent+="<br/>From, <br/>DSCE Internship Portal (Auto Generated)";
		mailcontent+=encodeURIComponent(str);
		document.getElementById("mailText").innerHTML=htmlcontent;
		document.getElementById("confirmSend").href=mailcontent;
	}
	closeOnSend(){ 
		document.getElementById("mailText").style.display="none";
		document.getElementById("confirmSend").style.display="none";
		firebase.database().ref("internships/internship/"+this.state.id+"/progress").set(2);
		this.setState({progress:40});
	}
	removeFromShortlist(i){
		let s=this.state.shortlisted;
		let temp;
		if(s.length==1){
			temp=s[0];
			s=[];}
		else{temp=s.pop(i);}
		firebase.database().ref("internships/internship/"+this.state.id+"/shortlisted").set(s);
		this.setState({shortlisted:s});
	}
	finaliseShortlist(){
		if(this.state.finalised && this.state.progress>=60){
			
		}
		else{
			firebase.database().ref("internships/internship/"+this.state.id).update({finalised:true});
			firebase.database().ref("internships/internship/"+this.state.id).update({progress:3});
			let iid=this.state.id;
			let title=this.state.title;
			for(var i=0; i<this.state.shortlisted.length;i++){
				let id=this.state.shortlisted[i].uid;
				firebase.database().ref("internships/students/"+id+"/notifications").once("value").then(function(s){
					let notifs=s.val();
					let notif={internshipid:iid,notifText:"You have been selected for the internship "+title+". Meet the internship cell in the department and sign an undertaking before the start date."};
					notifs.push(notif);
					firebase.database().ref("internships/students/"+id+"/notifications").set(notifs);
				});
			}
			this.setState({progress:60});
		}
		window.location.href="/admindashboard";
	}
	render(){
		return(
		<div>
		{(this.state.progress>0 && this.state.appliedLength>0)?
		<div><hr/>
		<h3 className="internship1">Shortlist</h3>
		<table className="internship1StudentApplied"><tbody>
		<tr><th>USN</th><th>Name</th><th>Sem</th><th>Email</th><th>Phone</th><th>Skills</th><th></th><th></th></tr>
		{this.state.shortlisted.map((item,index)=>{
			return(
			<tr className="internship1StudentApplied" key={index}>
			<td>{item.usn}</td>
			<td>{item.fullName}</td>
			<td>{item.sem} {item.sec}</td>
			<td><a className="internship1StudentApplied" href={"mailto:"+item.email}>{item.email}</a></td>
			<td><a className="internship1StudentApplied" href={"tel:"+item.phone}>{item.phone}</a></td>
			<td>{item.skills?item.skills.map((item1,index1)=>{return(<span key={index1}>{item1} </span>);}):""}</td>
			<td><a className="internship1StudentApplied" href={item.resume} target="_blank">Resume</a></td>
			<td><button onClick={()=>{this.removeFromShortlist(index)}}>&times;</button></td>
			</tr>
			);
		})}
		</tbody></table>
		<button className="internshipMiniTest" onClick={this.sendShortlist}>Send Shortlist</button>
		<button className="internshipMiniTest" onClick={this.finaliseShortlist}>Finalise Student List</button>
		{(this.state.progress>=60 || this.state.finalised || this.state.type=="ongoing" || this.state.type=="completed")?<span className="statusText">Finalised</span>:(this.state.progress==40?<span className="statusText">Shortlist Sent</span>:"")}
		<p id="mailText"></p>
		<a href="" id="confirmSend" className="internshipMiniTest" onClick={this.closeOnSend}>Confirm Send</a>
		</div>:""}
		</div>
		);
	}
}

class InternshipUndertaking extends React.Component{
	constructor(){
		super();
		this.state={}
		this.undertakingComplete=this.undertakingComplete.bind(this);
	}
	componentDidMount(){
		let method=this.props.getStateMethod;
		let resp1=method();
		let resp=Object.assign({},resp1);
		this.setState(resp);
	}
	undertakingComplete(){
		firebase.database().ref("internships/internship/"+this.state.id+"/progress").set(5);
		firebase.database().ref("internships/internship/"+this.state.id+"/remarks").set(" ");
		this.setState({progress:80});
	}
	render(){
		return(
		<div>
		{(this.state.progress>=60||this.state.type=="ongoing" ||this.state.type=="completed")?
		<div><hr/>
		<h3 className="internship1">Undertaking</h3>
		<button className="internshipMiniTest" onClick={this.undertakingComplete}>Mark as Signed</button>
		{(this.state.progress>=80||this.state.type=="ongoing"||this.state.type=="completed")?<span className="statusText">Undertaking Signed</span>:""}
		<br/><br/></div>:""}
		</div>
		);
	}
}

class MiniTestForm extends React.Component{
	constructor(){
		super();
		this.state = {
		  quest:"",
		  opt1:"",
		  opt2:"",
		  opt3:"",
		  opt4:"",
		  q:[]
	  }
	  this.changedState = this.changedState.bind(this);
	  this.addQuestion = this.addQuestion.bind(this);
	  this.addQP = this.addQP.bind(this);
	  this.removeQuestion = this.removeQuestion.bind(this);
	}
	changedState(e){
	  this.setState({
		[e.target.name]: e.target.value
	});	
	}
	addQuestion(){
	  let arr={question:this.state.quest,
	  answers:[this.state.opt1,this.state.opt2,this.state.opt3,this.state.opt4],
	  answer:parseInt(this.state.canswer)};
	  this.state.q.push(arr);
	  let newState={  quest:"",
		  opt1:"",
		  opt2:"",
		  opt3:"",
		  opt4:"",
		  q:this.state.q }
	  this.setState(newState);
	}
	addQP(){
	  let topic1=window.prompt("Enter the Test Topic:","");
	  while(topic1==""){
		  topic1=window.prompt("Topic not entered.Enter the Test Topic:","");
	  }
	  let key1=firebase.database().ref('internships/minitests').push().key;
	  let item={
		  topic:topic1,
		  totalMarks:this.state.q.length,
		  questions:this.state.q
	  }
	  firebase.database().ref('internships/minitests/'+key1).update(item).then(()=>{ document.location.href="/admindashboard";},()=>{alert("Connection Error!");});
	}
	removeQuestion(item){
	  let index=this.state.q.indexOf(item);
	  this.state.q.splice(index,1);
	  let newState={  quest:this.state.quest,
		  opt1:this.state.opt1,
		  opt2:this.state.opt2,
		  opt3:this.state.opt3,
		  opt4:this.state.opt4,
		  q:this.state.q }
	  this.setState(newState);
	}  
	render(){
		return(
		<div>
		<Header pageTitle="Add Mini Test" linkto={true}/>
		<div className="questionForm">
			<h4>Question:</h4>
			<input type="text" className="minitestq" name="quest" value={this.state.quest} onChange={this.changedState}/><br/>
			<h4>Answer Options:</h4>
			<input type="text" placeholder="Option 1" className="option" value={this.state.opt1} name="opt1" onChange={this.changedState}/>
			<input type="text" placeholder="Option 2" className="option" value={this.state.opt2} name="opt2" onChange={this.changedState}/>
			<input type="text" placeholder="Option 3" className="option" value={this.state.opt3} name="opt3" onChange={this.changedState}/>
			<input type="text" placeholder="Option 4" className="option" value={this.state.opt4} name="opt4" onChange={this.changedState}/>
			<br/><br/><b>Correct Answer:&nbsp;</b>
			<div className="option">Option 1<input type="radio" value="1" name="canswer" onChange={this.changedState}/></div>
			<div className="option">Option 2<input type="radio" value="2" name="canswer" onChange={this.changedState}/></div>
			<div className="option">Option 3<input type="radio" value="3" name="canswer" onChange={this.changedState}/></div>
			<div className="option">Option 4<input type="radio" value="4" name="canswer" onChange={this.changedState}/></div>
		<button className="btn" onClick={this.addQuestion}>Add Question</button>
		</div>
		<section className="prevQuestions">
		<ul className="questionForm">
		{this.state.q.map((item) =>{
			return(
			<li key={this.state.q.indexOf(item)}>
			<div className="questionFilled">
			<button className="removebtn" onClick={()=>this.removeQuestion(item)}>&times;</button>
			<b>{item.question}</b><br/>
			<p>1. {item.answers[0]}<br/>2. {item.answers[1]}<br/>3. {item.answers[2]}<br/>4. {item.answers[3]}</p>
			<p className="optionFilled1"><b>Correct Answer: </b>{item.answer}</p>
			</div>
		</li>);
		})}
		</ul>
		</section>
		<button className="btn" onClick={this.addQP}>Save Test</button>
		</div>
		);
	}
}



class NewInternship extends React.Component{
	constructor(){
		super();
		this.state={
			adt:"",
			cDesc:"",
			cMail:"",
			cName:"",
			cPhone:"",
			desc:"",
			dur:0,
			sdt:"",
			stip:0,
			starttime:"",
			endtime:"",
			tsks:[],
			ititle:"",
			workcat:"full-time",
			selectedOption:[],
			minitestoptions:[],
			minitests:[],
			skilloptions:[],
			isLoading:false,
			dateToday:"2019-01-01",
			username:"DSCE"
		};
		this.addInternship = this.addInternship.bind(this);
		this.changedState=this.changedState.bind(this);
		this.closeSideBar=this.closeSideBar.bind(this);
		this.loadMinitests=this.loadMinitests.bind(this);
		this.loadSkills=this.loadSkills.bind(this);
		this.handleTimeChange=this.handleTimeChange.bind(this);
		this.sendNewNotification=this.sendNewNotification.bind(this);
	}
	loadMinitests(snapshot){
		let vals=[];
		for(var i in snapshot.val()){
			let temp=snapshot.val()[i].topic;
			let temp1={value:i,label:temp};
			vals.push(temp1);
		}
		let newState=Object.assign({},this.state);
		newState.isLoading=false;
		newState.minitests=vals;
		this.setState(newState);
	}
	loadSkills(snapshot){
		let vals=[];
		for (var i in snapshot.val()){
			vals.push({value:snapshot.val()[i],label:snapshot.val()[i]});
		}
		let newState=Object.assign({},this.state);
		newState.isLoading=false;
		newState.skilloptions=vals;
		this.setState(newState);
	}
	componentDidMount(){
		let tmp=this.loadMinitests;
		let tmp1=this.loadSkills;
		let dt=new Date();
		let str;
		if(dt.getMonth()<9){
			str=dt.getFullYear()+"-0"+(dt.getMonth()+1)+"-"+dt.getDate();
		}
		else{
			str=dt.getFullYear()+"-"+(dt.getMonth()+1)+"-"+dt.getDate();
		}
		let newState=Object.assign({},this.state);
		let url=new URL(window.location.href);
		let searchParams = new URLSearchParams(url.search);
		if(searchParams.get("cname")){
			newState.cName=decodeURI(searchParams.get("cname"));
			document.getElementById("compname").disabled="disabled";
			newState.username=decodeURI(searchParams.get("cname"));
		}
		newState.isLoading=true;
		newState.dateToday=str;
		this.setState(newState);
		firebase.database().ref("internships/minitests").once('value').then(function(snapshot){ tmp(snapshot);});
		firebase.database().ref("internships/additional/skills").once('value').then(function(snapshot){ tmp1(snapshot);});

		
	}
	closeSideBar(){
		document.getElementById("sidebar").style.visibility="hidden";
		document.getElementById("sidebar").style.display="none";
	}
	changedState(e){
	  this.setState({
		[e.target.name]: e.target.value
	});	
	}	
	sendNewNotification(item,stateref){
		
		if(stateref==="DSCE"){
			window.location.href="/admindashboard";}
		else{window.history.go();}
	}
	addInternship(){
		let appdt1=(new Date(this.state.adt)).valueOf();
		let startdt1=(new Date(this.state.sdt)).valueOf();
		let dur1;
		let stateref=this.state.username;
		if(document.getElementById("daterangeselect").value=="months"){
			dur1=this.state.dur*30;
		}
		else{
			if(this.state.dur%4==0){
				dur1=(this.state.dur/4)*30;
			}
			else
				dur1=this.state.dur*7;
		}
		let worktim=this.state.starttime+"-"+this.state.endtime;
		let skill=[],mini=[];
		for(let i in (this.state.selectedOption)){skill.push(this.state.selectedOption[i].value);}
		for(let i in (this.state.minitestoptions)){mini.push(this.state.minitestoptions[i].value);}
		let item={
			applicationdt:appdt1,
			companyDesc:this.state.cDesc.trim(),
			companyMail:this.state.cMail.trim(),
			companyName:this.state.cName.trim(),
			companyPhone:this.state.cPhone.trim(),
			description:this.state.desc.trim(),
			isComplete:false,
			remarks:"",
			startdt:startdt1,
			stipend:(this.state.stip?parseInt(this.state.stip):0),
			workCategory:this.state.workcat,
			workTimings:worktim,
			testEnable:false,
			title:this.state.ititle.trim(),
			skillSet:skill,
			minitest:mini,
			duration:dur1,
			approved:false
		};
		if(item.companyMail==""||item.companyName==""||item.title==""||item.startdt==""||item.applicationdt==""){
			alert("Please Fill all the fields!");
		}
		else{		
			let sendNotification=this.sendNewNotification;
			let newKey=firebase.database().ref("internships/internship").push().key;
			firebase.database().ref('internships/internship/'+newKey).update(item).then(()=>{ 
			alert("Internship Added");
			sendNotification(item,stateref);
			},()=>{alert("Connection Error!");});
		}
	}
	handleTimeChange(val){
		console.log(val);
	}
	  handleChange = selectedOption => {
		this.setState({ selectedOption });
	  };
   handleChange1 = minitestoptions => {
    this.setState({ minitestoptions });
  };
	render(){
		const { selectedOption } = this.state;
		const { minitestoptions } = this.state;
		return(
		<div>
		<Header pageTitle="New Internship" userName={this.state.username} linkto={false}/>
		<div className="sidebar" id="sidebar">
		<button className="sidebarclose" onClick={this.closeSideBar}>&times;</button>
		<ActionsDiv onGoingLoc="/admindashboard#ongoing" applicationsLoc="/admindashboard#toselect"/>
		</div>
		<div className="formClass">
		<table className="formClass">
		<tbody>
		<tr className="formClass"><th className="formClass">Title:</th><td className="formClass"><input type="text" name="ititle" onChange={this.changedState}/></td></tr>
		<tr className="formClass"><th className="formClass">Description:</th><td className="formClass"></td></tr>
		<tr className="formClass"><td colSpan="2" className="formClass"><textarea name="desc" onChange={this.changedState}></textarea></td></tr>
		<tr className="formClass"><th className="formClass">Company Name:</th><td className="formClass"><input type="text" name="cName" id="compname" value={this.state.cName} onChange={this.changedState}/></td></tr>
		<tr className="formClass"><th className="formClass">Contact Email:</th><td className="formClass"><input type="email" name="cMail" onChange={this.changedState}/></td></tr>
		<tr className="formClass"><th className="formClass">Contact Number:</th><td className="formClass"><input type="tel" name="cPhone" maxLength="12" pattern="[0-9]{8,}" onChange={this.changedState}/></td></tr>
		<tr className="formClass"><th className="formClass">Company Description:</th><td className="formClass"><input type="text" name="cDesc" onChange={this.changedState}/></td></tr>
		<tr className="formClass"><th className="formClass">Internship Start Date:</th><td className="formClass"><input type="date" name="sdt" min={this.state.dateToday} onChange={this.changedState}/></td></tr>
		<tr className="formClass"><th className="formClass">Skills Required:</th><td className="formClass"><Select value={selectedOption} options={this.state.skilloptions} onChange={this.handleChange} isMulti={true} isLoading={this.state.isLoading}/></td></tr>
		<tr className="formClass"><th className="formClass">Last Application Date:</th><td className="formClass"><input type="date" name="adt" min={this.state.dateToday} onChange={this.changedState}/></td></tr>
		<tr className="formClass"><th className="formClass">Work Timings:</th><td className="formClass"><select onChange={this.changedState} name="workcat"><option value="full-time">Full Time</option>
		<option value="part-time">Part Time</option>
		<option value="work-from-home">Work From Home</option></select></td></tr>
		<tr className="formClass"><th className="formClass"></th><td><input name="starttime" type="time" min="07:00" max="22:00" onChange={this.changedState} /> - <input type="time" name="endtime" min="07:00" max="22:00" onChange={this.changedState}/></td></tr>
		<tr className="formClass"><th className="formClass">Length of Internship:</th><td className="formClass1"><input type="number" min="1" name="dur" onChange={this.changedState}/><select id="daterangeselect"><option value="months">Months</option><option value="weeks">Weeks</option></select></td></tr>
		<tr className="formClass"><th className="formClass">Stipend (0 if not applicable):</th><td className="formClass"><input type="number" min="0" name="stip" onChange={this.changedState}/></td></tr>
		<tr className="formClass"><th className="formClass">Mini Tests</th><td className="formClass"><Select value={minitestoptions} options={this.state.minitests} onChange={this.handleChange1} isMulti={true} isLoading={this.state.isLoading}/></td></tr>
		<tr className="formClass"><td colSpan="2" className="formClass"><button onClick={this.addInternship}>Add</button></td></tr>
		</tbody></table>
		</div>
		</div>
		);
	}
}

class NewInternshipLink extends React.Component{
	constructor(){
		super();
		this.createLink=this.createLink.bind(this);
	}
	createLink(){
		let val=document.getElementById("compName").value.trim();
		if(val!=""){
		let res=encodeURI(val);
		let link0=document.location.href;		
		let link1=link0.slice(0,link0.indexOf("newinternshiplink"))+"newinternship?cname="+res;
		document.getElementById("result").style.display="block";
		document.getElementById("result").value=link1;		
		}
	}
	componentDidMount(){
		document.getElementById("result").style.display="none";
	}
	render(){
		return(
		<div>
		<Header pageTitle="New Internship"/>
		<div className="linkcreate">
		<input type="text" required="required" id="compName" placeholder="Company Name" className="linkcreate"/>
		<button onClick={this.createLink} className="linkcreate">Create Link</button><br/><br/>
		<input type="text" id="result" className="linkcreate1"/>
		</div>
		</div>
		);
	}
}

class OpenInternship extends React.Component{
	constructor(){
		super();
		this.state={
			internship:"",
			type:"",
			userValid:false,
			internshipdata:null,
			userdata:null,
			studentdata:null,
			loaded:false
		}
		this.closeSideBar=this.closeSideBar.bind(this);
		this.setInternshipId=this.setInternshipId.bind(this);
		this.getState=this.getState.bind(this);
		this.setStateMethod=this.setStateMethod.bind(this);
	}

	closeSideBar(){
		document.getElementById("sidebar").style.visibility="hidden";
		document.getElementById("sidebar").style.display="none";
	}
	setInternshipId(id1,type){
		let newState=Object.assign({},this.state);
		newState.internship=id1;
		newState.type=type;
		this.setState(newState);
	}
	getState(){
		return this.state;
	}
	setStateMethod(st){
		this.setState(st);
	}
	componentDidMount(){
		let newState=new Object();
		let updateState=this.setStateMethod;
		newState.internship=null;
		newState.type="";
		/*let uid=firebase.auth().currentUser.uid;
		firebase.database().ref("users/"+uid+"/teacher").once("value").then(function(snapshot){
			if(snapshot.val()){ newState.userValid=true; }
		});*/
		newState.userValid=true; //Remove after integration
		firebase.database().ref("internships/students").once("value").then(function(s){
			newState.studentdata=s.val();
			firebase.database().ref("internships/internship").once("value").then(function(s1){
			newState.internshipdata=s1.val();
			firebase.database().ref("users").once("value").then(function(s2){
			newState.userdata=s2.val();
			newState.loaded=true;
			updateState(newState);
		});
		});
		});
		this.setState(newState);
	}
	render(){
		return(
		<div>
		{this.state.userValid?<div>
		<Header pageTitle="Admin Dashboard" linkto={true}/>
		<div className="sidebar" id="sidebar">
		<button className="sidebarclose" onClick={this.closeSideBar}>&times;</button>
		<ActionsDiv onGoingLoc="/admindashboard#ongoing" applicationsLoc="/admindashboard#toselect"/>
		</div>
		<div className="actiondiv">
		<ActionsDiv/></div>
		{this.state.loaded?<div>
			{this.state.internship?
			<Internship getStateMethod={this.getState} setInternshipIdMethod={this.setInternshipId}/>:""}
		<OpenInternship1 getStateMethod={this.getState} setInternshipIdMethod={this.setInternshipId} setStateMethod={this.setStateMethod}/>
		<div className="popup" id="popup"></div></div>:<div><br/><br/><h1>Loading</h1></div>}
		</div>:<div><p className="unauthorisedAccess">Access Denied</p><span className="unauthorisedAccess">You are not allowed access to this page. If you are supposed to be able to access this page, try logging in again.</span></div>}
		</div>
		);
	}
}

class CompletedInternship extends React.Component{
constructor(){
		super();
		this.state={
			internship:"",
			type:"",
			userValid:false,
			internshipdata:null,
			userdata:null,
			studentdata:null,
			loaded:false
		}
		this.closeSideBar=this.closeSideBar.bind(this);
		this.setInternshipId=this.setInternshipId.bind(this);
		this.getState=this.getState.bind(this);
		this.setStateMethod=this.setStateMethod.bind(this);
	}

	closeSideBar(){
		document.getElementById("sidebar").style.visibility="hidden";
		document.getElementById("sidebar").style.display="none";
	}
	setInternshipId(id1,type){
		let newState=Object.assign({},this.state);
		newState.internship=id1;
		newState.type=type;
		this.setState(newState);
	}
	getState(){
		return this.state;
	}
	setStateMethod(st){
		this.setState(st);
	}
	componentDidMount(){
		let newState=new Object();
		let updateState=this.setStateMethod;
		newState.internship=null;
		newState.type="";
		/*let uid=firebase.auth().currentUser.uid;
		firebase.database().ref("users/"+uid+"/teacher").once("value").then(function(snapshot){
			if(snapshot.val()){ newState.userValid=true; }
		});*/
		newState.userValid=true; //Remove after integration
		firebase.database().ref("internships/students").once("value").then(function(s){
			newState.studentdata=s.val();
			firebase.database().ref("internships/internship").once("value").then(function(s1){
			newState.internshipdata=s1.val();
			firebase.database().ref("users").once("value").then(function(s2){
			newState.userdata=s2.val();
			newState.loaded=true;
			updateState(newState);
		});
		});
		});
		this.setState(newState);
	}
	render(){
		return(
		<div>
		{this.state.userValid?<div>
		<Header pageTitle="Admin Dashboard" linkto={true}/>
		<div className="sidebar" id="sidebar">
		<button className="sidebarclose" onClick={this.closeSideBar}>&times;</button>
		<ActionsDiv onGoingLoc="/admindashboard#ongoing" applicationsLoc="/admindashboard#toselect"/>
		</div>
		<div className="actiondiv">
		<ActionsDiv/></div>
		{this.state.loaded?<div>
			{this.state.internship?
			<Internship getStateMethod={this.getState} setInternshipIdMethod={this.setInternshipId}/>:""}
		<CompletedInternship1 getStateMethod={this.getState} setInternshipIdMethod={this.setInternshipId} setStateMethod={this.setStateMethod}/>
		<div className="popup" id="popup"></div></div>:<div><br/><br/><h1>Loading</h1></div>}
		</div>:<div><p className="unauthorisedAccess">Access Denied</p><span className="unauthorisedAccess">You are not allowed access to this page. If you are supposed to be able to access this page, try logging in again.</span></div>}
		</div>
		);
	}
}

class CompletedInternship1 extends React.Component{
constructor(){
		super();
		this.state={
			internships:[]
		}
		this.gotoInternship=this.gotoInternship.bind(this);
		this.stopProp=this.stopProp.bind(this);
		this.animateProgress=this.animateProgress.bind(this);
	}
	animateProgress(){
		let newState=this.state.internships;
		for(var i=0;i<newState.length;i++){
			newState[i].progress=100;
		}
		this.setState({internships:newState});
	}
	gotoInternship(id1){
		let tmp=this.props.setInternshipIdMethod;
		tmp(id1,"completed");
	}
	stopProp(e){
		e.stopPropagation();
	}
	componentDidMount(){
		let dt=new Date();
		dt=dt.valueOf();
		let getStateMethod=this.props.getStateMethod;
		let t=getStateMethod();
		let newState=Object.assign({},t);
		newState.internships=[];
		for(var i in newState.internshipdata){
			if(newState.internshipdata[i].applicationdt<dt && newState.internshipdata[i].startdt<dt && newState.internshipdata[i].isComplete==true){
				let item=newState.internshipdata[i];
				let days=item.duration;
				item.duration=(item.duration%7==0)?((item.duration/7)+" week(s)"):((item.duration/30)+" month(s)");
				item.appliedcount=(item.applied?item.applied.length:0);
				item.id=i;
				item.progress=0;
				let dt1=new Date(item.startdt);
				item.startdt=dt1.getDate()+"/"+(dt1.getMonth()+1)+"/"+dt1.getFullYear();
				newState.internships.push(item);
			}
		}
		this.setState(newState);
		let animatep=this.animateProgress;
		setTimeout(function(){animatep();},1000);
	}
	render(){
		return(
		<div className="closedDiv" id="completed">
		<h3 className="closedDiv">Completed Internships</h3>
		{this.state.internships.map((item) =>{
			return(
			<div key={item.id} className="internship" onClick={()=>{this.gotoInternship(item.id)}}>
			<h3 className="internship">{item.title}</h3>
			<p className="internshipCompany">{item.companyName}</p>
			<p className="internship"><span className="internship">No. of students applied: {item.appliedcount}</span><span className="internship">Duration: {item.duration}</span><span className="internship">Started On: {item.startdt}</span></p>
			<a href={"tel:"+item.companyPhone} onClick={this.stopProp}><button className="internship">Call Company</button></a>
			<a href={"mailto:"+item.companyMail} onClick={this.stopProp}><button className="internship">Email Company</button></a>
			<h3 className="internshipStatus">Status: </h3>
			<div className="internshipStatus">
			<ProgressBar percent={item.progress}  filledBackground="linear-gradient(90deg,yellow,green)">
			<Step transition="scale">
				  {({ accomplished }) => (
					<img style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}  width="20" src="circle.png"/>
				  )}
				</Step>
				<Step transition="scale">
				  {({ accomplished }) => (
					<img style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}  width="20" src="circle.png"/>
				  )}
				</Step>
			</ProgressBar>
		</div>
			</div>);
		})}
		</div>
		);
	}
	
}

class OpenInternship1 extends React.Component{
constructor(){
		super();
		this.state={
			internships:[]
		}
		this.gotoInternship=this.gotoInternship.bind(this);
		this.stopProp=this.stopProp.bind(this);
	}
	gotoInternship(id1){
		let tmp=this.props.setInternshipIdMethod;
		tmp(id1,"open");
	}
	stopProp(e){
		e.stopPropagation();
	}
	componentDidMount(){
		let dt=new Date();
		dt=dt.valueOf();
		let getStateMethod=this.props.getStateMethod;
		let t=getStateMethod();
		let newState=Object.assign({},t);
		newState.internships=[];
		for(var i in newState.internshipdata){
			if(newState.internshipdata[i].applicationdt>dt && newState.internshipdata[i].isComplete==false){
				let item=newState.internshipdata[i];
				let days=item.duration;
				item.duration=(item.duration%7==0)?((item.duration/7)+" week(s)"):((item.duration/30)+" month(s)");
				item.appliedcount=(item.applied?item.applied.length:0);
				item.id=i;
				item.progress=0;
				let dt1=new Date(item.startdt);
				item.startdt=dt1.getDate()+"/"+(dt1.getMonth()+1)+"/"+dt1.getFullYear();
				newState.internships.push(item);
			}
		}
		this.setState(newState);
	}
	render(){
		return(
		<div className="closedDiv" id="open">
		<h3 className="closedDiv">Open To Apply Internships</h3>
		{this.state.internships.map((item) =>{
			return(
			<div key={item.id} className={item.approved?"internship":"unapprovedinternship"} onClick={()=>{this.gotoInternship(item.id)}}>
			<h3 className="internship">{item.title}</h3>
			<p className="internshipCompany">{item.companyName}</p>
			<p className="internship"><span className="internship">No. of students applied: {item.appliedcount}</span><span className="internship">Duration: {item.duration}</span><span className="internship">Starts On: {item.startdt}</span></p>
			<a href={"tel:"+item.companyPhone} onClick={this.stopProp}><button className="internship">Call Company</button></a>
			<a href={"mailto:"+item.companyMail} onClick={this.stopProp}><button className="internship">Email Company</button></a>
			<h3 className="internshipStatus">Status: </h3>
			<div className="internshipStatus">
			<ProgressBar percent={item.progress}  filledBackground="linear-gradient(90deg,yellow,green)">
			<Step transition="scale">
				  {({ accomplished }) => (
					<img style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}  width="20" src="circle.png"/>
				  )}
				</Step>
				<Step transition="scale">
				  {({ accomplished }) => (
					<img style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}  width="20" src="circle.png"/>
				  )}
				</Step>
			</ProgressBar>
		</div>
			</div>);
		})}
		</div>
		);
	}
}


class SendNotification extends React.Component{
	constructor(){
		super();
		this.updateDatabase=this.updateDatabase.bind(this);
		this.gotoHome=this.gotoHome.bind(this);
	}
	gotoHome(){
		window.location.href="/admindashboard";
	}
	updateDatabase(){
		document.getElementById("loadingShow").style.display="block";
		setTimeout(function(){document.getElementById("loadingShow").style.display="none"; alert("Notifications Sent");},10000);
		let content=document.getElementById("notification1").value;
		let studentlist=document.getElementById("notification2").value.split(",");
		let students=[];
		for(var j in studentlist){
			let tmp=studentlist[j].trim().toUpperCase();
			students.push(tmp);
		if(tmp=="ALL"||tmp=="All"||tmp=="all"){
			firebase.database().ref("internships/students").once("value").then(function(s){
				let st=s.val();
				for(var k in st){
					let notif=st[k].notifications;
					notif.push({internshipid:"Admin",text:content});
					firebase.database().ref("internships/students/"+k+"/notifications").set(notif);
				}
			});
			
			break;
		}
		}
		for(var i in students){
			firebase.database().ref("internships/students").orderByChild("usn").equalTo(students[i]).once("value").then(function(snapshot){
				let notif=[];
				for(var j in snapshot.val()){
					if(snapshot.val()[j].notifications!=null){	notif=snapshot.val()[j].notifications;}
					notif.push({internshipid:"Admin",text:content});
					firebase.database().ref("internships/students/"+j+"/notifications").update(notif);
					break;
				}
			});
		}
	}
	render(){
		return(
		<div className="notification">
		<button onClick={this.gotoHome} className="notification">&times;</button>
		<h3 className="notification">Notification Content:</h3>
		<input className="notification" type="text" id="notification1"/><br/>
		<h3 className="notification">Student List(seperated by commas):</h3>
		<input type="text" id="notification2" className="notification"/><br/>
		<button onClick={this.updateDatabase} className="btn">Send</button>
		<br/><br/>
		<img className="loadicon" src="loadingicon.png" id="loadingShow"/>
		</div>
		);
	}
}

export {MainPage, NewInternship, NewInternshipLink, MiniTestForm, Internship, OpenInternship, CompletedInternship, SendNotification};
