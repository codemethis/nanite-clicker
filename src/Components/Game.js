import React, { Component } from 'react';
import { connect } from 'react-redux';
import BigNumber from 'big-number';

import Building from './Building';

class Game extends Component {
	constructor() {
		super();

		window.setInterval(() => this.tick(), 1000);
	}

	displayNaniteValue = () => {
		const wholeNanites = BigNumber(this.props.naniteTenths).div(10);
		return wholeNanites.val();
	};

	tick = () => {
		this.props.buildings.forEach(b => {
			this.props.addNanites(b.baseNTPS * b.owned);
		});
	};

	handleButtonClick = () => {
		this.props.addNanites(10);
	};

	renderBuildings = () => {
		return this.props.buildings.map(b => {
			return (
				<Building key={b.id} buildingId={b.id} />
			);
		});
	};

	render() {
		return (
			<div>
				<h1>You have {this.displayNaniteValue()} nanites.</h1>
				<button onClick={this.handleButtonClick}>Click to generate nanite</button>

				<br /><br /><br />
				<h3>Buildings</h3>
				{this.renderBuildings()}
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
		addNanites: amountToAdd => {
			dispatch({
				type: 'ADD_NANITES',
				payload: amountToAdd
			});
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
