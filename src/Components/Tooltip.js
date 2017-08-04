import React from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'big-number';
import {prettifyNumber} from '../Utilities/utilities';

function Tooltip(props) {
	const b = props.tooltipBuilding;
	const ownedDetails = () => {
		if(b.owned === 0) {
			return '';
		}

		let details = '';

		if(b.owned > 1) {
			details = (
				<p>{b.owned} {b.plural} are producing a total of {prettifyNumber(BigNumber(b.baseNHPT).mult(b.owned).div(10))} nanites per second.</p>
			);
		}

		return (
			<div>
				<p>Each {b.name} produces {prettifyNumber(BigNumber(b.baseNHPT).div(10))} nanites per second.</p>
				{details}
			</div>
		);
	};

	return (
		<div id="tooltip" style={{display: props.tooltipActive, top: props.tooltipTop}}>
			<h4>{b.name}</h4>
			<p className="description">{b.description}</p>
			{ownedDetails()}
		</div>
	);
}

Tooltip.propTypes = {
	tooltipActive: PropTypes.string.isRequired,
	tooltipTop: PropTypes.string.isRequired,
	tooltipBuilding: PropTypes.object.isRequired
}

export default Tooltip;
