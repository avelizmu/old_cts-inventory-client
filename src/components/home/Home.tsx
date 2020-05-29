import React from 'react';
import Table from "../table/Table";
import axios from 'axios';

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
    }
}

class Home extends React.Component<any, HomeState> {

    constructor(props: any) {
        super(props);

        this.search = this.search.bind(this);
    }


    state: HomeState = {}


    async componentDidMount() {
        const initialData = (await axios.post('/api/inventory/search')).data;
        this.setState({
            data: initialData
        });
    }

    render(): React.ReactNode {
        return <Table headers={[
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
