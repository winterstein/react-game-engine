import React from 'react';
import ReactDOM from 'react-dom';
import DataStore from '../base/plumbing/DataStore';

/**
 * props: {width: MUST be in pixels, height, render: (context)}
 */
class CanvasComponent extends React.Component {

	componentDidMount() {
		this.updateCanvas();
	}
	
	updateCanvas() {
		const canvas = this.refs.canvas;
		const ctx = canvas.getContext('2d');
		ctx.resetTransform();
		ctx.clearRect(0,0, canvas.width, canvas.height);
		this.props.render(ctx);
		// also call render on children
		let children = this.props.children;
		if (children) {
			// array of elements (or just one)?
			if (children.filter) children = children.filter(x => !! x);
			React.Children.map(children, (Kid, i) => {
				if (Kid.props && Kid.props.render) {
					Kid.props.render(ctx);
				}
			});	
		}
	}
	
	render() {
		if (this.refs.canvas) {
			this.updateCanvas();
		}
		// NB if the width is set in css -- weird zooming occurs!
		return (
			<div ref="cwrapper" >
				<canvas width={this.props.width} height={this.props.height} ref="canvas" />
				{this.props.children}
			</div>
        );
    }
}

export default CanvasComponent;
