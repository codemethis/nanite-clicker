import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BigNumber from 'big-number';

import Building from './Building';
import { loadGame, saveGame, clearSave, tick, addNanites, buyBuilding } from '../Actions/gameActions';

class Game extends Component {
	constructor(props) {
		super();

		props.loadGame();
		window.setInterval(() => props.tick(), 100);
		window.setInterval(() => props.saveGame(), 60000);
	}

	displayNaniteValue = () => {
		const wholeNanites = BigNumber(this.props.naniteHundredths).div(100);
		return this.prettifyNumber(wholeNanites);
	};

	prettifyNumber = n => {
		let bigN = BigNumber(n);
		if(bigN.lt(1000)) {
			return bigN.val();
		}
		if(bigN.lt(1000000)) {
			return `${BigNumber(bigN).div(1000).val()},${bigN.number.slice(0,3).reverse().join('')}`;
		}
		const numbers = [
			{name: ' million', value: BigNumber('1000000')},
			{name: ' billion', value: BigNumber('1000000000')},
			{name: ' trillion', value: BigNumber('1000000000000')},
			{name: ' quadrillion', value: BigNumber('1000000000000000')},
			{name: ' quintillion', value: BigNumber('1000000000000000000')},
			{name: ' sextillion', value: BigNumber('1000000000000000000000')},
			{name: ' septillion', value: BigNumber('1000000000000000000000000')},
			{name: ' octillion', value: BigNumber('1000000000000000000000000000')},
			{name: ' nonillion', value: BigNumber('1000000000000000000000000000000')},
			{name: ' decillion', value: BigNumber('1000000000000000000000000000000000')},
			{name: ' undecillion', value: BigNumber('1000000000000000000000000000000000000')},
			{name: ' duodecillion', value: BigNumber('1000000000000000000000000000000000000000')},
			{name: ' tredecillion', value: BigNumber('1000000000000000000000000000000000000000000')},
			{name: ' quattuordecillion', value: BigNumber('1000000000000000000000000000000000000000000000')},
			{name: ' quindecillion', value: BigNumber('1000000000000000000000000000000000000000000000000')},
		];

		const word = numbers.find(x => bigN.lt(BigNumber(x.value).mult(1000)));
		if(!word) {
			return 'far too many';
		}

		const integerPart = parseInt(BigNumber(bigN).div(word.value));
		let decimalPart = '';
		const secondDigit = bigN.number.slice(-2, -1)[0];
		const thirdDigit = bigN.number.slice(-3, -2)[0];

		if(integerPart < 10) {
			if(thirdDigit === 0) {
				decimalPart = secondDigit === 0 ? '' : `.${secondDigit}`;
			} else {
				decimalPart = `.${secondDigit}${thirdDigit}`;
			}
		} else if(integerPart < 100) {
			decimalPart = thirdDigit === 0 ? '' : `.${thirdDigit}`;
		}

		return `${integerPart}${decimalPart}${word.name}`;
	}

	renderBuildings = () => {
		return this.props.buildings.map(b => {
			return (
				<Building key={b.id} building={b} nanites={this.props.naniteHundredths} buyBuilding={this.props.buyBuilding} prettifyNumber={this.prettifyNumber} />
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
