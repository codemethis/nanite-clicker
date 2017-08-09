import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BigNumber from 'big-number';

import Building from './Building';
import Stats from './Stats';
import Tooltip from './Tooltip';
import { loadGame, saveGame, clearSave, tick, addNanites, buyBuilding, hideTooltip, moveTooltip } from '../Actions/gameActions';
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

	render() {
		const tooltipBuilding = this.props.buildings.find(b => b.id === this.props.tooltipBuilding);
		const  renderBuildings = () => {
			return this.props.buildings.map(b => {
				return (
					<Building key={b.id} building={b} nanites={this.props.naniteHundredths} buyBuilding={this.props.buyBuilding} moveTooltip={this.props.moveTooltip} />
				);
			});
		};
		const renderTooltip = () => {
			let tt = '';
			if(this.props.tooltipActive) {
				tt = (
					<Tooltip tooltipTop={this.props.tooltipTop} tooltipBuilding={tooltipBuilding} />
				);
			}

			return tt;
		}

		return (
			<div id="Game">
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
					<h1 className="text-center">Nanite Clicker</h1>
					Nanite Clicker is an incremental idle game heavily inspired by <a href="http://orteil.dashnet.org/cookieclicker">Cookie Clicker</a><br />
					You can find the source code on <a href="https://github.com/codemethis/nanite-clicker">GitHub</a>

					<h2 className="text-center">Things I'm working on next</h2>
					<ul>
						<li>More buildings</li>
						<li>Upgrades</li>
					</ul>

					<h2 className="text-center">Statistics</h2>
					<Stats nanites={this.props.naniteHundredths}
							nanitesPerSecond={this.props.nanitesPerSecond}
							generatedNanites={this.props.nanitesGenerated}
							handGeneratedNanites={this.props.nanitesHandGenerated}
							buildingsOwned={this.props.buildingsOwned} />
				</div>
				<div id="rightPanel">
					<h2 className="text-center">Buildings</h2>
					<div id="buildingContainer" onMouseLeave={() => this.props.hideTooltip()}>
						{renderBuildings()}
					</div>
				</div>
				{renderTooltip()}
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
	tooltipActive: PropTypes.bool.isRequired,
	tooltipTop: PropTypes.string.isRequired,
	tooltipBuilding: PropTypes.number.isRequired,
	loadGame: PropTypes.func.isRequired,
	saveGame: PropTypes.func.isRequired,
	clearSave: PropTypes.func.isRequired,
	tick: PropTypes.func.isRequired,
	addNanites: PropTypes.func.isRequired,
	buyBuilding: PropTypes.func.isRequired,
	hideTooltip: PropTypes.func.isRequired,
	moveTooltip: PropTypes.func.isRequired
}

const mapStateToProps = state => {
	return {
		naniteHundredths: state.naniteHundredths,
		nanitesPerSecond: state.nanitesPerSecond,
		nanitesGenerated: state.nanitesGenerated,
		nanitesHandGenerated: state.nanitesHandGenerated,
		buildingsOwned: state.buildingsOwned,
		buildings: state.buildings,
		tooltipActive: state.tooltipActive,
		tooltipTop: state.tooltipTop,
		tooltipBuilding: state.tooltipBuilding
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
		buyBuilding: buildingId => dispatch(buyBuilding(buildingId)),
		hideTooltip: () => dispatch(hideTooltip()),
		moveTooltip: (buildingId, mouseY) => dispatch(moveTooltip(buildingId, mouseY))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
