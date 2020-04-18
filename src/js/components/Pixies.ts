/**
 * 
 */
import * as PIXI from 'pixi.js';
import { PartiallyEmittedExpression } from 'typescript';
import Sprite from '../data/Sprite';
import { assMatch } from 'sjtest';

/**
 * {String: PIXI.Container} world | ui | ground | characters
 */
const containerFor : {[key: string]: PIXI.Container} = {};
const _pspriteFor : {[key: string]: PIXI.Sprite} = {};

const setPSpriteFor = (sprite : Sprite, psprite : PIXI.Sprite) => {
	const id = sprite.id;
	assMatch(id,String);
	return _pspriteFor[id] = psprite;
}
/**
 * 
 * @param sprite 
 * @returns {?PIXI.Sprite} psprite if set
 */
const getPSpriteFor = (sprite : Sprite) => {
	const id = sprite.id;
	assMatch(id,String);
	return _pspriteFor[id];
}; // : PIXI.Sprite;

let papp : PIXI.Application = null;

const getPApp = () => papp;
const setPApp = (app : PIXI.Application) => papp = app;

export {
	getPApp, setPApp,
	containerFor,
	getPSpriteFor, setPSpriteFor
}; 