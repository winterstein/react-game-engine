
import Tree from "../base/data/Tree";
import { nonce } from "../base/data/DataClass";
import { assert } from "../base/utils/assert";
import Game from "../Game";

class StoryTree {
	/**
	 * @type {Tree} Never null
	 */
	history;

	constructor(text) {
		this.text = text;
		this.root = new Tree({value:"root"});
		this.history = new Tree();		
		// this.tSentence4id = {};
		let sections = text.split(/^##\s/m);
		sections.forEach((section,i) => {
			let tSection = Tree.add(this.root, {id:nonce(), index:""+i});
			let scenes = section.split(/^###\s/m);
			scenes.forEach((scene,j) => {
				let tScene = Tree.add(tSection, {id:nonce(), index:i+"."+j});
				// branches for local dialog variants
				let twigs = scene.split(/^####\s/m);
				twigs.forEach((twig,b) => {
					// NB the 1st twig is probably "pre-twigging"
					let twigi = i+"."+j+(b? "."+("abcdefgh"[b-1]) : "");
					let tTwig = Tree.add(tScene, {id:nonce(), index:twigi});
					let sentences = twig.split(/\n *\n/);
					for (let k=0; k<sentences.length; k++) {
						const sentence = sentences[k].trim();
						if ( ! sentence) continue; // skip blank lines
						if (sentence.substr(0,2)==='//') continue; // skip comments
						if (k===0) {
							// e.g. #### {if foo in inventory} goes on the twig, so it can have child sentences to skip
							tTwig.value.text = sentence;
						} else {
							let tSentence = Tree.add(tTwig, {index:twigi+"."+k, text:sentence, id:nonce()});
						}
						// this.tSentence4id[tSentence.value.id] = tSentence;
					} // ./sentences
				}); // ./twigs
			}); // ./scenes
		}); // ./sections
		Tree.add(this.history, this.root.value);
	}
} // ./StoryTree

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
	let nextNodeValue = Object.assign({}, nextNode.value);
	// add to history
	// TODO it'd be nice to preserve the tree structure -- history is just flat here
	Tree.add(storyTree.history, nextNodeValue);
	// return
	return nextNode;
};

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
	const nnText = nextNode.value && nextNode.value.text && nextNode.value.text;
	if (nnText && nnText[0] === "{") {
		let ok = nextTest(nnText);
		if ( ! ok) {
			console.warn("skip", nextNode);
			return next2(storyTree, nodes, nextNode, false);
		}
	}
	// return
	return nextNode;
};

const nextTest = test => {
	let m = test.match("{if (.+)}");
	let test2 = m && m[1];
	if ( ! test2) {
		console.warn("nextTest - no test?! "+test);
		return true;
	}
	// HACK inventory check?
	let m2 = test2.match("(\\w+) in inventory");
	if (m2 && m2[1]) {
		const inventory = Game.getInventory(Game.get());
		let haveit = inventory[m2[1]];
		if (haveit) console.log("nextTest: yes! "+test);
		return !! haveit;
	}
	return true;
};
window.nextTest = nextTest; // debug

StoryTree.current = storyTree => {
	let olds = Tree.flatten(storyTree.history);
	let last = olds[olds.length-1]; 
	return last;
};

export default StoryTree;
