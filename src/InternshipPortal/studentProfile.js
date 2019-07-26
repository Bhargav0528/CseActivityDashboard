import React, { Component } from 'react';
import './studentProfile.css';
import firebase from '../config/firebaseConfig';

class App extends Component {
  constructor(){
    super();
    this.resume=this.resume.bind(this);
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
	var key2=firebase.database().ref('internships/students').push().key;
	var item={
      usn:r,
      doingInternship:x,
      phone:document.getElementById("phone").value,
      permanent:document.getElementById("21").value,
      preferences:{
        courses:document.getElementById("8").value,
        language:document.getElementById("7").value,
        workfrom:a,
        workhours:h,
      },
      projects:document.getElementById("pro").value,
      resume:"resumes/s1/resume.pd",
      skills:document.getElementById("20").value
    };
	console.log(item);
	firebase.database().ref('internships/students/'+key2).update(item);
	var storageRef=firebase.storage().ref("resumes");
	var resumeRef=storageRef.child(r+".pdf");
	var file=document.getElementById("image-file").files[0];
	resumeRef.put(file).then(function(){ 
    console.log("uploaded");});
    window.location.href="details";
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
	<li className="studentProfileDefault"><label>Enter your usn:</label>   <input className="studentProfileDefault" type="text" id="usn"/></li><br/>
	<li className="studentProfileDefault"><label>Current CGPA:</label>   <input className="studentProfileDefault" type="text" id="cgpa"/></li><br/>
	<li className="studentProfileDefault"><label>Pursuing any internship </label><input type="radio" id="1" name="yes" value="yes"/>Yes<input type="radio" id="2" name="yes" value="no"/>No</li><br/>
	<li className="studentProfileDefault"><label>Prefer to work from: </label>     <input type="radio" id="5" name="from" value="office"/>Office <input type="radio" id="6" name="from" value="home" />Home</li><br/>
	<li className="studentProfileDefault"><label>Working hours prefered:</label>     <input type="radio" id="9" name="work" value="0-5"/>0-4 hrs
                                     <input type="radio" id="10" name="work" value="0-7"/>0-6 hrs
                                     <input type="radio" id="11" name="work" value="0-8"/>0-8 hrs
                                     </li><br/>
	<li className="studentProfileDefault"><label>Known languages: </label>  <textarea className="studentProfileDefault" id="7" rows="2" cols="10"></textarea> </li><br/><br/><br/><br/>
	<li className="studentProfileDefault"><label>Mention if any online courses done: </label>       <textarea className="studentProfileDefault" id="8" rows="3" cols="20"></textarea></li><br/><br/><br/><br/>
	<li className="studentProfileDefault"><label>Mention if any projects done: </label>       <textarea className="studentProfileDefault" id="pro" rows="3" cols="20"></textarea></li><br/><br/><br/><br/>
	<li className="studentProfileDefault"><label>Skills: </label>       <textarea className="studentProfileDefault" id="20" rows="3" cols="20"></textarea></li><br/><br/><br/><br/>
	<li className="studentProfileDefault"><label>Email-ID:</label>     <input className="studentProfileDefault" type="text" id="12"/></li><br/>
	<li className="studentProfileDefault"><label>Phone-no:</label>     <input className="studentProfileDefault" type="text" id="phone"/></li><br/>
	<li className="studentProfileDefault"><label>Permanent address: </label>  <textarea className="studentProfileDefault" id="21" rows="4" cols="10"></textarea> </li><br/><br/><br/>
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

function Details() {
  return (
  <div>
  <div className="substudentProfileDefault">
        <center><h1>Thank You!!</h1></center>
    </div>
<div className="detailstudentProfileDefault">
  <center><p>Your response has been submitted</p></center>
</div>
</div>
  );
}

export  {App as SubmitProfile,Details as ProfileSubmitted};
