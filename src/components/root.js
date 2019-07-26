import React from 'react';
import ProjDashBoard from './ProjDashBoard';
import LandingPage from './LandingPage';
import Profile from './Profile';
import Authentication from './Authentication';
import ProjectDetails from './ProjectDetails';
import {Switch, Route} from 'react-router-dom';


const Root = ()=> (
    <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route path="/profile" component={Profile} />
        <Route path="/projects" component={ProjDashBoard} />
        <Route path="/users" component={Profile} />
        <Route path="/auth" component={Authentication} />
        <Route path="/project/:ids" component={ProjectDetails} />
    </Switch>
)

export default Root;