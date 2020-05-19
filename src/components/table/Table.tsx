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
    }[],
    update?: (
        key: string,
        filter: string
    ) => void
}

class Table extends React.Component<TableProps, any> {

    render(): React.ReactNode {
        return <div className={styles.container}>
            <div className={styles.headerRow}>
                {
                    this.props.headers.map(header => <div key={header.key}
                                                          className={styles.headerCell}>{header.display}</div>)
                }
            </div>
            <div className={styles.headerRow}>
                {
                    this.props.headers.map((header, index) => <div key={header.key} className={styles.filter}>
                        <FilterList/>
                        <input className={styles.filterInput} onChange={async (e) => {
                            const value = e.target.value;
                            if (this.props.update) {
                                this.props.update(header.key, value);
                            }
                        }}/>
                    </div>)
                }
            </div>
            {
                this.props.data.map(data => <div key={data.id} className={styles.dataRow}>
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