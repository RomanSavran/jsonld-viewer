import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import WebFont from 'webfontloader';
import './i18n';
import './index.css';
import {App} from './App';

WebFont.load({
    google: {
        families: ['Lato:300,400,600,700,800', 'Roboto:300,400,600,700', 'sans-serif']
    }
})

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
