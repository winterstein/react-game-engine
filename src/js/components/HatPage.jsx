/**
 * A convenient place for ad-hoc widget tests.
 * This is not a replacement for proper unit testing - but it is a lot better than debugging via repeated top-level testing.
 */
import React from 'react';
import ReactDOM from 'react-dom';

import SJTest, {assert} from 'sjtest';
import Login from 'you-again';
import DataStore from '../base/plumbing/DataStore';
import C from '../C';
import Misc from '../base/components/Misc';
import Peer from 'peerjs';
import PropControl from '../base/components/PropControl';
import { useState } from 'react';
import { nonce } from '../base/data/DataClass';
import { Button } from 'reactstrap';
import _ from 'lodash';
const HI = ":)";

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


const HatPage = () => {	
	let peerState = DataStore.getValue('misc','peerState') || {};
	
	const room = DataStore.getUrlValue('room') || pid;
	
	const doJoin = () => {
		if (getConnectionTo(room) != null) {
			return;
		}
		const conn = peer.connect(room, {metadata:{from:pid, to:room, room}});
		window.myconn = conn;
		console.log("conn", conn);		
		conn.on('data', data => doProcessData(data, conn));
		conn.on('open', () => {
			conn.send(HI);
			DataStore.update();
		});
	};

	let chats = DataStore.getValue(['misc','chat','history']) || [];

	const isMaster = () => room === pid;

	const sendChat = () => {
		let from = Login.getId() || pid;
		let chat = {type:'chat', id:nonce(), text:DataStore.getValue('misc','chat','text'), from};
		if (isMaster()) {
			doProcessData(chat, null);
			return;
		}
		let conn = getConnectionTo(room);
		if ( ! conn) {
			console.warn("No connection to "+room);
			return;
		}
		conn.send(chat);
	};

	return <div>
		ID: <pre>{pid}</pre> {isMaster()? "Room Master!" : "Client"}

		<PropControl prop='room' label='Room ID' />
		<Button onClick={doJoin}>Join</Button>
		{getConnectionTo(room)? "In the room: "+room : null}

		People
		{Object.keys(peer.connections).join(", ")}

		Paper Slip

		Hat

		<h3>Chat</h3>
		{chats.map(c => <div key={c.id}>{c.from}: {c.text}</div>)}
		<PropControl prop='text' label='Send Message' path={['misc','chat']} />
		<Button onClick={sendChat}>Send</Button>

	</div>;
};

export default HatPage;
