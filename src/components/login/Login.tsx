import React from 'react';
import styles from './Login.module.css';
import LoadingModal from "../modals/loadingModal/LoadingModal";
import axios from 'axios';

type LoginState = {
    username: string,
    password: string,
    loading: boolean,
    error: string | undefined
}

class Login extends React.Component<any, LoginState> {

    state: LoginState = {
        username: '',
        password: '',
        loading: false,
        error: undefined
    }

    constructor(props: Readonly<any>) {
        super(props);

        this.submit = this.submit.bind(this);
    }

    render(): React.ReactNode {
        return <div className={styles.container}>
            {
                this.state.error ? <div className={styles.error}>
                    {this.state.error}
                </div> : <></>
            }
            <input placeholder="Username" className={styles.input} onChange={(e) => {this.setState({username: e.target.value})}}/>
            <input placeholder="Password" className={styles.input} onChange={(e) => {this.setState({password: e.target.value})}}/>
            <button className={styles.button} onClick={this.submit}>Log In</button>
            <LoadingModal visible={this.state.loading} onClose={()=>{}}/>
        </div>
    }

    async submit() {
        this.setState({loading: true});

        try{
            await axios.post('/api/users/login', {
                username: this.state.username,
                password: this.state.password
            });
        }
        catch(err) {
            this.setState({error: err.message})
        }

        this.setState({loading: false});
    }
}

export default Login;
