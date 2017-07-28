import React, { Component } from 'react';
import { connect } from 'react-redux';
import BigNumber from 'big-number';

import Building from './Building';
import { tick, addNanites, buyBuilding} from '../Actions/gameActions';

class Game extends Component {
	constructor() {
		super();

		window.setInterval(() => this.tick(), 100);
	}

	displayNaniteValue = () => {
		const wholeNanites = BigNumber(this.props.naniteHundredths).div(100);
		return wholeNanites.val();
	};

	tick = () => {
		this.props.tick();
	};

	handleButtonClick = () => {
		this.props.addNanites(100);
	};

	renderBuildings = () => {
		return this.props.buildings.map(b => {
			return (
				<Building key={b.id} building={b} nanites={this.props.naniteHundredths} buyBuilding={this.props.buyBuilding} />
			);
		});
	};

	render() {
		return (
			<div>
				<h1>You have {this.displayNaniteValue()} nanites.</h1>
				<button onClick={() => this.props.addNanites(100)}>Click to generate nanite</button>

				<br /><br /><br />
				<h3>Buildings</h3>
				{this.renderBuildings()}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		lastTickTime: state.lastTickTime,
		naniteHundredths: state.naniteHundredths,
		buildings: state.buildings
	};
};

const mapDispatchToProps = dispatch => {
	return {
		tick: () => dispatch(tick()),
		addNanites: amountToAdd => dispatch(addNanites(amountToAdd)),
		buyBuilding: buildingId => dispatch(buyBuilding(buildingId))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
