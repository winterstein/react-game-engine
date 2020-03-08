import * as React from 'react';
import * as PIXI from 'pixi.js';

class PixiComponent extends React.Component {
  gameCanvas; //: HTMLDivElement;

	constructor(props) {
		super(props);
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
	this.app = this.props.app;
	this.app.renderer.autoResize = true;
	this.gameCanvas.appendChild(this.app.view);
    this.app.start();
  }
  
  /**
   * Stop the Application when unmounting.
   */
  componentWillUnmount() {
    if (this.app) this.app.stop();
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
