import React from 'react';
import ReactDOM from 'react-dom';
import WebFont from 'webfontloader';
import './i18n';
import './index.css';
import {App} from './App';

WebFont.load({
    google: {
        families: ['Montserrat:300,400,600,700', 'Roboto:300,400,600,700', 'sans-serif']
    }
})

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
