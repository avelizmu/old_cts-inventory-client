import React from 'react';
import Login from "./components/login/Login";
import {Redirect, Route, Switch} from "react-router-dom";
import Home from "./components/home/Home";
import Scanner from './components/scanner/Scanner';

function App() {
    return <Switch>
        <Route exact path='/login' component={Login}/>
        <Route exact path='/home' component={Home}/>
        <Route exact path='/scan' component={Scanner}/>
        <Route path='/'>
            <Redirect to='/login'/>
        </Route>
    </Switch>
}

export default App;
