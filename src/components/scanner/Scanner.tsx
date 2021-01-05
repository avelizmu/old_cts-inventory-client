import React from 'react';
import {BarcodeFormat, BrowserMultiFormatReader, DecodeHintType} from '@zxing/library';
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

    codeReader: BrowserMultiFormatReader;

    constructor(props: any) {
        super(props);
        const hints = new Map<DecodeHintType, any>();
        hints.set(2, [11, 4]);
        this.codeReader = new BrowserMultiFormatReader();
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

        this.codeReader.decodeFromConstraints({
            video: {
                facingMode: "environment",
            }
        }, 'video', (result, error) => {
            if (result) {
                this.props.onScan(result.getText());
            }
        });
    }

    render(): React.ReactNode {
        return this.state.devices.length ?
            <video id='video' style={{height: '100%', width: '100%', objectFit: 'cover'}}/> :
            <div className={styles.error}>
                No camera found
            </div>;
    }
}

export default Scanner;
