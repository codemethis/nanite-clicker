import React, { Component } from 'react';
import BigNumber from 'big-number';

class Building extends Component {
	buy = () => {
		this.props.buy(this.props.buildingId);
	}

	render() {
		const building = this.props.building;
		const canBuy = BigNumber(building.priceOfNext).lte(BigNumber(this.props.nanites).div(100));

		return (
			<div>
				<h5>{building.name}</h5>
				<div>{building.owned}</div>
				<div>{building.priceOfNext.val()}</div>
				<button onClick={() => this.props.buyBuilding(building.id)} disabled={!canBuy}>Buy</button>
			</div>
		);
	}
}

export default Building;
