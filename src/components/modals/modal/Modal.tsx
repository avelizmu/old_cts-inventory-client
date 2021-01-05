import React from 'react';
import styles from './Modal.module.css';

type ModalProps = {
    visible: boolean,
    onClose?: () => void
}

class Modal extends React.Component<ModalProps, any> {
    render(): React.ReactNode {
        return this.props.visible ? <div>
            <div className={styles.background} onClick={this.props.onClose}/>
            <div className={styles.modal}>
                {this.props.children}
            </div>
        </div> : <></>
    }
}

export default Modal;
