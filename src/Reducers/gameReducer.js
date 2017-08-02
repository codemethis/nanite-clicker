import BigNumber from 'big-number';

const defaultState = {
	lastTickTime: null,
	naniteHundredths: BigNumber(0),
	nanitesGenerated: BigNumber(0),
	nanitesHandGenerated: BigNumber(0),
	buildingsOwned: 0,
	nanitesPerSecond: BigNumber(0),
	buildings: [
		{
			id: 1,
			name: 'Replicator',
			owned: 0,
			basePrice: BigNumber(15),
			priceOfNext: BigNumber(15),
			baseNHPT: BigNumber(1)
		},
		{
			id: 2,
			name: 'Drone',
			owned: 0,
			basePrice: BigNumber(100),
			priceOfNext: BigNumber(100),
			baseNHPT: BigNumber(10)
		},
		{
			id: 3,
			name: 'Fabrication Plant',
			owned: 0,
			basePrice: BigNumber(1100),
			priceOfNext: BigNumber(1100),
			baseNHPT: BigNumber(80)
		},
		{
			id: 4,
			name: 'Colony',
			owned: 0,
			basePrice: BigNumber(12000),
			priceOfNext: BigNumber(12000),
			baseNHPT: BigNumber(470)
		},
		{
			id: 5,
			name: 'Space Station',
			owned: 0,
			basePrice: BigNumber(130000),
			priceOfNext: BigNumber(130000),
			baseNHPT: BigNumber(2600)
		},
		{
			id: 6,
			name: 'Planet',
			owned: 0,
			basePrice: BigNumber(1400000),
			priceOfNext: BigNumber(1400000),
			baseNHPT: BigNumber(14000)
		},
		{
			id: 7,
			name: 'Nebula',
			owned: 0,
			basePrice: BigNumber(20000000),
			priceOfNext: BigNumber(20000000),
			baseNHPT: BigNumber(78000)
		},
		{
			id: 8,
			name: 'Galaxy',
			owned: 0,
			basePrice: BigNumber(330000000),
			priceOfNext: BigNumber(330000000),
			baseNHPT: BigNumber(440000)
		},
		{
			id: 9,
			name: 'Alternate Dimension',
			owned: 0,
			basePrice: BigNumber(5100000000),
			priceOfNext: BigNumber(5100000000),
			baseNHPT: BigNumber(2600000)
		}
	]
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

//NHPT = Nanite Hundreths Per Tick
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

		default:
			return state;
	}
};
