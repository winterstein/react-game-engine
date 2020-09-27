/**
 * A bit of a story in a fight / explore page
 */

import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import { assert } from 'sjtest';
import { nonce } from '../base/data/DataClass';
import Tree from '../base/data/Tree';
import DataStore from '../base/plumbing/DataStore';
import { assMatch } from '../base/utils/assert';
import { modifyHash, space } from '../base/utils/miscutils';
import { CHARACTERS } from '../Character';
import Sprite from '../data/Sprite';
import StoryTree from '../data/StoryTree';
import Game from '../Game';
import Key, { KEYS } from '../Key';
import StopWatch from '../StopWatch';
import ChatLine, { ChatControls, splitLine } from './ChatLine';
import { collision } from './Collision';


/**
 * 
 * @param {!Game} game 
 * @param {?Person} player 
 * @param {!string} whoName 
 * @param {?Tree} storyNode 
 */
export const maybeStartTalk = (game, player, whoName, storyTree) => {	
	console.warn("maybeStartTalk", storyTree, player, whoName);
	// source story node?
	StoryTree.assIsa(storyTree);
	let storyNode = StoryTree.storyStackPeek(storyTree);
	let whoNode = StoryTree.findNamedNode(storyNode, whoName);
	if ( ! whoNode) {
		return null;
	}
	console.warn("YES StartTalk", whoName, whoNode);
	StoryTree.setCurrentNode(window.storyTree, whoNode);
	StoryTree.next(window.storyTree);
	game.talking = true;	
	return true;
};


const StoryBit = ({storyTree}) => {
	if ( ! storyTree) return null;
	
	const game = Game.get();
	if ( ! game.talking) {
		return null;
	}
	// get a text node
	let currentNode = StoryTree.current(storyTree);
	// end?
	if (currentNode && StoryTree.isEnd(storyTree, currentNode)) {
		game.talking = false;
		console.log("TALK DONE"); 
		// current node = the current story level node
		StoryTree.setCurrentNode(storyTree, StoryTree.storyStackPeek(storyTree));
		DataStore.update();	
		return null;
	}	
	
	currentNode = StoryTree.nextToText(storyTree, currentNode);
	let currentText = StoryTree.text(currentNode);
	
	return (<>
		{currentText && splitLine(currentText) && <ChatLine line={currentText} />}
		<ChatControls currentNode={currentNode} storyTree={window.storyTree} />
	</>);
};

export default StoryBit;
