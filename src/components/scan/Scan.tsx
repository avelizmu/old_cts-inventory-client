import React from 'react';
import styles from './Scan.module.css';
import InputModal from "../modals/inputModal/InputModal";
import Scanner from "../scanner/Scanner";
import {Redirect} from "react-router";

type ScanState = {
    room?: string,
    scans: string[],
    noCameraFound?: boolean,
    cancelled?: boolean
}

class Scan extends React.Component<any, ScanState> {

    state: ScanState = {
        scans: []
    }

    render(): React.ReactNode {
        return <div className={styles.fullHeight}>
            {
                (this.state.noCameraFound || this.state.cancelled) ? <Redirect to="/" push/> : <></>
            }
            {
                <InputModal visible={!this.state.room} prompt="Room Number" onConfirm={(room) => {
                    this.setState({room})
                }} onCancel={() => {
                    this.setState({cancelled: true})
                }}/>
            }
            {
                this.state.room && <div className={styles.fullHeight}>
                    <Scanner onScan={(value) => {
                        this.setState((prevState, props) => {
                            const newState = {...prevState}
                            newState.scans.push(value);
                            return newState;
                        })
                    }} onNoCameraFound={() => {
                        this.setState({noCameraFound: true})
                    }}/>
                    {
                        this.state.scans.length ? <div className={[styles.button, styles.confirmButton].join(' ')}>
                            <i onClick={() => {
                            }} className={['material-icons'].join(' ')}>
                                done
                            </i>
                            {
                                this.state.scans.length
                            }
                        </div> : <></>
                    }
                    <i onClick={() => {
                        this.setState({cancelled: true})
                    }} className={[styles.button, styles.backButton, 'material-icons'].join(' ')}>
                        keyboard_backspace
                    </i>
                </div>
            }
        </div>;
    }
}

export default Scan;
