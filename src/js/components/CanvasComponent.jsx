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
    }
    render() {
		if (this.refs.canvas) {
			this.updateCanvas();
		}
		// NB if the width is set in css -- weird zooming occurs!
        return (
			<div ref="cwrapper" >
				<canvas width={this.props.width} height={this.props.height} ref="canvas" />
			</div>
        );
    }
}

export default CanvasComponent;
