/** 
 * Wrapper for server calls.
 *
 */
import $ from 'jquery';
import {SJTest, assert, assMatch} from 'sjtest';
import {XId, encURI} from 'wwutils';
import C from '../C.js';

import Login from 'you-again';

// Try to avoid using this for modularity!
import DataStore from '../base/plumbing/DataStore';
import Messaging, {notifyUser} from '../base/plumbing/Messaging';

import ServerIO from '../base/plumbing/ServerIOBase';
export default ServerIO;

/** dataspace = data-controller = (usually) app
 * This is the dataspace used in unit.js for reporting events */
ServerIO.dataspace = 'gl';

ServerIO.NO_API_AT_THIS_HOST = true;

ServerIO.PROFILER_ENDPOINT = `${C.HTTPS}://${C.SERVER_TYPE}profiler.good-loop.com`;
// ServerIO.PROFILER_ENDPOINT = 'https://testprofiler.good-loop.com';
// ServerIO.PROFILER_ENDPOINT = 'https://profiler.good-loop.com';

// /**
//  * My Loop has no backend, so use profiler
//  */
// ServerIO.LOGENDPOINT = ServerIO.PROFILER_ENDPOINT + '/log';

ServerIO.checkBase();

