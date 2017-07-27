import React, { Component } from 'react';
import { connect } from 'react-redux';
import BigNumber from 'big-number';

class Building extends Component {
	buy = () => {
		this.props.buy(this.props.buildingId);
	}

	render() {
		const building = this.props.buildings.find(bld => bld.id === this.props.buildingId);
		const canBuy = BigNumber(building.priceOfNext).lte(BigNumber(this.props.naniteTenths).div(10));

		return (
			<div>
				<h5>{building.name}</h5>
				<div>{building.owned}</div>
				<div>{building.priceOfNext.val()}</div>
				<button onClick={this.buy} disabled={!canBuy}>Buy</button>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		naniteTenths: state.naniteTenths,
		buildings: state.buildings
	};
};

const mapDispatchToProps = dispatch => {
	return {
		buy: buildingId => {
			dispatch({
				type: 'BUY_BUILDING',
				payload: buildingId
			});
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Building);
