import React, { Component } from 'react';
import './studentProfile.css';
import firebase from '../config/firebase.js';

class App extends Component {
  constructor(){
    super();
	this.state={
		CGPA:"",
		currentAddress:"",
		doingInternship:false,
		email:"",
		fullName:"",
		onlineCourses:"",
		permanentAddress:"",
		phone:"",
		projects:"",
		resume:"",
		sec:"",
		sem:"",
		skills:[],
		usn:""
	};
    this.resume=this.resume.bind(this);
	this.loadData=this.loadData.bind(this);
	this.changedState=this.changedState.bind(this);
  }
  	changedState(e){
	  this.setState({
		[e.target.name]: e.target.value
	});	
	}	
  componentDidMount(){
	//let uid1=firebase.auth().currentUser.uid;
	let uid1="u1"; //Remove after integration
	let loadfunc=this.loadData;
	this.setState({uid:uid1});
	firebase.database().ref("internships/students/"+uid1).once("value").then(function(snapshot){
		let sval=snapshot.val();
		loadfunc(sval);
	});
  }
  loadData(sval){
	  console.log(sval);
	  this.setState(sval);
  }
resume()
{
	var key1=firebase.database().ref();
	key1.on("value",function(snapshot){  var x=snapshot.val();console.log(x); }, function(error){});
	var x;
	var i;
	if(document.getElementById("1").checked)
      x="yes";
	console.log(x);
    if(document.getElementById("2").checked)
      x="no"; 
    console.log(x);
    var a;
    var i;
    if(document.getElementById("5").checked)
      a="home";
    console.log(a);
    if(document.getElementById("6").checked)
      a="office";
    console.log(a);
    var h;
    var i;
    if(document.getElementById("9").checked)
      h="0-4";
    console.log(h);
    if(document.getElementById("10").checked)
      h="0-6";
	console.log(h);
    if(document.getElementById("11").checked)
      h="0-8";
    console.log(h);
	var r=document.getElementById("usn").value;
    var alpha=/^[1-4][a-zA-Z][a-zA-Z][0-9][0-9][a-zA-Z][a-zA-Z][0-9][0-9][0-9]$/
    if(!r.match(alpha)){ alert("Invalid USN "); }
    else{
		let sk=document.getElementById("20").value;
		if(sk.trim()==""){sk=[];}
		else{
		sk=sk.split(",");
		for(var t in sk){
			sk[t]=sk[t].trim();
		}}
	var key2=firebase.database().ref('internships/students').push().key;
	var item={
		email:this.state.email,
      phone:document.getElementById("phone").value,
      permanentAddress:document.getElementById("21").value,
      preferences:{
        courses:document.getElementById("8").value,
        language:document.getElementById("7").value,
        workfrom:a,
        workhours:h,
      },
      projects:document.getElementById("pro").value,
      skills:sk
    };
	if(document.getElementById("image-file").files[0]){ item.resume="resumes/"+this.state.uid+"/resume.pdf";}
	console.log(item);
	firebase.database().ref('internships/students/'+this.state.uid).update(item);
	if(document.getElementById("image-file").files[0]){
	var storageRef=firebase.storage().ref("resumes/"+this.state.uid);
	var resumeRef=storageRef.child("resume.pdf");
	var file=document.getElementById("image-file").files[0];
	resumeRef.put(file).then(function(){ 
    console.log("uploaded");
	window.location.href="/submitted";
	});
	}
	else{ window.location.href="submitted";}
	}
}
render() {
    return (
	<div>
	<div className="headerstudentProfileDefault">
	<center> <h1>Preferences</h1></center>
	</div>
	<form action="">
	<ol>
	<li className="studentProfileDefault"><label>Enter your usn:</label>   <input className="studentProfileDefault" type="text" id="usn" name="usn" value={this.state.usn} onChange={this.changedState}/></li><br/>
	<li className="studentProfileDefault"><label>Current CGPA:</label>   <input className="studentProfileDefault" type="text" id="cgpa" name="CGPA" value={this.state.CGPA} onChange={this.changedState}/></li><br/>
	<li className="studentProfileDefault"><label>Pursuing any internship </label><input type="radio" id="1" name="yes" value="yes"/>Yes<input type="radio" id="2" name="yes" value="no"/>No</li><br/>
	<li className="studentProfileDefault"><label>Prefer to work from: </label>     <input type="radio" id="5" name="from" value="office"/>Office <input type="radio" id="6" name="from" value="home" />Home</li><br/>
	<li className="studentProfileDefault"><label>Working hours prefered:</label>     <input type="radio" id="9" name="work" value="0-5"/>0-4 hrs
                                     <input type="radio" id="10" name="work" value="0-7"/>0-6 hrs
                                     <input type="radio" id="11" name="work" value="0-8"/>0-8 hrs
                                     </li><br/>
	<li className="studentProfileDefault"><label>Known languages: </label>  <textarea className="studentProfileDefault" id="7" rows="2" cols="10"></textarea> </li><br/><br/><br/><br/>
<li className="studentProfileDefault"><label>Mention if any online courses done: </label>       <textarea className="studentProfileDefault" id="8" rows="3" cols="20" name="onlineCourses" value={this.state.onlineCourses} onChange={this.changedState}></textarea></li><br/><br/><br/><br/>
	<li className="studentProfileDefault"><label>Mention if any projects done: </label>       <textarea className="studentProfileDefault" id="pro" rows="3" cols="20"></textarea></li><br/><br/><br/><br/>
	<li className="studentProfileDefault"><label>Skills: </label>       <textarea className="studentProfileDefault" id="20" rows="3" cols="20" name="skills" value={this.state.skills} onChange={this.changedState}></textarea></li><br/><br/><br/><br/>
	<li className="studentProfileDefault"><label>Email-ID:</label>     <input className="studentProfileDefault" type="text" id="12" name="email" value={this.state.email} onChange={this.changedState}/></li><br/>
	<li className="studentProfileDefault"><label>Phone-no:</label>     <input className="studentProfileDefault" type="text" id="phone" name="phone" value={this.state.phone} onChange={this.changedState}/></li><br/>
	<li className="studentProfileDefault"><label>Permanent address: </label>  <textarea className="studentProfileDefault" id="21" rows="4" cols="10" name="permanentAddress" value={this.state.permanentAddress} onChange={this.changedState}></textarea> </li><br/><br/><br/>
	</ol>
	</form>
	<div>
	<label>Click the button to add resume:</label> <form encType="multipart/form-data" action="/upload/image" method="post">
    <input id="image-file" type="file"/>
    </form><br/><br/><br/>
	</div>
	<div  className="submitstudentProfileDefault">
	<form >
	<center> <input type="button"  value="Submit" onClick={this.resume}/> </center>
	</form>
	</div>
	<div className="footerstudentProfileDefault">
	<center><p></p></center>
	</div>
	</div>
    );
  }
}

class Details extends React.Component{
	render(){
  return (
  <div>
  <div className="substudentProfileDefault">
        <center><h1>Thank You!!</h1></center>
    </div>
<div className="detailstudentProfileDefault">
  <center><p>Your response has been submitted, and profile updated.</p></center>
</div>
</div>
  );
}
}

export  {App as SubmitProfile,Details as ProfileSubmitted};
