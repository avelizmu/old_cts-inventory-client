import React from 'react';
import {mount, render} from 'enzyme';
import Drawer from "./Drawer";
import axios from 'axios';
import mock = jest.mock;

mock('axios');
describe('Drawer', () => {

    it('Top bar and drawer is populated properly', () => {
        const component = mount(<Drawer menuItems={[
            {
                name: 'Test',
                callback: () => {
                }
            },
            {
                name: 'Other Test',
                callback: () => {
                }
            },
            {
                name: 'One More Test',
                callback: () => {
                }
            }
        ]}>
        </Drawer>);

        const topBarIcons = component.find('.topBar');
        expect(topBarIcons.children().length).toBe(4);

        const drawerIcon = component.find('.drawerIcon');
        expect(drawerIcon).toBeDefined();

        expect(topBarIcons.find('.topBarItem').at(0).text()).toBe('Test');
        expect(topBarIcons.find('.topBarItem').at(1).text()).toBe('Other Test');
        expect(topBarIcons.find('.topBarItem').at(2).text()).toBe('One More Test');

        const drawer = component.find('.drawer');
        expect(drawer).toBeDefined();

        expect(drawer.find('.drawerItem').at(0).text()).toBe('Test');
        expect(drawer.find('.drawerItem').at(1).text()).toBe('Other Test');
        expect(drawer.find('.drawerItem').at(2).text()).toBe('One More Test');
    });

});