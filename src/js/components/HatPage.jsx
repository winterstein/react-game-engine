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

const HI = ":)";

const HatPage = () => {	
	let peer = DataStore.getValue('misc','peer');
	let peerState = DataStore.getValue('misc','peerState') || {};
	let pid;
	if ( ! peer) {
		pid = 'hat-'+nonce(4);
		peer = new Peer(pid);
		window.mypeer = peer;
		peer.on('connection', connb => {			
			console.log("connection", connb);
			window.myconnb = connb;
			connb.on('data', function(data) {
				// Will print 'hi!'
				console.log("data!", data, "from", connb.metadata);
				// connect back	
				DataStore.update();
			});
			connb.send("yes?");
		});
		DataStore.setValue(['misc','peer'], peer, false);
		DataStore.setValue(['misc','pid'], pid, false);
		console.log("peer", peer);
	} else {
		pid = DataStore.getValue(['misc','pid']);
		console.log("pid", pid, peer.id, peer.connections);
	}

	let oid1 = peerState.oid1;
	
	let [con1, setCon1] = useState();

	if (oid1 && ! con1) {
		const conn = peer.connect(oid1, {metadata:{from:pid, to:oid1}});
		window.myconn = conn;
		console.log("conn", conn);
		setCon1(true);
		conn.on('data', function(data) {
			// Will print 'hi!'
			console.log("YEH data!", data, "from", conn.metadata);
			// connect back	
			DataStore.update();
		});
		conn.on('open', () => {
			conn.send(HI);
			DataStore.update();
		});
	}

	return <div>
		ID: <pre>{pid}</pre>

		<PropControl prop='oid1' label='Other ID 1' path={['misc','peerState']} />
		
		People
		{Object.keys(peer.connections).join(", ")}

		Paper Slip

		Hat

	</div>;
};

export default HatPage;
