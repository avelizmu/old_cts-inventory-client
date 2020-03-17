import React from 'react';
import styles from './LoadingModal.module.css';
import Modal from "../modal/Modal";

type ModalProps = {
    visible: boolean,
    onClose: () => void
}

class LoadingModal extends React.Component<ModalProps, any> {
    render(): React.ReactNode {
        return <Modal visible={this.props.visible} onClose={this.props.onClose}>
            <div className={styles.loader}/>
        </Modal>
    }
}

export default LoadingModal;
