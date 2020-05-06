import React from 'react';
import styles from './Login.module.scss';
import LoadingModal from "../modals/loadingModal/LoadingModal";
import axios from 'axios';

type LoginState = {
    username: string,
    password: string,
    newPassword: string | undefined,
    loading: boolean,
    error: string | undefined,
    resetPassword: boolean
}

class Login extends React.Component<any, LoginState> {

    state: LoginState = {
        username: '',
        password: '',
        newPassword: undefined,
        loading: false,
        error: undefined,
        resetPassword: false
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
            {
                this.state.resetPassword ? <div className={styles.warning}>
                    You must set a new password
                </div> : <></>
            }
            <input placeholder="Username" className={styles.input} onChange={(e) => {
                this.setState({username: e.target.value})
            }}/>
            <input placeholder="Password" className={styles.input} onChange={(e) => {
                this.setState({password: e.target.value})
            }}/>
            {
                this.state.resetPassword ?
                    <input placeholder="New Password" className={styles.input} onChange={(e) => {
                        this.setState({newPassword: e.target.value})
                    }}/> : <></>
            }
            <button className={styles.button} onClick={this.submit}>Log In</button>
            <LoadingModal visible={this.state.loading} onClose={() => {
            }}/>
        </div>
    }

    async submit() {
        this.setState({loading: true});

        try {
            const loginData: { username: string, password: string, newPassword?: string } = {
                username: this.state.username,
                password: this.state.password
            };
            if (this.state.newPassword) {
                loginData.newPassword = this.state.newPassword;
            }
            await axios.post('/api/users/login', loginData);
        } catch (err) {
            if (err.response.status === 401) {
                this.setState({resetPassword: true})
            } else {
                this.setState({error: err.message});
            }
        }

        this.setState({loading: false});
    }
}

export default Login;
