import React from 'react';
import styles from './Scan.module.css';
import InputModal from "../modals/inputModal/InputModal";
import Scanner from "../scanner/Scanner";
import {Redirect} from "react-router";

type ScanState = {
    room?: string,
    scans: string[],
    withInfo: {
        room: string,
        number: string,
        domain: string,
        brand: string,
        model: string,
        serial: string,
        windowsVersion: string,
        windowsBuild: string,
        windowsRelease: string,
        cpu: string,
        clockSpeed: string,
        cpuCores: string,
        ram: string,
        disk: string
    }[],
    workingNumber?: string,
    noCameraFound?: boolean,
    cancelled?: boolean,
    processing?: boolean,
}

class Scan extends React.Component<any, ScanState> {

    state: ScanState = {
        scans: [],
        withInfo: [],
    }

    render(): React.ReactNode {
        if (this.state.noCameraFound || this.state.cancelled) {
            return <Redirect to="/" push/>
        }
        return <div className={styles.fullHeight}>
            {
                <InputModal visible={!this.state.room} prompt="Room Number" onConfirm={(room) => {
                    this.setState({room})
                }} onCancel={() => {
                    this.setState({cancelled: true})
                }}/>
            }
            {
                this.state.room && !this.state.processing && <div className={styles.fullHeight}>
                    <div className={styles.instructions}>
                        {
                            this.state.workingNumber ? "Please scan the qr code on the screen" : "Please scan the computer's barcode"
                        }
                    </div>
                    <Scanner onScan={(value) => {
                        if (!this.state.workingNumber) {
                            if (/\d+/.test(value) && !this.state.scans.includes(value)) {
                                this.setState((prevState, props) => {
                                    const newState = {...prevState}
                                    newState.scans.push(value);
                                    newState.workingNumber = value;
                                    return newState;
                                });
                            }
                        } else {
                            const informationPattern = /DOMAIN:(.+)\nBRAND:(.+)\nMODEL:(.+)\nSERIALNUMBER:(.+)\nWINDOWSVERSION:(.+)\nWINDOWSBUILD:(.+)\nWINDOWSRELEASE:(.+)\nCPUMODEL:(.+)\nCPUSPEED:(.+)\nCPUCORES:(.+)\nRAM:(.+)\nDISK:(.+)/;
                            if (informationPattern.test(value)) {
                                const [, domain, brand, model, serial, windowsVersion, windowsBuild, windowsRelease, cpu, clockSpeed, cpuCores, ram, disk] = value.match(informationPattern) as string[];
                                const json = {
                                    room: this.state.room!,
                                    number: this.state.workingNumber,
                                    domain,
                                    brand,
                                    model,
                                    serial,
                                    windowsVersion,
                                    windowsBuild,
                                    windowsRelease,
                                    cpu,
                                    clockSpeed,
                                    cpuCores,
                                    ram,
                                    disk
                                };

                                this.setState((prevState, props) => {
                                    const newState = {...prevState}
                                    newState.withInfo.push(json);
                                    newState.workingNumber = undefined;

                                    return newState;
                                });
                            }
                        }
                    }} onNoCameraFound={() => {
                        this.setState({noCameraFound: true})
                    }}/>
                    {
                        this.state.withInfo.length ? <div className={[styles.button, styles.confirmButton].join(' ')}>
                            <i onClick={() => {
                                this.setState({processing: true});

                            }} className={['material-icons'].join(' ')}>
                                done
                            </i>
                            {
                                this.state.withInfo.length
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
