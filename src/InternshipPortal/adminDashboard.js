import React from 'react';
import {Link} from 'react-router-dom';
import './adminDashboard.css';
import firebase from '../config/firebaseConfig.js';
import InternshipFeedbacks from './internshipfeedbks.js';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import {Tabs, Tab, Badge, Spinner} from 'react-mdl';

class Header extends React.Component{
	constructor(){
		super();
		this.openSideBar=this.openSideBar.bind(this);
		this.gotoNewInternship=this.gotoNewInternship.bind(this);
		this.gotoNewNotification=this.gotoNewNotification.bind(this);
		this.gotoNewTest=this.gotoNewTest.bind(this);
		this.gotoSkillSearch=this.gotoSkillSearch.bind(this);
	}
	openSideBar(){
		document.getElementById("sidebar").style.display="block";
		document.getElementById("sidebar").style.visibility="visible";
	}
	gotoNewInternship(){
		window.location.href="/newinternship";
	}
	gotoNewTest(){
		window.location.href="/createminitest";
	}
	gotoNewNotification(){
		window.location.href="/sendnotification";
	}
	gotoSkillSearch(){ window.location.href="/skillsearchinternship"; }
	render(){
		return(
		<div className="header">
		<button className="sidebar" onClick={this.openSideBar}><img src="menu-icon.png" className="sidebar" alt="Menu"/></button><Link to="/admindashboard"><img className="icon" src="DSILogo.png" alt="Logo"/><span className="header">{this.props.pageTitle}</span></Link>
		<div className="actiondiv"><button className="actionsdiv" onClick={this.gotoNewInternship}>New Internship</button><button className="actionsdiv" onClick={this.gotoNewTest}>New Test</button><button className="actionsdiv" onClick={this.gotoNewNotification}>Send Notification</button>
		<button className="actionsdiv" onClick={this.gotoSkillSearch}>Skill Search</button>
		</div>
		</div>
	);}
}

class ActionsDiv extends React.Component{
	constructor(){
		super();
		this.gotoApplications=this.gotoApplications.bind(this);
		this.gotoOngoing=this.gotoOngoing.bind(this);
		this.gotoNewInternship=this.gotoNewInternship.bind(this);
		this.gotoNewInternshipLink=this.gotoNewInternshipLink.bind(this);
		this.gotoCompletedInternship=this.gotoCompletedInternship.bind(this);
		this.gotoOpenInternship=this.gotoOpenInternship.bind(this);
		this.gotoSendNotification=this.gotoSendNotification.bind(this);
		this.gotoSkillSearch=this.gotoSkillSearch.bind(this);
	}
	static defaultProps = { onGoingLoc:"/admindashboard#ongoing", applicationsLoc:"/admindashboard#toselect", newInternshipLoc:"/newInternship", miniTestLoc:"/createminitest"}
	gotoOngoing(){				window.location.href=this.props.onGoingLoc;	}
	gotoApplications(){			window.location.href=this.props.applicationsLoc;	}
	gotoNewInternship(){		window.location.href=this.props.newInternshipLoc;	}
	gotoNewInternshipLink(){	window.location.href="/newinternshiplink";	}
	gotoCompletedInternship(){	window.location.href="/completedinternship"; 	}
	gotoOpenInternship(){		window.location.href="/openinternship";		}
	gotoSendNotification(){	window.location.href="/sendnotification";	}
	gotoSkillSearch(){ window.location.href="/skillsearchinternship"; }
	render(){
		return(
		<div className="actionsdiv">
		<h3 className="actionsdiv">Actions</h3>
		<button className="actionsdiv" onClick={this.gotoNewInternship}>New Internship</button>
		<button className="actionsdiv" onClick={this.gotoNewInternshipLink}>Internship Link</button>
		<Link to={this.props.miniTestLoc}><button className="actionsdiv">New Test</button></Link>
		<button className="actionsdiv" onClick={this.gotoSendNotification}>Custom Notification</button>
		<button className="actionsdiv" onClick={this.gotoSkillSearch}>Skill Search</button>
		</div>
		);
	}
}

class SkillSearch extends React.Component{
	constructor(){
		super();
		this.state={
			userValid:null,
			responselist:[],
			skilloptions:[],
			selectedoption:[]
		};
		this.processSkillSet=this.processSkillSet.bind(this);
		this.searchBySkill=this.searchBySkill.bind(this);
	}
	searchBySkill(){
		let skilllist=[];
		for(var l in this.state.selectedoption){
			skilllist.push(this.state.selectedoption[l].value);
		}
		let resplist=[];
		for(var i in skilllist){
			for(var j in this.state.studentData){
				if(this.state.studentData[j].skills){
					if(this.state.studentData[j].skills.includes(skilllist[i])){
						let z=false;
						for(var k in resplist){
							if(resplist[k].uid==j){
								resplist[k].pr+=1;
								z=true;
								break;
							}							
						}
						if(!z){
							resplist.push({data:this.state.studentData[j],uid:j,pr:1});
						}
					}
				}
			}
		}
		resplist.sort(function(a,b){
			if((a.pr>b.pr) && a.data.doingInternship===false){return -1; }
			else if((a.pr<b.pr) && b.data.doingInternship===false){return 1;}
			else if((a.pr===b.pr)  && a.data.doingInternship===false && b.data.doingInternship===false){return 0;}
			else if(a.data.doingInternship===true && b.data.doingInternship===false){return 1; }
			else if(a.data.doingInternship===false && b.data.doingInternship===true){return -1; }
			else{ return 0; }
		});
		this.setState({responselist:resplist});
	}
	processSkillSet(){
		let sk=[],sk2=[];
		let sdata=Object.assign({},this.state.studentData);
		for(var i in sdata){
			for(var j in sdata[i].skills){
				if(!sk.includes(sdata[i].skills[j].toUpperCase())){
					sk.push(sdata[i].skills[j].toUpperCase());
					sk2.push({label:sdata[i].skills[j],value:sdata[i].skills[j].toUpperCase()});
				}
				sdata[i].skills[j]=sdata[i].skills[j].toUpperCase();
			}
		}
		this.setState({skilloptions:sk2,studentData:sdata});
	}
	handleChange = selectedoption => {
		this.setState({ selectedoption });
	  };
	componentDidMount(){
		firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			if(!user.isAnonymous){
				firebase.database().ref("users/"+user.uid+"/teacher").once("value").then((snapshot)=>{
					if(snapshot.val()){this.setState({userValid:true});
					firebase.database().ref("internships/students").once("value").then((sn)=>{
						this.setState({studentData:sn.val()});
						this.processSkillSet();
					});
					
					}
					else{this.setState({userValid:false});}
				});
			}
			else{window.location.href="/";}
		} 
		else{
			window.location.href="/";
		}
		});
		
	}
	render(){
		if(this.state.userValid==null){
			return(<div className="closedDiv"><Spinner/></div>);
		}
		else if(this.state.userValid){
			const { selectedoption } = this.state;
			return(<div><Header pageTitle="Search Student By Skill"/>
			<div className="closedDiv">
			<Select options={this.state.skilloptions} value={this.state.selectedoption} onChange={this.handleChange} isMulti={true}/><br/>
			<button className="btn" onClick={this.searchBySkill}>Search</button>
			{this.state.responselist?<table style={{width:'100%'}}><tbody>
				{this.state.responselist.map((item,index)=>{return(
				<tr className={item.data.doingInternship?"searchskill1":"searchskill"} key={index}><td>
				<div className="searchskill">
				<h4>{item.data.fullName}</h4> - {item.data.usn} {"("+item.data.sem+" "+item.data.sec+")"} {item.data.doingInternship?<b>(Doing internship)</b>:""}<br/>
				<h4>Skills: </h4> {item.data.skills.map((item1,index1)=>{return(<span key={index1}>{item1}, </span>);})}<br/>
				<a href={"mailto:"+item.data.email}><img src="mailicon.png" className="internshipIcon"/></a> <a href={"tel:"+item.data.phone}><img src="callicon.png" className="internshipIcon"/></a> <a className="internship1StudentApplied" href={"https://wa.me/91"+item.data.phone} target="_blank"><img src="whatsappicon.png" className="internshipIcon"/></a><br/>
				</div>
				</td></tr>
				);})}
				</tbody></table>:""}
			</div></div>
			);
		}
		else{
			return(<div><p className="unauthorisedAccess">Access Denied</p><span className="unauthorisedAccess">You are not allowed access to this page.</span></div>);
		}
	}
}

