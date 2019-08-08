import React, { Component } from 'react';
import {Layout, Header, Navigation, Drawer, Content} from 'react-mdl';
import './App.css';
import Root from './components/root';
import {Link, BrowserRouter,Switch, Route} from 'react-router-dom';
import fire from './config/firebaseConfig';
import {Nav, Navbar} from 'react-bootstrap';
import ProjDashBoard from './components/ProjDashBoard';
import LandingPage from './components/LandingPage';
import Profile from './components/Profile';
import Authentication from './components/Authentication';
import ProjectDetails from './components/ProjectDetails';
import APPjs from './InternshipPortal/App';
import {MainPage, NewInternship, NewInternshipLink, MiniTestForm, Internship, CompletedInternship, OpenInternship, SendNotification, EditInternship} from './InternshipPortal/adminDashboard.js';
import MinitestConduct from './InternshipPortal/minitestStudent.js';
import {StudentDashboard} from './InternshipPortal/studentDashboard';
import {FeedbackForm} from './InternshipPortal/feedbackForm';
import {SubmitProfile, ProfileSubmitted} from './InternshipPortal/studentProfile';

class App extends Component {
    state = {user:null, fullName:""}

componentDidMount(){
    this.authListener();
}
authListener(){

    fire.auth().onAuthStateChanged((user) =>{
      //console.log(user);
      if(user){

        fire.database().ref(`users/${fire.auth().currentUser.uid}/`).on('value', (snap)=>{
            this.setState({user:fire.auth().currentUser.uid, fullName:snap.val().fullName});
        })

        
        //localStorage.setItem('user',user.uid);
      }else{
        this.setState({user:null});
        //localStorage.removeItem('user');

      }
      });
    
  }

  profileCheck()
  {
      if(this.state.user!== null)
      {
        return <Link style={{fontSize:16, marginRight:20, color:'#fff'}} to="/profile">{this.state.fullName}</Link>
      }

      else
      {
        return <Link style={{fontSize:16, marginRight:20, color:'#fff'}} to="/auth">Login</Link>
      }
  }

  render() {
    return (
      <div className="nav-bar">
        <Navbar bg="dark" variant="dark" className="navbar" sticky="top">
        <img src="https://img.collegepravesh.com/2018/10/DSI-Bangalore-Logo.png" style={{width:'40px', height:'40px', marginRight:'20px'}} />
        <Navbar.Brand href="#home">CSE Dashboard</Navbar.Brand>
        <Nav className="ml-auto">
        <div>
        <Link style={{fontSize:16, marginRight:20, color:'#fff'}} to="/projects">Projects</Link>
        <Link style={{fontSize:16, marginRight:20, color:'#fff'}} to="/Internship">Internship</Link>
        {this.profileCheck()}
        <Link style={{fontSize:16, marginRight:20, color:'#fff'}}to="#">Pricing</Link>
        </div>
        </Nav>
        </Navbar>
        <div style={{width:"100%"}}>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/profile" component={Profile} />
          <Route path="/projects" component={ProjDashBoard} />
          <Route path="/users" component={Profile} />
          <Route path="/auth" component={Authentication} />
          <Route path="/project/:ids" component={ProjectDetails} />
          
        <Route exact path="/Internship" component={APPjs}/>
	<Route exact path="/studentdashboard" component={StudentDashboard}/>
	<Route path="/admindashboard" component={MainPage}/>
	<Route path="/newinternship" component={NewInternship}/>
	<Route path="/createminitest" component={MiniTestForm}/>
	<Route path="/internship" component={Internship}/>
	<Route path="/newinternshiplink" component={NewInternshipLink}/>
	<Route path="/completedinternship" component={CompletedInternship}/>
	<Route path="/openinternship" component={OpenInternship}/>
	<Route path="/sendnotification" component={SendNotification}/>
	<Route exact path="/sprofile" component={SubmitProfile}/>
	<Route path="/submitted" component={ProfileSubmitted}/>
	<Route path="/studentdashboard/feedback" component={FeedbackForm}/>
	<Route path="/minitest" component={MinitestConduct}/>
		<Route path="/editinternship" component={EditInternship}/>
        </Switch>
        </div>
</div>
    );
  }
}

export default App;
