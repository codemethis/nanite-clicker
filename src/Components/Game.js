import React, { Component } from 'react';
import BigNumber from 'big-number';

import Building from './Building';

class Game extends Component {
	constructor() {
		super();

		this.state = {
			naniteTenths: BigNumber(0),
			buildings: [
				{
					id: 1,
					name: 'Replicator',
					owned: 0,
					basePrice: BigNumber(15),
					priceOfNext: BigNumber(15),
					canAfford: false,
					baseNTPS: 1
				}
			]
		};

		window.setInterval(() => this.tick(), 1000);
	}

	calculatePriceOfNext = building => {
		const multiplier = Math.floor(Math.pow(1.15, building.owned) * 100);
		let np = BigNumber(building.basePrice).mult(multiplier).div(100);

		building.priceOfNext = np;
		this.isAffordable(building);
	};

	isAffordable = building => {
		console.log(this.state.naniteTenths.val());
		let ca = BigNumber(building.priceOfNext).lte(BigNumber(this.state.naniteTenths).div(10));
		building.canAfford = ca;
	};

	displayNaniteValue = () => {
		const wholeNanites = BigNumber(this.state.naniteTenths).div(10);
		return wholeNanites.val();
	};

	addNanites = tenthsToAdd => {
		let newNanites = BigNumber(this.state.naniteTenths);
		newNanites.add(tenthsToAdd);

		this.setState({
			naniteTenths: newNanites
		}, () => {
			let buildings = this.state.buildings.slice();
			buildings.forEach(b => this.isAffordable(b));

			this.setState({
				buildings: buildings
			});
		});
	};

	tick = () => {
		this.state.buildings.forEach(b => {
			this.addNanites(b.baseNTPS * b.owned);
		});
	};

	handleButtonClick = () => {
		this.addNanites(10);
	};

	handleBuildingBuyClick = buildingId => {
		const buildings = this.state.buildings.slice();
		let b = buildings.find(bdn => bdn.id === buildingId);
		b.owned++;
		this.addNanites(BigNumber(b.priceOfNext).mult(-10));
		this.calculatePriceOfNext(b);

		this.setState({
			buildings: buildings
		});
	};

	renderBuildings = () => {
		return this.state.buildings.map(b => {
			return (
				<Building key={b.id} buildingId={b.id} name={b.name} priceOfNext={b.priceOfNext} owned={b.owned} canBuy={b.canAfford} buy={this.handleBuildingBuyClick} />
			);
		});
	};

	render() {
		const buildings = this.renderBuildings();

		return (
			<div>
				<h1>You have {this.displayNaniteValue()} nanites.</h1>
				<button onClick={this.handleButtonClick}>Click to generate nanite</button>

				<br /><br /><br />
				<h3>Buildings</h3>
				{buildings}
			</div>
		);
	}
}

export default Game;
