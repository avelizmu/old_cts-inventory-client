import React from 'react';
import {BrowserBarcodeReader} from '@zxing/library';
import styles from './Scanner.module.css';

export type ScannerState = {
    devices: MediaDeviceInfo[]
}

export type ScannerProps = {
    onScan: (value: string) => void,
    onNoCameraFound?: () => void
}

class Scanner extends React.Component<ScannerProps, ScannerState> {
    state: ScannerState = {
        devices: []
    }

    codeReader: BrowserBarcodeReader;

    constructor(props: any) {
        super(props);
        this.codeReader = new BrowserBarcodeReader();
    }

    async componentDidMount() {
        const devices = (await this.codeReader.listVideoInputDevices()).filter(device => device.kind === 'videoinput');
        this.setState({
            devices
        });
        if (!devices.length) {
            this.props.onNoCameraFound?.();
            return;
        }

        this.codeReader.decodeFromVideoDevice(devices[devices.length - 1].deviceId, 'video', (result, error) => {
            if (result) {
                this.props.onScan(result.getText());
            }
        });
    }

    render(): React.ReactNode {
        return this.state.devices.length ? <video id='video' style={{height: '100%', width: '100%'}}/> :
            <div className={styles.error}>
                No camera found
            </div>;
    }
}

export default Scanner;
