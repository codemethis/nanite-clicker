import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BigNumber from 'big-number';

import Building from './Building';
import Stats from './Stats';
import { loadGame, saveGame, clearSave, tick, addNanites, buyBuilding } from '../Actions/gameActions';
import { prettifyNumber, updateTitleTag } from '../Utilities/utilities';

import greenNebula from '../Images/greenNebula.jpg';

class Game extends Component {
	constructor(props) {
		super(props);

		props.loadGame();
		window.setInterval(() => props.tick(), 100);
		window.setInterval(() => updateTitleTag(this.props.naniteHundredths), 5000);
		window.setInterval(() => props.saveGame(), 60000);
	}

	displayNaniteValue = () => {
		const wholeNanites = BigNumber(this.props.naniteHundredths).div(100);
		return prettifyNumber(wholeNanites, true);
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
			<div style={{height: '100vh', width: '100vw'}}>
				<div id="leftPanel" style={{backgroundImage: 'url(' + greenNebula + ')'}}>
					<div id="banner">
						<h2>{this.displayNaniteValue()} nanites</h2>
						<small>{prettifyNumber(BigNumber(this.props.nanitesPerSecond).div(10))} per second</small>
					</div>
					<div id="bigNanite" onClick={() => this.props.addNanites(100)}>
						<h1 className="text-center">Imagine an image of a nanite here</h1>
					</div>
				</div>
				<div id="centerPanel">
					<h2 className="text-center">Statistics</h2>
					<Stats nanites={this.props.naniteHundredths}
							nanitesPerSecond={this.props.nanitesPerSecond}
							generatedNanites={this.props.nanitesGenerated}
							handGeneratedNanites={this.props.nanitesHandGenerated}
							buildingsOwned={this.props.buildingsOwned} />
				</div>
				<div id="rightPanel">
					<h2 className="text-center">Buildings</h2>
					{this.renderBuildings()}
				</div>
			{/*
			<div className="container">
				<div className="row text-center">
					<div className="col-xs-12">
						<h1>You have {this.displayNaniteValue()} nanites.</h1>
					</div>
					<div className="col-xs-12" style={{padding: '0.5em'}}>
						<button className="btn btn-primary" onClick={() => this.props.addNanites(100)}>Click to generate nanite</button>
					</div>
					<div className="col-xs-12">
						<button className="btn btn-default" onClick={this.props.saveGame}>Save Game</button>
						&nbsp;
						<button className="btn btn-danger" onClick={this.props.clearSave}>Clear Save</button>
					</div>
				</div>

				<div className="row" style={{marginTop: '3em'}}>
					<div className="col-xs-12 col-lg-6 col-lg-offset-3">
						<Stats nanites={this.props.naniteHundredths}
								nanitesPerSecond={this.props.nanitesPerSecond}
								generatedNanites={this.props.nanitesGenerated}
								handGeneratedNanites={this.props.nanitesHandGenerated}
								buildingsOwned={this.props.buildingsOwned} />
					</div>
				</div>

				<br /><br /><br />
				<h3>Buildings</h3>
				{this.renderBuildings()}
			</div>
			*/}
			</div>
		);
	}
}

Game.propTypes = {
	naniteHundredths: PropTypes.object.isRequired,
	nanitesPerSecond: PropTypes.object.isRequired,
	nanitesGenerated: PropTypes.object.isRequired,
	nanitesHandGenerated: PropTypes.object.isRequired,
	buildingsOwned: PropTypes.number.isRequired,
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
		nanitesPerSecond: state.nanitesPerSecond,
		nanitesGenerated: state.nanitesGenerated,
		nanitesHandGenerated: state.nanitesHandGenerated,
		buildingsOwned: state.buildingsOwned,
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
