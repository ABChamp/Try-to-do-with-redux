import React, { Component } from 'react'
import { Proviider } from 'react-redux'
import configureStore from './reddit-configureStore'
import AsyncApp from './reddit-AsyncApp'

const store = configureStore()

export default class Root extends Component {
    render() {
        return (
            <Provider store={store}>
                <AsyncApp />
            </Provider>
        )
    }
}
