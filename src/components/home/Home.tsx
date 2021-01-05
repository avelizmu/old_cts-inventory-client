import React from 'react';
import Table from "../table/Table";
import axios from 'axios';
import styles from './Home.module.css';
import Scanner from "../scanner/Scanner";
import {Redirect} from "react-router";

export type HomeState = {
    data?: {
        id: number,
        room: string,
        number: string,
        serial: string,
        model: string,
        cpu: string,
        clockSpeed: string,
        ram: string
    }[],
    filters?: {
        [key: string]: string
    },
    sort?: {
        key: string,
        direction: string
    },
    scanning: boolean
}

class Home extends React.Component<any, HomeState> {

    constructor(props: any) {
        super(props);

        this.search = this.search.bind(this);
    }

    state: HomeState = {
        scanning: false
    }

    async componentDidMount() {
        const initialData = (await axios.post('/api/inventory/search')).data;
        this.setState({
            data: initialData
        });
    }

    render(): React.ReactNode {
        return <>
            {
                !this.state.scanning && <div>
                    <Table headers={[
                        {
                            key: 'room',
                            display: 'Room #'
                        },
                        {
                            key: 'number',
                            display: 'PC #'
                        },
                        {
                            key: 'serial',
                            display: 'Serial #'
                        },
                        {
                            key: 'model',
                            display: 'Model'
                        },
                        {
                            key: 'cpu',
                            display: 'CPU'
                        },
                        {
                            key: 'clockSpeed',
                            display: 'Clock Speed'
                        },
                        {
                            key: 'ram',
                            display: 'RAM'
                        }
                    ]} data={this.state.data} update={(key: string, filter: string) => {
                        this.setState((previousState) => {
                            return {
                                ...previousState,
                                filters: {
                                    ...previousState.filters,
                                    [key]: filter
                                }
                            }
                        }, this.search)
                    }} updateSorting={(key, direction) => {
                        this.setState({
                            sort: {
                                key,
                                direction
                            }
                        }, this.search)
                    }}/>;
                    <i onClick={() => {
                        this.setState({scanning: true});
                    }} className={[styles.button, styles.scanButton, 'material-icons'].join(' ')}>
                        search
                    </i>
                </div>
            }
            {
                this.state.scanning && <Redirect to={'/scan'}/>
            }
        </>
    }

    async search() {
        const filters = Object.keys(this.state.filters || {}).reduce((search: {
            [key: string]: {
                value: string | number,
                operator: string
            }
        }, key) => {
            if (!this.state.filters?.[key]) {
                return search;
            }
            let op;
            let defaultOp = false;
            if (this.state.filters[key].match(/^[><=]/)) {
                op = this.state.filters[key].charAt(0);
                if (op !== '=' && this.state.filters[key].charAt(1) === '=') {
                    op += '=';
                }
            } else {
                defaultOp = true;
                op = '=';
            }

            const value = this.state.filters[key].substring(defaultOp ? 0 : op.length);
            if (value) {
                search[key] = {
                    value,
                    operator: op
                }
            }
            return search;
        }, {});


        const requestData: { search: any, sort?: any } = {
            search: filters
        }
        if (this.state.sort) {
            requestData.sort = this.state.sort
        }
        const data = (await axios.post('/api/inventory/search', requestData)).data;
        this.setState({
            data
        });

    }
}

export default Home;
