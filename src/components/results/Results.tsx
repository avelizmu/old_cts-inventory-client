import React from 'react';
import Table from "../table/Table";
import {IAppState} from "../../redux/store";
import {connect} from "react-redux";
import {LastUpdates} from "../../redux/actions/lastUpdates";
import styles from './Results.module.css';

type ResultProps = {
    lastUpdates: LastUpdates
}

class Results extends React.Component<ResultProps, any> {
    render(): React.ReactNode {
        return <Table headers={[
            {
                key: 'number',
                display: 'PC Number'
            },
            {
                key: 'message',
                display: 'Result'
            }
        ]} data={
            this.props.lastUpdates?.map(update => {
                return {
                    id: update.number,
                    number: update.number,
                    message: <div className={styles.messageDiv}>
                        {
                            update.message.split('\n').map(line => <div className={styles.line}>{line}</div>)
                        }
                    </div>
                }
            })
        }/>
    }
}

const mapStateToProps = (state: IAppState) => ({lastUpdates: state.lastUpdates});

export default connect(mapStateToProps, {})(Results);
