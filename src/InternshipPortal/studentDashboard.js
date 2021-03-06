import React from 'react';
import './StudentDashboard.css';
import firebase from '../config/firebaseConfig.js';
import Select from 'react-select'



class App extends React.Component{
  constructor(){
    super();
    this.state={
        internships:[],selectedOption: null,
         options: []
    };
    this.loaddata=this.loaddata.bind(this);
    this.sort=this.sort.bind(this);
	this.toggleNotifications=this.toggleNotifications.bind(this);
	this.loadSkills=this.loadSkills.bind(this);
	this.gotoMiniTest=this.gotoMiniTest.bind(this);
	this.setStatefunc=this.setStatefunc.bind(this);
  this.reset=this.reset.bind(this);
  }
  gotoMiniTest(){
	  window.location.href="/minitest";
  }
loaddata(snapshot,uid){
    let vals=[];
    for(var i in snapshot.val()){
      if(snapshot.val()[i].isComplete==false){
        let temp=snapshot.val()[i];
        let dt1=new Date(temp.applicationdt),dt2=new Date(temp.startdt);
        let dt3=dt1.getDate()+"-"+(dt1.getMonth()+1)+"-"+dt1.getFullYear();
        let dt4=dt2.getDate()+"-"+(dt2.getMonth()+1)+"-"+dt2.getFullYear();
        let add={
          id:i,
          applicationdt:dt3,
		  applied:temp.applied,
          companyName:temp.companyName,
          companyPhone:temp.companyPhone,
          companyEmail:temp.companyMail,
          duration:temp.duration/30,
          description:temp.description,
          startdt:dt4,
          stipend:temp.stipend?temp.stipend:0,
          skillSet:temp.skillSet?temp.skillSet:[],
          title:temp.title,
          workCategory:temp.workCategory,
          workTimings:temp.workTimings,
          show:true,
		  studentapplied:false
        };
        if(temp.approved && temp.isComplete==false && temp.startdt>Date.now() && temp.applicationdt>Date.now()){
			vals.push(add);
		}
      }
    }
    let newState=this.state;
    newState.internships=vals;
    this.setState(newState);
  }
  reset(){
   let st=this.state.internships;
   for(var i=0;i<st.length;i++){
    st[i].show=true;
   }
   this.setState({internships:st,selectedOption:[]});
   document.getElementById("Workfromhome").checked=false;
   document.getElementById("part-time").checked=false;
   document.getElementById("full-time").checked=false;   
}

loadSkills(s){
  let skills=s.val();
  let sk=[];
  for(var i=0;i<skills.length;i++){
      let tmp={label:skills[i],value:skills[i]};
      sk.push(tmp);
  }
  this.setState({options:sk});
}
setStatefunc(p){
	this.setState(p);
}
componentDidMount(){
	setTimeout(()=>{
  if(firebase.auth().currentUser){
	  let uid1=firebase.auth().currentUser.uid;
  let tmp=this.loaddata;
  let tmp2=this.loadSkills;
  let tmp3=this.checkTestFeedback;
  firebase.database().ref("internships/additional/skills").once("value").then(function(snapshot1){
    tmp2(snapshot1);
  });
 firebase.database().ref("internships/internship").orderByChild("applicationdt").once('value').then(function(snapshot) {
tmp(snapshot,uid1);
});
let statefunc=this.setStatefunc;
	firebase.database().ref("internships/students/"+uid1).once("value").then(function(s){
		let t=s.val();
	statefunc({studentdata:t});	});}
	else{
		window.location.href="/";
	}
	},5000);
}
apply(id){
	let uid1=firebase.auth().currentUser.uid;
	if(this.state.studentdata.teacher){
		return;
	}
	firebase.database().ref("internships/internship/"+id).once('value').then(function(snapshot) {
		var x=snapshot.val();
		let isindb=false;
		if(x.applied!=null){
			if(x.applied.includes(uid1)){isindb=true;}
			else{			x.applied.push(uid1);}
		}
		else{x.applied=[]; x.applied.push(uid1);}
		if(x.minitestscores!=null){
			
			for(var i in x.minitestscores){
				if(x.minitestscores[i].uid==uid1){
					isindb=true;
				}
			}
			if(!isindb){
		x.minitestscores.push({uid:uid1,marks:-1});}}
		else{
			x.minitestscores=[];
			x.minitestscores.push({uid:uid1,marks:-1});
		}
		if(isindb){
			alert("You have already applied");
		}
		else{
		firebase.database().ref("internships/students/"+uid1+"/notifications").once("value").then(function(s){
			let sval=s.val();
			sval.push({internshipid:id,notifText:"You have enrolled for "+x.title});
			firebase.database().ref("internships/students/"+uid1+"/notifications").update(sval);
		});
		firebase.database().ref("internships/internship/"+id).update(x).then(function(){
			window.location.href="/sprofile";
		});}
	});
}
sort(){
   let st=this.state.internships;
   let sellen=this.state.selectedOption?this.state.selectedOption.length:0;
   for(var i=0;i<st.length;i++){
    st[i].show=false;
   }

  if(document.getElementById("Workfromhome").checked && document.getElementById("part-time").checked){
     for(var i=0;i<st.length;i++)
    {   
      if(st[i].workCategory=="work-from-home"){
      st[i].show=true; }
      if(st[i].workCategory=="part-time"){
      st[i].show=true; }
    }
  }
 else if(document.getElementById("Workfromhome").checked && document.getElementById("full-time").checked){
     for(var i=0;i<st.length;i++)
    {   
      if(st[i].workCategory=="work-from-home"){
      st[i].show=true; }
      if(st[i].workCategory=="full-time"){
      st[i].show=true; }
    }
  }
 else if(document.getElementById("part-time").checked && document.getElementById("Workfromhome").checked){
     for(var i=0;i<st.length;i++)
    {   
      if(st[i].workCategory=="part-time"){
      st[i].show=true; }
      if(st[i].workCategory=="work-from-home"){
      st[i].show=true; }
    }
  }
 else if(document.getElementById("full-time").checked && document.getElementById("part-time").checked){
     for(var i=0;i<st.length;i++)
    {   
      if(st[i].workCategory=="full-time"){
      st[i].show=true; }
      if(st[i].workCategory=="part-time"){
      st[i].show=true; }
    }
  }

else if(document.getElementById("Workfromhome").checked){
     for(var i=0;i<st.length;i++)
    {   
      if(st[i].workCategory=="work-from-home"){
      st[i].show=true;
    }
  }
}
else if(document.getElementById("part-time").checked){
     for(var i=0;i<st.length;i++)
    {   
      if(st[i].workCategory=="part-time"){
      st[i].show=true;
    }
  }
}
else if(document.getElementById("full-time").checked){
     for(var i=0;i<st.length;i++)
    {   
      if(st[i].workCategory=="full-time"){
      st[i].show=true;
    }
  }
}
else{
	 for(var i=0;i<st.length;i++)
    {   
      
      st[i].show=true;
    
  }
}
      for(var i=0;i<st.length;i++){      
      for(var j=0;j<sellen;j++){
   if(!st[i].skillSet.includes(this.state.selectedOption[j].label)){
       st[i].show=false;
    }
  }
}
this.setState({internships:st});
}
handleChange = selectedOption => {
    this.setState({ selectedOption });
};
toggleNotifications(){
	if(document.getElementById("notificationBox").style.display=="none"||document.getElementById("notificationBox").style.display==""){
		document.getElementById("notificationBox").style.display="block";	}
	else{		document.getElementById("notificationBox").style.display="none";	}
}
render(){
  const { selectedOption } = this.state;
  return (    
    <div className="body">
<div className="headera">
<img className="HeadLogoStudent" src="https://img.collegepravesh.com/2018/10/DSI-Bangalore-Logo.png"/>
     <h4 className="defaultClass">Student Dashboard</h4>
</div>



<div className="notificationBoxOuter"  id="notificationBox">
<div className="notificationBoxInner"><Notifications/></div></div>




     {this.state.internships.map((item)=>{return(
      <div key={item.id}>
      {item.show?<div className="internshipa"> 
            <h2 className="defaultClass">Title: {item.title}</h2>
            <b>Company: {item.companyName}</b>
            <p>Description:  {item.description}</p><br/>
            <table className="defaultClass">
              <tbody className="defaultClass">
                <tr className="defaultClass">
                <th className="defaultClass">Start date</th>
                <th className="defaultClass">Duration</th>
                <th className="defaultClass">Stipend</th>
                <th className="defaultClass">Apply by</th>
				<th className="defaultClass">Skills Required</th>
                </tr>
                <tr className="defaultClass">
                <td className="defaultClass">{item.startdt}</td>
                <td className="defaultClass">{item.duration} Month(s)</td>
                <td className="defaultClass">Rs.{item.stipend} /Month</td>
                <td className="defaultClass">{item.applicationdt}</td>
                <td className="defaultClass">
                {item.skillSet.map((x,i)=>{return(
                <span key={i}> {x}</span>)})}</td></tr>
              </tbody>
            </table><br/>
			
			<input type="button" className="view" value="Apply" onClick={()=>{this.apply(item.id);}}/>
<br/><br/>
</div>:""}</div>
 );})}      
 <button className="notificationButton" onClick={this.toggleNotifications}>Notifications</button>
      <div className="filter">
     <div className="filterui">
     <h1 className="Head">Filters</h1>
     <hr></hr>
     <h3 className="defaultClass">Category</h3>
     <div className="options">
	<Select options={this.state.options} onChange={this.handleChange} value={this.state.selectedOption} isMulti={true}/>
<h3 className="defaultClass">Select your preferences</h3>
  <h5 className="defaultClass"><input type="checkbox" className="radio" id="Workfromhome"  name="preference"/>Work From Home</h5>
  <h5 className="defaultClass"><input type="checkbox" className="radio" id="part-time" name="preference"/>Part-Time</h5>
  <h5 className="defaultClass"><input type="checkbox" className="radio" id="full-time" name="preference"/>Full-Time</h5>
   <input type="button" className="view" value="Reset" onClick={this.reset}/>
  <input type="button" className="view" value="Submit" onClick={this.sort}/>
            </div>
         </div>
        </div>
		<button className="takeminitest" onClick={this.gotoMiniTest}>Start Test</button><br/>
      </div>
      
  );}
}
class Notifications extends React.Component{
	constructor(){
		super();
		this.state={
			items:[]
		};
		this.loaddata=this.loaddata.bind(this);
	}
	componentDidMount() {
	let tmp=this.loaddata;
	setTimeout(()=>{
		if(firebase.auth().currentUser){
	let uid=firebase.auth().currentUser.uid;
	firebase.database().ref("internships/students/"+uid+"/notifications").on("value",function(snapshot){
		tmp(snapshot.val());
		});}
		else{window.location.href="/";}
		},5000);
	}
	loaddata(snapshotval){
		let data=snapshotval;
		data=data.reverse();
		this.setState({items:data});
	}
	render(){
		return(
		<div>
			{this.state.items.map((item) =>{
				return(
				<h4 key={this.state.items.indexOf(item)} className="notificationItem">{item.gotoLink?<a className="notifLink" href={item.gotoLink} target="_blank">{item.notifText}</a>:<span>{item.notifText}</span>}</h4>
				);
			})}	    
		</div>
		);
	}
}

export {App as StudentDashboard};
