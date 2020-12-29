/**
 * A convenient place for ad-hoc widget tests.
 * This is not a replacement for proper unit testing - but it is a lot better than debugging via repeated top-level testing.
 */
import React, { useState } from 'react';
import ReactVivus from 'react-vivus';
import { Button } from 'reactstrap';
import { nonce } from '../base/data/DataClass';
import DataStore from '../base/plumbing/DataStore';



const DrawReactSVG = ({id, src, height = "200px", width = "200px", duration = 70 }) => {
	if ( ! id) [id] = useState(nonce(6));
	return (<ReactVivus
		id={id}
		option={{
			file: src,
			type: 'oneByOne',
			// animTimingFunction: 'EASE',
			duration,
			onReady: console.log
		}}
		style={{ height, width }}
		callback={console.log}
	/>);
};

/**
 * get some user interaction so we can play audio
 */
let goFlag;

const SplashScreen = () => {
	if ( ! goFlag) {
		return <div className='flex-column w-100' style={{height:"80vh"}}><Button color='primary' onClick={() => {
			goFlag=true;
			DataStore.update();
		}}>Launch</Button></div>;
	}
	// useEffect(playThemeSong);
	// // shrink to normal - not working - svg is hidden
	// let style = {transform:"scale(5)"};
	// if (playingFlag) {
	// 	style.transform="scale(1)";
	// 	style.transition="all 5s";
	// }
	return <><div className='animation-window'>
		<DrawReactSVG id='splash-img' src='/img/src/celtic/celtic-swirl.svg' width='500px' height='400px' duration={1000} />
	</div>
			<h1>The Kilfearn Chronicles</h1>
			<Button color='primary'>New Game</Button>
	</>;
};

// TODO
// let themeSong = new Howl({
// 	src: ['/snd/ran-n-bone-man-human.mp3'],
// 	autoplay: true,
// 	loop: true,
// 	volume: 0.5,
// 	onend: function () {
// 		console.log('Finished!');
// 	}
// });

// let playingFlag;
// const playThemeSong = () => {
// 	console.log("Play...");
// 	themeSong.play();
// 	playingFlag = true;
// 	// DataStore.update(); upsets react in useEffect
// };

export default SplashScreen;
