import React from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'big-number';

import { prettifyNumber } from '../Utilities/utilities';

function Building(props) {
	const building = props.building;
	const canBuy = BigNumber(building.priceOfNext).lte(BigNumber(props.nanites).div(100));
	const overlay = canBuy ? null : (<div className="overlay"></div>);

	function drawTooltip(mouseY) {
		const windowHeight = window.innerHeight;
		let basePoint = windowHeight - mouseY - 150;

		if(basePoint < 10) {
			basePoint = 10;
		} else if(basePoint > windowHeight - 250) {
			basePoint = windowHeight - 250;
		}

		props.moveTooltip(building.id, basePoint + 'px');
	}

	return (
		<div className="building"
			style={{cursor: canBuy ? 'pointer' : 'default'}}
			onClick={canBuy ? () => props.buyBuilding(building.id) : () => null}
			onMouseMove={$event => drawTooltip($event.pageY)}>

			<h5>{building.name}</h5>
			<div>{building.owned}</div>
			<div>{prettifyNumber(building.priceOfNext)}</div>
			{overlay}
		</div>
	);
}

Building.propTypes = {
	building: PropTypes.object.isRequired,
	nanites: PropTypes.object.isRequired,
	buyBuilding: PropTypes.func.isRequired,
	moveTooltip: PropTypes.func.isRequired
};

export default Building;
