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
import C from '../C';
import Game, { doLoad, doSave, doReset } from '../Game';
import Misc from '../base/components/Misc';
import Sprite from '../data/Sprite';
import SpriteLib from '../data/SpriteLib';
import Tile from '../data/Tile';
import PixiComponent from './PixiComponent';
import StopWatch from '../StopWatch';
import PropControl, { setInputStatus } from '../base/components/PropControl';
import * as PIXI from 'pixi.js';
// import * as PIXISound from 'pixi-sound';
import Key, { KEYS } from '../Key';
import { Alert, Button, Modal, ModalHeader, ModalBody, Row, Col, Card, CardTitle, Progress } from 'reactstrap';
import { getPApp } from './Pixies';
import DataClass, { nonce, getType } from '../base/data/DataClass';
import GameAdmin, { doNewWorld } from './GameAdmin';
import FullScreenButton from './FullScreenButton';
import Fight from '../data/Fight';
import Spell from '../data/Spell';
import Monster from '../data/Monster';

import ReactVivus from 'react-vivus';
import { space, randomPick, modifyHash } from '../base/utils/miscutils';
import Command, { cmd } from '../data/Command';
import printer from '../base/utils/printer';
import { CHARACTERS } from '../Character';
import MONSTERS, { getMonsterByName } from '../MONSTERS';
import ChatLine, { ChatControls, splitLine } from './ChatLine';
import ExplorePage from './ExplorePage';
import StoryTree from '../data/StoryTree';
import StoryBit, { maybeStartTalk } from './StoryBit';

/**
 * Each fight is worth about 2x the previous
 * Random monsters
 * which level up and increase in number
 * How far do you dare go?
 * 
 * 
 */
const ArenaPage = () => {

};

export default ArenaPage;
