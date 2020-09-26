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
	// source story node?
	StoryTree.assIsa(storyTree);
	let storyNode = StoryTree.storyStackPeek(window.storyTree);
	console.warn("maybeStartTalk", storyNode, player, whoName);
	if ( ! storyNode) {
		console.warn("no storynode");
		return;
	}
	// node for person?	
	// NB: flatten() is more forgiving than children(), but means you cant have if blocks around name chunks
	// a tree walk setup would be ideal. but sod that complexity
	let nodes = Tree.children(storyNode);
	let whoNodes = nodes.filter(n => n.value && n.value.text==="{"+whoName+"}");
	if (whoNodes.length === 0) {
		whoNodes = Tree.children(storyNode).filter(n => n.value && n.value.text===whoName);
		if (whoNodes.length) console.warn("Handling bad script syntax: please use `{name}` for on-bump-into bits");
	}
	if (whoNodes.length !== 1) {
		console.warn("Could not cleanly find node for "+whoName, storyNode);
		return;
	}
	let whoNode = whoNodes[0];
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
