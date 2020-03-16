import React from 'react';
import {mount} from 'enzyme';
import Modal from "./Modal";

describe('Modal', () => {
    it('Is visible when visibility is set to true', () => {
        const component = mount(<Modal visible={true} onClose={() => {}}/>);

        expect(component.find('.modal').exists()).toBe(true);
    });

    it('Is not visible when visibility is set to false', () => {
        const component = mount(<Modal visible={false} onClose={() => {}}/>);

        expect(component.find('.modal').exists()).toBe(false);
    });
});