
import Tree from "../base/data/Tree";
import DataClass, { nonce } from "../base/data/DataClass";
import { assert, assMatch } from "../base/utils/assert";
import Game from "../Game";
import { modifyHash } from "../base/utils/miscutils";
import { CHARACTERS } from "../Character";
import DataStore from "../base/plumbing/DataStore";
import MONSTERS from "../MONSTERS";

/**
 * no blanks or comments
 */
const noBlanks = s => s && s.trim() && s.substr(0, 2) !== '//';

class StoryTree extends DataClass {
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
		super();
		this.text = text;
		this.root = new Tree({ value: "root", depth: 0 });
		this.history = new Tree();
		// parse
		let sections = text.split(/^##\s/m).filter(noBlanks);
		sections.forEach((section, i) => {
			let [s1, rest] = firstSentenceRest(section);
			let tSection = Tree.add(this.root, { id: nonce(), index: "section-" + i, depth: 1, text: s1.trim() });
			let scenes = rest.split(/^###\s/m).filter(noBlanks);
			scenes.forEach((scene, j) => {
				[s1, rest] = firstSentenceRest(scene);
				let tScene = Tree.add(tSection, { id: nonce(), index: i + ".scene-" + j, depth: 2, text: s1.trim() });
				// branches for local dialog variants
				let twigs = rest.split(/^####\s/m).filter(noBlanks);
				twigs.forEach((twig, b) => {
					[s1, rest] = firstSentenceRest(twig);
					// NB the 1st twig is probably "pre-twigging"
					let twigi = i + "." + j + ".twig" + (b ? "abcdefgh"[b - 1] : "");
					let tTwig = Tree.add(tScene, { id: nonce(), index: twigi, depth: 3, text: s1.trim() });
					let sentences = rest.split(/\n *\n/).filter(noBlanks);
					sentences.forEach((sentence, k) => {
						let tSentence = Tree.add(tTwig, { index: twigi + ".sentence-" + k, text: sentence.trim(), id: nonce(), depth: 4 });
					}); // ./sentences
				}); // ./twigs
			}); // ./scenes
		}); // ./sections
		// avoid pointless nesting down through twigs etc
		simplifyOnlyKids(this.root); // buggy
		// identify ends and loop-roots??
		// Tree.map(this.root, (n,p,d) => {
		// 	let nt = StoryTree.text(n);
		// 	if (nt.substr) ??
		// });
		Tree.add(this.history, this.root.value);
		console.log("read", Tree.str(this.root));
	}
} // ./StoryTree
DataClass.register(StoryTree, "StoryTree");

const firstSentenceRest = text => {
	if (!text) return [null, ''];
	let i = text.indexOf('\n');
	if (i === -1) return [text, ''];
	return [text.substr(0, i), text.substr(i)];
};

const simplifyOnlyKids = tree => {
	if (!tree.children) return;
	tree.children.map(simplifyOnlyKids);
	if (tree.children.length === 1 && tree.value && !tree.value.text) {
		let onlyChild = tree.children[0];
		if (!Tree.children(onlyChild).length) {
			tree.value.text = onlyChild.value.text;
			tree.children = [];
		}
	}
};

/**
 * Advance until a text node, or null
 * @param {StoryTree} storyTree 
 * @param {Tree} node 
 */
StoryTree.nextToText = (storyTree, node) => {
	StoryTree.assIsa(storyTree);
	Tree.assIsa(node);
	while(node) {
		let nText = StoryTree.text(node) || '';
		// start/end explore|fight? Then stop
		if (nText.match(/^{(end[: ] *|)(explore|fight)}/)) {
			console.log("don't next through start/end : "+nText);
			return null;
		}
		// avoid any commands
		nText = nText.replaceAll(/{[^}]+}/g, '');
		if (nText) {
			break;
		}
		console.log("nextToText through "+nText+" "+node.value.id);
		node = StoryTree.next(storyTree);
	}
	return node;
};

/**
 * 
 * @param {StoryTree} storyTree 
 * @returns {Tree} a src node in the root tree. the node value is copied into the history tree. or null for at the end
 */
StoryTree.next = (storyTree) => {
	// what comes next? find latest then step on	
	// let olds = Tree.flatten(storyTree.history);
	let lastSrc = StoryTree.currentSource(storyTree);
	// let last = olds[olds.length-1];
	// NB: we step within the source tree, not the history one, as you can repeat a conversation
	// How high can we look? e.g. within ## {explore:home} you can't exit explore
	let lastRoots = Tree.roots(storyTree.root, lastSrc);
	assert(lastRoots.length, lastSrc);
	let lastRoot;
	for (let i = lastRoots.length - 1; i !== -1; i--) {
		lastRoot = lastRoots[i];
		if (lastRoot.loop) {
			break;
		}
	}
	// the space of nodes available
	let nodes = Tree.flatten(lastRoot);
	Tree.assIsa(lastSrc);
	let nextNodeSrc;
	let goDeeper = true;
	while(lastSrc) {
		nextNodeSrc = next2(storyTree, nodes, lastSrc, goDeeper);
		if ( ! nextNodeSrc) {
			const last = StoryTree.current(storyTree);
			last.end = true; // mark it as an end
			console.log("END", JSON.stringify(last));
			return null;
		}
		assert(nextNodeSrc !== lastSrc, lastSrc);
		// test: skip this node?
		let ok = true;
		const nnText = StoryTree.text(nextNodeSrc);
		if (nnText && nnText[0] === "{") {
			ok = nextTest(storyTree, nnText);			
		}
		if (ok) {
			break; // yeh
		}
		// skip onwards...
		lastSrc = nextNodeSrc;
		goDeeper = false;
	}
	// shallow copy the node, so e.g. we can edit choices
	StoryTree.setCurrentNode(storyTree, nextNodeSrc);
	// return
	return nextNodeSrc;
};
/**
 * Checks for .end=true, which is set by execute when it runs out of next nodes
 * @param {*} storyTree 
 * @param {*} current 
 */
StoryTree.isEnd = (storyTree, current) => assert(Tree.flatten(storyTree.history).includes(current), current) && current.end;
/**
 * Set the latest node in history, using a shallow copy of node.
 * Executes any commands!
 * @param {!StoryTree} storyTree 
 * @param {!Tree} srcNode 
 */
StoryTree.setCurrentNode = (storyTree, srcNode) => {
	// shallow copy the node, so e.g. we can edit choices
	let nodeValue = {...srcNode.value};
	// add to history
	// TODO it'd be nice to preserve the tree structure -- history is just flat here
	let historyNode = Tree.add(storyTree.history, nodeValue);
	// execute any commands
	let nnText = StoryTree.text(historyNode);
	while (nnText) {
		let m = nnText.match(regexCODE);
		if (!m) break;
		let code = m[1];
		// do it?
		StoryTree.execute(storyTree, code, historyNode);
		nnText = nnText.substr(m.index + m[0].length);
	}
	// re-render - but not if inside a nested update
	if (!DataStore.updating) DataStore.update();
};

export const regexCODE = /{([^}]+)}/;

