import React from 'react';
import {mount} from 'enzyme';
import Login from "./Login";
import axios from 'axios';
import mock = jest.mock;

mock('axios');

describe('Login', () => {
    it('Calls POST /api/users/login with empty body when no credentials provided', async () => {
        const component = mount(<Login/>);

        const post = jest.spyOn(axios, 'post').mockResolvedValueOnce({});
        component.find('.button').at(0).simulate('click');
        expect(post).toHaveBeenCalledWith('/api/users/login', {
            username: '',
            password: ''
        });
    });

    it('Calls POST /api/users/login with credentials with they are provided', async () => {
        const component = mount(<Login/>);

        const post = jest.spyOn(axios, 'post').mockResolvedValueOnce({});

        component.find('.input').at(0).simulate('change', {target: {value: 'username'}})
        component.find('.input').at(1).simulate('change', {target: {value: 'password'}})

        component.find('.button').at(0).simulate('click');
        expect(post).toHaveBeenCalledWith('/api/users/login', {
            username: 'username',
            password: 'password'
        });
    });

    it('Displays error when failing to log in', async () => {
        const component = mount(<Login/>);

        const post = jest.spyOn(axios, 'post').mockRejectedValueOnce({
            response: {
                status: 400,
                data: {
                    message: 'Test Message'
                }
            }
        });

        component.find('.button').at(0).simulate('click');

        expect(post).toHaveBeenCalledWith('/api/users/login', {
            username: '',
            password: ''
        });

        return new Promise((resolve, reject) => {
            setImmediate(() => {
                component.update()
                expect(component.find('.error').exists()).toBe(true);
                expect(component.find('.error').text()).toBe('Test Message');
                resolve();
            });
        });
    });

    it('Displays password reset warning', async () => {
        const component = mount(<Login/>);

        const post = jest.spyOn(axios, 'post').mockRejectedValueOnce({
            response: {
                status: 401,
                data: {
                    message: 'Password must be reset.'
                }
            }
        });

        component.find('.button').at(0).simulate('click');

        expect(post).toHaveBeenCalledWith('/api/users/login', {
            username: '',
            password: ''
        });

        return new Promise((resolve, reject) => {
            setImmediate(() => {
                component.update()
                expect(component.find('.warning').exists()).toBe(true);
                expect(component.find('.warning').text()).toBe('You must set a new password');
                expect(component.find('.input').length).toBe(3);
                resolve();
            });
        });
    });
});