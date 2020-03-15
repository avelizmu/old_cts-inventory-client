import React from 'react';
import {mount} from 'enzyme';

import Table, {TableProps} from "./Table";

describe('Table', () => {
    const headersData = [{key: '1', display: 'Header 1'}, {key: '2', display: 'Header 2'}]
    it('Renders the headers', () => {
        const component = mount(<Table data={[]} headers={headersData}/>);

        component.find('.headerCell').forEach((element, index) => {
            expect(element.text()).toBe(headersData[index].display);
        });
    });

    it('Renders the data', () => {
        const headersData = [{key: 'first', display: 'Header 1'}, {key: 'second', display: 'Header 2'}];
        const data = [{id: 0, first: '12345', second: "67890"}, {id: 1, first: '34567', second: '89012'}, {id: 2, first: '56789', second: '01234'}];
        const component = mount(<Table data={data} headers={headersData}/>);

        component.find('.dataRow').forEach((row, rowIndex) => {
            expect(row.childAt(0).text()).toBe(data[rowIndex].first);
            expect(row.childAt(1).text()).toBe(data[rowIndex].second);
        })
    });

    it('Filters the data correctly', () => {
        const headersData = [{key: 'first', display: 'Header 1'}, {key: 'second', display: 'Header 2'}];
        const data = [{id: 0, first: '12345', second: "67890"}, {id: 1, first: '34567', second: '89012'}, {id: 2, first: '56789', second: '01234'}];
        const component = mount(<Table data={data} headers={headersData}/>);

        for(let dataEntry of data) {
            component.find('.filterInput').at(0).simulate('change', { target: { value: dataEntry.first } });
            expect(component.find('.dataRow').at(0).childAt(0).text()).toBe(dataEntry.first);
            expect(component.find('.dataRow').at(0).childAt(1).text()).toBe(dataEntry.second);
        }
    });
});



/*it('Filters the data correctly', () => {
    const headersData = [{key: 'first', display: 'Header 1'}, {key: 'second', display: 'Header 2'}];
    const data = [{id: 0, first: '12345', second: "67890"}, {id: 1, first: '34567', second: '89012'}, {id: 2, first: '56789', second: '01234'}];
    act(() => {
        render(<Table data={data} headers={headersData}/>, container)
    });

    const dataRow = container.getElementsByClassName(styles.dataRow).item(0) as Element;


    // @ts-ignore
    Simulate.change(container.getElementsByClassName(styles.filterInput).item(0) as Element, {target: {value: '123'}});
    console.log(`Test: ${(container.getElementsByClassName(styles.filterInput).item(0) as HTMLInputElement).value}`)
});*/