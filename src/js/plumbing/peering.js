
import Peer from 'peerjs';
import Login from 'you-again';
import _ from 'lodash';
import DataStore from '../base/plumbing/DataStore';
import DataClass, { nonce, getType } from '../base/data/DataClass';
import Messaging, { notifyUser } from '../base/plumbing/Messaging';
import { assert } from '../base/utils/assert';


class Room {

	constructor() {
		this['@type'] = 'Room';
	}

	/**
	 * @type {String}
	 */
	id;
	/**
	 * @type {String[]}
	 */
	memberIds = [];

	members = {};	

	chats = [];

	open;
	
	state = {};
}
window.Room = Room;

class Chat extends DataClass {
	from;
	text;
}
DataClass.register(Chat, 'Chat');


Room.create = () => {	
	let room = new Room();
	room.id = getPeerId();
	room.open = true;
	let u = getUser();
	room.memberIds = [getPeerId()];
	room.members[getPeerId()] = u || {};
	console.log("Room.create", room);

	peer.on('connection', connb => {			
		console.log("connection", connb);
		window.myconnb = connb;
		wireUpConnection(connb, room);
	});

	roomUpdateFromHost(room);

	return room;
};

const roomUpdateFromHost = room => {
	if ( ! room.open) return;
	assert(Room.isHost(room), room);
	// connection status?
	room.memberIds.forEach(pid => {
		let m = room.members[pid];
		if ( ! m) {
			console.error("No member for "+pid);
			return;
		}
		if (pid===room.id) {
			m.connection = true; // self!
			return;
		}
		let conn = getConnectionTo(pid);
		if ( ! conn) {
			m.connection = false;
			return;
		}
		if ( ! conn.open) {
			m.connection = false;
			return;
		}
		m.connection = true;
		console.log(pid, m, conn);		
	});
	doSyndicate(room, room);
	setTimeout(() => roomUpdateFromHost(room), 5000);
};

const getUser = () => {
	let u = Login.getUser() || {};
	u.peerId = getPeerId();	
	return u;
};


Room.sendRoomUpdate = room => {
	assert(room);
	assert(room.id, "No host?!", room);

	if (Room.isHost(room)) {
		doSyndicate(room);
		return;
	}

	let conn = getConnectionTo(room.id);
	if ( ! conn) {
		console.warn("No connection to host - try to join...",room);
		doJoin(room.id);
		conn = getConnectionTo(room.id);
		if ( ! conn) {
			throw new Error("Cannot connect to "+room.id);
		}
	}
	sendData(conn, room, room);
};


Room.sendStateUpdate = (room, state) => {
	room.state = Object.assign(room.state, state);
	Room.sendRoomUpdate(room);
};


Room.sendChat = (room, text) => {
	assert(room && text, room,text);
	assert(room.id, "No host?!", room);
	let chat = new Chat();
	chat.text = text;
	chat.from = getPeerId();
	chat = Object.assign({}, chat); // Peer doesnt like classes :(

	room.chats.push(chat);

	Room.sendRoomUpdate(room);
};

Room.enter = id => {	
	console.log("Room.enter", id, room);
	let room = doJoin(id);
	return room;
};
Room.exit = room => {
	if (Room.isHost(room)) {
		// ?
		return; 
	}
	let conn = getConnectionTo(room.id);
	conn.close();
};
Room.isHost = room => getPeerId() === room.id;

const oncForRoomId = {};
Room.setOnChange = (room, fn) => oncForRoomId[room.id] = fn;

Room.member = (room, peerId) => {
	return room.members[peerId];
};

const sendData = (c, data, room) => {
	assert(c && data, c,data,room);
	if ( ! c.open) {
		doJoin(c.peer);
		c = getConnectionTo(c.peer);
	}
	console.log("send", data, "to", c.metadata); 
	let d = Object.assign({}, data); // non-object eg Room causes bug?? But what about nested non-objects :(
	c.send(d);
};

/**
 * 
 * @param {String} pid 
 * @returns {?Peer.DataConnection}
 */
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

const doProcessData = (data, conn, room) => {
	// Will print 'hi!'
	console.log("doProcessData!", data, "from", conn && conn.metadata);
	const dtype = getType(data);
	if (dtype === 'Room') {
		Object.assign(room, data);
		DataStore.setValue(['data','Room',room.id], room);
		console.log("...doProcessData Room", data, "from", conn && conn.metadata);
	}
	if (dtype === 'Chat') {
		console.log("...doProcessData Chat", data, "from", conn && conn.metadata);
		if ( ! room.chats) room.chats = [];
		room.chats.push(data);
	}
	// update	
	DataStore.update();	
	// syndicate?
	if (Room.isHost(room)) {
		doSyndicate(data);
	}
};

/**
 * 
 * @param {*} conn 
 * @param {Room} room 
 */
const onConnect = (conn, room) => {
	console.log("onConnect", conn, room);
	let m = conn.peer;
	if ( ! room.memberIds.includes(m)) {
		room.memberIds.push(m);
	}
	room.members[m] = conn.metadata || {};
};
const onError = (e, conn) => {
	console.error("error", e, conn);
};
const onClose = conn => {
	console.error(conn);
};


const doSyndicate = (data, room) => {
	console.log("doSyndicate", data);
	let conns = peer.connections || {};
	const conlist = _.flatten(Object.values(conns));
	conlist.forEach(c => {
		if ( ! c.open) {
			console.warn("skip syndicate to closed ",c);
		} else {
			sendData(c, data, room);
		}
	});
};

/**
 * Idempotent
 * @param {String} host 
 */
const doJoin = (host) => {
	const oldCon = getConnectionTo(host);
	if (oldCon != null && oldCon.open) {
		return;
	}
	let room = new Room();
	room.id = host;
	let u = Login.getUser() || {};
	const metadata = {from:pid, to:host, host, fromxid:Login.getId(), ...u};
	const conn = peer.connect(host, {metadata});
	window.myconn = conn;
	console.log("conn", conn);
	wireUpConnection(conn, room);
	return room;
};

const wireUpConnection = (conn, room) => {
	conn.on('data', data => doProcessData(data, conn, room));
	conn.on('open', () => onConnect(conn, room));
	conn.on('close', () => onClose(conn, room));
	conn.on('error', e => onError(e, conn, room));
};


const pid = nonce(4).toLowerCase();
const peer = new Peer(pid);

let callInProgress = null;
/**
 * 
 * @param {?String} toPeerId
 */
const startAudioCall = (toPeerId) => {
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

/**
 * @returns {String: DataConnection[]}
 */
const getConnections = () => peer.connections;

const getConnectionsList = () => {
	return _.flatten(Object.values(peer.connections));
};

export {
	Room,
	getPeerId, doJoin, startAudioCall, getConnectionTo, getConnections, getConnectionsList
};
