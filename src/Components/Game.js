import React, { Component } from 'react';
import { connect } from 'react-redux';
import BigNumber from 'big-number';

import Building from './Building';
import { loadGame, saveGame, tick, addNanites, buyBuilding } from '../Actions/gameActions';

class Game extends Component {
	constructor(props) {
		super();

		props.loadGame();
		window.setInterval(() => this.tick(), 100);
		window.setInterval(() => this.props.saveGame(), 60000);
	}

	saveGame

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
		naniteHundredths: state.naniteHundredths,
		buildings: state.buildings
	};
};

const mapDispatchToProps = dispatch => {
	return {
		loadGame: () => dispatch(loadGame()),
		saveGame: () => dispatch(saveGame()),
		tick: () => dispatch(tick()),
		addNanites: amountToAdd => dispatch(addNanites(amountToAdd)),
		buyBuilding: buildingId => dispatch(buyBuilding(buildingId))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
