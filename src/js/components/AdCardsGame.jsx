/**
 * A convenient place for ad-hoc widget tests.
 * This is not a replacement for proper unit testing - but it is a lot better than debugging via repeated top-level testing.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import SJTest, {assert} from 'sjtest';
import Login from 'you-again';
import DataStore, { getValue, setValue } from '../base/plumbing/DataStore';
import C from '../C';

import DataClass, { nonce } from '../base/data/DataClass';
import { randomPick } from '../base/utils/miscutils';

class AdCardsGame extends DataClass {	

	/** @type {string[]} */
	playerIds;

	/** @type {string[]} */
	slogans;

	/** playerId -> their state */
	playerState;

	/** @type {string[]} */
	products;

	constructor(base) {
		super(base);
		Object.assign(this, base);
		delete this.status;	
	}

}
DataClass.register(AdCardsGame, "AdCardsGame");

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

let HAND_SIZE = 6;

AdCardsGame.setup = game => {
	// TODO fetch card data
	game.products = ['sausages','cucumber'];
	game.slogans = ['I love ___','Just Do It'];
	// options
	game.options= {showCards:true};
	// game.deck = game.slogans.slice(); // copy
	// blank player state	
	const n = game.playerIds.length;
	game.playerState = {};
	game.playerIds.forEach(playerId => {
		game.playerState[playerId] = {hand:[]};
	});
	// deal slogan cards
	shuffle(game.slogans);
	shuffle(game.products);	
	game.sloganIndex = 0;
	game.productIndex = 0;
	for (let i=0; i<HAND_SIZE; i++) {
		for(let j=0; j<n; j++) {
			dealCardTo(game, game.playerIds[j]);
		}
	}

	// whos the first client?
	game.client = randomPick(game.playerIds);
	AdCardsGame.newRound(game);
};

const dealCardTo = (game, pid) => {
	let phand = game.playerState[pid].hand;
	let card = game.slogans[game.sloganIndex % game.slogans.length];
	game.sloganIndex++;
	phand.push(card);
};

AdCardsGame.newRound = (game) => {
	game.waitMsg = null;
	// client
	let cid = game.playerIds.indexOf(game.client);
	cid++;
	game.client = game.playerIds[cid % game.playerIds.length];
	// product
	game.product = game.products[game.productIndex % game.products.length];
	game.productIndex++;
	// remove played cards and clear picks
	game.playerIds.forEach(pid => {
		const pstate = game.playerState[pid];
		pstate.hand = pstate.hand.filter(c => c !== pstate.picked);
		pstate.picked = null;
	});
	// deal new cards
	game.playerIds.forEach(pid => {
		const pstate = game.playerState[pid];
		if (pstate.hand.length < HAND_SIZE) {
			dealCardTo(game, pid);
		}
	});
};

AdCardsGame.pickedCards = (game) => {
	let picks = game.playerIds.map(pid => game.playerState[pid].picked);
	picks = picks.filter(p => p);
	return picks;
};

AdCardsGame.getHand = (game, pid) => {
	return game.playerState[pid].hand;
};

export default AdCardsGame;
