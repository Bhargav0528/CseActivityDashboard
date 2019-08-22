import React from 'react';
import './adminDashboard.css';
import firebase from '../config/firebaseConfig';

class InternshipFeedbacks extends React.Component{
	constructor(){
		super();
		this.state={
			feedbacks:[]
		}
	}
	componentDidMount(){
		let id=this.props.iid;
		let stdata=this.props.stdata;
		let ap=this.props.ap;
		let fd=this.props.fd;
		firebase.database().ref("internships/feedback").once("value").then((snapshot)=>{
			let newState=new Object();
			newState.feedback=snapshot.val();
			newState.stdata=stdata;
			newState.applied=ap;
			newState.id=id;
			newState.feedbacks=[];
			if(newState.feedback && newState.applied){
			for(var i in newState.feedback){
				if(newState.applied.includes(newState.feedback[i].user)){
					let item={name:'',content:''};
					item.name=newState.stdata[newState.feedback[i].user].fullName;
					item.content=newState.feedback[i].content;
					newState.feedbacks.push(item);
				}
			}}
			this.setState(newState);
		});
	}
	render(){
		console.log(this.state);
		return(
		<div>
		{this.state.feedbacks.map((item,index)=>{
			return(
			<div key={index} style={{padding:'5px',borderTop:'1px solid lightblue',borderBottom:'1px solid lightblue',marginBottom:'20px'}}>
			<span style={{fontSize:'12pt'}}>{item.name}</span><br/>
			<p style={{fontSize:'10pt',padding:'0px',marginLeft:'10px',marginRight:'0px',marginTop:'5px',marginBottom:'0px'}}>{item.content}</p>
			</div>
			);
		})}
		</div>);
	}
}

export default InternshipFeedbacks;