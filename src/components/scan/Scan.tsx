import React from 'react';
import styles from './Scan.module.css';
import InputModal from "../modals/inputModal/InputModal";
import Scanner from "../scanner/Scanner";
import {Redirect} from "react-router";
import LoadingModal from "../modals/loadingModal/LoadingModal";
import axios, {AxiosError, AxiosResponse} from 'axios';
import {IAppState} from "../../redux/store";
import {connect} from "react-redux";
import {setLastUpdatesActionCreator, LastUpdates, SetLastUpdatesActionCreator} from "../../redux/actions/lastUpdates";

type ScanState = {
    room?: string,
    scans: string[],
    withInfo: (InformationScan & {
        room: string,
        number: string
    })[],
    workingNumber?: string,
    noCameraFound?: boolean,
    cancelled?: boolean,
    processing: boolean,
    flashingInstructions: boolean,
    showResults?: boolean
}

type ScanProps = {
    lastUpdate: LastUpdates,
    setLastUpdates: SetLastUpdatesActionCreator
}

type InformationScan = {
    domain: string,
    brand: string,
    model: string,
    serial: string,
    windowsVersion: string,
    windowsBuild: string,
    windowsRelease: string,
    cpu: number,
    clockSpeed: number,
    cpuCores: number,
    ram: number,
    disk: number
}

function isInformatonScan(input: any): input is InformationScan {
    return typeof(input) == "object" &&
        "domain" in input &&
        "brand" in input &&
        "model" in input &&
        "serial" in input &&
        "windowsVersion" in input &&
        "windowsBuild" in input &&
        "windowsRelease" in input &&
        "cpu" in input &&
        "clockSpeed" in input &&
        "cpuCores" in input &&
        "ram" in input &&
        "disk" in input
}

class Scan extends React.Component<ScanProps, ScanState> {

    state: ScanState = {
        scans: [],
        withInfo: [],
        flashingInstructions: false,
        processing: false
    }

    constructor(props: any) {
        super(props);
        this.sendScans = this.sendScans.bind(this);
    }

    async sendScans() {
        const changesResponse: (AxiosResponse | AxiosError)[] = await Promise.all(this.state.withInfo.map(inp => {
            return axios.post('/api/inventory', inp).catch(e => e);
        }));
        const changes: LastUpdates = changesResponse.map((response: (AxiosResponse | AxiosError), index) => {
            if("status" in response) {
                const casted = response as AxiosResponse;
                if(casted.status == 201) {
                    return {
                        number: this.state.withInfo[index].number,
                        message: 'Inserted into database.'
                    }
                }
                return {
                    number: this.state.withInfo[index].number,
                    message: casted.data.message
                }
            }
            else {
                return {
                    number: this.state.withInfo[index].number,
                    message: 'An error occurred while processing this entry.'
                }
            }
        });
        this.props.setLastUpdates(changes);
        this.setState({
            showResults: true
        })
    }

    render(): React.ReactNode {
        if (this.state.noCameraFound || this.state.cancelled) {
            //return <Redirect to="/" push/>
        }
        if(this.state.showResults) {
            return <Redirect to="/results" push/>
        }
        return <div className={styles.fullHeight}>
            <LoadingModal visible={this.state.processing}/>
            {
                <InputModal visible={!this.state.room} prompt="Room Number" onConfirm={(room) => {
                    this.setState({room})
                }} onCancel={() => {
                    this.setState({cancelled: true})
                }}/>
            }
            {
                this.state.room && !this.state.processing && <div className={this.state.flashingInstructions ? styles.instructionsFlash : styles.instructions}>
                    {
                        this.state.workingNumber ? "Please scan the qr code on the screen" : "Please scan the computer's barcode"
                    }
                </div>
            }
            {
                this.state.room && !this.state.processing && <div className={styles.fullHeight}>
                    <Scanner onScan={(value) => {
                        if (!this.state.workingNumber) {
                            if (/^\d+$/.test(value) && !this.state.scans.includes(value)) {
                                const sound = document.getElementById('beep') as HTMLAudioElement;
                                sound!.play().then();
                                
                                this.setState((prevState, props) => {
                                    const newState = {...prevState}
                                    newState.scans.push(value);
                                    newState.workingNumber = value;
                                    newState.flashingInstructions = true;
                                    return newState;
                                }, () => {
                                    setTimeout(() => {
                                        this.setState({flashingInstructions: false})
                                    }, 2000);
                                });
                            }
                        } else {
                            const json = JSON.parse(value);
                            if(isInformatonScan(json)) {
                                const sound = document.getElementById('beep') as HTMLAudioElement;
                                sound!.play().then();

                                this.setState((prevState, props) => {
                                    const newState = {...prevState}
                                    newState.withInfo.push({
                                        ...json,
                                        room: this.state.room!,
                                        number: this.state.workingNumber!
                                    });
                                    newState.workingNumber = undefined;
                                    newState.flashingInstructions = true;

                                    return newState;
                                }, () => {
                                    setTimeout(() => {
                                        this.setState({flashingInstructions: false})
                                    }, 2000);
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
                                this.sendScans();

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

const mapStateToProps = (state: IAppState) => ({lastUpdates: state.lastUpdates});

export default connect(mapStateToProps, {setLastUpdates: setLastUpdatesActionCreator})(Scan);
