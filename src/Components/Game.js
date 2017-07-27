import React, { Component } from 'react';
import BigNumber from 'big-number';

class Game extends Component {
	constructor() {
		super();

		this.state = {
			naniteTenths: BigNumber(0)
		};
	}

	displayNaniteValue = () => {
		const wholeNanites = BigNumber(this.state.naniteTenths).div(10);
		return wholeNanites.val();
	};

	addNanites = tenthsToAdd => {
		let newNanites = BigNumber(this.state.naniteTenths);
		newNanites.add(tenthsToAdd);
		this.setState({
			naniteTenths: newNanites
		});
	};

	handleButtonClick = () => {
		this.addNanites(10);
	};

	render() {
		return (
			<div>
				<h1>You have {this.displayNaniteValue()} nanites.</h1>
				<button onClick={this.handleButtonClick}>Click to generate nanite</button>
			</div>
		);
	}
}

export default Game;
