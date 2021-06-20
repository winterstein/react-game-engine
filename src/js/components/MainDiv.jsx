import React, { Component } from 'react';
import Login from '../base/youagain';
import { isMobile, modifyHash } from '../base/utils/miscutils';
import _ from 'lodash';
// Plumbing
import DataStore from "../base/plumbing/DataStore";
import Roles from "../base/Roles";
import C from "../C";
import Crud from "../base/plumbing/Crud"; // Crud is loaded here (but not used here)

// Templates
import MessageBar from '../base/components/MessageBar';
import LoginWidget from '../base/components/LoginWidget';

// Pages
import {BasicAccountPage} from '../base/components/AccountPageWidgets';
import E404Page from '../base/components/E404Page';
import TestPage from '../base/components/TestPage';
import FightPage from './FightPage';
import StoryPage from './StoryPage';
import ExplorePage from './ExplorePage';
import LeftNav from './LeftNav';
import SplashScreen from './SplashScreen';
import Messaging from '../base/plumbing/Messaging';
import ArenaPage from './ArenaPage';
import SpacePage from './SpacePage';
// game
import Game from '../Game';
import { Alert } from 'reactstrap';

// DataStore
C.setupDataStore();
DataStore.update({game: Game.get()});

// Actions

const PAGES = {
	account: BasicAccountPage,
	test: TestPage,
	fight: FightPage,
	arena: ArenaPage,
	story: StoryPage,
	explore: ExplorePage,
	splash:	SplashScreen,
	space:	SpacePage
};

const DEFAULT_PAGE = 'space';

const loginResponsePath = ['misc', 'login', 'response'];

if (isMobile()) {
	Messaging.notifyUser({type:"warning",text:"Not ready for mobile yet"});
}


let rightClickDisabledFlag = false;

/**
		Top-level: tabs
*/
class MainDiv extends Component {

	componentWillMount() {
		// disable right-click to stop it interfering with the game. Use F12 to get the console
		if (false && !rightClickDisabledFlag) {
			document.addEventListener('contextmenu', event => event.preventDefault());
			rightClickDisabledFlag = true;
		}

		// redraw on change
		const updateReact = (mystate) => this.setState({});
		DataStore.addListener(updateReact);

		Login.app = C.app.service;
		// Set up login watcher here, at the highest level		
		Login.change(() => {
			// ?? should we store and check for "Login was attempted" to guard this??
			if (Login.isLoggedIn()) {
				// close the login dialog on success
				LoginWidget.hide();
			}
			// Link profiles? No - done by the YA server
			// poke React via DataStore (e.g. for Login.error)
			DataStore.update({});			
			// is this needed??
			this.setState({});
		});

		// Are we logged in?
		//Login.verify();
		Login.verify().then((response) => {
			let success = response.success;
			DataStore.setValue(loginResponsePath, success, true);
			// Store response.cargo.success somewhere in datastore so other components can check (a) if it's finished and (b) if it was successful before trying to talk to lg.good-loop.com
		});

	}

	componentDidCatch(error, info) {
		// Display fallback UI
		this.setState({error, info, errorPath: DataStore.getValue('location', 'path')});
		console.error(error, info); 
		if (window.onerror) window.onerror("Caught error", null, null, null, error);
	}

	render() {
		// why??
		if ( ! DataStore.getValue('env', 'width')) {
			DataStore.setValue(['env', 'width'], window.innerWidth, false);
			DataStore.setValue(['env', 'height'], window.innerHeight, false);
			// NB: wrapper function to get the right this in update
			setTimeout(() => DataStore.update(), 1);
			return null;
		}
		if (isMobile()) {
			return <Alert color="danger">Sorry - Mobile is not supported 😢</Alert>
		}


		let path = DataStore.getValue('location', 'path');	
		let page = (path && path[0]);
		if ( ! page) {
			_.defer(() => modifyHash([DEFAULT_PAGE]));
			return null;
		}
		assert(page);
		let Page = PAGES[page];
		if ( ! Page) {
			Page = E404Page;
		}
		if (this.state && this.state.error && this.state.errorPath === path) {
			Page = () => (<div><h3>There was an Error :'(</h3>
				<p>Try navigating to a different tab, or reloading the page. If this problem persists, please contact support.</p>
				<p>{this.state.error.message}<br /><small>{this.state.error.stack}</small></p>
			</div>);
		}
	
		return (<div style={{height:'100vh',width:'100vw'}} className='flex-row'>
			<MessageBar />
			{isMobile()? null /* TODO */ : <LeftNav className='pull-left' />}
			<div className='page flex-grow' id={page} >
				<Page path={path} />
			</div>
			<LoginWidget logo={C.app.service} title={'Welcome to '+C.app.name} services={['twitter', 'facebook']} />
		</div>);
	} // ./render()
} // ./MainDiv

export default MainDiv;
