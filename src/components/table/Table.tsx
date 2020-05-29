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
    data?: {
        id: string | number,
        [key: string]: any
    }[],
    update?: (
        key: string,
        filter: string
    ) => void,
    updateSorting?: (key: string, direction: string) => void
}

export type TableState = {
    sorting?: {
        key: string,
        direction: string
    }
}

class Table extends React.Component<TableProps, TableState> {

    state: TableState = {};

    render(): React.ReactNode {
        return <div className={styles.container}>
            <div className={styles.headerRow}>
                {
                    this.props.headers.map(header =>
                        <div key={header.key} className={styles.headerCell} onClick={() => {
                            if (this.state.sorting?.key === header.key) {
                                if (this.state.sorting.direction === 'DESC') {
                                    this.setState({
                                        sorting: {
                                            key: header.key,
                                            direction: 'ASC'
                                        }
                                    })
                                    this.props.updateSorting?.(header.key, 'ASC');
                                } else {
                                    this.setState({
                                        sorting: {
                                            key: header.key,
                                            direction: 'DESC'
                                        }
                                    })
                                    this.props.updateSorting?.(header.key, 'DESC');
                                }
                            } else {
                                this.setState({
                                    sorting: {
                                        key: header.key,
                                        direction: 'DESC'
                                    }
                                })
                                this.props.updateSorting?.(header.key, 'DESC');
                            }
                        }}>
                            {header.display}
                            {
                                header.key === this.state.sorting?.key ? (
                                    this.state.sorting.direction === 'ASC' ? '▲' : '▼'
                                ) : ''
                            }
                        </div>
                    )
                }
            </div>
            <div className={styles.headerRow}>
                {
                    this.props.headers.map((header, index) => <div key={header.key} className={styles.filter}>
                        <FilterList/>
                        <input className={styles.filterInput} onChange={async (e) => {
                            const value = e.target.value;
                            this.props.update?.(header.key, value);
                        }}/>
                    </div>)
                }
            </div>
            {
                this.props.data?.map(data => <div key={data.id} className={styles.dataRow}>
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
}

export default Table;