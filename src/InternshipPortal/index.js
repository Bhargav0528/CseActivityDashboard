import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {MainPage, NewInternship, NewInternshipLink, MiniTestForm, Internship, CompletedInternship, OpenInternship, SendNotification} from './adminDashboard.js';
import MinitestDemo from './minitestStudent.js';
import App from './App.js';
import {StudentDashboard} from './studentDashboard.js';
import {FeedbackForm} from './feedbackForm.js';
import {SubmitProfile, ProfileSubmitted} from './studentProfile.js';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
<Router>
<div>
	<Route exact path="/" component={App}/>
	<Route exact path="/studentdashboard" component={StudentDashboard}/>
	<Route path="/admindashboard" component={MainPage}/>
	<Route path="/newinternship" component={NewInternship}/>
	<Route path="/createminitest" component={MiniTestForm}/>
	<Route path="/internship" component={Internship}/>
	<Route path="/newinternshiplink" component={NewInternshipLink}/>
	<Route path="/completedinternship" component={CompletedInternship}/>
	<Route path="/openinternship" component={OpenInternship}/>
	<Route path="/sendnotification" component={SendNotification}/>
	<Route exact path="/profile" component={SubmitProfile}/>
	<Route path="/profile/submitted" component={ProfileSubmitted}/>
	<Route path="/studentdashboard/feedback" component={FeedbackForm}/>
	<Route path="/minitestdemo" component={MinitestDemo}/>
</div>
</Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
