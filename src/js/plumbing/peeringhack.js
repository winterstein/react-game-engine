
import Login from 'you-again';
import _ from 'lodash';
import DataStore from '../base/plumbing/DataStore';
import DataClass, { nonce, getType } from '../base/data/DataClass';
import Messaging, { notifyUser } from '../base/plumbing/Messaging';
import { assert } from '../base/utils/assert';
import ServerIO from '../base/plumbing/ServerIOBase';
import JSend from '../base/data/JSend';
import * as jsonpatch from 'fast-json-patch';

const DT = 250;

class Room {

	constructor() {
		this['@type'] = 'Room';
	}

	/**
	 * @type {String}
	 */
	id;
	/**
	 * key:key Use a map for server-side merge
	 */
	memberIds = {};

	members = {};	

	/**
	 * time:chat
	 */
	chats = {};

	open;
	closed;
	
	state = {};
}
window.Room = Room;

class Chat extends DataClass {
	from;
	text;
}
DataClass.register(Chat, 'Chat');

Room.memberIds = room => {
	return Object.keys(room.memberIds);
};
Room.chats = room => {
	return room.chats? Object.values(room.chats) : [];
};

Room.create = () => {	
	let room = new Room();
	room.id = getPeerId();
	room.open = true;
	let u = getUser();
	room.memberIds[getPeerId()] = getPeerId();
	room.members[getPeerId()] = u || {};
	console.log("Room.create", room);
	Room.sendRoomUpdate(room);
	currentRoom = room;
	return room;
};

const getUser = () => {
	let u = Login.getUser() || {};
	u.peerId = getPeerId();	
	return u;
};

const CHANNEL_ENDPOINT = window.location.protocol+"//"+window.location.host+"/channel";
//'http://localhost:8328/channel';

Room.sendRoomUpdate = room => {
	if ( ! room) {
		return;	
	}
	assert(room.id, "No host?!", room);

	let diff = jsonpatch.compare(oldRoom, room);
	let data = {room:JSON.stringify(room), peerId:getPeerId(), diff:JSON.stringify(diff)};
	let pLoad = ServerIO.load(CHANNEL_ENDPOINT+"/"+room.id, {data});
	pLoad.then(res => {
		let rd = JSend.data(res);
		if (rd.diff) {
			jsonpatch.applyPatch(room, diff);
		} else if (rd.room) {
			_.merge(room, rd.room);			
		}
		oldRoom = JSON.parse(JSON.stringify(room));
	});
};
let oldRoom = {};

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

	room.chats[new Date().getTime()] = chat;

	Room.sendRoomUpdate(room);
};

Room.enter = (id, user) => {	
	console.log("Room.enter", id, room);
	let room = doJoin(id, user);
	return room;
};

Room.exit = room => {
};
Room.isHost = room => getPeerId() === room.id;

Room.member = (room, peerId) => {
	return room.members[peerId];
};

let currentRoom = null;

/**
 * Idempotent
 * @param {String} host 
 */
const doJoin = (host, user={}) => {
	if (currentRoom) {
		return;
	}
	const room = new Room();
	room.id = host;
	room.memberIds[getPeerId()] = getPeerId();
	room.members[getPeerId()] = user;
	currentRoom = room;
	return currentRoom;
};


setInterval(() => Room.sendRoomUpdate(currentRoom), DT);


const pid = nonce(4).toLowerCase();

const getPeerId = () => pid;

export {
	Room,
	getPeerId
};
