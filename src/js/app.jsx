import React from 'react';
import ReactDOM from 'react-dom';
import SJTest from 'sjtest';
import MainDiv from './components/MainDiv';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';

// disable right-click to stop it interfering with the game. Use F12 to get the console
document.addEventListener('contextmenu', event => event.preventDefault());

// global jquery for You-Again
window.$ = $;

ReactDOM.render(<MainDiv />, document.getElementById('mainDiv'));
