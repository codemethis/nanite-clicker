import React from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'big-number';

import { prettifyNumber } from '../Utilities/utilities';

function Building(props) {
	const building = props.building;
	const canBuy = BigNumber(building.priceOfNext).lte(BigNumber(props.nanites).div(100));
	const overlay = canBuy ? null : (<div style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, backgroundColor: 'rgba(255,255,255,0.5)'}}></div>);

	return (
		<div className="building" style={{position: 'relative', cursor: 'pointer'}} onClick={canBuy ? () => props.buyBuilding(building.id) : () => null}>
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
	buyBuilding: PropTypes.func.isRequired
};

export default Building;
