
import Tree from "../base/data/Tree";
import { nonce } from "../base/data/DataClass";
import { assert } from "../base/utils/assert";
import Game from "../Game";
import { modifyHash } from "../base/utils/miscutils";

/**
 * no blanks or comments
 */
const noBlanks = s => s && s.trim() && s.substr(0,2) !== '//';

class StoryTree {
	/**
	 * @type {Tree} Never null
	 */
	history;


	/**
	* memory flags set by command 
	* @type {Object}
	 */
	memory = {};

	constructor(text) {
		this.text = text;
		this.root = new Tree({value:"root", depth:0});
		this.history = new Tree();		
		let sections = text.split(/^##\s/m).filter(noBlanks);
		sections.forEach((section,i) => {
			let [s1,rest] = firstSentenceRest(section);
			let tSection = Tree.add(this.root, {id:nonce(), index:"section-"+i, depth:1, text:s1.trim()});
			let scenes = rest.split(/^###\s/m).filter(noBlanks);
			scenes.forEach((scene,j) => {
				[s1,rest] = firstSentenceRest(scene);
				let tScene = Tree.add(tSection, {id:nonce(), index:i+".scene-"+j, depth:2, text:s1.trim()});
				// branches for local dialog variants
				let twigs = rest.split(/^####\s/m).filter(noBlanks);
				twigs.forEach((twig,b) => {
					[s1,rest] = firstSentenceRest(twig);
					// NB the 1st twig is probably "pre-twigging"
					let twigi = i+"."+j+".twig"+(b? "abcdefgh"[b-1] : "");
					let tTwig = Tree.add(tScene, {id:nonce(), index:twigi, depth:3, text:s1.trim()});
					let sentences = rest.split(/\n *\n/).filter(noBlanks);
					sentences.forEach((sentence, k) => {
						let tSentence = Tree.add(tTwig, {index:twigi+".sentence-"+k, text:sentence.trim(), id:nonce(), depth:4});						
					}); // ./sentences
				}); // ./twigs
			}); // ./scenes
		}); // ./sections
		// avoid pointless nesting down through twigs etc
		// simplifyOnlyKids(this.root); buggy
		Tree.add(this.history, this.root.value);
		console.log("read", Tree.str(this.root));
	}
} // ./StoryTree

const firstSentenceRest = text => {
	if ( ! text) return [null,''];
	let i = text.indexOf('\n');
	if (i===-1) return [text, ''];
	return [text.substr(0,i), text.substr(i)];
};

const simplifyOnlyKids = tree => {
	if ( ! tree.children) return;
	tree.children.map(simplifyOnlyKids);	
	if (tree.children.length===1 && ! tree.value.text) {
		let onlyChild = tree.children[0];
		tree.value.text = onlyChild.value.text;
		tree.children = [];
	}
};

/**
 * 
 * @param {StoryTree} storyTree 
 * @returns {Tree} a node in the root tree. the node value is copied into the history tree
 */
StoryTree.next = (storyTree) => {
	// what comes next? find latest then step on	
	let olds = Tree.flatten(storyTree.history);
	let last = olds[olds.length-1]; 	
	let nodes = Tree.flatten(storyTree.root);
	Tree.assIsa(last);
	let nextNode = next2(storyTree, nodes, last, true);
	if ( ! nextNode) {
		console.log("END");
		return null;
	}
	assert(nextNode !== last, last);
	// shallow copy the node, so e.g. we can edit choices
	StoryTree.setCurrentNode(storyTree, nextNode);
	// return
	return nextNode;
};

/**
 * Set the latest node in history, using a shallow copy of node.
 * Executes any commands!
 * @param {!StoryTree} storyTree 
 * @param {!Tree} node 
 */
StoryTree.setCurrentNode = (storyTree, node) => {
	// shallow copy the node, so e.g. we can edit choices
	let nodeValue = Object.assign({}, node.value);
	// execute any commands
	let nnText = StoryTree.text(node);	
	while(nnText) {
		let m = nnText.match(regexCODE);
		if ( ! m) break;
		let code = m[1];
		// do it?
		StoryTree.execute(storyTree, code);
		nnText = nnText.substr(m.index + m[0].length);
	}
	// add to history
	// TODO it'd be nice to preserve the tree structure -- history is just flat here
	Tree.add(storyTree.history, nodeValue);
};

export const regexCODE = /{([^}]+)}/;

StoryTree.execute = (storyTree, code) => {
	// OMG its fugly hacks all the way down
	if (code.substr(0,2)==="if") {
		return; // done already by next
	}	
	// HACK e.g. player.courage += 1
	let m = code.match(/player.(\w+) *\+= *(\d+)/);
	if (m) {
		let player = Game.getPlayer();
		assert(player, "No player?!");
		player[m[1]] = (player[m[1]] || 0) + 1*m[2];
		return;
	}
	// HACK e.g. flag.metBigBad = true
	m = code.match(/([a-zA-Z0-9\-_.]+) *\+?= *(\S+)/);
	if (m) {
		let vpath = m[1];		
		StoryTree.setMemory(storyTree, vpath, m[2]);
		return;
	}	
	// change place?
	m = code.match(/explore: *(\S+)/);
	if (m) {
		let place = m[1];
		let bookmark =''; // TODO a way of passing where we are in storyTree
		// for now - just rely on storyTree being shared
		modifyHash(['explore'].concat(place.split('/')), {bookmark});
		return;
	}	
	// end marker
	if (code.substr(0,4)==='end:') {
		console.log(code); // no action
		return;
	}
	alert(code);
};

/**
 * 
 * @param {StoryTree} storyTree 
 * @param {!string} vpath 
 * @param {*} val 
 */
StoryTree.setMemory = (storyTree, vpath, val) => {
	if ( ! storyTree.memory) storyTree.memory = {};
	let mem = storyTree.memory;
	let vbits = vpath.split('.');
	for(let i=0; i<vbits.length-1; i++) {
		let mem2 = mem[vbits[i]];
		if ( ! mem2) {
			mem2 = {};
			mem[vbits[i]] = mem2;
		}
		mem = mem2;
	}
	mem[vbits[vbits.length-1]] = val;
	console.log("setMemory", mem, vpath, val);
};

/**
 * 
 * @param {StoryTree} storyTree 
 * @param {!string} vpath 
 */
StoryTree.memory = (storyTree, vpath) => {
	if ( ! storyTree.memory) storyTree.memory = {};
	let mem = storyTree.memory;
	let vbits = vpath.split('.');
	for(let i=0; i<vbits.length; i++) {
		let mem2 = mem[vbits[i]];
		if ( ! mem2) {
			return;
		}
		mem = mem2;
	}
	return mem;
}

/**
 * 
 * @param {?Tree} node 
 * @returns {?string} text if present on this node (ignores children)
 */
StoryTree.text = node => node && node.value && node.value.text;

const next2 = (storyTree, nodes, last, goDeeper=true) => {
	let nextNode;
	// goDeeper?
	if (goDeeper) {			
		// Then the next node is the next in flatten -- easy
		for(let i=0; i<nodes.length; i++) {
			if (nodes[i].value && last.value && nodes[i].value.id === last.value.id) {
				nextNode = nodes[i+1];
				break;
			}
		}
	} else {
		// skip (eg a test failed)
		// NB: we can't just take the next node -- we may have to skip over several leaves
		// we need nextNode's next sibling
		let parentNode = nodes.find(n => n.children && n.children.includes(last));
		assert(parentNode, "No parent?!", last);
		let i = parentNode.children.indexOf(last);
		nextNode = parentNode.children[i+1];
		// out of kids? go up a level
		if ( ! nextNode) {
			assert(i+1 ===parentNode.children.length, "huh odd kids", parentNode);
			console.log("Out of kids - go up a level", parentNode);	
			return next2(storyTree, nodes, parentNode, false);
		}
	}
	if ( ! nextNode) {
		// all done
		console.log("No next for",last);
		return null;
	}
	// skip this node?
	const nnText = StoryTree.text(nextNode);
	if (nnText && nnText[0] === "{") {
		let ok = nextTest(storyTree, nnText);
		if ( ! ok) {
			console.warn("skip", nextNode);
			return next2(storyTree, nodes, nextNode, false);
		}
	}
	// return
	return nextNode;
};

const nextTest = (storyTree, test) => {
	let m = test.match("{if (!?) *([^}]+)}");
	let test2 = m && m[2];
	if ( ! test2) {
		// HACK
		if (test==="{else}") {
			// TODO 
			console.log("TODO else");
		}
		console.log("nextTest - no test "+test);
		return true;
	}
	let yesno = nextTest2_eval(storyTree, test2);
	if (m[1]) { // not?
		return ! yesno;
	}
	return yesno;
};
window.nextTest = nextTest; // debug

const nextTest2_eval = (storyTree, expr) => {
	// last choice check? e.g. {if |dinosaur|}
	if (expr[0] === '|') {
		let option = expr.substr(1, expr.length-2);
		let lastPick = StoryTree.lastChoice(storyTree);
		if (option === lastPick) {
			return true;
		}
		return false;
	}
	// HACK inventory check?
	let m2 = expr.match("(\\w+) in inventory");
	if (m2 && m2[1]) {
		const inventory = Game.getInventory(Game.get());
		let haveit = inventory[m2[1]];
		if (haveit) console.log("nextTest: have-it yes! "+test);
		return !! haveit;
	}
	// if flag.ateMushroom
	let m = expr.match(/([a-zA-Z0-9\-_.]+)/);
	if (m) {
		let vpath = m[1];		
		let memval = StoryTree.memory(storyTree, vpath);
		if (memval) console.log("nextTest: memory yes! "+test);	
		return !! memval;
	}	
	throw new Error("Unknown test code: "+test);	
};

StoryTree.lastChoice = storyTree => storyTree.lastChoice;

/**
 * @param {?StoryTree} storyTree falsy returns undefined
 * @returns {Tree} The current node _from history_
 */
StoryTree.current = storyTree => {
	if ( ! storyTree) return;
	let olds = Tree.flatten(storyTree.history);
	let last = olds[olds.length-1]; 
	return last;
};

/**
 * @param {StoryTree} storyTree 
 * @returns {Tree} The current node _from source_
 */
StoryTree.currentSource = storyTree => {
	let c = StoryTree.current(storyTree);
	if ( ! c || ! c.value) return null;
	let id = c.value.id;
	let node = Tree.findByValue(storyTree.root, v => v.id===id);
	assert(node, "StoryTree currentSource() no node?",id, storyTree);
	return node;
};


export default StoryTree;
