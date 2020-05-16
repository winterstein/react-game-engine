import React from 'react';
import ReactDOM from 'react-dom';
import SJTest from 'sjtest';
import MainDiv from './components/MainDiv';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';

// global jquery for You-Again
window.$ = $;

ReactDOM.render(<MainDiv />, document.getElementById('mainDiv'));
