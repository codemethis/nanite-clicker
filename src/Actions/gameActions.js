export function tick() {
	return {
		type: 'TICK'
	};
}

export function addNanites(amountToAdd) {
	return {
		type: 'ADD_NANITES',
		payload: amountToAdd
	};
}

export function buyBuilding(buildingId) {
	return {
		type: 'BUY_BUILDING',
		payload: buildingId
	};
}
