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
		if (this.refs.canvas) {
			this.updateCanvas();
		}
		const style = {
			width: this.props.width || '100%',
			height: this.props.height || '100%'
		};
        return (
			<canvas ref="canvas" style={style} />
        );
    }
}

export default CanvasComponent;
