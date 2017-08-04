export function loadGame() {
	return {
		type: 'LOAD_GAME'
	};
}

export function saveGame() {
	return {
		type: 'SAVE_GAME'
	};
}

export function clearSave() {
	return {
		type: 'CLEAR_SAVE'
	};
}

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

export function hideTooltip() {
	return {
		type: 'HIDE_TOOLTIP'
	};
}

export function moveTooltip(buildingId, mouseY) {
	return {
		type: 'MOVE_TOOLTIP',
		payload: {
			buildingId,
			mouseY
		}
	};
}
