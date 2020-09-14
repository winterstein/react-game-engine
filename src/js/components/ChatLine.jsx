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
import MDText from '../base/components/MDText';

/**
 * regex for dialogue, e.g. `Mom: (happy) We're off!` or `Omega "Morphing Person": Welcome`
 * match = [all, person, label, emotion, said]
 */
const rSpeech = /^([a-zA-Z0-9 ]+)("[a-zA-Z0-9 ]+")?: ?(\([a-z ]+\)|)(.+)/;

const ChatLine = ({ line }) => {
	let m = splitLine(line);
	if (!m) {
		console.warn("ChatLine - no pattern match: " + line);
		return <div>{line}</div>;
	}
	let {who, label, emotion, said} = m;
	let type = '.png';
	if (who==='Omega' || who==='Narrator') type = '.gif';
	let img = '/img/src/person/' + space(who, emotion) +type;
	img = img.replaceAll(' ', '-').toLowerCase();
	return <div className='chatline'>
		<div className='who'>{label}</div>
		<img src={img} alt={label} />
		<div className='said'><MDText source={said} /></div>
	</div>;
};

/**
 * 
 * @param {!string} line 
 * @returns {?object} {who, label, emotion, said} or null
 */
export const splitLine = line => {
	let m = line.match(rSpeech);
	if (!m) {
		return null;
	}
	let who = m[1].trim();
	let label = m[2]? substr(m[2], 1, -1) : who; // pop quotes
	let emotion = m[3]? substr(m[3], 1, -1) : null; // pop brackets
	let said = m[4].trim();
	return {who, label, emotion, said};
};

export default ChatLine;
