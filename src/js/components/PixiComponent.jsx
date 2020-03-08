import * as React from 'react';
import * as PIXI from 'pixi.js';
import SpriteLib from '../data/SpriteLib';


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
		.add(SpriteLib.alligator().src)
  		.load(() => {
			let sprite = new PIXI.Sprite(app.loader.resources[SpriteLib.alligator().src].texture);
			app.stage.addChild(sprite);
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
