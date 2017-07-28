import React from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'big-number';

function Building(props) {
	const building = props.building;
	const canBuy = BigNumber(building.priceOfNext).lte(BigNumber(props.nanites).div(100));

	return (
		<div>
			<h5>{building.name}</h5>
			<div>{building.owned}</div>
			<div>{props.prettifyNumber(building.priceOfNext)}</div>
			<button onClick={() => props.buyBuilding(building.id)} disabled={!canBuy}>Buy</button>
		</div>
	);
}

Building.propTypes = {
	building: PropTypes.object.isRequired,
	nanites: PropTypes.object.isRequired,
	buyBuilding: PropTypes.func.isRequired,
	prettifyNumber: PropTypes.func.isRequired
};

export default Building;
