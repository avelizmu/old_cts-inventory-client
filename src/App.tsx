import React from 'react';
import Login from "./components/login/Login";
import {Redirect, Route, Switch} from "react-router-dom";

function App() {
    return <Switch>
        <Route exact path='/login' component={Login}/>
        <Route path='/'>
            <Redirect to='/login'/>
        </Route>
    </Switch>
}

export default App;