StoryTree.execute = (storyTree, code, historyNode) => {
	assMatch(code, String);
	assMatch(historyNode, Tree);
	code = code.trim(); // just in case
	// a character name? This is a syntactic sugar test for explore
	if (CHARACTERS[code] || MONSTERS[code]) {
		historyNode.loop = true; // You can't next out of this
		src4history(storyTree, historyNode).loop = true;
		console.log(code + " is a name - no execute action"); // no action
		return;
	}
	// HACK fight states - same as explore character-name bits
	if (code==="win" || code==="lose") {
		historyNode.loop = true; // is this needed??
		src4history(storyTree, historyNode).loop = true;
		console.log(code + " is a fight state - no execute action"); // no action
		return;
	}
	// OMG its fugly hacks all the way down
	if (code.substr(0, 2) === "if") {
		return; // done already by next
	}
	// HACK e.g. player.courage += 1
	let m = code.match(/player.(\w+) *\+= *(\d+)/);
	if (m) {
		let player = Game.getPlayer();
		assert(player, "No player?!");
		player[m[1]] = (player[m[1]] || 0) + 1 * m[2];
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
	m = code.match(/^explore: *(\S+)/);
	if (m) {
		historyNode.loop = true; // You can't next out of this
		src4history(storyTree, historyNode).loop = true;
		let place = m[1];
		let bookmark = ''; // TODO a way of passing where we are in storyTree
		// for now - just rely on storyTree being shared
		modifyHash(['explore'].concat(place.split('/')), { bookmark });
		console.log("Explore!");
		return;
	}
	// change story?
	m = code.match(/^story: *(\S+)/);
	if (m) {
		let chapter = m[1];
		modifyHash(['story'], { chapter });
		console.log("More Story! "+chapter);
		return;
	}
	// fight!
	m = code.match(/^fight: *(.+)/);
	if (m) {
		// A v B, e.g. {fight:team v |robot|monster|x2}
		let [a,b] = m[1].split(/\s+v\s+/);
		modifyHash(['fight'], {lhs:a,rhs:b});
		return;
	}
	// end marker (with a bit of flex on syntax)
	if (code==='end' || code.substr(0, 4) === 'end:' || code.substr(0, 4) === 'end ') {
		// end explore?
		if (code.match(/^end[: ] *(explore|fight)/)) {
			// set the node to the next section
			// HACK - ??maybe instead look up the root chain for an explore StoryTree.currentSource(storyTree);			
			let exploreSectionSrcNode = code.includes("explore")? storyTree.sceneSrcNode : storyTree.fightSrcNode; 
			// assert(StoryTree.text(exploreSectionSrcNode).find(/(explore|fight)/), exploreSectionSrcNode.value);
			// the space of nodes available
			let srcNodes = Tree.flatten(storyTree.root);					
			let nextSectionSrcNode = next2(storyTree, srcNodes, exploreSectionSrcNode, false);
			assert(nextSectionSrcNode, srcNodes);
			assert(nextSectionSrcNode !== exploreSectionSrcNode, nextSectionSrcNode);
			console.log("Back to the Diary!");
			StoryTree.setCurrentNode(storyTree, nextSectionSrcNode);
			modifyHash(['story']);
			return;	
		}
		// end a section? no action
		console.log(code);
		return;
	}
	// unrecognised
	alert("TODO execute for "+code);
};

StoryTree.sceneSrcNode = (storyTree, page="explore") => {
	// TODO a stack to allow explore within explore
	if (page==="fight") {
		return storyTree.fightSrcNode;
	}
	return storyTree.sceneSrcNode;
};

const src4history = (storyTree, historyNode) => {
	let id = historyNode.value.id;
	let node = Tree.findByValue(storyTree.root, v => v.id === id);
	Tree.assIsa(node, historyNode);
	return node;
};

/**
 * 
 * @param {StoryTree} storyTree 
 * @param {!string} vpath 
 * @param {*} val 
 */
StoryTree.setMemory = (storyTree, vpath, val) => {
	if (!storyTree.memory) storyTree.memory = {};
	let mem = storyTree.memory;
	let vbits = vpath.split('.');
	for (let i = 0; i < vbits.length - 1; i++) {
		let mem2 = mem[vbits[i]];
		if (!mem2) {
			mem2 = {};
			mem[vbits[i]] = mem2;
		}
		mem = mem2;
	}
	mem[vbits[vbits.length - 1]] = val;
	console.log("setMemory", mem, vpath, val);
};

/**
 * 
 * @param {StoryTree} storyTree 
 * @param {!string} vpath 
 */
StoryTree.memory = (storyTree, vpath) => {
	if (!storyTree.memory) storyTree.memory = {};
	let mem = storyTree.memory;
	let vbits = vpath.split('.');
	for (let i = 0; i < vbits.length; i++) {
		let mem2 = mem[vbits[i]];
		if (!mem2) {
			return;
		}
		mem = mem2;
	}
	return mem;
};

/**
 * 
 * @param {?Tree} node 
 * @returns {?string} text if present on this node (ignores children)
 */
StoryTree.text = node => node && node.value && node.value.text;

/**
 * 
 * @param {*} storyTree 
 * @param {*} srcNodes 
 * @param {*} lastSrc 
 * @param {*} goDeeper 
 * @returns {Tree} a src node
 */
const next2 = (storyTree, srcNodes, lastSrc, goDeeper = true) => {
	let nextNode;
	// goDeeper?
	if (goDeeper) {
		// Then the next node is the next in flatten -- easy
		for (let i = 0; i < srcNodes.length; i++) {
			if (srcNodes[i].value && lastSrc.value && srcNodes[i].value.id === lastSrc.value.id) {
				nextNode = srcNodes[i + 1];
				break;
			}
		}
	} else {
		// skip (eg a test failed)
		// NB: we can't just take the next node in the flat list -- we may have to skip over several leaves
		// we need nextNode's next sibling		
		let parentNode = srcNodes.find(n => n.children && n.children.includes(lastSrc));
		assert(parentNode, "No parent?!", lastSrc);
		let i = parentNode.children.indexOf(lastSrc);
		nextNode = parentNode.children[i + 1];	
		// out of kids? go up a level
		if ( ! nextNode) {
			console.log("Out of kids - go up a level", parentNode);
			return next2(storyTree, srcNodes, parentNode, false);
		}
	}
	if ( ! nextNode) {
		// all done
		console.log("No next for", lastSrc);
		return null;
	}
	// return
	return nextNode;
};

const nextTest = (storyTree, test) => {
	StoryTree.assIsa(storyTree);
	assMatch(test, String);
	const testCode = test.substr(1, test.length - 2).trim(); // pop the {}s
	let m = test.match("if (!?) *([^}]+)");
	let test2 = m && m[2];
	if (!test2) {
		// HACK
		if (testCode === "else") {
			// TODO 
			console.log("TODO else");
		}
		// a name? This is ExplorePage's start/stop marker
		if (CHARACTERS[testCode] || MONSTERS[testCode]) {
			console.log(test + " is a name - stop next");
			return false;
		}
		console.log("nextTest - no test " + test);
		return true;
	}
	let yesno = nextTest2_eval(storyTree, test2);
	if (m[1]) { // not?
		return !yesno;
	}
	return yesno;
};
window.nextTest = nextTest; // debug

const nextTest2_eval = (storyTree, expr) => {
	// last choice check? e.g. {if |dinosaur|}
	if (expr[0] === '|') {
		let option = expr.substr(1, expr.length - 2);
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
		if (haveit) console.log("nextTest: have-it yes! " + expr);
		return !!haveit;
	}
	// if flag.ateMushroom
	let m = expr.match(/([a-zA-Z0-9\-_.]+)/);
	if (m) {
		let vpath = m[1];
		let memval = StoryTree.memory(storyTree, vpath);
		if (memval) console.log("nextTest: memory yes! " + expr);
		return !!memval;
	}
	throw new Error("Unknown test code: " + expr);
};

StoryTree.lastChoice = storyTree => storyTree.lastChoice;

/**
 * @param {?StoryTree} storyTree falsy returns undefined
 * @returns {Tree} The current node _from history_
 */
StoryTree.current = storyTree => {
	if (!storyTree) return;
	let olds = Tree.flatten(storyTree.history);
	let last = olds[olds.length - 1];
	return last;
};

/**
 * @param {StoryTree} storyTree 
 * @returns {Tree} The current node _from source_
 */
StoryTree.currentSource = storyTree => {
	let c = StoryTree.current(storyTree);
	if (!c || !c.value) return null;
	let node = src4history(storyTree, c);
	assert(node, "StoryTree currentSource() no node?", c.id, storyTree);
	return node;
};


export default StoryTree;
