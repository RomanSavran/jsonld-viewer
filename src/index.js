import 'react-app-polyfill/ie11';
import fromEntries from 'object.fromentries';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';

if (!Object.fromEntries) {
    fromEntries.shim();
}


ReactDOM.render(<App />, document.getElementById('platform-app'));