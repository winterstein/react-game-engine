/** 
 * Wrapper for server calls.
 *
 */
import ServerIO from '../base/plumbing/ServerIOBase';
import C from '../C.js';



export default ServerIO;

/** dataspace = data-controller = (usually) app
 * This is the dataspace used in unit.js for reporting events */
ServerIO.dataspace = 'gl';

// ServerIO.APIBASE = 'http://dw.winterwell.com'; // TODO https
ServerIO.CHANNEL_ENDPOINT = ServerIO.APIBASE+'/channel';

ServerIO.NO_API_AT_THIS_HOST = true;

ServerIO.PROFILER_ENDPOINT = `${C.HTTPS}://${C.SERVER_TYPE}profiler.good-loop.com`;
// ServerIO.PROFILER_ENDPOINT = 'https://testprofiler.good-loop.com';
// ServerIO.PROFILER_ENDPOINT = 'https://profiler.good-loop.com';

// /**
//  * My Loop has no backend, so use profiler
//  */
// ServerIO.LOGENDPOINT = ServerIO.PROFILER_ENDPOINT + '/log';

ServerIO.checkBase();

