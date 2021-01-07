import React from 'react';
import Login from "./components/login/Login";
import {Redirect, Route, Switch} from "react-router-dom";
import Home from "./components/home/Home";
import Scan from "./components/scan/Scan";
import {IAppState} from "./redux/store";
import {connect} from "react-redux";
import {AuthenticateActionCreator, authenticateActionCreator, User} from "./redux/actions/user";
import axios from "axios";
import Results from "./components/results/Results";

type AppProps = {
    user: User | undefined,
    login: AuthenticateActionCreator
}

type AppState = {
    authenticated?: boolean
}

class App extends React.Component<AppProps, AppState> {
    state: AppState = {}

    render() {
        if (this.state.authenticated === undefined) {
            return <></>;
        }
        if (this.state.authenticated) {
            return <Switch>
                <Route exact path='/home' component={Home}/>
                <Route exact path='/scan' component={Scan}/>
                <Route exact path='/results' component={Results}/>
                <Route path='/'>
                    <Redirect to='/home'/>
                </Route>
            </Switch>
        } else {
            return <Switch>
                <Route exact path='/login' component={Login}/>
                <Route path='/'>
                    <Redirect to='/login'/>
                </Route>
            </Switch>
        }
    }

    componentDidUpdate(prevProps: Readonly<AppProps>, prevState: Readonly<AppState>, snapshot?: any) {
        if (this.props.user && !this.state.authenticated) {
            this.setState({authenticated: true});
        }
    }

    async componentDidMount() {
        try {
            const user: {
                id: number,
                username: string,
                name: string,
                pendingPasswordReset: boolean,
                createdAt: string,
                updatedAt: string
            } = (await axios.post('/api/users/login', {})).data;
            this.props.login(user);
        } catch (err) {
            this.setState({authenticated: false});
        }
    }
}

const mapStateToProps = (state: IAppState) => ({user: state.user});
export default connect(mapStateToProps, {login: authenticateActionCreator})(App);
