import BigNumber from 'big-number';

//NHPT = Nanite Hundreths Per Tick
export default (state = {
	lastTickTime: null,
	naniteHundredths: BigNumber(0),
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
}, action) => {
	switch(action.type) {
		case 'ADD_NANITES':
			return {
				...state,
				naniteHundredths: BigNumber(state.naniteHundredths).plus(action.payload)
			};

		case 'TICK':
			const tickTime = Date.now();
			let lapsedMicroseconds = 100;

			if(state.lastTickTime) {
				lapsedMicroseconds = tickTime - state.lastTickTime;
			}

			const timeingMultiplier = Math.round(lapsedMicroseconds / 100);

			let nanitesAfterTick = BigNumber(state.naniteHundredths);

			state.buildings.forEach(bld => {
				nanitesAfterTick.plus(BigNumber(bld.baseNHPT).mult(bld.owned).mult(timeingMultiplier));
			});

			return {
				...state,
				lastTickTime: tickTime,
				naniteHundredths: nanitesAfterTick
			};

		case 'BUY_BUILDING':
			let buildings = [];
			state.buildings.forEach(bld => buildings.push({
				...bld,
				basePrice: BigNumber(bld.basePrice),
				priceOfNext: BigNumber(bld.priceOfNext),
				baseNHPT: BigNumber(bld.baseNHPT)
			}));

			let b = buildings.find(bld => bld.id === action.payload);
			b.owned++;

			const nanitesAfterPurchase = BigNumber(state.naniteHundredths).minus(BigNumber(b.priceOfNext).mult(100));

			const multiplier = Math.floor(Math.pow(1.15, b.owned) * 100);
			b.priceOfNext = BigNumber(b.basePrice).mult(multiplier).div(100);

			return {
				...state,
				naniteHundredths: nanitesAfterPurchase,
				buildings
			};

		default:
			return state;
	}
};
