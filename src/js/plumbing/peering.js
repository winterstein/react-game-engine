
import Peer from 'peerjs';
import Login from 'you-again';
import DataStore from '../base/plumbing/DataStore';
import { nonce } from '../base/data/DataClass';
import { notifyUser } from '../base/plumbing/Messaging';

const getConnectionTo = (pid) => {
	if ( ! pid) return null;
	let conns = peer.connections;
	console.warn(peer, conns);
	let consToPid = conns[pid];
	if ( ! consToPid) return null;
	let con = consToPid.find(c => c.metadata.to === pid);
	if (con) return con;
	return consToPid[0];
};

const doProcessData = (data, conn) => {
	// Will print 'hi!'
	console.log("YEH data!", data, "from", conn && conn.metadata);
	if (data.type === 'chat') {
		let chats = DataStore.getValue(['misc','chat','history']) || [];
		chats.push(data);
		DataStore.setValue(['misc','chat','history'], chats);
	}
	// update	
	DataStore.update();	
	// syndicate?
	doSyndicateIfRoom(data,conn);
};

const doSyndicateIfRoom = (data, conn) => {
	let isRoom = ! conn || (conn && conn.metadata.room === pid);
	if ( ! isRoom) return;
	let conns = peer.connections || {};
	const conlist = _.flatten(Object.values(conns));
	conlist.forEach(c => {
		c.send(data);
	});
};

let currentRoom = null;
/**
 * Idempotent
 * @param {String} room 
 */
const doJoin = (room) => {
	if (getConnectionTo(room) != null) {
		return;
	}
	const metadata = {from:pid, to:room, room, fromxid:Login.getId()};
	const conn = peer.connect(room, {metadata});
	window.myconn = conn;
	console.log("conn", conn);		
	conn.on('data', data => doProcessData(data, conn));
	conn.on('open', () => {
		DataStore.update();
	});
	currentRoom = room;
};


let initFlag = false;
const pid = nonce(4).toLowerCase();
const peer = new Peer(pid);
const init = () => {
	if (initFlag) return;
	initFlag = true;		
	peer.on('connection', connb => {			
		console.log("connection", connb);
		window.myconnb = connb;
		connb.on('data', data => doProcessData(data, connb));
		connb.send("yes?");
	});
};
init();

let callInProgress = null;
/**
 * 
 * @param {?String} toPeerId
 */
const startAudioCall = (toPeerId) => {
	if ( ! toPeerId) {
		toPeerId = currentRoom;
	}
	if ( ! toPeerId) {
		notifyUser({type:'error', text:"No destination given"});
		return;
	}
	if ( ! navigator.mediaDevices) {
		notifyUser({type:'error', text:"No Media (can be caused by http vs https)"});
		return;
	}
	let pMediaStream = navigator.mediaDevices.getUserMedia({ audio: true, video: false });
	pMediaStream.then(mediaStream => {
		callInProgress = peer.call(toPeerId, mediaStream);
	});
};

const getPeerId = () => pid;
const getRoomId = () => currentRoom;

export {
	getPeerId, doJoin, startAudioCall, getRoomId
};
