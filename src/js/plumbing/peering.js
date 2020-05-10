
import Peer from 'peerjs';
import Login from 'you-again';
import _ from 'lodash';
import DataStore from '../base/plumbing/DataStore';
import { nonce, getType } from '../base/data/DataClass';
import { notifyUser } from '../base/plumbing/Messaging';


class Room {

	constructor() {
		this['@type'] = 'Room';
	}

	/**
	 * @type {String}
	 */
	id;
	/**
	 * @type {String}
	 */	
	host;
	/**
	 * @type {String[]}
	 */
	memberIds = [];

	members = [];

	chats = [];

	open;
	
	state = {};
}
window.Room = Room;

class Chat {
	from;
	text;
}


Room.create = () => {	
	let room = new Room();
	room.id = getPeerId();
	room.open = true;
	let u = getUser();
	room.memberIds = [getPeerId()];
	room.members = [u];
	console.log("Room.create", room);

	peer.on('connection', connb => {			
		console.log("connection", connb);
		window.myconnb = connb;
		wireUpConnection(connb, room);
	});

	roomUpdate(room);

	return room;
};

const roomUpdate = room => {
	if ( ! room.open) return;
	doSyndicate(room);
	setTimeout(() => roomUpdate(room), 5000);
};

const getUser = () => {
	let u = Login.getUser() || {};
	u.peerId = getPeerId();	
	return u;
};

Room.updateState = (room, state) => {
	room.state = Object.assign(room.state, state);
	if (Room.isHost(room)) {
		doSyndicate(room);
		return;
	}
	let conn = getConnectionTo(room.host);
	sendData(conn, state);
};

Room.sendChat = (room, text) => {
	const chat = new Chat();
	chat.text = text;
	chat.from = getPeerId();
	
	room.chats.push(chat);

	if (Room.isHost(room)) {
		doSyndicate(room);
		return;
	}

	let conn = getConnectionTo(room.host);
	sendData(conn, chat);
};

Room.enter = id => {	
	console.log("Room.enter", id, room);
	let room = doJoin(id);
	return room;
};
Room.exit = room => {
	if (Room.isHost()) {
		// ?
		return; 
	}
	let conn = getConnectionTo(room.host);
	conn.close();
};
Room.isHost = room => getPeerId() === room.id;

const oncForRoomId = {};
Room.setOnChange = (room, fn) => oncForRoomId[room.id] = fn;


const sendData = (c, data) => {
	console.log("send", data, "to", c.metadata); 
	let d = Object.assign({}, data); // non-object eg Room causes bug??
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
	console.log("YEH data!", data, "from", conn && conn.metadata);
	const dtype = getType(data);
	if (dtype === 'Room') {
		if ( ! Room.isHost()) {
			Object.assign(room, data);
		}
	}
	if (dtype === 'chat') {
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
};
const onError = (e, conn) => {
	console.error("error", e, conn);
};
const onClose = conn => {
	console.error(conn);
};


const doSyndicate = data => {
	let conns = peer.connections || {};
	const conlist = _.flatten(Object.values(conns));
	conlist.forEach(c => {
		sendData(c, data);
	});
};

let currentHost = null;
/**
 * Idempotent
 * @param {String} host 
 */
const doJoin = (host) => {
	if (getConnectionTo(host) != null) {
		return;
	}
	let room = new Room();
	room.id = host;
	const metadata = {from:pid, to:host, host, fromxid:Login.getId()};
	const conn = peer.connect(host, {metadata});
	window.myconn = conn;
	console.log("conn", conn);
	wireUpConnection(conn, room);
	currentHost = host;
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
		toPeerId = currentHost;
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
/**
 * @returns {?String} 
 */
const getHostId = () => currentHost;
/**
 * @returns {String: DataConnection[]}
 */
const getConnections = () => peer.connections;

const getConnectionsList = () => {
	return _.flatten(Object.values(peer.connections));
};

export {
	Room,
	getPeerId, doJoin, startAudioCall, getHostId, getConnectionTo, getConnections, getConnectionsList
};
