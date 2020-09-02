/**
 * A convenient place for ad-hoc widget tests.
 * This is not a replacement for proper unit testing - but it is a lot better than debugging via repeated top-level testing.
 */
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Enum from 'easy-enums';
import _ from 'lodash';
import SJTest, { assert } from 'sjtest';
import Login from 'you-again';
import DataStore from '../base/plumbing/DataStore';
import { space, substr } from '../base/utils/miscutils';

const ChatLine = ({line}) => {	
	let m = line.match(/^([a-zA-Z0-9 ]+): ?(\([a-z ]+\)|)(.+)/);
	if ( ! m) {
		console.warn("ChatLine - no pattern match: "+line);
		return <div>{line}</div>;
	}
	let who = m[1];
	let emotion = m[2]? substr(m[2],1,-1) : null; // pop brackets
	let said = m[3];
	let img = '/img/src/person/'+space(who, emotion)+'.png';
	img = img.replaceAll(' ','-').toLowerCase();
	return <div><div>{who} <img src={img} /></div> "{said}"</div>;
};

export default ChatLine;
