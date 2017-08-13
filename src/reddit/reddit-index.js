import React from 'react'
import { render } from 'react-dom'
import Root from './reddit-root'
import registerServiceWorker from '../registerServiceWorker';

render(
    <Root/>,
    document.getElementById('root')
)
registerServiceWorker();