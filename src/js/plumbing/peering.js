
import Peer from 'peerjs';
import Login from 'you-again';
import DataStore from '../base/plumbing/DataStore';
import { nonce } from '../base/data/DataClass';
import { notifyUser } from '../base/plumbing/Messaging';


class Room {
	/**
	 * @type {String}
	 */
	id;
	/**
	 * @type {String}
	 */	
	host;
	/**
	 * @type {{peerId}[]}
	 */
	members;

	chat;
	
	state = {};
}

Room.create = () => {	
	let room = new Room();
	room.id = getPeerId();
	let u = getUser();
	room.members = [u];
	console.log("Room.create", room);
	return room;
};

const getUser = () => {
	let u = Login.getUser() || {};
	u.peerId = getPeerId();	
	return u;
};

Room.update = ({room, state}) => {
	room.state = Object.assign(room.state, state);
	if (Room.isHost()) {
		let conns = peer.connections || {};
		const conlist = _.flatten(Object.values(conns));
		conlist.forEach(c => {
			sendData(c, state);
		});	
		return;
	}
	let conn = getConnectionTo(room.host);
	sendData(conn, state);
};
Room.enter = id => {	
	let room = new Room();
	room.id = id;
	console.log("Room.enter", id, room);
	doJoin(id);
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
Room.isHost = room => room && getPeerId() === room.id;

const oncForRoomId = {};
Room.setOnChange = (room, fn) => oncForRoomId[room.id] = fn;


const sendData = (c, data) => {
	console.log("send", data, "to", c.metadata); 
	c.send(data);
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

const doProcessData = (data, conn) => {
	// Will print 'hi!'
	console.log("YEH data!", data, "from", conn && conn.metadata);
	if (data.type === 'chat') {
		let chats = DataStore.getValue(['misc','chat','history']) || [];
		chats.push(data);
		DataStore.setValue(['misc','chat','history'], chats);
	}
	if (onData) onData(data, conn);
	// update	
	DataStore.update();	
	// syndicate?
	doSyndicateIfHost(data,conn);
};

let onData = null;
const setOnData = fn => onData=fn;
let onConnect = null;
const setOnConnect = fn => onConnect=fn;


const doSyndicateIfHost = (data, conn) => {
	let isHost = ! conn || (conn && conn.metadata.host === pid);
	if ( ! isHost) return;
	let conns = peer.connections || {};
	const conlist = _.flatten(Object.values(conns));
	conlist.forEach(c => {
		c.send(data);
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
	const metadata = {from:pid, to:host, host, fromxid:Login.getId()};
	const conn = peer.connect(host, {metadata});
	window.myconn = conn;
	console.log("conn", conn);		
	conn.on('data', data => doProcessData(data, conn));
	conn.on('open', () => {
		if (onConnect) onConnect(conn);
		DataStore.update();
	});
	currentHost = host;
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
		if (onConnect) onConnect(connb);
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
	getPeerId, doJoin, startAudioCall, getHostId, getConnectionTo, getConnections, getConnectionsList,
	setOnData, setOnConnect
};
