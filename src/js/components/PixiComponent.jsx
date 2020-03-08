import * as React from 'react';
import * as PIXI from 'pixi.js';
import SpriteLib from '../data/SpriteLib';
import Key, {KEYS} from '../Key';

class PixiComponent extends React.Component {
  app; //: Pixi.Application;
  gameCanvas; //: HTMLDivElement;
  
  constructor() {
    super();
  }
  
  /**
   * After mounting, add the Pixi Renderer to the div and start the Application.
   */
  componentDidMount() {
	let type = "WebGL"
	// if( ! PIXI.utils.isWebGLSupported()){
	// 	type = "canvas"
	// }
	// PIXI.utils.sayHello(type);
	window.PIXI = PIXI;
	this.app = new PIXI.Application(window.innerWidth, window.innerHeight);
	window.app = this.app;
	this.app.renderer.autoResize = true;
	this.gameCanvas.appendChild(this.app.view);
	
	app.loader
		.add("/img/animals.TP.json")
		.add(SpriteLib.alligator().src)
  		.load(() => {
			let sprite = new PIXI.Sprite(app.loader.resources[SpriteLib.alligator().src].texture);
			app.stage.addChild(sprite);

			let bsprite = new PIXI.Sprite(app.loader.resources["/img/animals.TP.json"].textures['bunny/bunny-0.png']);
			app.stage.addChild(bsprite);
			bsprite.dx = 0;

			let right = new Key(KEYS.ArrowRight);
			let left = new Key(KEYS.ArrowLeft);

			right.press = () => bsprite.dx = 1;
			right.release = () => left.isUp? bsprite.dx = 0 : null;
			
			left.press = () => bsprite.dx = -1;
			left.release = () => right.isUp? bsprite.dx = 0 : null;

			const ticker = new StopWatch();
			function gameLoop() {

				//Call this `gameLoop` function on the next screen refresh
				//(which happens 60 times per second)
				requestAnimationFrame(gameLoop);

				if ( ! StopWatch.update(ticker)) {
					return;
				}
				bsprite.x += bsprite.dx;		
			};
			
			//Start the loop
			gameLoop();
		});

    this.app.start();
  }
  
  /**
   * Stop the Application when unmounting.
   */
  componentWillUnmount() {
    this.app.stop();
  }
  
  /**
   * Simply render the div that will contain the Pixi Renderer.
   */
  render() {
    let component = this;
    return (
      <div ref={(thisDiv) => {component.gameCanvas = thisDiv}} />
    );
  }
}

export default PixiComponent;
