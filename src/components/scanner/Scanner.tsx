import React from 'react';
import {BrowserBarcodeReader} from '@zxing/library';

export type ScannerState = {
    devices: MediaDeviceInfo[]
}

class Scanner extends React.Component<any, ScannerState> {
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
            console.log(result);
            console.error(error);
            if (result) {
                alert(result.getText());
            }
        });
    }

    render(): React.ReactNode {
        return <video id='video' style={{width: '100%', height: '100%'}}/>;
    }
}

export default Scanner;
