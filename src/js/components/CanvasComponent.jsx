import React from 'react';
import ReactDOM from 'react-dom';

/**
 * props: {width height render: (context)}
 */
class CanvasComponent extends React.Component {
    componentDidMount() {
        this.updateCanvas();
    }
    updateCanvas() {
        const ctx = this.refs.canvas.getContext('2d');
		ctx.clearRect(0,0, this.props.width, this.props.height);
		this.props.render(ctx);
    }
    render() {
		if (this.refs.canvas) this.updateCanvas();
        return (
			<canvas ref="canvas" width={this.props.width} height={this.props.height}/>
        );
    }
}

export default CanvasComponent;