class MainPage extends React.Component{
	constructor(){
		super();
		this.state={
			internship:"",
			type:"",
			userValid:null,
			internshipdata:null,
			studentdata:null,
			loaded:false,
			activeTab:0,
			tabNotifs:[0,0,0,0]
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
		let statem=this.setStateMethod;
		  firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			if(!user.isAnonymous){
			firebase.database().ref("users/"+user.uid+"/teacher").once("value").then(function(snapshot){
			if(snapshot.val()){ statem({userValid:true}); }
			else{ statem({userValid:false});}
			});}
			else{window.location.href="/";}
		} 
		else{
			window.location.href="/";
		}
		}); 
		let updateState=this.setStateMethod;
		firebase.database().ref("internships/students").once("value").then(function(s){
			let ns=new Object();
			ns.studentdata=s.val();
			firebase.database().ref("internships/internship").once("value").then(function(s1){
			ns.internshipdata=s1.val();
			ns.loaded=true;
			let notifcount=[0,0,0,0];
			for(var i in ns.internshipdata){
				if(ns.internshipdata[i].approved==false){
					notifcount[2]+=1;
				}
			}
			ns.tabNotifs=notifcount;
			updateState(ns);
		});
		});	
		
	}
	render(){
		return(
		<div className="mainPageInternshipPortal">
		{this.state.userValid?<div>
		<Header pageTitle="Admin Dashboard" linkto={true}/>
		<div className="sidebar" id="sidebar">
		<button className="sidebarclose" onClick={this.closeSideBar}>&times;</button>
		<ActionsDiv onGoingLoc="/admindashboard#ongoing" applicationsLoc="/admindashboard#toselect"/>
		</div>
		<Tabs id="categoryTabAdminDashboard" activeTab={this.state.activeTab} onChange={(tabId)=>this.setState({activeTab:tabId})} ripple>
		<Tab className="adminDashboardTab">{this.state.tabNotifs[0]==0?"Applications":<Badge text={this.state.tabNotifs[0]} overlap>Applications</Badge>}</Tab>
		<Tab className="adminDashboardTab">{this.state.tabNotifs[1]==0?"Ongoing":<Badge text={this.state.tabNotifs[1]} overlap>Ongoing</Badge>}</Tab>
		<Tab className="adminDashboardTab">{this.state.tabNotifs[2]==0?"Approvals":<Badge text={this.state.tabNotifs[2]} overlap>Approvals</Badge>}</Tab>
		<Tab className="adminDashboardTab">{this.state.tabNotifs[3]==0?"Completed":<Badge text={this.state.tabNotifs[3]} overlap>Completed</Badge>}</Tab>
		</Tabs>
		{this.state.loaded?<div>
			{this.state.internship?
			<Internship getStateMethod={this.getState} setInternshipIdMethod={this.setInternshipId}/>:""}
			{this.state.activeTab==0?<InternshipApplications getStateMethod={this.getState} setInternshipIdMethod={this.setInternshipId} setStateMethod={this.setStateMethod}/>:(this.state.activeTab==1)?<OngoingInternships getStateMethod={this.getState} setInternshipIdMethod={this.setInternshipId} setStateMethod={this.setStateMethod}/>:(this.state.activeTab==2)?<OpenInternship1 getStateMethod={this.getState} setInternshipIdMethod={this.setInternshipId} setStateMethod={this.setStateMethod}/>:<CompletedInternship1 getStateMethod={this.getState} setInternshipIdMethod={this.setInternshipId} setStateMethod={this.setStateMethod}/>}
		<div className="popup" id="popup"></div></div>:<div><br/><br/><img src="loadingicon.png" className="loadingicon"/></div>}
		</div>:(this.state.userValid==null)?<h1>Loading</h1>:<div><p className="unauthorisedAccess">Access Denied</p><span className="unauthorisedAccess">You are not allowed access to this page.</span></div>}
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
			if(newState.internshipdata[i].startdt>dt && newState.internshipdata[i].isComplete==false && newState.internshipdata[i].approved){
				let item=Object.assign({},newState.internshipdata[i]);
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
				item.startdt1=dt1.getDate()+"/"+(dt1.getMonth()+1)+"/"+dt1.getFullYear();
				newState.internships.push(item);
			}
		}
		newState.internships.sort(function(a,b){
			if(a.progress>=80 && b.progress>=80){return 0;}
			else if(a.progress>=80){return 1;}
			else if(b.progress>=80){return -1;}
			else if(a.progress==b.progress && a.startdt>b.startdt){return 1;}
			else if(a.progress==b.progress && a.startdt<b.startdt){return -1;}
			else if(a.progress<b.progress && a.startdt<b.startdt){return -1;}
			else if(a.progress>b.progress && a.startdt>b.startdt){ return 1;}
			else if(a.progress<b.progress && a.startdt==b.startdt){ return -1;}
			else if(a.progress>b.progress && a.startdt==b.startdt){return 1;}
			else if(a.applicationdt>b.applicationdt){return 1;}
			else if(b.applicationdt>a.applicationdt){return -1;}
			else{return 0; }
		});
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
			<p className="internship"><span className="internship">No. of students applied: {item.appliedcount}</span><span className="internship">Duration: {item.duration}</span><span className="internship">Starts On: {item.startdt1}</span></p>
			<a href={"tel:"+item.companyPhone} onClick={this.stopProp}><button className="internship">Call Company</button></a>
			<a href={"mailto:"+item.companyMail} onClick={this.stopProp}><button className="internship">Email Company</button></a>
			<h3 className="internshipStatus">Status: </h3><br/>
			<div className="internshipStatus">
			<ProgressBar percent={item.progress} filledBackground="linear-gradient(90deg,yellow,green)">
				<Step transition="scale">
				  {({ accomplished }) => (
					<img style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}  width="75" src="circle1.png"/>
				  )}
				</Step>
				
				<Step transition="scale">
				  {({ accomplished }) => (
					<img style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}  width="75" src="circle2.png"/>
				  )}
				</Step>
				<Step transition="scale">
				  {({ accomplished }) => (
					<img style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}  width="75" src="circle3.png"/>
				  )}
				</Step>
				<Step transition="scale">
				  {({ accomplished }) => (
					<img style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}  width="75" src="circle4.png"/>
				  )}
				</Step>
				<Step transition="scale">
				  {({ accomplished }) => (
					<img style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}  width="80" src="circle5.png"/>
				  )}
				</Step>
				<Step transition="scale">
				  {({ accomplished }) => (
					<img style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}  width="75" src="circle6.png"/>
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
			if((newState.internshipdata[i].startdt<=dt && newState.internshipdata[i].isComplete==false)||(newState.internshipdata[i].isStarted && newState.internshipdata[i].isComplete==false)){
				let item=Object.assign({},newState.internshipdata[i]);
				let days=item.duration;
				item.duration=(item.duration%7==0)?((item.duration/7)+" week(s)"):((item.duration/30)+" month(s)");
				item.appliedcount=(item.applied?item.applied.length:0);
				item.id=i;
				let tmp=((Date.now()-item.startdt)/(days*86400000))*100;
				item.progress=tmp;
				let dt1=new Date(item.startdt);
				item.startdt1=dt1.getDate()+"/"+(dt1.getMonth()+1)+"/"+dt1.getFullYear();
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
			<p className="internship"><span className="internship">No. of students applied: {item.appliedcount}</span><span className="internship">Duration: {item.duration}</span><span className="internship">Started On: {item.startdt1}</span></p>
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
			remarks:"",
			companyDesc:"",
			description:""
		}
		this.clearInternship=this.clearInternship.bind(this);
		this.approveInternship=this.approveInternship.bind(this);
		this.getInternshipState=this.getInternshipState.bind(this);
		this.deleteInternship=this.deleteInternship.bind(this);
		this.updateRemarks=this.updateRemarks.bind(this);
		this.changedState=this.changedState.bind(this);
		this.markInternshipComplete=this.markInternshipComplete.bind(this);
		this.gotoEditInternship=this.gotoEditInternship.bind(this);
		this.updateResumeLink=this.updateResumeLink.bind(this);
		this.shortlistCutoffApply=this.shortlistCutoffApply.bind(this);
		this.removeShortlist=this.removeShortlist.bind(this);
		this.applyShortlist=this.applyShortlist.bind(this);
		this.resetShortlist=this.resetShortlist.bind(this);
		this.toggleTest=this.toggleTest.bind(this);
		this.sendMiniTestNotif=this.sendMiniTestNotif.bind(this);
		this.completeMinitestNotif=this.completeMinitestNotif.bind(this);
		this.finaliseShortlist=this.finaliseShortlist.bind(this);
		this.sendShortlist=this.sendShortlist.bind(this);
		this.closeOnSend=this.closeOnSend.bind(this);
		this.undertakingComplete=this.undertakingComplete.bind(this);
		this.startInternship=this.startInternship.bind(this);
		this.copyInternship=this.copyInternship.bind(this);
		this.expandCompanyDesc=this.expandCompanyDesc.bind(this);
		this.expandInternshipDesc=this.expandInternshipDesc.bind(this);
		this.expandSkillsList=this.expandSkillsList.bind(this);
		this.expandInternshipOtherDetails=this.expandInternshipOtherDetails.bind(this);
		this.expandInternsFeedback=this.expandInternsFeedback.bind(this);
	}
	changedState(e){
	  this.setState({
		[e.target.name]: e.target.value
	});	
	}
	expandInternshipOtherDetails(){
		if(document.getElementById("internshipOtherDetailsAdminDashboard").style.display=="none"){
			document.getElementById("internshipOtherDetailsAdminDashboard").style.display="block";
			document.getElementById("internshipOtherDetailsBtnAdminDashboard").innerHTML="Hide";
		}
		else{
			document.getElementById("internshipOtherDetailsAdminDashboard").style.display="none";
			document.getElementById("internshipOtherDetailsBtnAdminDashboard").innerHTML="Expand";
		}
	}
	expandCompanyDesc(){
		if(document.getElementById("companyDescAdminDashboard").style.display=="none"){
			document.getElementById("companyDescAdminDashboard").style.display="inline-block";
			document.getElementById("companyDescBtnAdminDashboard").innerHTML="Hide";
		}
		else{
			document.getElementById("companyDescAdminDashboard").style.display="none";
			document.getElementById("companyDescBtnAdminDashboard").innerHTML="Expand";
		}
	}
	expandInternshipDesc(){
		if(document.getElementById("internshipDescAdminDashboard").style.display=="none"){
			document.getElementById("internshipDescAdminDashboard").style.display="block";
			document.getElementById("internshipDescBtnAdminDashboard").innerHTML="Hide";
		}
		else{
			document.getElementById("internshipDescAdminDashboard").style.display="none";
			document.getElementById("internshipDescBtnAdminDashboard").innerHTML="Expand";
		}
	}
	expandSkillsList(){
		if(document.getElementById("skillsListAdminDashboard").style.display=="none"){
			document.getElementById("skillsListAdminDashboard").style.display="block";
			document.getElementById("skillsListBtnAdminDashboard").innerHTML="Hide";
		}
		else{
			document.getElementById("skillsListAdminDashboard").style.display="none";
			document.getElementById("skillsListBtnAdminDashboard").innerHTML="Expand";
		}
	}
	expandInternsFeedback(){
		if(document.getElementById("internsfeedbackAdminDashboard").style.display=="none"){
			document.getElementById("internsfeedbackAdminDashboard").style.display="block";
			document.getElementById("internsfeedbackBtnAdminDashboard").innerHTML="Hide";
		}
		else{
			document.getElementById("internsfeedbackAdminDashboard").style.display="none";
			document.getElementById("internsfeedbackBtnAdminDashboard").innerHTML="Expand";
		}
	}
	gotoEditInternship(){
		let id=this.state.id;
		let res=encodeURIComponent(id);
		let link1="/editinternship?internship="+res;
		window.location.href=link1;
	}
	copyInternship(){
		let id=this.state.id;
		let res=encodeURIComponent(id);
		let link1="/editinternship?internship="+res+"&copy=true";
		window.location.href=link1;
	}
	clearInternship(){
		document.getElementById("categoryTabAdminDashboard").style.display="block";
		if(this.state.type=="application"){
			document.getElementById("toselect").style.display="block";
		}
		else if(this.state.type=="ongoing"){
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
				this.markInternshipComplete();
				
				firebase.database().ref("internships/internship/"+this.state.id).set({}).then(function(){window.location.href="/admindashboard";});
			}
			else{ return; }
		}
		else{
			return;
		}
	}
	updateResumeLink(url,i){
		let s=this.state.appliedUserData;
		for(var j=0;j<s.length;j++){
			if(s[j].uid==i){
				s[j].resume=url;
			}
		}
		this.setState({shortlisted:s});		
	}
	componentDidMount(){
		document.getElementById("internshipBody").style.display="block";
		document.getElementById("companyDescAdminDashboard").style.display="none";
		document.getElementById("internshipDescAdminDashboard").style.display="none";
		document.getElementById("categoryTabAdminDashboard").style.display="none";
		document.getElementById("skillsListAdminDashboard").style.display="none";
		document.getElementById("internshipOtherDetailsAdminDashboard").style.display="none";
		if(document.getElementById("internsfeedbackAdminDashboard"))
			document.getElementById("internsfeedbackAdminDashboard").style.display="none";
		let tmp=this.props.getStateMethod;
		let temp=tmp();
		let stateCopy=Object.assign({},temp);
		let internship=Object.assign({},stateCopy.internshipdata[stateCopy.internship]);
		internship.mainRef=temp;
		internship.type=stateCopy.type;
		internship.id=stateCopy.internship;
		internship.appliedLength=0;
		internship.duration1=(internship.duration%7==0 && internship.duration%30!=0)?(internship.duration/7)+" week(s)":(internship.duration/30)+" month(s)";
		if(internship.applied){	internship.appliedLength=internship.applied.length;		}
		let dt=new Date(internship.applicationdt);
		internship.applicationdt1=dt.getDate()+"/"+(dt.getMonth()+1)+"/"+dt.getFullYear();
		dt=new Date(internship.startdt);
		internship.startdt1=dt.getDate()+"/"+(dt.getMonth()+1)+"/"+dt.getFullYear();
		if(internship.type=="application"){
			document.getElementById("toselect").style.display="none";
		}
		else if(internship.type=="ongoing"){
			document.getElementById("ongoing").style.display="none";
		}
		else if(internship.type=="open"){
			document.getElementById("open").style.display="none";
		}
		else if(internship.type=="completed"){
			document.getElementById("completed").style.display="none";
		}
		internship.studentdata=stateCopy.studentdata;
		internship.internshipdata=stateCopy.internshipdata;
		internship.userValid=stateCopy.userValid;
		let appliedUserdata=[];
		let uresl=this.updateResumeLink;
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
				resume:"",
				marks:m,
				shortlisted:false,
				isNew:true,
				isMember:false,
				doingInternship:internship.studentdata[i].doingInternship
			};
			if(internship.prevApplied){
				for(var j in internship.prevApplied){
					if(internship.shortlisted && internship.shortlisted.includes(i)){item.shortlisted=true; item.isNew=false;}
					else if(internship.prevApplied.includes(i)){ item.shortlisted=false; item.isNew=false; }
					else{item.shortlisted=true; item.isNew=true;}					
				}
			}
			else{
				item.shortlisted=true;
				item.isNew=true;
			}
			if(internship.members){
			if(internship.members.includes(item.uid)){
				item.isMember=true;
			}}
			appliedUserdata.push(item);
		}}
		if(internship.feedback){
			for(var x in internship.feedback){
				let feedbackid=internship.feedback[x].uid;
				for(var y in appliedUserdata){
					if(appliedUserdata[y].uid==feedbackid){
						internship.feedback[x].name=appliedUserdata[y].name;
						if(internship.feedback[x].score<=5){
						internship.feedback[x].score=(internship.feedback[x].score-1)*25;}
						break;
					}
				}				
			}
		}
		}
		internship.appliedUserData=appliedUserdata;	
		internship.iidf=internship.id;
		let res=encodeURIComponent(internship.id);
		let link0=window.location.href;
		let link1=link0.slice(0,link0.indexOf("admindashboard"))+"studentfeedbackinternship?internship="+res;
		internship.feedbacklink=link1;
		if(internship.studentFeedbackByCompany){
			for(var m in internship.studentFeedbackByCompany){
				internship.studentFeedbackByCompany[m].usn=internship.studentdata[internship.studentFeedbackByCompany[m].uid].usn;
			}
		}
		if(internship.remarks==" "){internship.remarks=""; }
		this.setState(internship);
		for(var i in internship.appliedUserData){
			if(internship.appliedUserData[i].resumeloc){
			if(internship.appliedUserData[i].resumeloc.startsWith("resumes")){
				let uids=internship.appliedUserData[i].uid;
				firebase.storage().ref(internship.appliedUserData[i].resumeloc).getDownloadURL().then(function(url){
					uresl(url,uids);
				});
			}}
		}

		this.setState({loading:true});
	}
	approveInternship(){
		let tmp=this.state.id;
		firebase.database().ref("internships/internship/"+tmp).update({approved:true});
		this.state.mainRef.internshipdata[tmp].approved=true;
		this.setState({approved:true});
	}
	getInternshipState(){
		let st=this.state;
		return st;
	}
	updateRemarks(){
		let tmp=this.state.id;
		firebase.database().ref("internships/internship/"+tmp+"/remarks").set(this.state.remarks);
		this.state.mainRef.internshipdata[tmp].remarks=this.state.remarks;
	}
	toggleTest(){
		let stateinternshipid=this.state.id;
		if(!(this.state.testEnable)){
			let ans=window.prompt("Set time limit in minutes for the test (0 for none):","");
			if(ans!=""){
				ans=parseInt(ans);
				if(ans==0 || isNaN(ans)){}
				else{
					firebase.database().ref("internships/internship/"+stateinternshipid+"/testDuration").set(ans);
					this.state.mainRef.internshipdata[stateinternshipid].testDuration=ans;
				}
			}
			this.state.mainRef.internshipdata[stateinternshipid].testEnable=true;
		firebase.database().ref("internships/internship/"+stateinternshipid).update({testEnable:true}).then(function(){
			document.getElementById("testtoggle").classList="btn1";;
		});}
		else{
			this.state.mainRef.internshipdata[stateinternshipid].testEnable=false;
			firebase.database().ref("internships/internship/"+stateinternshipid).update({testEnable:false}).then(function(){
			document.getElementById("testtoggle").classList="internshipMiniTest	";});
		}
		if(this.state.progress<=1){
		firebase.database().ref("internships/internship/"+stateinternshipid+"/progress").set(1);
		this.setState({progress:1});
		this.state.mainRef.internshipdata[stateinternshipid].progress=1;
		}
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
				let item={internshipid:iid,notifText:str, type:"minitest", gotoLink:"/minitest"};
				tmp.push(item);}
				else{
					tmp=[];
					let item={internshipid:iid,notifText:str, type:"minitest", gotoLink:"/minitest"};
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
		if(tmp[index].shortlisted==true){
		tmp[index].shortlisted=false;}
		else{tmp[index].shortlisted=true;}
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
		let rejectlist=[],rejects=false;
		for(var i in list){
			if(list[i].shortlisted){
				if(list[i].doingInternship){
					rejects=true;
					rejectlist.push(list[i]);
				}
				else{
				shortlist.push(list[i].uid);}
			}
		}
		if(rejects){
			firebase.database().ref("internships/internship/"+id+"/prevApplied").set(this.state.applied);
			let str="Cannot shortlist the following:\n";
			for(var k in rejectlist){
				str+=rejectlist[k].name+" ("+rejectlist[k].usn+")\n";
			}
			str+="Reason: Already finalised for an internship";
			alert(str);
		}
		else{
			if(this.state.progress>2){}
		else{
		firebase.database().ref("internships/internship/"+id+"/shortlisted").set(shortlist);
		firebase.database().ref("internships/internship/"+id+"/prevApplied").set(this.state.applied);
		/*for(var j in shortlist){
			let sj=shortlist[j];
			firebase.database().ref("internships/students/"+sj+"/notifications").once("value").then(function(s){
				let notifs=s.val();
				let notif={internshipid:id,notifText:"You have been shortlisted for the internship "+title+". You may be contacted for further selection process."};
				notifs.push(notif);
				firebase.database().ref("internships/students/"+sj+"/notifications").set(notifs);
			});
		}*/}
		}
	}
	sendShortlist(){
		document.getElementById("mailText").style.display="block";
		document.getElementById("confirmSend").style.display="block";
		let htmlcontent="<b>To: </b>"+this.state.companyMail+"<br/><b>Subject: </b>DSCE:Internship Shortlist for "+this.state.title+"<br/><br/>Hello, <br/>The following students were shortlisted for the internship "+this.state.title+" posted on the DSCE Internship Portal.<br/>Please go through their skill sets and confirm your requirement for the internship.<br/>Name - Email (Phone) - Skills<br/><br/>";
		let mailcontent="mailto:"+this.state.companyMail+"?subject=DSCE:Internship%20Shortlist%20for%20"+encodeURIComponent(this.state.title)+"&body=";
		let str="Hello, The following students were shortlisted for the internship '"+this.state.title+"' posted on the DSCE Internship Portal.\nPlease go through their skill sets and confirm your requirement for the internship.\nName - Email (Phone) - Skills\n\n";
		for(var i in this.state.appliedUserData){
			let tmp=this.state.appliedUserData[i];
			if(tmp.shortlisted==true){
				str+=tmp.name+" ("+tmp.sem+" Sem) - "+tmp.email+" ("+tmp.phone+") -\n";
				htmlcontent+=tmp.name+" ("+tmp.sem+" Sem) - "+tmp.email+" ("+tmp.phone+") <br/>";
				if(tmp.skills){
				for(var j=0;j<tmp.skills.length;j++){
					str+=tmp.skills[j]+", ";
					htmlcontent+=tmp.skills[j]+", ";
				}}
				str+="\n \n";
				htmlcontent+="<br/> <br/>";
			}
		}
		str+="\n\nFrom, \nDSCE Internship Portal (Auto Generated)";
		htmlcontent+="<br/>From, <br/>DSCE Internship Portal (Auto Generated)";
		mailcontent+=encodeURIComponent(str);
		document.getElementById("mailText").innerHTML=htmlcontent;
		document.getElementById("confirmSend").href=mailcontent;
	}
	closeOnSend(){ 
		document.getElementById("mailText").style.display="none";
		document.getElementById("confirmSend").style.display="none";
		if(this.state.progress<2){
		firebase.database().ref("internships/internship/"+this.state.id+"/progress").set(2);
		this.setState({progress:2});
		let tmp=this.state.id;
		this.state.mainRef.internshipdata[tmp].progress=2;
		}
	}
	finaliseShortlist(){
		if(this.state.finalised && this.state.progress>=3){
			
		}
		else{
			let iid=this.state.id;
			firebase.database().ref("internships/internship/"+this.state.id).update({finalised:true});
			this.state.mainRef.internshipdata[iid].finalised=true;
			if(this.state.progress<=3){
				firebase.database().ref("internships/internship/"+this.state.id).update({progress:3});
				this.setState({progress:3});
				this.state.mainRef.internshipdata[iid].progress=3;
			}			
			let title=this.state.title;
			for(var i=0; i<this.state.shortlisted.length;i++){
				if(this.state.shortlisted[i].shortlisted){
				let id=this.state.shortlisted[i].uid;
				firebase.database().ref("internships/students/"+id+"/notifications").once("value").then(function(s){
					let notifs=s.val();
					let notif={internshipid:iid,notifText:"You have been selected for the internship "+title+". Meet the internship cell in the department and sign an undertaking before the start date."};
					notifs.push(notif);
					firebase.database().ref("internships/students/"+id+"/notifications").set(notifs);
				});
				firebase.database().ref("internships/students/"+id+"/doingInternship").set(true);
				for(var j in this.state.internshipdata){
					let temp=this.state.internshipdata[j];
					if(j==iid){continue;}
					if(temp.applied){
					if(temp.applied.includes(i)){
						let item={shortlisted:temp.shortlisted};
						if(item.shortlisted.includes(i)){
							let tmp=[];
							for(var m in item.shortlisted){
								if(item.shortlisted[m]!=i){tmp.push(item.shortlisted[m]);}
							}
							item.shortlisted=tmp;
							firebase.database().ref("internships/internship/"+j).update(item);
						}
					}
				}}}
			}			
		}
		//setTimeout(function(){
		//window.location.href="/admindashboard";},1000);
	}
	startInternship(){
		firebase.database().ref("internships/internship/"+this.state.id+"/progress").set(5);
		firebase.database().ref("internships/internship/"+this.state.id+"/startdt").set(Date.now());
		firebase.database().ref("internships/internship/"+this.state.id+"/isStarted").set(true).then(function(){
			window.location.href="/admindashboard";
		});
	}
	undertakingComplete(){
		let id=this.state.id;
		let mem=[];
		for(var i in this.state.shortlisted){
			mem.push(this.state.shortlisted[i].uid);
		}
		firebase.database().ref("internships/internship/"+id+"/progress").set(5).then(function(){
			firebase.database().ref("internships/internship/"+id+"/remarks").set(" ");
		});
		this.setState({progress:5});
		this.state.mainRef.internshipdata[id].progress=5;
		firebase.database().ref("internships/internship/"+id+"/members").set(mem);
	}
	markInternshipComplete(){
		let ans=window.confirm("Do you want to mark this internship as completed?");
		if(ans){
			let members=this.state.members;
			let t=this.state.title;
			let id=this.state.id;
			if(members){
				let n={notifText:"Please provide feedback about the internship "+t+". Click on this notification to provide feedback",
				gotoLink:"/studentdashboard/feedback?internship="+id,
				internshipid:id};
				for(var i in members){
					firebase.database().ref("internships/students/"+members[i]+"/notifications").once("value").then(function(s){
						let notifs=s.val();
						notifs.push(n);
						firebase.database().ref("internships/students/"+members[i]).update({doingInternship:false,notifications:notifs});
					});
				}
			}
			firebase.database().ref("internships/internship/"+id+"/isComplete").set(true).then(function(){
				setTimeout(function(){window.location.href="/admindashboard";},1000);
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
		{(this.state.type=="open")?<div><b>Internship Description: </b><pre>{this.state.description}</pre></div>:<div>
			<b className="internship1">Internship Description:</b><button id="internshipDescBtnAdminDashboard" onClick={this.expandInternshipDesc}>Expand</button><div id="internshipDescAdminDashboard"><pre className="internship1">{this.state.description}</pre></div></div>}
		{this.state.type=="open"?<div><b className="internship1">Company Description:</b>{this.state.companyDesc}</div>:<div>
			<b className="internship1">Company Description:</b><button id="companyDescBtnAdminDashboard" onClick={this.expandCompanyDesc}>Expand</button><div id="companyDescAdminDashboard">{this.state.companyDesc}</div></div>}
		<b className="internship1">Skills Required: </b>
		<button id="skillsListBtnAdminDashboard" onClick={this.expandSkillsList}>Expand</button>
		<ul className="internship1" id="skillsListAdminDashboard">
		{((this.state.skillSet)?(this.state.skillSet.map((item,index)=>{
			return(<li key={index}>{item}</li>);
		})):"None")}</ul><br/>
		<b className="internship1">Other Details:</b><button id="internshipOtherDetailsBtnAdminDashboard" onClick={this.expandInternshipOtherDetails}>Expand</button>
		<div id="internshipOtherDetailsAdminDashboard"><table className="internship1"><tbody>
		<tr><td><b>Work Hours: </b> {((this.state.workCategory=="full-time")?"Full Time":((this.state.workCategory=="part-time")?"Part Time":"Work From Home"))} - {((this.state.workTimings!="-")?(this.state.workTimings):"Timings Not Mentioned")}</td>
		<td><b>Stipend:</b> {this.state.stipend}</td><td><b>No. of Students Applied: </b>{this.state.appliedLength}</td></tr>
		<tr><td><b>Start Date: </b>{this.state.startdt1}</td>
		<td><b>Last Date to apply: </b>{this.state.applicationdt1}</td>
		<td><b>Duration:</b> {this.state.duration1}</td></tr>
		<tr><td><b>Interns Required:</b> {this.state.minRequirement==0?"Not Specified":this.state.minRequirement}</td>
		<td><b># of Tests:</b> {this.state.minitest?this.state.minitest.length:0}</td></tr>
		</tbody></table></div>
		{(this.state.type=="completed" || this.state.type=="open")?"":(<p className="internship1"><b>Status: </b>{this.state.progress==0 && this.state.type=="application"?"Applications":(this.state.progress==20?"Test Taken":(this.state.progress==40?"Shortlist Sent":(this.state.progress==60?"Students Finalised":(this.state.progress==80?"Undertaking Signed":"Ready to Start"))))}</p>)}
		<br/><a href={"tel:"+this.state.companyPhone}><button className="btn">Call Company</button></a><a href={"mailto:"+this.state.companyMail}><button className="btn">Email Company</button></a>
		<button className="internshipIconbtn" onClick={this.deleteInternship}><img src="deleteicon.png" className="internshipIcon"/>
		</button><button className="internshipIconbtn" onClick={this.gotoEditInternship}><img src="editicon.png" className="internshipIcon"/></button>
		<button className="internshipIconbtn" onClick={this.copyInternship}><img src="copyicon.png" className="internshipIcon"/></button>
		{this.state.type=="ongoing"?<button className="btn" onClick={this.markInternshipComplete}>Internship Completed</button>:""}
		{(this.state.type!="open" && this.state.type!="application")?<div style={{marginTop:'80px',marginBottom:'80px'}}><span className="blockTitleFont">PROGRESS REMARKS:</span><textarea name="remarks" onChange={this.changedState} value={this.state.remarks} className="remarks"></textarea><br/><button className="btn" onClick={this.updateRemarks}>Update</button></div>:""}
		{(this.state.studentFeedbackByCompany&&this.state.type=="completed")?<div style={{marginBottom:'80px'}}>
		<span className="blockTitleFont">COMPANY'S FEEDBACK ON INTERNS:</span>
			{this.state.studentFeedbackByCompany.map((item4,index4)=>{return(
				<div className="feedbackInternship" key={index4}>
				<h4 style={{padding:'0px',margin:'0px',fontSize:'12pt'}}>{item4.name} ({item4.usn})</h4>
					<span style={{fontSize:'10pt',marginLeft:'10px'}}>{item4.fd}</span>
				</div>
			);})}
		</div>:""}
		{((this.state.type=="ongoing" || this.state.type=="completed") && this.state.members && this.state.applied)?<div style={{marginTop:'80px',marginBottom:'80px'}}><span className="blockTitleFont">INTERN DETAILS:</span>
			<table className="internship1StudentMembers"><tbody><tr><th>USN</th><th>Name</th><th></th><th></th><th></th></tr>
				{this.state.appliedUserData.map((item3,index3)=>{
					if(item3.isMember){
					return(
					<tr key={index3} className="internship1StudentApplied"><td>{item3.usn}</td>
					<td>{item3.name}</td>
					<td><a className="internship1StudentApplied" href={"mailto:"+item3.email}><img src="mailicon.png" className="internshipIcon"/></a></td>
					<td><a className="internship1StudentApplied" href={"tel:"+item3.phone}><img src="callicon.png" className="internshipIcon"/></a></td>
					<td><a className="internship1StudentApplied" href={"https://wa.me/91"+item3.phone} target="_blank"><img src="whatsappicon.png" className="internshipIcon"/></a></td>
					</tr>
					);}
					else{
						return;
					}
				})}
				</tbody></table>
		</div>:""}
		{(this.state.applied && (this.state.type=="application"||this.state.type=="ongoing"))?
		<div style={{marginTop:'80px',marginBottom:'80px'}}><span className="blockTitleFont">APPLIED STUDENT DETAILS:</span><table className="internship1StudentApplied"><tbody>
		<tr className="internship1StudentApplied"><th>USN<br/>Name</th><th>Sem<br/>Sec</th><th>Email<br/>Phone</th><th></th><th>Skills</th><th>Marks</th><th></th></tr>
		{this.state.appliedUserData.map((item,index)=>{
			return(<tr key={index} className={(item.shortlisted && !item.isNew)?"internship3StudentApplied":((!item.isNew && !item.shortlisted)?"internship1StudentNS":(item.isNew && item.shortlisted)?"internship1StudentApplied":"internship1StudentNS")}>
			<td>{item.usn}<br/>{item.name}</td>
			<td>{item.sem} {item.sec}</td>
			<td><a className="internship1StudentApplied" href={"mailto:"+item.email}><img src="mailicon.png" className="internshipIcon"/></a> <a className="internship2StudentApplied" href={"tel:"+item.phone}><img src="callicon.png" className="internshipIcon"/></a> <a className="internship1StudentApplied" href={"https://wa.me/91"+item.phone} target="_blank"><img src="whatsappicon.png" className="internshipIcon"/></a></td>
			<td>{item.resume!=""?<a className="internship1StudentApplied" href={item.resume} target="_blank">Resume</a>:"-"}</td>
			<td>{item.skills?item.skills.map((item1,index1)=>{return(<span key={index1}>{item1}, </span>);}):""}</td>
			<td>{item.marks==-1?" - ":item.marks}</td>
			<td><button className="shortlistButton" onClick={()=>{this.removeShortlist(index);}}>{item.shortlisted?<span>&times;</span>:<span>+</span>}</button></td>
			</tr>);
		})}</tbody></table>
		{(this.state.type=="open"||this.state.type=="application")?<div>
			{this.state.progress<5?<div style={{display:"block"}}>
		<button onClick={this.applyShortlist} id="applyMtestShortlistChanges" className="internshipMiniTest">Apply Changes</button>
		<button onClick={this.resetShortlist} className="internshipMiniTest">Reset</button>
		{this.state.minitest.length>0?<div style={{marginLeft:'20px',marginRight:'0px',marginTop:'0px',marginBottom:'0px',display:'inline-block'}}>
		<button className="internshipMiniTest" onClick={this.sendMiniTestNotif}>Call For Test</button> → 
		<button className={this.state.testEnable?"btn1":"internshipMiniTest"} onClick={this.toggleTest} id="testtoggle">{this.state.testEnable?"Disable Test":"Enable Test"}</button>
		<input type="number" max="100" min="0" placeholder="Cutoff Score" id="cutoff" style={{marginLeft:'20px'}}className="internshipMiniTest"/>
		<button onClick={this.shortlistCutoffApply}>Apply Cutoff</button>
		</div>:""}
		<div id="popupMinitestNotif" className="popupMinitestNotif">
		<input type="text" id="minitestNotifContent" placeholder="Notification Text" className="popupMinitestNotif"/>
		<input type="date" id="minitestNotifDate" required="required"/>
		<input type="time" id="minitestNotifTime" required="required"/>
		<button onClick={this.completeMinitestNotif} className="popupMinitestNotif">Send</button><br/><br/>
			</div></div>:""}
		<div style={{border:'2px solid #eefaff',borderRadius:'8px',backgroundColor:'#eefaff',padding:'5px',margin:'5px 0px 0px 0px',display:'inline-block',width:'100%'}}>
		<button className={this.state.progress>=2?"internshipMiniTest1":"internshipMiniTest"} onClick={this.sendShortlist}>Shortlist</button>
		{this.state.progress>=2?<span><b>→</b> <button className={this.state.progress>=3?"internshipMiniTest1":"internshipMiniTest"} onClick={this.finaliseShortlist}>Finalize</button></span>:""}
		{this.state.progress>=3?<span><b>→</b> <button className={this.state.progress>=4?"internshipMiniTest1":"internshipMiniTest"} onClick={this.undertakingComplete}>Undertaking Signed</button></span>:""}
		{(this.state.progress>=4||this.state.type=="ongoing"||this.state.type=="completed")?<span className="statusText">Undertaking Signed</span>:(this.state.progress===3 || this.state.finalised)?<span className="statusText">Finalized</span>:(this.state.progress===2)?<span className="statusText">Shortlist Sent</span>:""}
		{this.state.progress>=4?<span><b>→</b> <button className="internshipMiniTest" onClick={this.startInternship}>Start Internship Now</button></span>:""}
		</div>
		<p id="mailText"></p>
		<a href="" id="confirmSend" className="internshipMiniTest" onClick={this.closeOnSend}>Confirm Send</a>
		<br/>
		</div>:""}
		</div>:""}
		
		{(this.state.type=="ongoing"||this.state.type=="completed")?<div style={{marginTop:'50px',marginBottom:'50px'}}>
		<span className="blockTitleFont">LINK TO BE SHARED TO RECEIVE COMPANY'S FEEDBACK ON INTERNS:</span>
		<input type="text" value={this.state.feedbacklink} style={{width:'99%', padding:'5px'}} disabled/></div>:""}
		{(this.state.type=="completed" && this.state.feedback)?<div style={{marginTop:'80px',marginBottom:'80px'}}>
		<span className="blockTitleFont" style={{display:'inline-block',marginRight:'10px'}}>INTERN'S FEEDBACK: </span> 
		<button id="internsfeedbackBtnAdminDashboard" onClick={this.expandInternsFeedback}>Expand</button>
		<div id="internsfeedbackAdminDashboard" className="internshipFeedbackDisp" style={{display:'none'}}>
		{this.state.iidf?<InternshipFeedbacks iid={this.state.iidf} fd={this.state.feedback} stdata={this.state.studentdata} ap={this.state.members}/>:""}
		</div>
		</div>:""}
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
	  this.closeSideBar=this.closeSideBar.bind(this);
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
	componentDidMount(){
		firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			if(!user.isAnonymous){
			firebase.database().ref("users/"+user.uid+"/teacher").once("value").then(function(snapshot){
			if(snapshot.val()){  }
			else{ window.location.href="/";}
			});}
			else{window.location.href="/";}
		} 
		else{
			window.location.href="/";
		}
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
		<Header pageTitle="← Add New Test" linkto={true}/>
		<div className="sidebar" id="sidebar">
		<button className="sidebarclose" onClick={this.closeSideBar}>&times;</button>
		<ActionsDiv onGoingLoc="/admindashboard#ongoing" applicationsLoc="/admindashboard#toselect"/>
		</div>
		
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
			<div className="option">Option 4<input type="radio" value="4" name="canswer" onChange={this.changedState}/></div><br/>
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
			username:"DSCE",
			studentreq:""
		};
		this.addInternship = this.addInternship.bind(this);
		this.changedState=this.changedState.bind(this);
		this.closeSideBar=this.closeSideBar.bind(this);
		this.loadSkills=this.loadSkills.bind(this);
		this.sendNewNotification=this.sendNewNotification.bind(this);
		this.gotoNewInternshipLink=this.gotoNewInternshipLink.bind(this);
	}
	gotoNewInternshipLink(){
		window.location.href="/newinternshiplink";
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
		firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			if(user.isAnonymous){
				this.setState({username:"None"});
			}
		} 
		else{
			firebase.auth().signInAnonymously().catch(function(error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		});
		}
		}); 
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
			//newState.username=decodeURI(searchParams.get("cname"));
		}
		newState.isLoading=true;
		newState.dateToday=str;
		newState.minitests=[];
		this.setState(newState);
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
		window.location.href="/newinternship";
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
			minitest:[],
			progress:0,
			duration:dur1,
			approved:false,
			minRequirement:(this.state.studentreq?parseInt(this.state.studentreq):0)
		};
		if(item.companyMail==""||item.companyName==""||item.title==""||item.startdt==""||item.applicationdt==""||item.companyPhone==""){
			alert("Please Fill all the fields!");
		}
		else if(item.startdt<item.applicationdt){
			alert("Start Date must be same as or after Apply By date.");
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
		{this.state.username!="DSCE"?"":
		<Header pageTitle="← New Internship" userName={this.state.username} linkto={false}/>}
		<div className="sidebar" id="sidebar">
		<button className="sidebarclose" onClick={this.closeSideBar}>&times;</button>
		<ActionsDiv onGoingLoc="/admindashboard#ongoing" applicationsLoc="/admindashboard#toselect"/>
		</div>
		{this.state.username=="DSCE"?<button className="btn" style={{marginTop:'4px'}}onClick={this.gotoNewInternshipLink}>Create Link</button>:""}
		<div className="formClass">
		<table className="formClass">
		<tbody>
		<tr className="formClass"><th className="formClass">Title:*</th><td className="formClass"><input type="text" name="ititle" onChange={this.changedState}/></td></tr>
		<tr className="formClass"><th className="formClass">Description:</th><td className="formClass"><textarea name="desc" onChange={this.changedState}></textarea></td></tr>
		<tr className="formClass"><th className="formClass">Company Name:*</th><td className="formClass"><input type="text" name="cName" id="compname" value={this.state.cName} onChange={this.changedState}/></td></tr>
		<tr className="formClass"><th className="formClass">Contact Email:*</th><td className="formClass"><input type="email" name="cMail" onChange={this.changedState}/></td></tr>
		<tr className="formClass"><th className="formClass">Contact Number:*</th><td className="formClass"><input type="tel" name="cPhone" maxLength="12" pattern="[0-9]{8,}" onChange={this.changedState}/></td></tr>
		<tr className="formClass"><th className="formClass">Company Description:</th><td className="formClass"><input type="text" name="cDesc" onChange={this.changedState}/></td></tr>
		<tr className="formClass"><th className="formClass">Apply By Date:*</th><td className="formClass"><input type="date" name="adt" min={this.state.dateToday} onChange={this.changedState}/></td></tr>
		<tr className="formClass"><th className="formClass">Internship Start By Date:*</th><td className="formClass"><input type="date" name="sdt" min={this.state.dateToday} onChange={this.changedState}/></td></tr>
		<tr className="formClass"><th className="formClass">Skills Required:</th><td className="formClass"><CreatableSelect value={selectedOption} options={this.state.skilloptions} onChange={this.handleChange} isMulti={true} isLoading={this.state.isLoading}/></td></tr>
		<tr className="formClass"><th className="formClass">Work Timings:</th><td className="formClass"><select onChange={this.changedState} name="workcat"><option value="full-time">Full Time</option>
		<option value="part-time">Part Time</option>
		<option value="work-from-home">Work From Home</option></select></td></tr>
		<tr className="formClass"><th className="formClass"></th><td><input name="starttime" type="time" min="07:00" max="22:00" onChange={this.changedState} className="formClass2"/> - <input type="time" name="endtime" min="07:00" max="22:00" onChange={this.changedState} className="formClass2"/></td></tr>
		<tr className="formClass"><th className="formClass">Length of Internship:*</th><td className="formClass1"><input type="number" min="1" name="dur" onChange={this.changedState}/><select id="daterangeselect"><option value="months">Months</option><option value="weeks">Weeks</option></select></td></tr>
		<tr className="formClass"><th className="formClass">Stipend (0 if not applicable):*</th><td className="formClass"><input type="number" min="0" name="stip" onChange={this.changedState}/></td></tr>
		<tr className="formClass"><th className="formClass">Students Required:</th><td className="formClass"><input type="number" min="0" name="studentreq" onChange={this.changedState}/></td></tr>
		<tr className="formClass"><td colSpan="2" className="formClass"><button onClick={this.addInternship} className="formClass">Add</button> * marked fields are required </td></tr>
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
		<Header pageTitle="← Internship Link"/>
		<div className="linkcreate">
		<input type="text" required="required" id="compName" placeholder="Company Name" className="linkcreate"/>
		<button onClick={this.createLink} className="linkcreate">Create Link</button><br/><br/>
		<input type="text" id="result" className="linkcreate1"/>
		</div>
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
			if(newState.internshipdata[i].startdt<dt && newState.internshipdata[i].isComplete==true){
				let item=Object.assign({},newState.internshipdata[i]);
				let days=item.duration;
				item.duration=(item.duration%7==0)?((item.duration/7)+" week(s)"):((item.duration/30)+" month(s)");
				item.appliedcount=(item.applied?item.applied.length:0);
				item.id=i;
				item.progress=0;
				let dt1=new Date(item.startdt);
				item.startdt1=dt1.getDate()+"/"+(dt1.getMonth()+1)+"/"+dt1.getFullYear();
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
			<p className="internship"><span className="internship">No. of students applied: {item.appliedcount}</span><span className="internship">Duration: {item.duration}</span><span className="internship">Started On: {item.startdt1}</span></p>
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
			if(newState.internshipdata[i].applicationdt>dt && newState.internshipdata[i].isComplete==false && !newState.internshipdata[i].approved){
				let item=Object.assign({},newState.internshipdata[i]);
				let days=item.duration;
				item.duration=(item.duration%7==0)?((item.duration/7)+" week(s)"):((item.duration/30)+" month(s)");
				item.appliedcount=(item.applied?item.applied.length:0);
				item.id=i;
				item.progress=0;
				let dt1=new Date(item.startdt);
				item.startdt1=dt1.getDate()+"/"+(dt1.getMonth()+1)+"/"+dt1.getFullYear();
				newState.internships.push(item);
			}
		}
		this.setState(newState);
	}
	render(){
		return(
		<div className="closedDiv" id="open">
		<h3 className="closedDiv">Approve New Internships</h3>
		{this.state.internships.map((item) =>{
			return(
			<div key={item.id} className="internship" onClick={()=>{this.gotoInternship(item.id)}}>
			<h3 className="internship">{item.title}</h3>
			<p className="internshipCompany">{item.companyName}</p>
			<p className="internship"><span className="internship">No. of students applied: {item.appliedcount}</span><span className="internship">Duration: {item.duration}</span><span className="internship">Starts On: {item.startdt1}</span></p>
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

class EditInternship extends React.Component{
	constructor(){
		super();
		this.state={
			applicationdt:"",
			companyDesc:"",
			companyMail:"",
			companyName:"",
			companyPhone:"",
			description:"",
			duration:0,
			startdt:"",
			stipend:0,
			starttime:"",
			endtime:"",
			title:"",
			workCategory:"",
			workTimings:"",
			selectedOption:[],
			minitestoptions:[],
			minitests:[],
			skilloptions:[],
			isLoading:false,
			dateToday:"2019-01-01",
			username:"DSCE",
			minRequirement:0
		};
		this.modifyInternship = this.modifyInternship.bind(this);
		this.changedState=this.changedState.bind(this);
		this.closeSideBar=this.closeSideBar.bind(this);
		this.loadMinitests=this.loadMinitests.bind(this);
		this.loadSkills=this.loadSkills.bind(this);
		this.loadInternship=this.loadInternship.bind(this);
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
	loadInternship(id,mtest){		
		firebase.database().ref("internships/internship/"+id).once("value").then((s)=>{
			let data=s.val();
			let dt=new Date(data.applicationdt);
			let str=dt.getFullYear()+"-";
			if(dt.getMonth()<9){
				str+="0"+(dt.getMonth()+1)+"-";
			}
			else{
				str+=(dt.getMonth()+1)+"-";
			}
			if(dt.getDate()<10){
				str+="0"+dt.getDate();
			}
			else{
				str+=dt.getDate();
			}
			data.applicationdt=str;
			dt=new Date(data.startdt);
			str=dt.getFullYear()+"-";
			if(dt.getMonth()<9){
				str+="0"+(dt.getMonth()+1)+"-";
			}
			else{
				str+=(dt.getMonth()+1)+"-";
			}
			if(dt.getDate()<10){
				str+="0"+dt.getDate();
			}
			else{
				str+=dt.getDate();
			}
			data.startdt=str;
			if(data.duration%30==0){ data.duration=data.duration/30; }
			else{ 
				data.duration=data.duration/7;
				document.getElementById("daterangeselect").value="weeks"
			}
			data.selectedOption=[];
			for(var i in data.skillSet){
				let item={label:data.skillSet[i],value:data.skillSet[i]};
				data.selectedOption.push(item);
			}
			if(data.workTimings!="-"){
				let tim=data.workTimings.split("-");
				data.starttime=tim[0];
				data.endtime=tim[1];
			}
			data.minitestoptions=[];
			if(data.minitest){
			for(var i in data.minitest){
				data.minitestoptions.push({label:mtest[data.minitest[i]].topic,value:data.minitest[i]});
			}}
			this.setState(data);
		});
	}
	componentDidMount(){
		firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			if(!user.isAnonymous){
			firebase.database().ref("users/"+user.uid+"/teacher").once("value").then(function(snapshot){
			if(snapshot.val()){  }
			else{ window.location.href="/";}
			});}
			else{window.location.href="/";}
		} 
		else{
			window.location.href="/";
		}
		}); 
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
		if(searchParams.get("internship")){
			newState.id=decodeURI(searchParams.get("internship"));
			if(searchParams.get("copy")){
				newState.copyi=decodeURI(searchParams.get("copy"));
			}
			else{
				newState.copyi=false;
			}
		}
		else{
			newState.username="DSCE";
		}
		newState.isLoading=true;
		newState.dateToday=str;
		this.setState(newState);
		let loadin=this.loadInternship;
		firebase.database().ref("internships/minitests").once('value').then(function(snapshot){ tmp(snapshot);
			loadin(newState.id,snapshot.val());
		});
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
	modifyInternship(){
		let appdt1=(new Date(this.state.applicationdt)).valueOf();
		let startdt1=(new Date(this.state.startdt)).valueOf();
		let dur1;
		if(document.getElementById("daterangeselect").value=="months"){
			dur1=this.state.duration*30;
		}
		else{
			if(this.state.duration%4==0){
				dur1=(this.state.duration/4)*30;
			}
			else
				dur1=this.state.duration*7;
		}
		let worktim=this.state.starttime+"-"+this.state.endtime;
		let skill=[],mini=[];
		for(let i in (this.state.selectedOption)){skill.push(this.state.selectedOption[i].value);}
		for(let i in (this.state.minitestoptions)){mini.push(this.state.minitestoptions[i].value);}
		let item={
			applicationdt:appdt1,
			companyDesc:this.state.companyDesc.trim(),
			companyMail:this.state.companyMail.trim(),
			companyName:this.state.companyName.trim(),
			companyPhone:this.state.companyPhone.trim(),
			description:this.state.description.trim(),
			isComplete:false,
			remarks:"",
			startdt:startdt1,
			stipend:(this.state.stipend?parseInt(this.state.stipend):0),
			workCategory:this.state.workCategory,
			workTimings:worktim,
			testEnable:false,
			title:this.state.title.trim(),
			skillSet:skill,
			minitest:mini,
			duration:dur1,
			approved:true,
			minRequirement:(this.state.minRequirement?parseInt(this.state.minRequirement):0)
		};
		if(item.companyMail==""||item.companyName==""||item.title==""||item.startdt==""||item.applicationdt==""){
			alert("Please Fill all the fields!");
		}
		else if(item.startdt<item.applicationdt){
			alert("Start Date must be after last application date.");
		}
		else{	
			if(this.state.copyi){
			let sendNotification=this.sendNewNotification;
			let newKey=firebase.database().ref("internships/internship").push().key;
			firebase.database().ref('internships/internship/'+newKey).update(item).then(()=>{ 
			alert("Internship Copied");
			window.location.href="/admindashboard";
			},()=>{alert("Connection Error!");});
			}
			else{
			let sendNotification=this.sendNewNotification;
			firebase.database().ref('internships/internship/'+this.state.id).update(item).then(()=>{ 
			alert("Internship Updated");
			window.location.href="/admindashboard";
			},()=>{alert("Connection Error!");});
			}
		}
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
		<Header pageTitle="← Edit Internship" userName={this.state.username} linkto={false}/>
		<div className="sidebar" id="sidebar">
		<button className="sidebarclose" onClick={this.closeSideBar}>&times;</button>
		<ActionsDiv onGoingLoc="/admindashboard#ongoing" applicationsLoc="/admindashboard#toselect"/>
		</div>
		<div className="formClass">
		<table className="formClass">
		<tbody>
		<tr className="formClass"><th className="formClass">Title:</th><td className="formClass"><input type="text" name="title" value={this.state.title} onChange={this.changedState}/></td></tr>
		<tr className="formClass"><th className="formClass">Description:</th><td className="formClass"><textarea name="description" value={this.state.description} onChange={this.changedState}></textarea></td></tr>
		<tr className="formClass"><th className="formClass">Company Name:</th><td className="formClass"><input type="text" name="companyName" id="compname" value={this.state.companyName} onChange={this.changedState}/></td></tr>
		<tr className="formClass"><th className="formClass">Contact Email:</th><td className="formClass"><input type="email" name="companyMail" onChange={this.changedState} value={this.state.companyMail}/></td></tr>
		<tr className="formClass"><th className="formClass">Contact Number:</th><td className="formClass"><input type="tel" name="companyPhone" maxLength="12" pattern="[0-9]{8,}" onChange={this.changedState} value={this.state.companyPhone}/></td></tr>
		<tr className="formClass"><th className="formClass">Company Description:</th><td className="formClass"><input type="text" name="companyDesc" onChange={this.changedState} value={this.state.companyDesc}/></td></tr>
		<tr className="formClass"><th className="formClass">Internship Start Date:</th><td className="formClass"><input type="date" name="startdt" value={this.state.startdt} onChange={this.changedState}/></td></tr>
		<tr className="formClass"><th className="formClass">Last Application Date:</th><td className="formClass"><input type="date" name="applicationdt" value={this.state.applicationdt} onChange={this.changedState}/></td></tr>
		<tr className="formClass"><th className="formClass">Skills Required:</th><td className="formClass"><CreatableSelect value={selectedOption} options={this.state.skilloptions} onChange={this.handleChange} isMulti={true} isLoading={this.state.isLoading}/></td></tr>
		<tr className="formClass"><th className="formClass">Work Timings:</th><td className="formClass"><select onChange={this.changedState} value={this.state.workCategory} name="workCategory"><option value="full-time">Full Time</option>
		<option value="part-time">Part Time</option>
		<option value="work-from-home">Work From Home</option></select></td></tr>
		<tr className="formClass"><th className="formClass"></th><td><input name="starttime" type="time" min="07:00" max="22:00" onChange={this.changedState} className="formClass2" value={this.state.starttime}/> - <input type="time" name="endtime" min="07:00" max="22:00" onChange={this.changedState} value={this.state.endtime} className="formClass2"/></td></tr>
		<tr className="formClass"><th className="formClass">Length of Internship:</th><td className="formClass1"><input type="number" min="1" name="duration" value={this.state.duration} onChange={this.changedState}/><select id="daterangeselect"><option value="months">Months</option><option value="weeks">Weeks</option></select></td></tr>
		<tr className="formClass"><th className="formClass">Stipend (0 if not applicable):</th><td className="formClass"><input type="number" min="0" name="stipend" value={this.state.stipend} onChange={this.changedState}/></td></tr>
		<tr className="formClass"><th className="formClass">Min. Student Requirement:</th><td className="formClass"><input type="number" name="minRequirement" min="0" value={this.state.minRequirement} onChange={this.changedState}/></td></tr>
		<tr className="formClass"><th className="formClass">Mini Tests</th><td className="formClass"><Select value={minitestoptions} options={this.state.minitests} onChange={this.handleChange1} isMulti={true} isLoading={this.state.isLoading}/></td></tr>
		<tr className="formClass"><td colSpan="2" className="formClass"><button onClick={this.modifyInternship} className="formClass">{this.state.copyi?"Copy":"Edit"}</button></td></tr>
		</tbody></table>
		</div>
		</div>
		);
	}
}

class SendNotification extends React.Component{
	constructor(){
		super();
		this.state={};
		this.updateDatabase=this.updateDatabase.bind(this);
	}
	componentDidMount(){
		firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			if(!user.isAnonymous){
			firebase.database().ref("users/"+user.uid+"/teacher").once("value").then(function(snapshot){
			if(snapshot.val()){  }
			else{ window.location.href="/";}
			});}
			else{window.location.href="/";}
		} 
		else{
			window.location.href="/";
		}
		}); 
	}
	updateDatabase(){
		document.getElementById("loadingShow").style.display="block";
		setTimeout(function(){document.getElementById("loadingShow").style.display="none"; alert("Notifications Sent");},5000);
		let content=document.getElementById("notification1").value;
		let notifItem={
			internshipid:"Admin",
			notifText:content
		};
		if(document.getElementById("notification3").value.trim()!=""){notifItem.gotoLink=document.getElementById("notification3").value.trim();}
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
					notif.push(notifItem);
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
					notif.push(notifItem);
					firebase.database().ref("internships/students/"+j+"/notifications").update(notif);
					break;
				}
			});
		}
}
	render(){
		return(
		<div>
		<Header pageTitle="← Custom Notification"/>
		<div className="notificationAdmin">
		<h3 className="notificationAdmin">Notification Content:</h3>
		<input className="notificationAdmin" type="text" id="notification1"/><br/>
		<h3 className="notificationAdmin">Link (If Any, start with http://):</h3>
		<input className="notificationAdmin" type="url" placeholder="Link" id="notification3"/><br/>
		<h3 className="notificationAdmin">Student List (Separated By Commas):</h3>
		<input type="text" id="notification2" className="notificationAdmin"/><br/>
		<button onClick={this.updateDatabase} className="btn">Send</button>
		<br/><br/>
		<img className="loadicon" src="loadingicon.png" id="loadingShow"/>
		</div>
		</div>
		);
	}
}

