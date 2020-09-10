import React, {FormEvent} from 'react';
import Modal from "../modal/Modal";
import styles from './InputModal.module.css';

type ModalProps = {
    visible: boolean,
    prompt: string,
    onClose?: () => void,
    onConfirm: (input: string) => void,
    onCancel: () => void
}

type InputModalState = {
    input: string
}

class InputModal extends React.Component<ModalProps, InputModalState> {

    state: InputModalState = {
        input: ""
    }

    render(): React.ReactNode {
        return <Modal visible={this.props.visible} onClose={this.props.onClose}>
            <div className={styles.container}>
                <div className={styles.prompt}>{this.props.prompt}</div>
                <input onInput={(e) => {
                    this.setState({input: e.currentTarget.value})
                }} className={styles.input}/>
                <div className={styles.buttons}>
                    <button className={[styles.button, styles.cancelButton].join(' ')}
                            onClick={this.props.onCancel}>Cancel
                    </button>
                    <button className={[styles.button, styles.confirmButton].join(' ')} onClick={() => {
                        this.props.onConfirm(this.state.input)
                    }}>Confirm
                    </button>
                </div>
            </div>
        </Modal>
    }
}

export default InputModal;
