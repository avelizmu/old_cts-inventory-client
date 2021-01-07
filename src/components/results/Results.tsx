import React from 'react';
import Table from "../table/Table";
import {IAppState} from "../../redux/store";
import {connect} from "react-redux";
import {LastUpdates} from "../../redux/actions/lastUpdates";

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
                    ...update
                }
            })
        }/>
    }
}

const mapStateToProps = (state: IAppState) => ({lastUpdates: state.lastUpdates});

export default connect(mapStateToProps, {})(Results);
