import React from 'react';
import styles from './Table.module.css';

import {
    FilterList
} from '@material-ui/icons'

export type TableProps = {
    headers: {
        key: string,
        display: string
    }[],
    data: {
        id: string | number,
        [key: string]: any
    }[]
}

type TableState = {
    filters: {
        enabled: boolean,
        filter: string,
        key: string
    }[]
}

class Table extends React.Component<TableProps, TableState> {

    state: TableState = {
        filters: []
    }

    render(): React.ReactNode {
        return <div className={styles.container}>
            <div className={styles.headerRow}>
                {
                    this.props.headers.map(header => <div key={header.key} className={styles.headerCell}>{header.display}</div>)
                }
            </div>
            <div className={styles.headerRow}>
                {
                    this.props.headers.map((header, index) => <div key={header.key} className={styles.filter}>
                        <FilterList/>
                        <input className={styles.filterInput} onChange={(e) => {
                            const value = e.target.value;
                            this.setState((oldState, props) => {
                                // Update the filters
                                const filters = [...oldState.filters];
                                filters[index] = {
                                    enabled: true,
                                    key: header.key,
                                    filter: value
                                }
                                return {
                                    ...oldState,
                                    filters
                                }
                            })
                        }}/>
                    </div>)
                }
            </div>
            {
                // Filter the data according to the active filters before displaying it
                this.props.data.filter(data => {
                    for (let filter of this.state.filters) {
                        if (filter && filter.enabled && !this.calculateFilter(filter.filter, data[filter.key].toString())) {
                            return false;
                        }
                    }
                    return true;
                }).map(data => <div key={data.id} className={styles.dataRow}>
                    {
                        this.props.headers.map(header => <div key={header.key} className={styles.dataCell}>
                            {
                                data[header.key]
                            }
                        </div>)
                    }
                </div>)
            }
        </div>
    }

    /**
     * Return true if the value matches the filter term
     *
     * @param term The filter term
     * @param value The value being filtered
     */
    calculateFilter(term: string, value: string): boolean {
        // Split up the groups separated by ( and )
        const groups = term.split(/[()]/g).filter(x => !!x);
        let pending = [];
        for (let group of groups) {
            // Get the individual filter tokens, space separated
            const tokens = group.split(/[\s]/g).filter(x => !!x);
            if (tokens[0] === 'and' || tokens[0] === 'or' || tokens[0] === 'not') {
                pending.push(tokens.shift());
            }
            let groupPending = [];
            for (let token of tokens) {
                // Directly push the non-value keywords into the pending array
                if (token === 'and' || token === 'or' || token === 'not') {
                    groupPending.push(token);
                    continue;
                }
                // Handle the different value comparison types
                switch (token[0]) {
                    case '=':
                        groupPending.push(token.substring(1) === value);
                        break;
                    case '>':
                        if (token[1] === '=') {
                            groupPending.push(value >= token.substring(2))
                        } else {
                            groupPending.push(value > token.substring(1))
                        }
                        break;
                    case '<':
                        if (token[1] === '=') {
                            groupPending.push(value <= token.substring(2))
                        } else {
                            groupPending.push(value < token.substring(1))
                        }
                        break;
                    default:
                        groupPending.push(token === value);
                        break;
                }
            }
            // Do the calculations on the values with the pending keywords
            this.handleKeywords(groupPending);
            pending.push(groupPending[0]);
        }
        // Do the calculations on the values with the pending keywords
        this.handleKeywords(pending);

        return pending.length ? pending[0] as boolean : true;
    }

    /**
     * Do the calculations with the values and keywords in the flat array
     * @param values The flat array of values and keywords to calculate the filter
     */
    handleKeywords = function (values: any[]) {
        for (let i = values.length - 1; i >= 0; i--) {
            if (values[i] === 'not') {
                values[i] = !values[i + 1]
                values.splice(i + 1, 1)
            }
        }
        while (values.length >= 3) {
            let newValue;
            switch (values[1]) {
                case 'and':
                    newValue = values[0] && values[2];
                    break;
                case 'or':
                    newValue = values[0] || values[2];
                    break;
            }
            values[0] = newValue;
            values.splice(1, 2);
        }
    }
}

export default Table;