import BigNumber from 'big-number';
import { updateTitleTag } from '../Utilities/utilities';

const defaultState = {
	lastTickTime: null,
	naniteHundredths: BigNumber(0),
	nanitesGenerated: BigNumber(0),
	nanitesHandGenerated: BigNumber(0),
	buildingsOwned: 0,
	nanitesPerSecond: BigNumber(0),
	buildings: [ //NHPT = Nanite Hundreths Per Tick
		{
			id: 1,
			name: 'Replicator',
			plural: 'Replicators',
			description: 'Nanites merge together to form a nanite-producing fabrication device',
			owned: 0,
			basePrice: BigNumber(15),
			priceOfNext: BigNumber(15),
			baseNHPT: BigNumber(1)
		},
		{
			id: 2,
			name: 'Drone',
			plural: 'Drones',
			description: 'Nanites infect a humanoid host, overpowering will and creating new nanites',
			owned: 0,
			basePrice: BigNumber(100),
			priceOfNext: BigNumber(100),
			baseNHPT: BigNumber(10)
		},
		{
			id: 3,
			name: 'Fabrication Plant',
			plural: 'Plants',
			description: 'An entire manufactoring facility devoted to creation of new nanites',
			owned: 0,
			basePrice: BigNumber(1100),
			priceOfNext: BigNumber(1100),
			baseNHPT: BigNumber(80)
		},
		{
			id: 4,
			name: 'Colony',
			plural: 'Colonies',
			description: 'A city-sized amalgamation of nanite-generating production line',
			owned: 0,
			basePrice: BigNumber(12000),
			priceOfNext: BigNumber(12000),
			baseNHPT: BigNumber(470)
		},
		{
			id: 5,
			name: 'Space Station',
			plural: 'Stations',
			description: 'A massive structure in orbit that solely exists to create more nanites',
			owned: 0,
			basePrice: BigNumber(130000),
			priceOfNext: BigNumber(130000),
			baseNHPT: BigNumber(2600)
		},
		{
			id: 6,
			name: 'Planet',
			plural: 'Planets',
			description: 'Your nanites take over an entire world and slowly convert all its natural resources into nanites',
			owned: 0,
			basePrice: BigNumber(1400000),
			priceOfNext: BigNumber(1400000),
			baseNHPT: BigNumber(14000)
		},
		{
			id: 7,
			name: 'Nebula',
			plural: 'Nebulae',
			description: 'A star-system\'s worth of space gas, providing a base material for the generation of nanites',
			owned: 0,
			basePrice: BigNumber(20000000),
			priceOfNext: BigNumber(20000000),
			baseNHPT: BigNumber(78000)
		},
		{
			id: 8,
			name: 'Galaxy',
			plural: 'Galaxies',
			description: 'A collection of billions of stars, completely overrun with self-replicating nanites',
			owned: 0,
			basePrice: BigNumber(330000000),
			priceOfNext: BigNumber(330000000),
			baseNHPT: BigNumber(440000)
		},
		{
			id: 9,
			name: 'Alternate Dimension',
			plural: 'Dimensions',
			description: 'Your nanites have ripped through the very fabric of space-time itself and consumed all that exists on the "other side"',
			owned: 0,
			basePrice: BigNumber(5100000000),
			priceOfNext: BigNumber(5100000000),
			baseNHPT: BigNumber(2600000)
		}
	],

	tooltipActive: false,
	tooltipBase: '0px',
	tooltipBuilding: 1
};

function deepCloneBuildingObject(buildingObject) {
	return {
		...buildingObject,
		basePrice: BigNumber(buildingObject.basePrice),
		priceOfNext: BigNumber(buildingObject.priceOfNext),
		baseNHPT: BigNumber(buildingObject.baseNHPT)
	};
}

function deepCloneStateObject(stateObject) {
	let buildings = [];
	stateObject.buildings.forEach(b => buildings.push(deepCloneBuildingObject(b)));

	return {
		...stateObject,
		naniteHundredths: BigNumber(stateObject.naniteHundredths),
		nanitesGenerated: BigNumber(stateObject.nanitesGenerated),
		nanitesHandGenerated: BigNumber(stateObject.nanitesHandGenerated),
		nanitesPerSecond: BigNumber(stateObject.nanitesPerSecond),
		buildings
	};
}

