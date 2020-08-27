import React from 'react';
import {BrowserBarcodeReader} from '@zxing/library';

export type ScannerState = {
    devices: MediaDeviceInfo[]
}

export type ScannerProps = {
    onScan: (value: string) => void
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

        this.codeReader.decodeFromVideoDevice(devices[devices.length - 1].deviceId, 'video', (result, error) => {
            if (result) {
                this.props.onScan(result.getText());
            }
        });
    }

    render(): React.ReactNode {
        return <video id='video' style={{height: '100%'}}/>;
    }
}

export default Scanner;
