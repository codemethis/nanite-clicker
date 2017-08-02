import React from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'big-number';

import { prettifyNumber } from '../Utilities/utilities';

function Stats(props) {
	return (
		<div>
			Current nanites: {prettifyNumber(BigNumber(props.nanites).div(100))}<br />
			Nanites generated per second: {prettifyNumber(BigNumber(props.nanitesPerSecond).div(10))}<br />
			Total nanites generated: {prettifyNumber(BigNumber(props.generatedNanites).div(100))}<br />
			Hand generated nanites: {prettifyNumber(BigNumber(props.handGeneratedNanites).div(100))} <br />
			Buildings owned: {props.buildingsOwned}
		</div>
	);
}

Stats.propTypes = {
	nanites: PropTypes.object.isRequired,
	nanitesPerSecond: PropTypes.object.isRequired,
	generatedNanites: PropTypes.object.isRequired,
	handGeneratedNanites: PropTypes.object.isRequired,
	buildingsOwned: PropTypes.number.isRequired
};

export default Stats;
