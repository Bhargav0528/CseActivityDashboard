import React from 'react';
import firebase,{auth,provider} from '../config/firebaseConfig';

class App extends React.Component{
	
	constructor(){
		super();
		this.state = {user:null};
		this.loginStudent=this.loginStudent.bind(this);
		this.loginAdmin=this.loginAdmin.bind(this);
	}

	componentDidMount()
	{
		
			firebase.auth().onAuthStateChanged((user) =>{
				//console.log(user);
				if(user){
		  
					firebase.database().ref(`users/${firebase.auth().currentUser.uid}/`).on('value',(snap)=>{
					  this.setState({user:snap.val()});
				  })
		  
				  
				  //localStorage.setItem('user',user.uid);
				}else{
				  //localStorage.removeItem('user');
		  
				}
				});
	}

	studentorTeachcer()
	{
		if(this.state.user!=null)
		{
			if(this.state.user.teacher)
			{
				this.loginAdmin();
			}
			else{
				this.loginStudent();
			}
		}
	}

	loginStudent(){
		window.location.href="/studentdashboard";
	}
	loginAdmin(){
		window.location.href="/admindashboard";
	}
	render(){
		console.log("Hello",this.state.user);
		
		return(
		<div>
		<p>Loadinggg......</p>
		{this.studentorTeachcer()}
		</div>
		);
	}
}

export default App;
