import React, {Ref} from 'react';
import MaterialTable from "material-table";

import {forwardRef} from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

type RowData = {
    number: number,
    room: number,
    type: string,
    domain: string,
    memory: string
    model: string
    cpu: string,
    clockSpeed: string,
    serialNumber: number,
    department: string,
    [key: string]: any
}

class Inventory extends React.Component<any, any> {

    render(): React.ReactNode {

        const tableIcons = {
            Add: forwardRef((props, ref: Ref<SVGSVGElement>) => <AddBox {...props} ref={ref}/>),
            Check: forwardRef((props, ref: Ref<SVGSVGElement>) => <Check {...props} ref={ref}/>),
            Clear: forwardRef((props, ref: Ref<SVGSVGElement>) => <Clear {...props} ref={ref}/>),
            Delete: forwardRef((props, ref: Ref<SVGSVGElement>) => <DeleteOutline {...props} ref={ref}/>),
            DetailPanel: forwardRef((props, ref: Ref<SVGSVGElement>) => <ChevronRight {...props} ref={ref}/>),
            Edit: forwardRef((props, ref: Ref<SVGSVGElement>) => <Edit {...props} ref={ref}/>),
            Export: forwardRef((props, ref: Ref<SVGSVGElement>) => <SaveAlt {...props} ref={ref}/>),
            Filter: forwardRef((props, ref: Ref<SVGSVGElement>) => <FilterList {...props} ref={ref}/>),
            FirstPage: forwardRef((props, ref: Ref<SVGSVGElement>) => <FirstPage {...props} ref={ref}/>),
            LastPage: forwardRef((props, ref: Ref<SVGSVGElement>) => <LastPage {...props} ref={ref}/>),
            NextPage: forwardRef((props, ref: Ref<SVGSVGElement>) => <ChevronRight {...props} ref={ref}/>),
            PreviousPage: forwardRef((props, ref: Ref<SVGSVGElement>) => <ChevronLeft {...props} ref={ref}/>),
            ResetSearch: forwardRef((props, ref: Ref<SVGSVGElement>) => <Clear {...props} ref={ref}/>),
            Search: forwardRef((props, ref: Ref<SVGSVGElement>) => <Search {...props} ref={ref}/>),
            SortArrow: forwardRef((props, ref: Ref<SVGSVGElement>) => <ArrowDownward {...props} ref={ref}/>),
            ThirdStateCheck: forwardRef((props, ref: Ref<SVGSVGElement>) => <Remove {...props} ref={ref}/>),
            ViewColumn: forwardRef((props, ref: Ref<SVGSVGElement>) => <ViewColumn {...props} ref={ref}/>)
        };

        return <MaterialTable
            options={{filtering: true}}
            title={'Inventory'}
            icons={tableIcons}
            columns={[
                {
                    title: 'Number', field: 'number',
                    customFilterAndSearch: (term, rowData) => this.calculateFilter(term, rowData, 'number')
                },
                {
                    title: 'Room', field: 'room',
                    customFilterAndSearch: (term, rowData) => this.calculateFilter(term, rowData, 'room')
                },
                {
                    title: 'Type', field: 'type'
                },
                {
                    title: 'Domain', field: 'domain',
                    customFilterAndSearch: (term, rowData) => this.calculateFilter(term, rowData, 'memory')
                },
                {
                    title: 'Memory', field: 'memory',
                    customFilterAndSearch: (term, rowData) => this.calculateFilter(term, rowData, 'memory')
                },
                {
                    title: 'Model', field: 'model',
                    customFilterAndSearch: (term, rowData) => this.calculateFilter(term, rowData, 'model')
                },
                {
                    title: 'CPU', field: 'cpu',
                    customFilterAndSearch: (term, rowData) => this.calculateFilter(term, rowData, 'cpu')
                },
                {
                    title: 'Clock Speed', field: 'clockSpeed',
                    customFilterAndSearch: (term, rowData) => this.calculateFilter(term, rowData, 'clockSpeed')
                },
                {
                    title: 'Serial Number', field: 'serialNumber',
                    customFilterAndSearch: (term, rowData) => this.calculateFilter(term, rowData, 'serialNumber')
                },
                {
                    title: 'Department', field: 'department',
                    customFilterAndSearch: (term, rowData) => this.calculateFilter(term, rowData, 'department')
                }
            ]}
            // TODO replace generated sample data with remote server data
            data={Array.from({length: 100}, () => {
                return {
                    id: Math.floor(Math.random() * 1000),
                    number: Math.floor(Math.random() * 10000000),
                    room: Math.floor(Math.random() * 10000),
                    type: 'D',
                    domain: 'mymdc.net',
                    memory: `${Math.floor(Math.random() * 64)} GB`,
                    model: `Precision M${Math.floor(Math.random() * 1000)}`,
                    cpu: 'Intel Core i7-4900MQ CPU',
                    clockSpeed: `${(Math.random() * 5).toString().substring(0, 4)}GHz`,
                    serialNumber: Math.random() * 51512,
                    department: 'Learning Resources'
                }
            })}>
        </MaterialTable>
    }

    calculateFilter(term: string, rowData: RowData, field: string): boolean {
        const groups = term.split(/[()]/g).filter(x => !!x);
        let pending = [];
        for (let group of groups) {
            const tokens = group.split(/[\s]/g).filter(x => !!x);
            if (tokens[0] === 'and' || tokens[0] === 'or' || tokens[0] === 'not') {
                pending.push(tokens.shift());
            }
            let groupPending = [];
            for (let token of tokens) {
                if (token === 'and' || token === 'or' || token === 'not') {
                    groupPending.push(token);
                    continue;
                }
                switch (token[0]) {
                    case '=':
                        groupPending.push(token.substring(1) === rowData[field].toString());
                        break;
                    case '>':
                        if (token[1] === '=') {
                            groupPending.push(rowData[field].toString() >= token.substring(2))
                        } else {
                            groupPending.push(rowData[field].toString() > token.substring(1))
                        }
                        break;
                    case '<':
                        if (token[1] === '=') {
                            groupPending.push(rowData[field].toString() <= token.substring(2))
                        } else {
                            groupPending.push(rowData[field].toString() < token.substring(1))
                        }
                        break;
                    default:
                        groupPending.push(token === rowData[field].toString());
                        break;
                }
            }
            for (let i = groupPending.length - 1; i >= 0; i--) {
                if (groupPending[i] === 'not') {
                    groupPending[i] = !groupPending[i + 1]
                    groupPending.splice(i + 1, 1)
                }
            }
            while (groupPending.length >= 3) {
                let newValue;
                switch (groupPending[1]) {
                    case 'and':
                        newValue = groupPending[0] && groupPending[2];
                        break;
                    case 'or':
                        newValue = groupPending[0] || groupPending[2];
                        break;
                }
                groupPending[0] = newValue;
                groupPending.splice(1, 2);
            }
            pending.push(groupPending[0]);
        }
        for (let i = pending.length - 1; i >= 0; i--) {
            if (pending[i] === 'not') {
                pending[i] = !pending[i + 1]
                pending.splice(i + 1, 1)
            }
        }
        while (pending.length >= 3) {
            let newValue;
            switch (pending[1]) {
                case 'and':
                    newValue = pending[0] && pending[2];
                    break;
                case 'or':
                    newValue = pending[0] || pending[2];
                    break;
            }
            pending[0] = newValue;
            pending.splice(1, 2);
        }
        return pending.length ? pending[0] as boolean : true;
    }
}

export default Inventory;