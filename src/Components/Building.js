import React, { Component } from 'react';

class Building extends Component {
	buy = () => {
		this.props.buy(this.props.buildingId);
		//use timeout so that props are updated first
		window.setTimeout(this.calculatePriceOfNext, 0);
	}

	render() {
		return (
			<div>
				<h5>{this.props.name}</h5>
				<div>{this.props.owned}</div>
				<div>{this.props.priceOfNext.val()}</div>
				<button onClick={this.buy} disabled={!this.props.canBuy}>Buy</button>
			</div>
		);
	}
}

export default Building;
