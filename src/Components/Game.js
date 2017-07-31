import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BigNumber from 'big-number';

import Building from './Building';
import { loadGame, saveGame, clearSave, tick, addNanites, buyBuilding } from '../Actions/gameActions';
import { prettifyNumber } from '../Utilities/utilities';

class Game extends Component {
	constructor(props) {
		super();

		props.loadGame();
		window.setInterval(() => props.tick(), 100);
		window.setInterval(() => this.updateTitleTag(), 5000);
		window.setInterval(() => props.saveGame(), 60000);
	}

	displayNaniteValue = () => {
		const wholeNanites = BigNumber(this.props.naniteHundredths).div(100);
		return prettifyNumber(wholeNanites, true);
	};

	updateTitleTag = () => {
		document.getElementsByTagName('title')[0].text = prettifyNumber(BigNumber(this.props.naniteHundredths).div(100)) + ' nanites - Nanite Clicker';
	}

	componentWillMount() {
		this.updateTitleTag();
	}

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
				<br /><br />
				<button onClick={this.props.saveGame}>Save Game</button> <button onClick={this.props.clearSave}>Clear Save</button>

				<br /><br /><br />
				<h3>Buildings</h3>
				{this.renderBuildings()}
			</div>
		);
	}
}

Game.propTypes = {
	naniteHundredths: PropTypes.object.isRequired,
	buildings: PropTypes.arrayOf(PropTypes.object).isRequired,
	loadGame: PropTypes.func.isRequired,
	saveGame: PropTypes.func.isRequired,
	clearSave: PropTypes.func.isRequired,
	tick: PropTypes.func.isRequired,
	addNanites: PropTypes.func.isRequired,
	buyBuilding: PropTypes.func.isRequired
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
		clearSave: () => {
			const confirm = window.confirm('Are you sure you want to delete all save data and start again?');
			if(confirm) {
				dispatch(clearSave());
			}
		},
		tick: () => dispatch(tick()),
		addNanites: amountToAdd => dispatch(addNanites(amountToAdd)),
		buyBuilding: buildingId => dispatch(buyBuilding(buildingId))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
