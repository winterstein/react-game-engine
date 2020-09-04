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

/**
 * regex for dialogue, e.g. Mom: (happy) We're off!
 * match = [all, person, emotion, said]
 */
export const rSpeech = /^([a-zA-Z0-9 ]+): ?(\([a-z ]+\)|)(.+)/;

const ChatLine = ({ line }) => {
	let m = line.match(rSpeech);
	if (!m) {
		console.warn("ChatLine - no pattern match: " + line);
		return <div>{line}</div>;
	}
	let who = m[1];
	let emotion = m[2] ? substr(m[2], 1, -1) : null; // pop brackets
	let said = m[3];
	let img = '/img/src/person/' + space(who, emotion) + '.png';
	img = img.replaceAll(' ', '-').toLowerCase();
	return <div className='chatline'>
		<div className='who'>{who}</div>
		<img src={img} alt={who} />
		<div className='said'>{said}</div>
	</div>;
};

export default ChatLine;