export default (state = defaultState, action) => {
	let stateClone = deepCloneStateObject(state);

	switch(action.type) {
		case 'LOAD_GAME':
			let savedState = localStorage.naniteSavedGame;
			if(savedState == null) {
				return state;
			}

			savedState = JSON.parse(savedState);

			stateClone.buildings.forEach(b => {
				let saved = savedState.buildings.find(s => s.id === b.id);
				if(saved) {
					Object.assign(b, {
						...saved,
						basePrice: BigNumber(saved.basePrice),
						priceOfNext: BigNumber(saved.priceOfNext),
						baseNHPT: BigNumber(saved.baseNHPT)
					});
				}
			});

			stateClone = {
				...stateClone,
				lastTickTime: null,
				naniteHundredths: BigNumber(savedState.naniteHundredths),
				nanitesGenerated: BigNumber(savedState.nanitesGenerated),
				nanitesHandGenerated: BigNumber(savedState.nanitesHandGenerated),
				buildingsOwned: savedState.buildingsOwned ? parseInt(savedState.buildingsOwned, 10) : 0,
				nanitesPerSecond: BigNumber(savedState.nanitesPerSecond)
			};

			updateTitleTag(savedState.naniteHundredths);

			return stateClone;

		case 'SAVE_GAME':
			let simplifiedBuildings = [];
			state.buildings.forEach(b => simplifiedBuildings.push({
				...b,
				basePrice: b.basePrice.val(),
				priceOfNext: b.priceOfNext.val(),
				baseNHPT: b.baseNHPT.val()
			}));

			localStorage.naniteSavedGame = JSON.stringify({
				naniteHundredths: state.naniteHundredths.val(),
				nanitesGenerated: state.nanitesGenerated.val(),
				nanitesHandGenerated: state.nanitesHandGenerated.val(),
				buildingsOwned: state.buildingsOwned,
				nanitesPerSecond: state.nanitesPerSecond.val(),
				buildings: simplifiedBuildings
			});
			console.info('Game Saved');
			return state;

		case 'CLEAR_SAVE':
			localStorage.removeItem('naniteSavedGame');

			return deepCloneStateObject(defaultState);

		case 'TICK':
			const tickTime = Date.now();
			let lapsedMicroseconds = 100;

			if(state.lastTickTime) {
				lapsedMicroseconds = tickTime - state.lastTickTime;
			}

			const timeingMultiplier = Math.round(lapsedMicroseconds / 100);

			state.buildings.forEach(bld => {
				const nanitesFromBuilding = BigNumber(bld.baseNHPT).mult(bld.owned).mult(timeingMultiplier);
				stateClone.naniteHundredths.plus(nanitesFromBuilding);
				stateClone.nanitesGenerated.plus(nanitesFromBuilding);
			});

			stateClone.lastTickTime = tickTime;

			return stateClone;

		case 'ADD_NANITES':
			stateClone.naniteHundredths.plus(action.payload);
			stateClone.nanitesGenerated.plus(action.payload);
			stateClone.nanitesHandGenerated.plus(action.payload);

			return stateClone;

		case 'BUY_BUILDING':
			let b = stateClone.buildings.find(bld => bld.id === action.payload);
			b.owned++;

			stateClone.buildingsOwned++;
			stateClone.nanitesPerSecond.plus(BigNumber(b.baseNHPT));

			stateClone.naniteHundredths.minus(BigNumber(b.priceOfNext).mult(100));

			const multiplier = Math.floor(Math.pow(1.15, b.owned) * 100);
			b.priceOfNext = BigNumber(b.basePrice).mult(multiplier).div(100);

			return stateClone;

		case 'HIDE_TOOLTIP':
			stateClone.tooltipActive = false;

			return stateClone;

		case 'MOVE_TOOLTIP':
			stateClone.tooltipActive = true;
			stateClone.tooltipBuilding = action.payload.buildingId;
			stateClone.tooltipBase = action.payload.mouseY;

			return stateClone;

		default:
			return state;
	}
};
