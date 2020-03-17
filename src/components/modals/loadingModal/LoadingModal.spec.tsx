import React from 'react';
import {mount} from 'enzyme';
import LoadingModal from "./LoadingModal";

describe('LoadingModal', () => {
    it('Is visible when visibility is set to true', () => {
        const component = mount(<LoadingModal visible={true} onClose={() => {}}/>);

        expect(component.find('.loader').exists()).toBe(true);
    });

    it('Is not visible when visibility is set to false', () => {
        const component = mount(<LoadingModal visible={false} onClose={() => {}}/>);

        expect(component.find('.loader').exists()).toBe(false);
    });
});