class StudentFeedbackCompany extends React.Component{
	constructor(){
		super();
		this.state={
			iid:"",
			memberdata:[]
		};
		this.updateName=this.updateName.bind(this);
		this.updateFeedback=this.updateFeedback.bind(this);
		this.submitFeedbackStudent=this.submitFeedbackStudent.bind(this);
	}
	updateName(name,id){
		let memd=this.state.memberdata;
		for(var k in memd){
			if(memd[k].uid==id){
				memd[k].name=name;
				break;
			}
		}
		this.setState({memberdata:memd});
	}
	updateFeedback(key,val){
		let memd=this.state.memberdata;
		memd[key].fd=val;
		this.setState({memberdata:memd});
	}
	submitFeedbackStudent(){
		firebase.database().ref("internships/internship/"+this.state.iid+"/studentFeedbackByCompany").set(this.state.memberdata).then(()=>{
			document.getElementById("feedbackStudentCompanyHeader").innerHTML="Thank you for the feedback";
			document.getElementById("feedbackListForm").style.display="none";
		});
	}
	componentDidMount(){
		firebase.auth().onAuthStateChanged((user) => {
		if (user) {
		} 
		else{
			firebase.auth().signInAnonymously().catch(function(error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		});
		}
		}); 
		let url=new URL(window.location.href);
		let searchParams = new URLSearchParams(url.search);
		if(searchParams.get("internship")){
			let inter=decodeURI(searchParams.get("internship"));
			this.setState({iid:inter});
			firebase.database().ref("internships/internship/"+inter).once("value").then((snapshot)=>{ 
				this.setState(snapshot.val());
				let memberd=[];
				for(var i in snapshot.val().members){
					let item={uid:snapshot.val().members[i],name:"",fd:""};
					memberd.push(item);
				}
				this.setState({memberdata:memberd});
				for(var i in snapshot.val().members){
					let u=snapshot.val().members[i];
					firebase.database().ref("internships/students/"+u+"/fullName").once("value").then((snapshot1)=>{
						this.updateName(snapshot1.val(),u);
					});
				}
			});
		}
	}
	render(){
		return(
		<div>
		<div className="header">
		<img className="icon" src="DSILogo.png" alt="Logo"/><span className="header">Student Feedback</span>
		</div>
		<h5 id="feedbackStudentCompanyHeader">Please provide feedback about the student(s) involved</h5>
		<div id="feedbackListForm">
		{this.state.memberdata.map((item,index)=>{return(
		<table className="studentFeedbackInternship" key={index}><tbody>
		<tr><th className="studentFeedbackInternship">Name: </th><td className="studentFeedbackInternship">{item.name}</td></tr>
		<tr><th className="studentFeedbackInternship">Feedback:</th><td className="studentFeedbackInternship"><textarea className="studentFeedbackInternship" onChange={(e)=>{this.updateFeedback(index,e.target.value)}}></textarea></td></tr>
		<tr><td colSpan="2"><hr/></td></tr>
		</tbody></table>
		);})}
		<button className="btn" onClick={this.submitFeedbackStudent}>Submit</button></div>
		</div>);
	}
}

export {MainPage, NewInternship, NewInternshipLink, MiniTestForm, Internship, SendNotification, EditInternship, StudentFeedbackCompany, SkillSearch};
