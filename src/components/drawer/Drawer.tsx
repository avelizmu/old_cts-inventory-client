import React from 'react';
import styles from './Drawer.module.css';

import {
    Menu as MenuIcon
} from '@material-ui/icons'

export type DrawerProps = {
    menuItems?: {
        name: string,
        callback: () => void
    }[]
}

export type DrawerState = {
    drawerOpen: boolean
}

class Drawer extends React.Component<DrawerProps, DrawerState> {

    state: DrawerState = {
        drawerOpen: false
    }

    render(): React.ReactNode {
        return <div className={styles.container}>
            <div className={styles.topBar}>
                <div className={styles.drawerIcon}>
                    <MenuIcon fontSize={'large'} onClick={() => {
                        this.setState((a) => {
                            return {drawerOpen: !a.drawerOpen}
                        })
                    }}/>
                </div>
                {this.props.menuItems?.map(item => {
                    return <div key={item.name} className={styles.topBarItem}>{item.name}</div>
                })}
            </div>
            <div className={this.state.drawerOpen ? [styles.drawer, styles.drawerOpen].join(' ') : styles.drawer}>
                {this.props.menuItems?.map(item => {
                    return <div key={item.name} className={styles.drawerItem}>{item.name}</div>
                })}
            </div>
            <div className={this.state.drawerOpen ? styles.overlay : ''} onClick={() => {
                this.setState((a) => {
                    return {drawerOpen: !a.drawerOpen}
                })
            }}/>
            <div className={styles.content} style={{overflowY: this.state.drawerOpen ? 'hidden' : 'auto'}}>
                {this.props.children}
            </div>
        </div>;
    }
}

export default Drawer;
