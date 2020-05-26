import React from 'react';
import {mount} from 'enzyme';

import Table from "./Table";
import axios from "axios";

describe('Table', () => {
    it('Renders the headers', () => {
        const headersData = [{key: '1', display: 'Header 1'}, {key: '2', display: 'Header 2'}]
        const component = mount(<Table data={[]} headers={headersData}/>);

        component.find('.headerCell').forEach((element, index) => {
            expect(element.text()).toBe(headersData[index].display);
        });
    });

    it('Renders the data', () => {
        const headersData = [{key: 'first', display: 'Header 1'}, {key: 'second', display: 'Header 2'}];
        const data = [{id: 0, first: '12345', second: "67890"}, {id: 1, first: '34567', second: '89012'}, {
            id: 2,
            first: '56789',
            second: '01234'
        }];
        const component = mount(<Table data={data} headers={headersData}/>);

        component.find('.dataRow').forEach((row, rowIndex) => {
            expect(row.childAt(0).text()).toBe(data[rowIndex].first);
            expect(row.childAt(1).text()).toBe(data[rowIndex].second);
        })
    });

    it('Filters the data correctly', () => {
        const headersData = [{key: 'first', display: 'Header 1'}, {key: 'second', display: 'Header 2'}];
        const data = [{id: 0, first: '12345', second: "67890"}, {id: 1, first: '34567', second: '89012'}, {
            id: 2,
            first: '56789',
            second: '01234'
        }];

        const updateFunction = jest.fn((key: string, filter: string) => {
        });
        const component = mount(<Table data={data} headers={headersData} update={updateFunction}/>);

        for (let dataEntry of data) {
            component.find('.filterInput').at(0).simulate('change', {target: {value: dataEntry.first}});
            expect(updateFunction).toHaveBeenLastCalledWith('first', dataEntry.first);
        }
    });

    it('Sorts the data correctly', () => {
        const headersData = [{key: 'first', display: 'Header 1'}, {key: 'second', display: 'Header 2'}];
        const data = [{id: 0, first: '12345', second: "67890"}, {id: 1, first: '34567', second: '89012'}];
        const updateSortingFunction = jest.fn((key: string, direction: string) => {
        });

        const component = mount(<Table data={data} headers={headersData} updateSorting={updateSortingFunction}/>);

        for (let header of headersData) {
            const headerWrapper = component.find('.headerCell').filterWhere(x => x.text().startsWith(header.display));
            expect(headerWrapper.exists()).toBe(true);
            expect(headerWrapper.text()).toBe(header.display);
            headerWrapper.simulate('click')
            expect(headerWrapper.text()).toBe(`${header.display}▼`);
            headerWrapper.simulate('click')
            expect(headerWrapper.text()).toBe(`${header.display}▲`);
            headerWrapper.simulate('click')
            expect(headerWrapper.text()).toBe(`${header.display}▼`);
        }

    })
});