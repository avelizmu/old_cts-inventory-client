import React from 'react';
import {mount} from 'enzyme';
import Home, {HomeState} from "./Home";
import axios from 'axios';
import mock = jest.mock;

mock('axios');

describe('Home', () => {
    it('Searches with no parameters on page load', () => {
        const post = jest.spyOn(axios, 'post').mockResolvedValueOnce({data: []});

        const component = mount(<Home/>);

        return new Promise((resolve, reject) => {
            setImmediate(() => {
                component.update()
                expect(post).toHaveBeenNthCalledWith(1, '/api/inventory/search');
                expect((component.update().state() as HomeState).data).toBeDefined();
                expect((component.update().state() as HomeState).data).toHaveLength(0);
                resolve();
            });
        });
    });

    it('Searches with filters', async () => {
        jest.spyOn(axios, 'post').mockResolvedValueOnce({data: []});

        const component = mount(<Home/>);

        const post = jest.spyOn(axios, 'post').mockResolvedValueOnce({
            data: [{
                id: 1,
                room: '1',
                number: '1',
                serial: '1',
                model: '1',
                cpu: '1',
                clockSpeed: 1,
                ram: 1
            }]
        });
        component.instance().setState({
            filters: {
                test: 'test',
                result: 'result'
            }
        });
        await (component.instance() as Home).search();

        return new Promise((resolve, reject) => {
            setImmediate(() => {
                component.update()
                expect(post).toHaveBeenLastCalledWith('/api/inventory/search', {
                    search: {
                        test: {
                            value: 'test',
                            operator: '='
                        },
                        result: {
                            value: 'result',
                            operator: '='
                        }
                    }
                });
                expect((component.update().state() as HomeState).data).toBeDefined();
                expect((component.update().state() as HomeState).data).toHaveLength(1);
                expect((component.update().state() as HomeState).data?.[0]).toStrictEqual({
                    id: 1,
                    room: '1',
                    number: '1',
                    serial: '1',
                    model: '1',
                    cpu: '1',
                    clockSpeed: 1,
                    ram: 1
                })

                resolve();
            });
        });
    });

    it('Searches with sorting', async () => {
        jest.spyOn(axios, 'post').mockResolvedValueOnce({data: []});

        const component = mount(<Home/>);

        const post = jest.spyOn(axios, 'post').mockResolvedValueOnce({
            data: [{
                id: 1,
                room: '1',
                number: '1',
                serial: '1',
                model: '1',
                cpu: '1',
                clockSpeed: 1,
                ram: 1
            }]
        });
        component.instance().setState({
            filters: {},
            sort: {
                key: 'test',
                direction: 'ASC'
            }
        });
        await (component.instance() as Home).search();

        return new Promise((resolve, reject) => {
            setImmediate(() => {
                component.update()
                expect(post).toHaveBeenLastCalledWith('/api/inventory/search', {
                    search: {},
                    sort: {
                        key: 'test',
                        direction: 'ASC'
                    }
                });
                expect((component.update().state() as HomeState).data).toBeDefined();
                expect((component.update().state() as HomeState).data).toHaveLength(1);
                expect((component.update().state() as HomeState).data?.[0]).toStrictEqual({
                    id: 1,
                    room: '1',
                    number: '1',
                    serial: '1',
                    model: '1',
                    cpu: '1',
                    clockSpeed: 1,
                    ram: 1
                })

                resolve();
            });
        });
    });

    it('Searches with filters and sorting', async () => {
        jest.spyOn(axios, 'post').mockResolvedValueOnce({data: []});

        const component = mount(<Home/>);

        const post = jest.spyOn(axios, 'post').mockResolvedValueOnce({
            data: [{
                id: 1,
                room: '1',
                number: '1',
                serial: '1',
                model: '1',
                cpu: '1',
                clockSpeed: 1,
                ram: 1
            }]
        });
        component.instance().setState({
            filters: {
                test: 'test',
                result: 'result'
            },
            sort: {
                key: 'test',
                direction: 'ASC'
            }
        });
        await (component.instance() as Home).search();

        return new Promise((resolve, reject) => {
            setImmediate(() => {
                component.update()
                expect(post).toHaveBeenLastCalledWith('/api/inventory/search', {
                    search: {
                        test: {
                            value: 'test',
                            operator: '='
                        },
                        result: {
                            value: 'result',
                            operator: '='
                        }
                    },
                    sort: {
                        key: 'test',
                        direction: 'ASC'
                    }
                });
                expect((component.update().state() as HomeState).data).toBeDefined();
                expect((component.update().state() as HomeState).data).toHaveLength(1);
                expect((component.update().state() as HomeState).data?.[0]).toStrictEqual({
                    id: 1,
                    room: '1',
                    number: '1',
                    serial: '1',
                    model: '1',
                    cpu: '1',
                    clockSpeed: 1,
                    ram: 1
                })

                resolve();
            });
        });
    });

});